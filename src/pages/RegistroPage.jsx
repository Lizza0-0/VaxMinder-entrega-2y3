import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

const SOLO_LETRAS  = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/
const SOLO_NUMEROS = /^\d+$/

export const RegistroPage = () => {
  const [formData, setFormData] = useState({
    idusuario: '', nombre: '', apellido: '', email: '',
    contrasena: '', fechanacimiento: '', tiposangre: '', telefono: '',
    tipoDocumento: ''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register }          = useContext(AuthContext)
  const navigate              = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const errores = {}

    if (!formData.tipoDocumento)
      errores.tipoDocumento = 'El tipo de documento es requerido'

    if (!formData.idusuario.trim())
      errores.idusuario = 'El número de documento es requerido'
    else if (!SOLO_NUMEROS.test(formData.idusuario))
      errores.idusuario = 'Solo se permiten números'

    if (!formData.nombre.trim())
      errores.nombre = 'El nombre es requerido'
    else if (!SOLO_LETRAS.test(formData.nombre))
      errores.nombre = 'Solo se permiten letras y espacios'

    if (!formData.apellido.trim())
      errores.apellido = 'El apellido es requerido'
    else if (!SOLO_LETRAS.test(formData.apellido))
      errores.apellido = 'Solo se permiten letras y espacios'

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errores.email = 'Ingresa un correo válido'

    if (!formData.contrasena || formData.contrasena.length < 6)
      errores.contrasena = 'Mínimo 6 caracteres'

    if (!formData.fechanacimiento)
      errores.fechanacimiento = 'La fecha de nacimiento es requerida'

    if (!formData.tiposangre)
      errores.tiposangre = 'El tipo de sangre es requerido'

    if (!formData.telefono.trim())
      errores.telefono = 'El teléfono es requerido'
    else if (!SOLO_NUMEROS.test(formData.telefono))
      errores.telefono = 'Solo se permiten números'

    return errores
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const errores = validar()
    if (Object.keys(errores).length > 0) {
      setFieldErrors(errores)
      return
    }
    setLoading(true)
    const result = await register({ ...formData, idusuario: parseInt(formData.idusuario) })
    if (result.success) { navigate('/dashboard') } else { setError(result.message) }
    setLoading(false)
  }

  const fe = fieldErrors

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '560px' }}>
        <h1>Crear Cuenta</h1>
        <p className="subtitle">Completa tu información personal</p>
        <form onSubmit={handleSubmit}>
          {/* tipoDocumento + idusuario */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoDocumento">Tipo de Documento *</label>
              <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento}
                onChange={handleChange} disabled={loading}>
                <option value="">Seleccionar...</option>
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="RC">Registro Civil (RC)</option>
              </select>
              {fe.tipoDocumento && <span className="field-error">{fe.tipoDocumento}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="idusuario">Número de Documento *</label>
              <input type="text" id="idusuario" name="idusuario" value={formData.idusuario}
                onChange={handleChange} placeholder="1234567890" disabled={loading} />
              {fe.idusuario && <span className="field-error">{fe.idusuario}</span>}
            </div>
          </div>
          {/* nombre + apellido */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre}
                onChange={handleChange} placeholder="Ana Maria" disabled={loading} />
              {fe.nombre && <span className="field-error">{fe.nombre}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input type="text" id="apellido" name="apellido" value={formData.apellido}
                onChange={handleChange} placeholder="Garcia Lopez" disabled={loading} />
              {fe.apellido && <span className="field-error">{fe.apellido}</span>}
            </div>
          </div>
          {/* email + contrasena */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input type="email" id="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="correo@ejemplo.com" disabled={loading} />
              {fe.email && <span className="field-error">{fe.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="contrasena">Contraseña *</label>
              <input type="password" id="contrasena" name="contrasena" value={formData.contrasena}
                onChange={handleChange} placeholder="Mínimo 6 caracteres" disabled={loading} />
              {fe.contrasena && <span className="field-error">{fe.contrasena}</span>}
            </div>
          </div>
          {/* fechanacimiento + tiposangre */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechanacimiento">Fecha de Nacimiento *</label>
              <input type="date" id="fechanacimiento" name="fechanacimiento"
                value={formData.fechanacimiento} onChange={handleChange} disabled={loading} />
              {fe.fechanacimiento && <span className="field-error">{fe.fechanacimiento}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="tiposangre">Tipo de Sangre *</label>
              <select id="tiposangre" name="tiposangre" value={formData.tiposangre}
                onChange={handleChange} disabled={loading}>
                <option value="">Seleccionar...</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
              {fe.tiposangre && <span className="field-error">{fe.tiposangre}</span>}
            </div>
          </div>
          {/* telefono */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input type="tel" id="telefono" name="telefono" value={formData.telefono}
                onChange={handleChange} placeholder="3001234567" disabled={loading} />
              {fe.telefono && <span className="field-error">{fe.telefono}</span>}
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="auth-link">¿Ya tienes cuenta? <a href="/login/paciente">Inicia sesión aquí</a></p>
        <p className="auth-back"><a href="/">← Volver al inicio</a></p>
      </div>
    </div>
  )
}
