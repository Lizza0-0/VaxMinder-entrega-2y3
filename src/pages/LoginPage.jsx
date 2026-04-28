import { useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

export const LoginPage = () => {
  const [documento, setDocumento] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validar que el documento no esté vacío
    if (!documento.trim()) {
      setError('Por favor ingresa tu número de documento')
      setLoading(false)
      return
    }

    // Intentar login
    const result = login(documento.trim())
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Error al iniciar sesión')
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>
        <p className="subtitle">Accede a tu carnet de vacunación digital</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="documento">Número de Documento</label>
            <input
              type="text"
              id="documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="Ej: 1234567890"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-link">
          ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </p>

        <div className="demo-hint">
          <p><strong>Demo:</strong> Usa cualquier documento para registrarte primero</p>
        </div>
      </div>
    </div>
  )
}
