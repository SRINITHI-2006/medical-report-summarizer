import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaMagic, FaTrash } from 'react-icons/fa'
import { reportService, summaryService } from '../services/reportService'
import LoadingSpinner from '../components/LoadingSpinner'

const ViewReport = () => {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    try {
      const { data } = await reportService.getById(id)
      setReport(data.data)
    } catch (err) {
      toast.error('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const { data } = await summaryService.generate(id)
      toast.success('Summary generated!')
      window.location.href = `/summary/${data.data.id}`
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary')
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this report?')) return
    try {
      await reportService.delete(id)
      toast.success('Report deleted')
      window.location.href = '/history'
    } catch (err) {
      toast.error('Failed to delete report')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <Link to="/history" className="text-decoration-none text-muted">
            <FaArrowLeft /> Back
          </Link>
          <h4 className="fw-bold mt-2 mb-0">Report Details</h4>
        </div>
        <div className="d-flex gap-2">
          {!report?.hasSummary && (
            <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
              <FaMagic /> {generating ? 'Generating...' : 'Generate Summary'}
            </button>
          )}
          {report?.hasSummary && (
            <Link to={`/summary/${report.summaryId}`} className="btn btn-success">
              View Summary
            </Link>
          )}
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Patient Name</h6>
              <p className="fw-bold">{report?.patientName}</p>
              <h6 className="text-muted">Doctor</h6>
              <p>{report?.doctorName || 'Not specified'}</p>
              <h6 className="text-muted">Hospital</h6>
              <p>{report?.hospitalName || 'Not specified'}</p>
              <h6 className="text-muted">Report Date</h6>
              <p>{report?.reportDate || 'Not specified'}</p>
              <h6 className="text-muted">File Name</h6>
              <p>{report?.fileName}</p>
              <h6 className="text-muted">Uploaded</h6>
              <p>{new Date(report?.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h6 className="mb-0 fw-bold">Extracted Report Text</h6>
            </div>
            <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                {report?.reportText || 'No text extracted'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewReport
