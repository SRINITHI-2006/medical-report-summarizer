import { useState } from 'react'
import { FaBars, FaBell } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth()

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-primary d-md-none" onClick={onMenuClick}>
          <FaBars />
        </button>
        <h5 className="mb-0 text-primary fw-bold">Medical Report Summarizer</h5>
      </div>
      <div className="d-flex align-items-center gap-3">
        <FaBell className="text-muted" />
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, fontSize: '0.875rem' }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="d-none d-sm-inline fw-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
