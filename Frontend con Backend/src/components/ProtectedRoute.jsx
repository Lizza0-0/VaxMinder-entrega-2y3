import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const ProtectedRoute = ({ children, centroOnly = false }) => {
  const { user, centro, loading } = useContext(AuthContext)
  if (loading) return <div className="loading">Cargando...</div>
  if (centroOnly) {
    if (!centro) return <Navigate to="/login/centro" replace />
    return children
  }
  if (!user) return <Navigate to="/login/paciente" replace />
  return children
}
