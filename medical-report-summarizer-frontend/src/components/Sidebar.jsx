import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FaTachometerAlt,
  FaUpload,
  FaHistory,
  FaUser,
  FaSignOutAlt,
  FaHospital,
} from 'react-icons/fa'

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { to: '/upload', icon: FaUpload, label: 'Upload Report' },
    { to: '/history', icon: FaHistory, label: 'History' },
    { to: '/profile', icon: FaUser, label: 'Profile' },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand d-flex align-items-center gap-2">
        <FaHospital size={24} />
        <span>MedReport AI</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Icon /> {label}
          </NavLink>
        ))}
        <button className="sidebar-link btn btn-link text-start w-100 border-0" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
