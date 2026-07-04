import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa'
import { reportService, summaryService } from '../services/reportService'

const UploadReport = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    patientName: '',
    doctorName: '',
    hospitalName: '',
    reportDate: '',
  })
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  const allowedExtensions = ['.pdf', '.docx', '.txt']

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
    if (!allowedExtensions.includes(ext)) {
      toast.error('Invalid file type. Allowed: PDF, DOCX, TXT')
      return false
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit')
      return false
    }
    return true
  }

  const handleFileSelect = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileSelect(droppedFile)
  }

  const getFileIcon = () => {
    if (!file) return <FaCloudUploadAlt size={48} className="text-primary" />
    const ext = file.name.split('.').pop().toLowerCase()
    if (ext === 'pdf') return <FaFilePdf size={48} className="text-danger" />
    if (ext === 'docx') return <FaFileWord size={48} className="text-primary" />
    return <FaFileAlt size={48} className="text-secondary" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'data',
      new Blob([JSON.stringify(form)], { type: 'application/json' })
    )

    try {
      const { data } = await reportService.upload(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(progress)
      })

      toast.success('Report uploaded successfully!')
      const reportId = data.data.id

      toast.info('Generating AI summary...')
      const summaryRes = await summaryService.generate(reportId)
      toast.success('Summary generated!')
      navigate(`/summary/${summaryRes.data.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div>
      <h4 className="mb-4 fw-bold">Upload Medical Report</h4>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Patient Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Doctor Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.doctorName}
                  onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Hospital Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.hospitalName}
                  onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Report Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.reportDate}
                  onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
                />
              </div>
            </div>

            <div
              className={`upload-zone mb-3 ${dragOver ? 'dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {getFileIcon()}
              <p className="mt-2 mb-1 fw-medium">
                {file ? file.name : 'Click or drag file to upload'}
              </p>
              <small className="text-muted">PDF, DOCX, TXT — Max 10MB</small>
              <input
                ref={fileInputRef}
                type="file"
                className="d-none"
                accept=".pdf,.docx,.txt"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>

            {uploadProgress > 0 && (
              <div className="mb-3">
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
              {loading ? 'Uploading & Summarizing...' : 'Upload & Generate Summary'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadReport
