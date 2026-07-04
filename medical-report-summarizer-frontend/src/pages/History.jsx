import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaEye, FaMagic, FaTrash, FaSearch } from 'react-icons/fa'
import { reportService, summaryService } from '../services/reportService'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'

const History = () => {
  const [reports, setReports] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(null)
  const [search, setSearch] = useState({ patientName: '', disease: '', date: '' })

  useEffect(() => {
    fetchReports()
  }, [page])

  const fetchReports = async (searchParams = search) => {
    setLoading(true)
    try {
      const params = { page, size: 10 }
      if (searchParams.patientName) params.patientName = searchParams.patientName
      if (searchParams.disease) params.disease = searchParams.disease
      if (searchParams.date) params.date = searchParams.date

      const { data } = await reportService.getAll(params)
      setReports(data.data.content)
      setTotalPages(data.data.totalPages)
    } catch (err) {
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    fetchReports(search)
  }

  const handleGenerate = async (reportId) => {
    setGenerating(reportId)
    try {
      const { data } = await summaryService.generate(reportId)
      toast.success('Summary generated!')
      window.location.href = `/summary/${data.data.id}`
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary')
    } finally {
      setGenerating(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report and its summary?')) return
    try {
      await reportService.delete(id)
      toast.success('Report deleted')
      fetchReports()
    } catch (err) {
      toast.error('Failed to delete report')
    }
  }

  return (
    <div>
      <h4 className="mb-4 fw-bold">Report History</h4>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Patient Name</label>
              <input
                type="text"
                className="form-control"
                value={search.patientName}
                onChange={(e) => setSearch({ ...search, patientName: e.target.value })}
                placeholder="Search by patient"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Disease / Condition</label>
              <input
                type="text"
                className="form-control"
                value={search.disease}
                onChange={(e) => setSearch({ ...search, disease: e.target.value })}
                placeholder="Search by disease"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={search.date}
                onChange={(e) => setSearch({ ...search, date: e.target.value })}
              />
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-primary w-100">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Hospital</th>
                  <th>Report Date</th>
                  <th>Uploaded</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No reports found</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.patientName}</td>
                      <td>{report.doctorName || '-'}</td>
                      <td>{report.hospitalName || '-'}</td>
                      <td>{report.reportDate || '-'}</td>
                      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
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
                              <FaMagic />
                            </button>
                          )}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(report.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  )
}

export default History
