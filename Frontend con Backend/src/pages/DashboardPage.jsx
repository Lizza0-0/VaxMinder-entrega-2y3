import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { carnetService, alertasService, vacunasService } from '../services/index'
import '../styles/dashboard.css'

// Componentes pequeños 
const KpiCard = ({ icon, valor, label, color, bg }) => (
  <div style={{ background: bg, borderRadius: 12, padding: 16, textAlign: 'center', border: `1.5px solid ${color}22` }}>
    <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: '2rem', fontWeight: 700, color, lineHeight: 1 }}>{valor}</div>
    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6, fontWeight: 600 }}>{label}</div>
  </div>
)

const Conclusion = ({ color, bg, border, texto }) => (
  <div style={{ marginTop: '0.875rem', background: bg, border: `1px dashed ${border}`, borderRadius: 10, padding: '0.75rem 1rem', display: 'flex', gap: 10 }}>
    <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
    <p style={{ margin: 0, fontSize: 12, color, lineHeight: 1.6, fontStyle: 'italic' }}>{texto}</p>
  </div>
)

export const DashboardPage = () => {
  const { user, updateProfile } = useContext(AuthContext)
  const nav = useNavigate()

  const [stats,            setStats]            = useState({ vacunaciones: 0, alertaspendientes: 0 })
  const [sugeridas,        setSugeridas]        = useState([])
  const [editando,         setEditando]         = useState(false)
  const [editData,         setEditData]         = useState({ email: '', telefono: '', contrasena: '' })
  const [saveErr,          setSaveErr]          = useState('')
  const [saveOk,           setSaveOk]           = useState('')
  const [saving,           setSaving]           = useState(false)
  const [misVacunas,       setMisVacunas]       = useState([])
  const [personasPorVacuna,setPersonasPorVacuna]= useState([])
  const [loadingVacunas,   setLoadingVacunas]   = useState(false)
  const [errorVacunas,     setErrorVacunas]     = useState('')

  useEffect(() => {
    if (!user) return
    setEditData({ email: user.email || '', telefono: user.telefono || '', contrasena: '' })
    const load = async () => {
      try {
        const [carnet, alertas, sug] = await Promise.all([
          carnetService.obtenerCarnet(user.idusuario),
          alertasService.obtenerAlertas(user.idusuario),
          vacunasService.obtenerSugeridas(user.idusuario),
        ])
        setStats({ vacunaciones: carnet.length, alertaspendientes: alertas.filter(a => a.estado === 'pendiente').length })
        setSugeridas(sug.vacunas || [])
      } catch {}
    }
    load()
    cargarVacunacion()
  }, [user])

  const cargarVacunacion = async () => {
    if (!user) return
    setLoadingVacunas(true); setErrorVacunas('')
    try {
      const [resDetalle, resPersonas] = await Promise.all([
        fetch('/src/assets/data/estado_vacunacion_por_usuario.json').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/src/assets/data/personas_por_vacuna.json').then(r => r.ok ? r.json() : []).catch(() => []),
      ])
      const miId = String(user.idusuario)
      setMisVacunas(Array.isArray(resDetalle) ? resDetalle.filter(r => String(r.idusuario) === miId) : [])
      setPersonasPorVacuna(Array.isArray(resPersonas) ? resPersonas : [])
    } catch {
      setErrorVacunas('No se pudo cargar el estado de vacunación.')
    }
    setLoadingVacunas(false)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaveErr(''); setSaveOk('')
    if (!editData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) { setSaveErr('Correo inválido'); return }
    if (!editData.telefono || editData.telefono.length !== 10) { setSaveErr('El teléfono debe tener 10 dígitos'); return }
    if (editData.contrasena && editData.contrasena.length < 6) { setSaveErr('Contraseña mínimo 6 caracteres'); return }
    setSaving(true)
    const r = await updateProfile(editData)
    if (r.success) { setSaveOk('Perfil actualizado'); setEditando(false) } else setSaveErr(r.message)
    setSaving(false)
  }

  const fmt            = d => d ? new Date(d).toLocaleDateString('es-ES') : '—'
  const porEstado      = e => misVacunas.filter(v => v.estado === e)
  const personasDeVac  = n => personasPorVacuna.find(p => p.nombrevacuna === n)?.personas_vacunadas ?? 0

  const totalCatalogo    = misVacunas.length
  const totalCompletadas = porEstado('completada').length
  const totalEnProgreso  = porEstado('en_progreso').length
  const totalPendientes  = porEstado('pendiente').length
  const totalConRefuerzo = misVacunas.filter(v => v.requiererefuerzo && v.estado !== 'pendiente').length
  const pct              = totalCatalogo > 0 ? Math.round((totalCompletadas / totalCatalogo) * 100) : 0

  return (
    <div className="dashboard-container">

      {/* Encabezado */}
      <div className="dashboard-header">
        <p className="page-subtitle">Panel Principal</p>
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Gestiona tu carnet de vacunación digital</p>
      </div>

      {/* KPI rápidos */}
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

      {/* Mis datos */}
      <div className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>Mis Datos</h2>
          <button onClick={() => setEditando(p => !p)} style={{ padding: '0.35rem 0.85rem', fontSize: 13, fontWeight: 600, background: 'white', color: editando ? '#64748b' : '#0099ab', border: '1.5px solid #cbd5e1', borderRadius: 8, cursor: 'pointer' }}>
            {editando ? 'Cancelar' : '✏️ Editar perfil'}
          </button>
        </div>
        <div className="info-grid">
          {[
            ['Tipo de Documento', user?.tipodocumento],
            ['Número de Documento', user?.idusuario],
            ['Nombre', user?.nombre],
            ['Apellido', user?.apellido],
            ['Fecha de Nacimiento', fmt(user?.fechanacimiento)],
            ['Tipo de Sangre', user?.tiposangre],
            ['Correo', user?.email],
            ['Teléfono', user?.telefono],
            ['Fecha de Registro', fmt(user?.fecharegistro)],
          ].map(([label, val]) => (
            <div className="info-item" key={label}>
              <label>{label}</label>
              <p>{val || '—'}</p>
            </div>
          ))}
        </div>
        {editando && (
          <form onSubmit={handleSave} style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Actualizar datos editables</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Correo *</label>
                <input type="email" value={editData.email} maxLength={100}
                  onChange={e => setEditData(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Teléfono * <small style={{ color: '#94a3b8', fontWeight: 'normal' }}>(10 dígitos)</small></label>
                <input type="tel" value={editData.telefono} inputMode="numeric" maxLength={10}
                  onChange={e => setEditData(p => ({ ...p, telefono: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña <small style={{ color: '#94a3b8', fontWeight: 'normal' }}>(vacío = no cambia)</small></label>
                <input type="password" value={editData.contrasena} maxLength={60} placeholder="Mínimo 6 caracteres"
                  onChange={e => setEditData(p => ({ ...p, contrasena: e.target.value }))} />
              </div>
            </div>
            {saveErr && <div className="error-message">{saveErr}</div>}
            {saveOk  && <div className="success-message">{saveOk}</div>}
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
          </form>
        )}
      </div>

      {/* Vacunas sugeridas */}
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

      {/* ── Mi Estado de Vacunación ── */}
      <div className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>💉 Mi Estado de Vacunación</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Resumen según el catálogo del sistema</p>
          </div>
          <button onClick={cargarVacunacion} disabled={loadingVacunas}
            style={{ padding: '0.4rem 1rem', fontSize: 13, fontWeight: 600, background: '#f0fdfe', color: '#0099ab', border: '1.5px solid #0099ab', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {loadingVacunas ? '⏳ Cargando...' : '🔄 Actualizar'}
          </button>
        </div>

        {errorVacunas && <div className="error-message" style={{ marginBottom: '1rem' }}>⚠️ {errorVacunas}</div>}

        {/* Tarjetas KPI */}
        {misVacunas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              <KpiCard icon="📋" valor={totalCatalogo}    label="Total catálogo"   color="#0099ab" bg="#f0fdfe" />
              <KpiCard icon="✅" valor={totalCompletadas} label="Completadas"      color="#059669" bg="#d1fae5" />
              <KpiCard icon="🔄" valor={totalEnProgreso}  label="En progreso"      color="#b45309" bg="#fef9c3" />
              <KpiCard icon="⏳" valor={totalPendientes}  label="Pendientes"       color="#dc2626" bg="#fee2e2" />
              <KpiCard icon="🔁" valor={totalConRefuerzo} label="Con refuerzo"     color="#7c3aed" bg="#ede9fe" />
            </div>

            {/* Barra de progreso */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: '#374151', fontSize: 14 }}>Progreso general del esquema de vacunación</span>
                <span style={{ fontWeight: 700, color: '#0099ab', fontSize: 18 }}>{pct}%</span>
              </div>
              <div style={{ background: '#e2e8f0', borderRadius: 999, height: 14, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#059669' : 'linear-gradient(90deg,#0099ab,#00b4cc)', borderRadius: 999, transition: 'width 0.5s' }} />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#6b7280' }}>
                {totalCompletadas} de {totalCatalogo} vacunas completadas
                {pct === 100 && ' 🎉 ¡Felicitaciones, tienes tu esquema completo!'}
              </p>
              <Conclusion
                color="#92400e" bg="#fffbeb" border="#fbbf24"
                texto={
                  pct === 100
                    ? 'Tienes todas tus vacunas al día. ¡Excelente trabajo cuidando tu salud!'
                    : pct >= 50
                      ? `Llevas más de la mitad completada. Te faltan ${totalPendientes} vacunas por iniciar y ${totalEnProgreso} por completar.`
                      : `Aún tienes ${totalPendientes} vacunas pendientes. Completar tu esquema reduce el riesgo de enfermedades prevenibles.`
                }
              />
            </div>

            {/* Vacunas pendientes */}
            {porEstado('pendiente').length > 0 && (
              <div>
                <h3 style={{ margin: '0 0 0.75rem', color: '#dc2626', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⏳ Vacunas que te faltan por aplicar
                  <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                    {porEstado('pendiente').length}
                  </span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
                  {porEstado('pendiente').map((v, i) => (
                    <div key={i} style={{ background: 'white', border: '1.5px solid #fecaca', borderRadius: 12, padding: 14, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#ef4444', borderRadius: '12px 0 0 12px' }} />
                      <div style={{ paddingLeft: 8 }}>
                        <div style={{ fontWeight: 700, color: '#111827', fontSize: 14, marginBottom: 6 }}>💉 {v.nombrevacuna}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                          {v.dosisrequeridas} dosis requeridas
                          {v.requiererefuerzo && <span style={{ marginLeft: 8, background: '#ede9fe', color: '#7c3aed', padding: '1px 7px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>Refuerzo</span>}
                        </div>
                        {personasDeVac(v.nombrevacuna) > 0 && (
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#15803d', fontWeight: 600 }}>
                            👥 {personasDeVac(v.nombrevacuna)} personas ya se vacunaron con esta vacuna
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Conclusion
                  color="#991b1b" bg="#fff5f5" border="#fca5a5"
                  texto={`Tienes ${totalPendientes} ${totalPendientes === 1 ? 'vacuna pendiente' : 'vacunas pendientes'} por iniciar. Consulta con tu centro médico para programarlas. Las personas que te rodean ya se están protegiendo — ¡únete a ellas!`}
                />
              </div>
            )}

            {/* Vacunas en progreso */}
            {porEstado('en_progreso').length > 0 && (
              <div>
                <h3 style={{ margin: '0 0 0.75rem', color: '#b45309', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🔄 Vacunas en progreso
                  <span style={{ background: '#fef9c3', color: '#b45309', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                    {porEstado('en_progreso').length}
                  </span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
                  {porEstado('en_progreso').map((v, i) => {
                    const p = v.dosisrequeridas > 0 ? Math.round((v.dosis_max_aplicada / v.dosisrequeridas) * 100) : 0
                    return (
                      <div key={i} style={{ background: 'white', border: '1.5px solid #fde68a', borderRadius: 12, padding: 14, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#f59e0b', borderRadius: '12px 0 0 12px' }} />
                        <div style={{ paddingLeft: 8 }}>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: 14, marginBottom: 6 }}>💉 {v.nombrevacuna}</div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                            Dosis: <strong style={{ color: '#b45309' }}>{v.dosis_max_aplicada}</strong> de <strong>{v.dosisrequeridas}</strong> · faltan <strong style={{ color: '#dc2626' }}>{v.dosis_faltantes}</strong>
                          </div>
                          <div style={{ background: '#e2e8f0', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                            <div style={{ width: `${p}%`, height: '100%', background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius: 999 }} />
                          </div>
                          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{p}% completado</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Vacunas completadas */}
            {porEstado('completada').length > 0 && (
              <div>
                <h3 style={{ margin: '0 0 0.75rem', color: '#059669', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  ✅ Esquemas completos
                  <span style={{ background: '#d1fae5', color: '#059669', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                    {porEstado('completada').length}
                  </span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {porEstado('completada').map((v, i) => (
                    <div key={i} style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 22, flexShrink: 0 }}>✅</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#065f46', fontSize: 13 }}>{v.nombrevacuna}</div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{v.dosisrequeridas} {v.dosisrequeridas === 1 ? 'dosis completada' : 'dosis completadas'}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Conclusion
                  color="#166534" bg="#f0fdf4" border="#86efac"
                  texto={`Has completado el esquema de ${totalCompletadas} ${totalCompletadas === 1 ? 'vacuna' : 'vacunas'}. Cada esquema completado representa protección efectiva contra enfermedades prevenibles para ti y tu comunidad.`}
                />
              </div>
            )}

          </div>
        )}

        {/* Estado vacío */}
        {!loadingVacunas && misVacunas.length === 0 && !errorVacunas && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#9ca3af' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <p style={{ fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>No hay datos de vacunación disponibles aún</p>
            <p style={{ fontSize: 13 }}>Ejecuta <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>python/main.py</code> con el backend activo.</p>
          </div>
        )}

      </div>

    </div>
  )
}