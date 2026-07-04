import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadReport from './pages/UploadReport'
import Summary from './pages/Summary'
import History from './pages/History'
import ViewReport from './pages/ViewReport'
import Profile from './pages/Profile'
import LoadingSpinner from './components/LoadingSpinner'

const App = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage />

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadReport />} />
          <Route path="/history" element={<History />} />
          <Route path="/summary/:id" element={<Summary />} />
          <Route path="/report/:id" element={<ViewReport />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
