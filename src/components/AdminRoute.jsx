import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <div className="loading">Cargando...</div>
  if (!user)              return <Navigate to="/login"     replace />
  if (user.rol !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}
