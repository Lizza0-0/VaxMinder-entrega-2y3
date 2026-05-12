import { useState, useContext } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

export const LoginPage = () => {
  // Detectar si es centro por la URL actual, no por useParams
  const location  = useLocation()
  const esCentro  = location.pathname.includes('centro')

  const [id, setId]                 = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const { login, loginCentro }      = useContext(AuthContext)
  const navigate                    = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    if (!id.trim()) {
      setError(`Ingresa tu ${esCentro ? 'NIT' : 'número de documento'}`)
      setLoading(false); return
    }
    if (!contrasena.trim()) {
      setError('Por favor ingresa tu contraseña')
      setLoading(false); return
    }
    if (esCentro && !/^\d+$/.test(id.trim())) {
      setError('El NIT debe contener solo dígitos, sin guion ni dígito de verificación')
      setLoading(false); return
    }

    const result = esCentro
      ? await loginCentro(id.trim(), contrasena)
      : await login(id.trim(), contrasena)

    if (result.success) {
      navigate(esCentro ? '/centro/portal' : '/dashboard')
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-role-badge" data-tipo={esCentro ? 'centro' : 'paciente'}>
          {esCentro ? '🏥 Centro Médico' : '👤 Paciente'}
        </div>
        <h1>Iniciar Sesión</h1>
        <p className="subtitle">
          {esCentro
            ? 'Accede al portal de registro de vacunaciones'
            : 'Accede a tu carnet de vacunación digital'}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id">
              {esCentro ? 'NIT (sin dígito de verificación)' : 'Número de Documento'}
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder={esCentro ? '8000123456' : '1234567890'}
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
              onChange={e => setContrasena(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '1.25rem' }}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {!esCentro && (
          <p className="auth-link">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        )}
        {esCentro && (
          <p className="auth-link">
            ¿No tienes cuenta? <Link to="/centro/registro">Registrar Centro Médico</Link>
          </p>
        )}
        <p className="auth-back">
          <Link to="/">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  )
}
