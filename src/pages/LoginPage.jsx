import { useState, useContext } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

export const LoginPage = () => {
  const { tipo }                       = useParams()
  const esCentro                       = tipo === 'centro'

  const [idusuario, setIdusuario]      = useState('')
  const [contrasena, setContrasena]    = useState('')
  const [error, setError]              = useState('')
  const [loading, setLoading]          = useState(false)
  const { login }                      = useContext(AuthContext)
  const navigate                       = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const labelId = esCentro ? 'código de centro' : 'número de documento'
    if (!idusuario.trim()) { setError(`Por favor ingresa tu ${labelId}`); setLoading(false); return }
    if (!contrasena.trim()) { setError('Por favor ingresa tu contraseña'); setLoading(false); return }

    const result = await login(idusuario.trim(), contrasena)
    if (result.success) {
      navigate(result.rol === 'admin' ? '/admin' : '/dashboard')
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-role-badge" data-tipo={tipo}>
          {esCentro ? '🏥 Centro de Salud' : '👤 Paciente'}
        </div>

        <h1>Iniciar Sesión</h1>
        <p className="subtitle">
          {esCentro
            ? 'Accede al panel de gestión de vacunaciones'
            : 'Accede a tu carnet de vacunación digital'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idusuario">
              {esCentro ? 'Código de Centro' : 'Número de Documento'}
            </label>
            <input
              type="text"
              id="idusuario"
              value={idusuario}
              onChange={(e) => setIdusuario(e.target.value)}
              placeholder={esCentro ? 'Ej: CMED01' : '1234567890'}
              disabled={loading}
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {!esCentro && (
          <p className="auth-link">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        )}

        <p className="auth-back">
          <Link to="/">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  )
}
