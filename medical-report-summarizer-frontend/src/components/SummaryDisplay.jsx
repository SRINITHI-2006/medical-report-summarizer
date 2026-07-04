const SummaryDisplay = ({ summary }) => {
  if (!summary) return null

  const renderList = (items, emptyText = 'Not Mentioned') => {
    if (!items || items.length === 0) {
      return <p className="text-muted mb-0">{emptyText}</p>
    }
    return (
      <div className="tag-list">
        {items.map((item, index) => (
          <span key={index} className="tag-item">
            {item}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="summary-section">
        <h5>Overall Summary</h5>
        <p className="mb-0">{summary.summary || 'Not Mentioned'}</p>
      </div>

      <div className="summary-section">
        <h5>Medical Conditions Mentioned</h5>
        {renderList(summary.medicalConditions)}
      </div>

      <div className="summary-section">
        <h5>Medicines Mentioned</h5>
        {renderList(summary.medications)}
      </div>

      <div className="summary-section">
        <h5>Laboratory Results</h5>
        {renderList(summary.labResults)}
      </div>

      <div className="summary-section">
        <h5>Doctor Recommendations</h5>
        <p className="mb-0">{summary.doctorRecommendations || 'Not Mentioned'}</p>
      </div>

      <div className="summary-section">
        <h5>Risk Factors</h5>
        {renderList(summary.riskFactors)}
      </div>

      <div className="summary-section">
        <h5>Follow-up Advice</h5>
        <p className="mb-0">{summary.followUp || 'Not Mentioned'}</p>
      </div>

      <div className="summary-section">
        <h5>Important Notes</h5>
        {renderList(summary.importantNotes)}
      </div>
    </div>
  )
}

export default SummaryDisplay
