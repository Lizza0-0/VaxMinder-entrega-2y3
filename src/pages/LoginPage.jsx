import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

export const LoginPage = () => {
  const [idusuario, setIdusuario]   = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const { login }                   = useContext(AuthContext)
  const navigate                    = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!idusuario.trim()) { setError('Por favor ingresa tu número de documento'); setLoading(false); return }
    if (!contrasena.trim()) { setError('Por favor ingresa tu contraseña'); setLoading(false); return }
    const result = await login(idusuario.trim(), contrasena)
    if (result.success) {
      navigate(result.rol === 'admin' ? '/admin' : '/dashboard')
    } else { setError(result.message) }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>
        <p className="subtitle">Accede a tu carnet de vacunación digital</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idusuario">Número de Documento</label>
            <input
              type="text"
              id="idusuario"
              value={idusuario}
              onChange={(e) => setIdusuario(e.target.value)}
              placeholder="1234567890"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="auth-link">¿No tienes cuenta? <a href="/registro">Regístrate aquí</a></p>
      </div>
    </div>
  )
}