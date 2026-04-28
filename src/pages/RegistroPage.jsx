import { useState } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

export const RegistroPage = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'cedula',
    documento: '',
    edad: '',
    email: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones
    if (!formData.nombres.trim()) {
      setError('El nombre es requerido')
      setLoading(false)
      return
    }
    if (!formData.apellidos.trim()) {
      setError('El apellido es requerido')
      setLoading(false)
      return
    }
    if (!formData.documento.trim()) {
      setError('El documento es requerido')
      setLoading(false)
      return
    }
    if (!formData.edad || formData.edad < 0) {
      setError('La edad debe ser válida')
      setLoading(false)
      return
    }
    if (!formData.email.trim()) {
      setError('El email es requerido')
      setLoading(false)
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('El email no es válido')
      setLoading(false)
      return
    }

    // Intentar registro
    const result = register(formData)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Error al registrarse')
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        <p className="subtitle">Completa tus datos para comenzar</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombres">Nombres *</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Tu nombre"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos *</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Tu apellido"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoDocumento">Tipo de Documento</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="cedula">Cédula</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="carnetExtranjeria">Carnet de Extranjería</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="documento">Documento *</label>
              <input
                type="text"
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder="1234567890"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edad">Edad *</label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                placeholder="30"
                min="0"
                max="120"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  )
}
