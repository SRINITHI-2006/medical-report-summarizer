import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFileMedical, FaClipboardList, FaEye, FaMagic } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { reportService, summaryService } from '../services/reportService'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const { data } = await reportService.getDashboard()
      setDashboard(data.data)
    } catch (err) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (reportId) => {
    setGenerating(reportId)
    try {
      const { data } = await summaryService.generate(reportId)
      toast.success('Summary generated successfully!')
      window.location.href = `/summary/${data.data.id}`
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary')
    } finally {
      setGenerating(null)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h4 className="mb-4 fw-bold">Dashboard</h4>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card stat-card p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                <FaFileMedical />
              </div>
              <div>
                <h2 className="mb-0 fw-bold">{dashboard?.totalReports || 0}</h2>
                <p className="text-muted mb-0">Total Reports Uploaded</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card stat-card p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-success bg-opacity-10 text-success">
                <FaClipboardList />
              </div>
              <div>
                <h2 className="mb-0 fw-bold">{dashboard?.totalSummaries || 0}</h2>
                <p className="text-muted mb-0">Total Summaries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Recent Reports</h5>
          <Link to="/upload" className="btn btn-primary btn-sm">Upload New</Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Hospital</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.recentReports?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No reports yet. <Link to="/upload">Upload your first report</Link>
                  </td>
                </tr>
              ) : (
                dashboard?.recentReports?.map((report) => (
                  <tr key={report.id}>
                    <td>{report.patientName}</td>
                    <td>{report.doctorName || '-'}</td>
                    <td>{report.hospitalName || '-'}</td>
                    <td>{report.reportDate || '-'}</td>
                    <td>
                      {report.hasSummary ? (
                        <span className="badge bg-success">Summarized</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/report/${report.id}`} className="btn btn-outline-primary btn-sm">
                          <FaEye />
                        </Link>
                        {report.hasSummary ? (
                          <Link to={`/summary/${report.summaryId}`} className="btn btn-outline-success btn-sm">
                            Summary
                          </Link>
                        ) : (
                          <button
                            className="btn btn-outline-info btn-sm"
                            onClick={() => handleGenerate(report.id)}
                            disabled={generating === report.id}
                          >
                            <FaMagic /> {generating === report.id ? '...' : 'Generate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
