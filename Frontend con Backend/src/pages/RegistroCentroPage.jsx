import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CIUDADES_COLOMBIA } from '../data/ciudadesColombia'
import '../styles/auth.css'

export const RegistroCentroPage = () => {
  const [formData, setFormData] = useState({
    nit:'', razonsocial:'', direccion:'', ciudad:'', telefono:'', contrasena:'', confirmarcontrasena:''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { registerCentro }    = useContext(AuthContext)
  const navigate              = useNavigate()

  // Solo dígitos, con límite de longitud
  const handleSoloNumeros = (name, maxLen) => (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, maxLen)
    setFormData(prev => ({ ...prev, [name]: val }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Solo letras, números y espacios (sin caracteres especiales)
  const handleAlfanumerico = (name, maxLen) => (e) => {
    const val = e.target.value
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,#\-]/g, '')
      .slice(0, maxLen)
    setFormData(prev => ({ ...prev, [name]: val }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const err = {}
    if (!formData.nit.trim()) err.nit = 'El NIT es requerido'
    else if (!/^\d+$/.test(formData.nit.trim())) err.nit = 'Solo dígitos, sin guion ni dígito de verificación'
    if (!formData.razonsocial.trim()) err.razonsocial = 'La razón social es requerida'
    else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,#\-]+$/.test(formData.razonsocial.trim()))
      err.razonsocial = 'Solo letras, números y caracteres básicos'
    if (!formData.direccion.trim())   err.direccion   = 'La dirección es requerida'
    if (!formData.ciudad.trim())      err.ciudad      = 'La ciudad es requerida'
    if (!formData.telefono.trim())    err.telefono    = 'El teléfono es requerido'
    else if (!/^\d+$/.test(formData.telefono)) err.telefono = 'Solo dígitos'
    else if (formData.telefono.length !== 10)  err.telefono = 'Debe tener exactamente 10 dígitos'
    if (!formData.contrasena || formData.contrasena.length < 6) err.contrasena = 'Mínimo 6 caracteres'
    if (formData.contrasena !== formData.confirmarcontrasena)   err.confirmarcontrasena = 'Las contraseñas no coinciden'
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    const errores = validar()
    if (Object.keys(errores).length > 0) { setFieldErrors(errores); return }
    setLoading(true)
    const result = await registerCentro(formData)
    if (result.success) { navigate('/centro/portal') } else { setError(result.message) }
    setLoading(false)
  }

  const fe = fieldErrors
  return (
    <div className="auth-container">
      <div className="auth-card" style={{maxWidth:'680px'}}>
        <div className="auth-role-badge" data-tipo="centro">🏥 Centro Médico</div>
        <h1>Registrar Centro Médico</h1>
        <p className="subtitle">Completa la información de tu institución</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Documento</label>
              <input type="text" value="NIT" readOnly disabled style={{background:'#f1f5f9',cursor:'not-allowed'}} />
            </div>
            <div className="form-group">
              <label>NIT (sin dígito de verificación) *</label>
              <input
                type="text" name="nit" value={formData.nit}
                onChange={handleSoloNumeros('nit', 15)}
                placeholder="8000123456" disabled={loading}
                inputMode="numeric" maxLength={15}
              />
              {fe.nit && <span className="field-error">{fe.nit}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Razón Social * <small style={{color:'#94a3b8',fontWeight:'normal'}}>(letras y números)</small></label>
            <input
              type="text" name="razonsocial" value={formData.razonsocial}
              onChange={handleAlfanumerico('razonsocial', 120)}
              placeholder="Hospital Ejemplo S.A.S." disabled={loading}
              maxLength={120}
            />
            {fe.razonsocial && <span className="field-error">{fe.razonsocial}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Dirección *</label>
              <input
                type="text" name="direccion" value={formData.direccion}
                onChange={handleAlfanumerico('direccion', 150)}
                placeholder="Calle 10 No 20-30" disabled={loading}
                maxLength={150}
              />
              {fe.direccion && <span className="field-error">{fe.direccion}</span>}
            </div>
            <div className="form-group">
              <label>Ciudad / Municipio *</label>
              <select
                name="ciudad" value={formData.ciudad}
                onChange={handleChange} disabled={loading}
              >
                <option value="">-- Seleccionar ciudad --</option>
                {CIUDADES_COLOMBIA.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {fe.ciudad && <span className="field-error">{fe.ciudad}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Teléfono * <small style={{color:'#94a3b8',fontWeight:'normal'}}>(10 dígitos)</small></label>
            <input
              type="tel" name="telefono" value={formData.telefono}
              onChange={handleSoloNumeros('telefono', 10)}
              placeholder="6044446000" disabled={loading}
              inputMode="numeric" maxLength={10}
            />
            {fe.telefono && <span className="field-error">{fe.telefono}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Contraseña *</label>
              <input type="password" name="contrasena" value={formData.contrasena}
                onChange={handleChange} placeholder="Mínimo 6 caracteres" disabled={loading} maxLength={60}/>
              {fe.contrasena && <span className="field-error">{fe.contrasena}</span>}
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña *</label>
              <input type="password" name="confirmarcontrasena" value={formData.confirmarcontrasena}
                onChange={handleChange} placeholder="Repite la contraseña" disabled={loading} maxLength={60}/>
              {fe.confirmarcontrasena && <span className="field-error">{fe.confirmarcontrasena}</span>}
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" style={{width:'100%',marginTop:'1.25rem'}} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="auth-link">¿Ya tienes cuenta? <Link to="/login/centro">Inicia sesión aquí</Link></p>
        <p className="auth-back"><Link to="/">← Volver al inicio</Link></p>
      </div>
    </div>
  )
}
