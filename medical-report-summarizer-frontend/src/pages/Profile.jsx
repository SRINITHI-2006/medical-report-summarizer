import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaUser, FaEnvelope, FaShieldAlt, FaCalendar } from 'react-icons/fa'
import { authService } from '../services/reportService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await authService.getProfile()
      setProfile(data.data)
    } catch (err) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h4 className="mb-4 fw-bold">My Profile</h4>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 80, height: 80, fontSize: '2rem' }}
              >
                {profile?.name?.charAt(0)?.toUpperCase()}
              </div>
              <h4 className="fw-bold">{profile?.name}</h4>
              <span className="badge bg-primary">{profile?.role}</span>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center gap-3 py-3">
                <FaUser className="text-primary" />
                <div>
                  <small className="text-muted d-block">Full Name</small>
                  <span>{profile?.name}</span>
                </div>
              </li>
              <li className="list-group-item d-flex align-items-center gap-3 py-3">
                <FaEnvelope className="text-primary" />
                <div>
                  <small className="text-muted d-block">Email</small>
                  <span>{profile?.email}</span>
                </div>
              </li>
              <li className="list-group-item d-flex align-items-center gap-3 py-3">
                <FaShieldAlt className="text-primary" />
                <div>
                  <small className="text-muted d-block">Role</small>
                  <span>{profile?.role}</span>
                </div>
              </li>
              <li className="list-group-item d-flex align-items-center gap-3 py-3">
                <FaCalendar className="text-primary" />
                <div>
                  <small className="text-muted d-block">Member Since</small>
                  <span>{new Date(profile?.createdAt).toLocaleDateString()}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
