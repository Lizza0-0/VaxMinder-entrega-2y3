import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { carnetService, alertasService, vacunasService } from '../services/index'
import '../styles/dashboard.css'

export const DashboardPage = () => {
  const { user, updateProfile }           = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats]                 = useState({ vacunaciones: 0, alertas: 0, vacunas: 0 })
  const [sugeridas, setSugeridas]         = useState([])
  const [editData, setEditData]           = useState({ email: '', telefono: '', contrasena: '' })
  const [updateError, setUpdateError]     = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [saving, setSaving]               = useState(false)

  useEffect(() => {
    if (!user) return
    setEditData({ email: user.email || '', telefono: user.telefono || '', contrasena: '' })

    const cargarTodo = async () => {
      try {
        const [carnet, alertas, vacResult] = await Promise.all([
          carnetService.obtenerCarnet(user.idusuario),
          alertasService.obtenerAlertas(user.idusuario),
          vacunasService.obtenerSugeridas(user.idusuario)
        ])
        setStats({
          vacunaciones: carnet.length,
          alertas:      alertas.filter(a => a.estado === 'pendiente').length,
          vacunas:      vacResult.vacunas?.length || 0
        })
        setSugeridas(vacResult.vacunas || [])
      } catch {}
    }
    cargarTodo()
  }, [user])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdateError('')
    setUpdateSuccess('')
    setSaving(true)
    if (!editData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      setUpdateError('El correo electronico no es valido'); setSaving(false); return
    }
    if (!editData.telefono.trim()) {
      setUpdateError('El telefono es requerido'); setSaving(false); return
    }
    const result = await updateProfile({
      email:    editData.email.trim(),
      telefono: editData.telefono.trim(),
      ...(editData.contrasena.trim() ? { contrasena: editData.contrasena.trim() } : {})
    })
    if (result.success) {
      setUpdateSuccess('Datos actualizados correctamente')
      setEditData(prev => ({ ...prev, contrasena: '' }))
    } else {
      setUpdateError(result.message || 'No se pudo actualizar la informacion')
    }
    setSaving(false)
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—'

  const goToSection = (targetId, route) => {
    if (route) {
      navigate(route)
      return
    }
    const section = document.getElementById(targetId)
    if (section) section.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.nombre}!</h1>
        <p>Tu carnet de vacunacion digital</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card clickable" onClick={() => goToSection(null, '/carnet')}>
          <div className="stat-icon">💉</div>
          <div className="stat-content"><h3>{stats.vacunaciones}</h3><p>Vacunaciones Registradas</p></div>
        </div>
        <div className="stat-card alert clickable" onClick={() => goToSection(null, '/alertas')}>
          <div className="stat-icon">🔔</div>
          <div className="stat-content"><h3>{stats.alertas}</h3><p>Alertas Pendientes</p></div>
        </div>
        <div className="stat-card clickable" onClick={() => goToSection('vacunas-recomendadas')}>
          <div className="stat-icon">📋</div>
          <div className="stat-content"><h3>{stats.vacunas}</h3><p>Vacunas Recomendadas</p></div>
        </div>
        <div className="stat-card clickable" onClick={() => goToSection('informacion-personal')}>
          <div className="stat-icon">👤</div>
          <div className="stat-content"><h3>{user?.edad ?? '—'}</h3><p>Anos</p></div>
        </div>
      </div>

      <div id="informacion-personal" className="dashboard-section">
        <h2>Informacion Personal</h2>
        <div className="info-grid">
          <div className="info-item"><label>Nombre completo</label><p>{user?.nombre} {user?.apellido}</p></div>
          <div className="info-item"><label>tipoDocumento</label><p>{user?.tipoDocumento || '—'}</p></div>
          <div className="info-item"><label>idusuario</label><p>{user?.idusuario}</p></div>
          <div className="info-item"><label>fechanacimiento</label><p>{fmt(user?.fechanacimiento)}</p></div>
          <div className="info-item"><label>tiposangre</label><p>{user?.tiposangre}</p></div>
          <div className="info-item"><label>Email</label><p>{user?.email}</p></div>
          <div className="info-item"><label>Telefono</label><p>{user?.telefono}</p></div>
        </div>
      </div>

      {sugeridas.length > 0 && (
        <div id="vacunas-recomendadas" className="dashboard-section">
          <h2>Vacunas recomendadas para tu edad ({user?.edad} anos)</h2>
          <div className="sugeridas-grid">
            {sugeridas.map(v => (
              <div key={v.id_vacuna} className="sugerida-card">
                <div className="sugerida-icon">💉</div>
                <div className="sugerida-info">
                  <strong>{v.nombre_vacuna}</strong>
                  {v.descripcion && <p>{v.descripcion}</p>}
                  <span className="sugerida-dosis">{v.dosis_requeridas} dosis requeridas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <h2>Editar datos de contacto</h2>
        <p className="section-hint">La cedula y la fecha de nacimiento no pueden modificarse.</p>
        <form onSubmit={handleUpdate} className="edit-profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo electronico</label>
              <input type="email" id="email" name="email" value={editData.email}
                onChange={handleEditChange} placeholder="correo@ejemplo.com" disabled={saving} />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Telefono</label>
              <input type="tel" id="telefono" name="telefono" value={editData.telefono}
                onChange={handleEditChange} placeholder="300 123 4567" disabled={saving} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="contrasena">Nueva contrasena</label>
              <input type="password" id="contrasena" name="contrasena" value={editData.contrasena}
                onChange={handleEditChange} placeholder="Dejar en blanco para no cambiar" disabled={saving} />
            </div>
          </div>
          {updateError   && <div className="error-message">{updateError}</div>}
          {updateSuccess && <div className="success-message">{updateSuccess}</div>}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}