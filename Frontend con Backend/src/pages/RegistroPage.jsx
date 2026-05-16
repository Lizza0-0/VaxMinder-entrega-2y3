import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

export const RegistroPage = () => {
  const [f, setF] = useState({
    idusuario:'', nombre:'', apellido:'', email:'',
    contrasena:'', tipodocumento:'', fechanacimiento:'', tiposangre:'', telefono:''
  })
  const [fe, setFe]       = useState({})
  const [error, setError] = useState('')
  const [load, setLoad]   = useState(false)
  const { register }      = useContext(AuthContext)
  const nav               = useNavigate()

  const handleSoloNumeros = (name, maxLen) => (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, maxLen)
    setF(p => ({...p, [name]: val}))
    if (fe[name]) setFe(p => ({...p, [name]: ''}))
  }

  const handleSoloLetras = (name, maxLen) => (e) => {
    const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '').slice(0, maxLen)
    setF(p => ({...p, [name]: val}))
    if (fe[name]) setFe(p => ({...p, [name]: ''}))
  }

  const set = (e) => {
    const {name, value} = e.target
    setF(p => ({...p, [name]: value}))
    if (fe[name]) setFe(p => ({...p, [name]: ''}))
  }

  const validar = () => {
    const err = {}
    if (!f.idusuario.trim()) err.idusuario = 'Requerido'
    else if (!/^\d+$/.test(f.idusuario)) err.idusuario = 'Solo números'
    if (!f.nombre.trim())    err.nombre    = 'Requerido'
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(f.nombre)) err.nombre = 'Solo letras'
    if (!f.apellido.trim())  err.apellido  = 'Requerido'
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(f.apellido)) err.apellido = 'Solo letras'
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) err.email = 'Correo inválido'
    if (!f.contrasena || f.contrasena.length < 6) err.contrasena = 'Mínimo 6 caracteres'
    if (!f.tipodocumento)    err.tipodocumento   = 'Requerido'
    if (!f.fechanacimiento)  err.fechanacimiento = 'Requerido'
    if (!f.tiposangre)       err.tiposangre      = 'Requerido'
    if (!f.telefono.trim())  err.telefono        = 'Requerido'
    else if (!/^\d+$/.test(f.telefono)) err.telefono = 'Solo números'
    else if (f.telefono.length !== 10)  err.telefono = 'Debe tener exactamente 10 dígitos'
    return err
  }

  const submit = async (e) => {
    e.preventDefault(); setError('')
    const err = validar()
    if (Object.keys(err).length) { setFe(err); return }
    setLoad(true)
    const r = await register({ ...f, idusuario: parseInt(f.idusuario) })
    if (r.success) nav('/dashboard')
    else setError(r.message)
    setLoad(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{maxWidth:'580px'}}>
        <div className="auth-role-badge">👤 Paciente</div>
        <h1>Crear Cuenta</h1>
        <p className="subtitle">Completa tu información personal</p>
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Documento *</label>
              <select name="tipodocumento" value={f.tipodocumento} onChange={set} disabled={load}>
                <option value="">Seleccionar...</option>
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="RC">Registro Civil (RC)</option>
              </select>
              {fe.tipodocumento && <span className="field-error">{fe.tipodocumento}</span>}
            </div>
            <div className="form-group">
              <label>Número de Documento *</label>
              <input
                type="text" name="idusuario" value={f.idusuario}
                onChange={handleSoloNumeros('idusuario', 15)}
                placeholder="1234567890" disabled={load}
                inputMode="numeric" maxLength={15}
              />
              {fe.idusuario && <span className="field-error">{fe.idusuario}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre * <small style={{color:'#94a3b8',fontWeight:'normal'}}>(solo letras)</small></label>
              <input
                type="text" name="nombre" value={f.nombre}
                onChange={handleSoloLetras('nombre', 60)}
                placeholder="Ana María" disabled={load} maxLength={60}
              />
              {fe.nombre && <span className="field-error">{fe.nombre}</span>}
            </div>
            <div className="form-group">
              <label>Apellido * <small style={{color:'#94a3b8',fontWeight:'normal'}}>(solo letras)</small></label>
              <input
                type="text" name="apellido" value={f.apellido}
                onChange={handleSoloLetras('apellido', 60)}
                placeholder="García López" disabled={load} maxLength={60}
              />
              {fe.apellido && <span className="field-error">{fe.apellido}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Correo Electrónico *</label>
              <input type="email" name="email" value={f.email} onChange={set}
                placeholder="correo@ejemplo.com" disabled={load} maxLength={100}/>
              {fe.email && <span className="field-error">{fe.email}</span>}
            </div>
            <div className="form-group">
              <label>Contraseña *</label>
              <input type="password" name="contrasena" value={f.contrasena} onChange={set}
                placeholder="Mínimo 6 caracteres" disabled={load} maxLength={60}/>
              {fe.contrasena && <span className="field-error">{fe.contrasena}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha de Nacimiento *</label>
              <input type="date" name="fechanacimiento" value={f.fechanacimiento} onChange={set} disabled={load}
                min="1900-01-01" max={new Date().toISOString().split('T')[0]}/>
              {fe.fechanacimiento && <span className="field-error">{fe.fechanacimiento}</span>}
            </div>
            <div className="form-group">
              <label>Tipo de Sangre *</label>
              <select name="tiposangre" value={f.tiposangre} onChange={set} disabled={load}>
                <option value="">Seleccionar...</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              {fe.tiposangre && <span className="field-error">{fe.tiposangre}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Teléfono * <small style={{color:'#94a3b8',fontWeight:'normal'}}>(10 dígitos)</small></label>
              <input
                type="tel" name="telefono" value={f.telefono}
                onChange={handleSoloNumeros('telefono', 10)}
                placeholder="3001234567" disabled={load}
                inputMode="numeric" maxLength={10}
              />
              {fe.telefono && <span className="field-error">{fe.telefono}</span>}
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" style={{width:'100%',marginTop:'1.25rem'}} disabled={load}>
            {load ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="auth-link">¿Ya tienes cuenta? <Link to="/login/paciente">Inicia sesión</Link></p>
        <p className="auth-back"><Link to="/">← Volver al inicio</Link></p>
      </div>
    </div>
  )
}
