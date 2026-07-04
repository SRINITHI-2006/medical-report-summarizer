import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaDownload, FaTrash, FaArrowLeft } from 'react-icons/fa'
import { summaryService } from '../services/reportService'
import SummaryDisplay from '../components/SummaryDisplay'
import LoadingSpinner from '../components/LoadingSpinner'

const Summary = () => {
  const { id } = useParams()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [id])

  const fetchSummary = async () => {
    try {
      const { data } = await summaryService.getById(id)
      setSummary(data.data)
    } catch (err) {
      toast.error('Failed to load summary')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await summaryService.downloadPdf(id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `medical-summary-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error('Failed to download PDF')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this summary?')) return
    try {
      await summaryService.delete(id)
      toast.success('Summary deleted')
      window.location.href = '/history'
    } catch (err) {
      toast.error('Failed to delete summary')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <Link to="/history" className="text-decoration-none text-muted">
            <FaArrowLeft /> Back to History
          </Link>
          <h4 className="fw-bold mt-2 mb-0">
            Summary — {summary?.patientName}
          </h4>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={handleDownload}>
            <FaDownload /> Download PDF
          </button>
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <SummaryDisplay summary={summary} />
    </div>
  )
}

export default Summary
