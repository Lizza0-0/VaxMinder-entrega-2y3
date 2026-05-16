import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { carnetService, alertasService, vacunasService } from '../services/index'
import '../styles/dashboard.css'

// Datos del usuario: idusuario, nombre, apellido, email, tipodocumento,
//                    fechanacimiento, tiposangre, telefono, fecharegistro, edad

export const DashboardPage = () => {
  const { user, updateProfile, logout } = useContext(AuthContext)
  const nav = useNavigate()
  const [stats, setStats] = useState({ vacunaciones: 0, alertaspendientes: 0 })
  const [sugeridas, setSugeridas] = useState([])
  const [editando, setEditando]   = useState(false)
  const [editData, setEditData]   = useState({ email:'', telefono:'', contrasena:'' })
  const [saveErr,  setSaveErr]    = useState('')
  const [saveOk,   setSaveOk]    = useState('')
  const [saving,   setSaving]    = useState(false)

  useEffect(() => {
    if (!user) return
    setEditData({ email: user.email||'', telefono: user.telefono||'', contrasena:'' })
    const load = async () => {
      try {
        const [carnet, alertas, sug] = await Promise.all([
          carnetService.obtenerCarnet(user.idusuario),
          alertasService.obtenerAlertas(user.idusuario),
          vacunasService.obtenerSugeridas(user.idusuario)
        ])
        setStats({ vacunaciones: carnet.length, alertaspendientes: alertas.filter(a=>a.estado==='pendiente').length })
        setSugeridas(sug.vacunas || [])
      } catch {}
    }
    load()
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault(); setSaveErr(''); setSaveOk('')
    if (!editData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      setSaveErr('Ingresa un correo electrónico válido (ej: nombre@dominio.com)'); return
    }
    setSaving(true)
    const r = await updateProfile(editData)
    if (r.success) { setSaveOk('Perfil actualizado'); setEditando(false) }
    else setSaveErr(r.message)
    setSaving(false)
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—'

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <p className="page-subtitle">Panel Principal</p>
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Gestiona tu carnet de vacunación digital</p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="stat-card clickable" onClick={() => nav('/carnet')}>
          <div className="stat-icon">💉</div>
          <div className="stat-content"><h3>{stats.vacunaciones}</h3><p>Vacunaciones</p></div>
        </div>
        <div className="stat-card clickable" onClick={() => nav('/alertas')}>
          <div className="stat-icon">🔔</div>
          <div className="stat-content"><h3>{stats.alertaspendientes}</h3><p>Alertas pendientes</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🩸</div>
          <div className="stat-content"><h3>{user?.tiposangre || '—'}</h3><p>Tipo de sangre</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎂</div>
          <div className="stat-content"><h3>{user?.edad ?? '—'}</h3><p>Años</p></div>
        </div>
      </div>

      {/* Datos personales — exactamente los campos de UsuarioResponseDTO */}
      <div className="dashboard-section">
        <div className="section-title-row">
          <h2>Mis Datos</h2>
          {!editando
            ? <button className="btn-secondary btn-sm" onClick={()=>setEditando(true)}>✏️ Editar perfil</button>
            : <button className="btn-secondary btn-sm" onClick={()=>setEditando(false)}>Cancelar</button>
          }
        </div>
        <div className="info-grid">
          <div className="info-item"><label>Tipo de Documento</label><p>{user?.tipodocumento || '—'}</p></div>
          <div className="info-item"><label>Número de Documento</label><p>{user?.idusuario}</p></div>
          <div className="info-item"><label>Nombre</label><p>{user?.nombre}</p></div>
          <div className="info-item"><label>Apellido</label><p>{user?.apellido}</p></div>
          <div className="info-item"><label>Fecha de Nacimiento</label><p>{fmt(user?.fechanacimiento)}</p></div>
          <div className="info-item"><label>Tipo de Sangre</label><p>{user?.tiposangre || '—'}</p></div>
          <div className="info-item"><label>Correo</label><p>{user?.email}</p></div>
          <div className="info-item"><label>Teléfono</label><p>{user?.telefono || '—'}</p></div>
          <div className="info-item"><label>Fecha de Registro</label><p>{fmt(user?.fecharegistro)}</p></div>
        </div>

        {/* Formulario edición — solo campos que el backend acepta en PUT /api/usuarios/{id} */}
        {editando && (
          <form onSubmit={handleSave} style={{marginTop:'1.5rem',borderTop:'1px solid #e2e8f0',paddingTop:'1.5rem'}}>
            <h3 style={{marginBottom:'1rem',color:'var(--primary-color)'}}>Actualizar datos editables</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Correo *</label>
                <input type="email" value={editData.email}
                  onChange={e=>setEditData(p=>({...p,email:e.target.value}))}
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Teléfono * <small style={{color:'#94a3b8',fontWeight:'normal'}}>(10 dígitos)</small></label>
                <input type="tel" value={editData.telefono}
                  onChange={e=>{
                    const val = e.target.value.replace(/\D/g,'').slice(0,10)
                    setEditData(p=>({...p,telefono:val}))
                  }}
                  inputMode="numeric" maxLength={10}
                />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña (dejar vacío para no cambiar)</label>
                <input type="password" value={editData.contrasena}
                  onChange={e=>setEditData(p=>({...p,contrasena:e.target.value}))}
                  placeholder="Mínimo 6 caracteres" maxLength={60}
                />
              </div>
            </div>
            {saveErr && <div className="error-message">{saveErr}</div>}
            {saveOk  && <div className="success-message">{saveOk}</div>}
            <button type="submit" className="btn-primary" disabled={saving}>{saving?'Guardando...':'Guardar cambios'}</button>
          </form>
        )}
      </div>

      {/* Vacunas sugeridas por edad */}
      {sugeridas.length > 0 && (
        <div className="dashboard-section">
          <h2>Vacunas sugeridas para tu edad ({user?.edad} años)</h2>
          <div className="sugeridas-grid">
            {sugeridas.map(v => (
              <div className="sugerida-card" key={v.idvacuna}>
                <div className="sugerida-icon">💉</div>
                <div className="sugerida-info">
                  <strong>{v.nombrevacuna}</strong>
                  <p>{v.descripcion}</p>
                  <span className="sugerida-dosis">{v.dosisrequeridas} dosis</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
