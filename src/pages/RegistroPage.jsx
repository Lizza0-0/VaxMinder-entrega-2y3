import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

export const RegistroPage = () => {
  const [formData, setFormData] = useState({
    idusuario: '', nombre: '', apellido: '', email: '',
    contrasena: '', fechanacimiento: '', tiposangre: '', telefono: '',
    tipoDocumento: ''
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register }          = useContext(AuthContext)
  const navigate              = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!formData.tipoDocumento)         { setError('El tipoDocumento es requerido');          setLoading(false); return }
    if (!formData.idusuario.trim())      { setError('El idusuario es requerido');              setLoading(false); return }
    if (!formData.nombre.trim())         { setError('El nombre es requerido');                 setLoading(false); return }
    if (!formData.apellido.trim())       { setError('El apellido es requerido');               setLoading(false); return }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Ingresa un correo valido'); setLoading(false); return }
    if (!formData.contrasena || formData.contrasena.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres'); setLoading(false); return }
    if (!formData.fechanacimiento)       { setError('La fechanacimiento es requerida');        setLoading(false); return }
    if (!formData.tiposangre)            { setError('El tiposangre es requerido');             setLoading(false); return }
    if (!formData.telefono.trim())       { setError('El telefono es requerido');               setLoading(false); return }

    const result = await register({ ...formData, idusuario: parseInt(formData.idusuario) })
    if (result.success) { navigate('/dashboard') } else { setError(result.message) }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        <p className="subtitle">Completa tu informacion personal</p>
        <form onSubmit={handleSubmit}>
          {/* tipoDocumento + idusuario */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoDocumento">tipoDocumento *</label>
              <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento}
                onChange={handleChange} disabled={loading}>
                <option value="">Seleccionar...</option>
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="RC">Registro Civil (RC)</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="idusuario">idusuario *</label>
              <input type="text" id="idusuario" name="idusuario" value={formData.idusuario}
                onChange={handleChange} placeholder="1234567890" disabled={loading} />
            </div>
          </div>
          {/* nombre + apellido */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">nombre *</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre}
                onChange={handleChange} placeholder="Ana Maria" disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">apellido *</label>
              <input type="text" id="apellido" name="apellido" value={formData.apellido}
                onChange={handleChange} placeholder="Garcia Lopez" disabled={loading} />
            </div>
          </div>
          {/* email + contrasena */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">email *</label>
              <input type="email" id="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="correo@ejemplo.com" disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="contrasena">contrasena *</label>
              <input type="password" id="contrasena" name="contrasena" value={formData.contrasena}
                onChange={handleChange} placeholder="Minimo 6 caracteres" disabled={loading} />
            </div>
          </div>
          {/* fechanacimiento + tiposangre */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechanacimiento">fechanacimiento *</label>
              <input type="date" id="fechanacimiento" name="fechanacimiento"
                value={formData.fechanacimiento} onChange={handleChange} disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="tiposangre">tiposangre *</label>
              <select id="tiposangre" name="tiposangre" value={formData.tiposangre}
                onChange={handleChange} disabled={loading}>
                <option value="">Seleccionar...</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
          </div>
          {/* telefono */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">telefono *</label>
              <input type="tel" id="telefono" name="telefono" value={formData.telefono}
                onChange={handleChange} placeholder="300 123 4567" disabled={loading} />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="auth-link">Ya tienes cuenta? <a href="/login">Inicia sesion aqui</a></p>
      </div>
    </div>
  )
}
