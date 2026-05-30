import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { vacunasService, centrosService, registroVacunacionService } from '../services/index'
import { CIUDADES_COLOMBIA } from '../data/ciudadesColombia'
import '../styles/portal-centro.css'

const API = 'http://localhost:8080'

// ── Mini barra horizontal ───
const Barra = ({ valor, max, color = '#0099ab', label, sublabel }) => {
  const pct = max > 0 ? Math.round((valor / max) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{sublabel ?? valor}</span>
      </div>
      <div style={{ background: '#f3f4f6', borderRadius: 999, height: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}

// ── Tarjeta KPI ───
const KpiCard = ({ icon, valor, label, color, bg, small }) => (
  <div style={{ background: bg, borderRadius: 12, padding: 16, textAlign: 'center', border: `1.5px solid ${color}22`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
    <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: small ? 11 : '1.6rem', fontWeight: 700, color, lineHeight: 1.2, wordBreak: 'break-word' }}>{valor}</div>
    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6, fontWeight: 600 }}>{label}</div>
  </div>
)

// ── Gráfica de barras verticales (CSS) ───
const GraficaBarras = ({ datos, keyX, keyY, color = '#0099ab', titulo, conclusion }) => {
  if (!datos || datos.length === 0) return null
  const maxVal = Math.max(...datos.map(d => d[keyY] || 0), 1)
  return (
    <div>
      {titulo && <p style={{ margin: '0 0 0.75rem', fontSize: 13, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{titulo}</p>}
      <div style={{ background: 'white', borderRadius: 10, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130, overflowX: 'auto', paddingBottom: 4 }}>
          {datos.map((d, i) => {
            const h = Math.max(4, Math.round(((d[keyY] || 0) / maxVal) * 110))
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0, minWidth: 50 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{d[keyY]}</span>
                <div style={{ width: 38, height: h, background: `linear-gradient(180deg,${color},${color}99)`, borderRadius: '4px 4px 0 0', minHeight: 4, boxShadow: `0 2px 6px ${color}33` }} />
                <span style={{ fontSize: 9, color: '#9ca3af', whiteSpace: 'nowrap', maxWidth: 54, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>{d[keyX]}</span>
              </div>
            )
          })}
        </div>
        {conclusion && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280', fontStyle: 'italic', lineHeight: 1.5 }}><strong style={{ color: '#374151', fontStyle: 'normal' }}>Conclusión:</strong> {conclusion}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Gráfica de torta (CSS + SVG simple) ───
const GraficaTorta = ({ datos, keyLabel, keyVal, titulo, conclusion }) => {
  if (!datos || datos.length === 0) return null
  const total = datos.reduce((s, d) => s + (d[keyVal] || 0), 0)
  const colores = ['#0099ab', '#ff6b6b', '#ffd93d', '#6bcb77', '#845ec2', '#00b4cc']
  return (
    <div>
      {titulo && <p style={{ margin: '0 0 0.75rem', fontSize: 13, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{titulo}</p>}
      <div style={{ background: 'white', borderRadius: 10, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <svg width={120} height={120} viewBox="0 0 42 42" style={{ flexShrink: 0 }}>
            {(() => {
              let offset = 0
              return datos.map((d, i) => {
                const pct = total > 0 ? (d[keyVal] / total) * 100 : 0
                const dash = pct
                const gap  = 100 - pct
                const rot  = offset
                offset += pct
                return (
                  <circle key={i} cx={21} cy={21} r={15.9} fill="none"
                    stroke={colores[i % colores.length]} strokeWidth={6}
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={25 - rot}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                )
              })
            })()}
            <circle cx={21} cy={21} r={12} fill="white" />
          </svg>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {datos.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: colores[i % colores.length], flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#374151', flex: 1 }}>{d[keyLabel]}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>
                  {d[keyVal]} ({total > 0 ? Math.round((d[keyVal] / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        {conclusion && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280', fontStyle: 'italic', lineHeight: 1.5 }}><strong style={{ color: '#374151', fontStyle: 'normal' }}>Conclusión:</strong> {conclusion}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const PortalCentroPage = () => {
  const { centro, token, updateCentro } = useContext(AuthContext)

  const [vacunas,   setVacunas]   = useState([])
  const [centros,   setCentros]   = useState([])
  const [registros, setRegistros] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')

  const [docBusqueda,   setDocBusqueda]   = useState('')
  const [buscando,      setBuscando]      = useState(false)
  const [paciente,      setPaciente]      = useState(null)
  const [historial,     setHistorial]     = useState([])
  const [errorPaciente, setErrorPaciente] = useState('')

  // Analítica 
  const [mostrarAnalisis, setMostrarAnalisis] = useState(false)
  const [loadingAnalisis, setLoadingAnalisis] = useState(false)
  const [errorAnalisis,   setErrorAnalisis]   = useState('')
  const [miCentro,        setMiCentro]        = useState(null)
  const [todosCentros,    setTodosCentros]     = useState([])

  // Edición perfil 
  const [editando,   setEditando]   = useState(false)
  const [editData,   setEditData]   = useState({ razonsocial:'', direccion:'', telefono:'', ciudad:'' })
  const [editErr,    setEditErr]    = useState({})
  const [savingEdit, setSavingEdit] = useState(false)
  const [editMsg,    setEditMsg]    = useState('')
  const [editErrMsg, setEditErrMsg] = useState('')

  const emptyForm = { idvacuna:'', fechaaplicacion:'', lotevacuna:'', idcentromedico:'', observaciones:'', proximadosisfecha:'' }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    Promise.all([vacunasService.obtenerVacunas(), centrosService.obtenerCentros()])
      .then(([v, c]) => {
        setVacunas(v); setCentros(c)
        const match = c.find(x => x.nombrecentro?.toLowerCase().trim() === centro?.razonsocial?.toLowerCase().trim())
        if (match) setForm(p => ({ ...p, idcentromedico: String(match.idcentro) }))
      })
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false))
  }, [centro])

  useEffect(() => {
    if (editando && centro) {
      setEditData({ razonsocial: centro.razonsocial||'', direccion: centro.direccion||'', telefono: centro.telefono||'', ciudad: centro.ciudad||'' })
      setEditErr({}); setEditMsg(''); setEditErrMsg('')
    }
  }, [editando, centro])

  // Cargar analítica del centro logueado 
  const cargarAnalisis = async () => {
    setLoadingAnalisis(true); setErrorAnalisis('')
    try {
      const res = await fetch('/src/assets/data/vacunaciones_por_centro.json')
      if (!res.ok) throw new Error('No se encontró el archivo de analítica')
      const todos = await res.json()

      if (!Array.isArray(todos)) throw new Error('Formato de datos incorrecto')

      // Buscar ESTE centro por ID o nombre
      const match = centros.find(x => x.nombrecentro?.toLowerCase().trim() === centro?.razonsocial?.toLowerCase().trim())
      const idC   = match?.idcentro

      const misDatos = todos.find(s => Number(s.idcentromedico) === Number(idC))
                    ?? todos.find(s => s.nombrecentro?.toLowerCase().trim() === centro?.razonsocial?.toLowerCase().trim())

      if (!misDatos) throw new Error(`No se encontraron datos para "${centro?.razonsocial}". Asegúrate de haber ejecutado python/main.py con el backend activo.`)

      setMiCentro(misDatos)
      setTodosCentros(todos)
      setMostrarAnalisis(true)
    } catch (e) {
      setErrorAnalisis(e.message)
    }
    setLoadingAnalisis(false)
  }

  // Derivar datos del centro para las gráficas 

  // Vacunas aplicadas en este centro
  const vacunasCentro = (() => {
    if (!miCentro) return []
    if (Array.isArray(miCentro.vacunas_detalle)) return miCentro.vacunas_detalle
    if (miCentro.vacunas_por_tipo) {
      return Object.entries(miCentro.vacunas_por_tipo)
        .map(([nombre, personas]) => ({ nombre, personas, dosis: personas }))
        .sort((a, b) => b.dosis - a.dosis)
    }
    return []
  })()

  // Tendencia mensual de este centro
  const tendenciaCentro = Array.isArray(miCentro?.tendencia_mensual)
    ? miCentro.tendencia_mensual.map(m => ({ mes: m.mes_aplicacion ?? m.mes, total: m.total }))
    : []

  // Alertas de este centro por estado
  const alertasCentro = miCentro?.alertas_por_estado
    ? Object.entries(miCentro.alertas_por_estado).map(([estado, cantidad]) => ({ estado, cantidad }))
    : []

  // Distribución de dosis de este centro
  const distribucionDosis = Array.isArray(miCentro?.distribucion_dosis)
    ? miCentro.distribucion_dosis.map(d => ({ etiqueta: d.dosis ?? `Dosis ${d.numerodosis}`, total: d.total }))
    : []

  // Comparación global: todos los centros ordenados por personas_vacunadas
  const comparacionGlobal = [...todosCentros]
    .sort((a, b) => (b.personas_vacunadas || 0) - (a.personas_vacunadas || 0))

  const maxPersonas = Math.max(...comparacionGlobal.map(c => c.personas_vacunadas || 0), 1)

  // Guardar perfil 
  const handleSavePerfil = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!editData.razonsocial.trim()) errs.razonsocial = 'Requerido'
    if (!editData.direccion.trim())   errs.direccion   = 'Requerido'
    if (!editData.ciudad.trim())      errs.ciudad      = 'Requerido'
    if (!editData.telefono.trim())    errs.telefono    = 'Requerido'
    else if (!/^\d{10}$/.test(editData.telefono)) errs.telefono = 'Debe tener 10 dígitos'
    if (Object.keys(errs).length) { setEditErr(errs); return }
    setSavingEdit(true)
    try {
      const r = await fetch(`${API}/api/auth/centros/perfil`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editData),
      })
      const d = await r.json()
      if (!r.ok) { setEditErrMsg(d.error || 'No se pudo actualizar'); return }
      if (updateCentro) updateCentro(d)
      setEditMsg('✅ Datos actualizados'); setEditando(false)
    } catch { setEditErrMsg('Error de conexión') }
    finally  { setSavingEdit(false) }
  }

  // Búsqueda paciente 
  const buscarPaciente = async () => {
    const doc = docBusqueda.trim()
    if (!doc || !/^\d+$/.test(doc)) { setErrorPaciente('Ingresa un número de documento válido'); return }
    setErrorPaciente(''); setBuscando(true); setPaciente(null); setHistorial([])
    setForm(p => ({ ...emptyForm, idcentromedico: p.idcentromedico })); setError(''); setSuccess('')
    try {
      const [rU, rH] = await Promise.all([
        fetch(`${API}/api/usuarios/${doc}`,                   { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/registrovacunacion/usuario/${doc}`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (!rU.ok) { setErrorPaciente('Paciente no encontrado.'); return }
      setPaciente(await rU.json()); setHistorial(rH.ok ? await rH.json() : [])
    } catch { setErrorPaciente('Error al consultar.') }
    finally  { setBuscando(false) }
  }

  // Helpers vacunación 
  const getVacuna   = id => vacunas.find(v => String(v.idvacuna) === String(id))
  const getMaxDosis = id => getVacuna(id)?.dosisrequeridas || 99
  const calcDosis   = id => {
    if (!id || !paciente) return 1
    return historial.filter(r => (r.idvacuna?.idvacuna ?? parseInt(r.idvacuna)) === parseInt(id)).length + 1
  }
  const esUltima  = id => id && calcDosis(id) >= getMaxDosis(id)
  const calcProx  = (id, fecha) => {
    if (!id || !fecha) return ''
    const v = getVacuna(id); if (!v?.intervalodosisdias) return ''
    const d = new Date(fecha); d.setDate(d.getDate() + v.intervalodosisdias)
    return d.toISOString().split('T')[0]
  }

  const handleVacunaChange = e => {
    const id = e.target.value; setError('')
    if (id && calcDosis(id) > getMaxDosis(id)) setError(`El paciente ya completó el esquema de "${getVacuna(id)?.nombrevacuna}"`)
    setForm(p => ({ ...p, idvacuna: id, proximadosisfecha: esUltima(id) ? '' : calcProx(id, p.fechaaplicacion) }))
  }
  const handleFechaChange = e => {
    const f = e.target.value
    setForm(p => ({ ...p, fechaaplicacion: f, proximadosisfecha: esUltima(p.idvacuna) ? '' : calcProx(p.idvacuna, f) }))
  }

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSuccess('')
    if (!paciente)              { setError('Busca un paciente primero'); return }
    if (!form.idvacuna)         { setError('Selecciona una vacuna'); return }
    if (!form.fechaaplicacion)  { setError('Indica la fecha de aplicación'); return }
    if (!form.lotevacuna.trim()){ setError('Indica el número de lote'); return }
    if (calcDosis(form.idvacuna) > getMaxDosis(form.idvacuna)) { setError('Esquema ya completado'); return }
    const numerodosis = calcDosis(form.idvacuna)
    const nomVacuna   = getVacuna(form.idvacuna)?.nombrevacuna || ''
    setSaving(true)
    try {
      const reg = await registroVacunacionService.registrar({
        idusuario: paciente.idusuario, idvacuna: parseInt(form.idvacuna),
        fechaaplicacion: form.fechaaplicacion, numerodosis, lotevacuna: form.lotevacuna,
        idcentromedico: form.idcentromedico ? parseInt(form.idcentromedico) : null,
        observaciones: form.observaciones || null,
        proximadosisfecha: esUltima(form.idvacuna) ? null : (form.proximadosisfecha || null),
      })
      setRegistros(p => [reg, ...p]); setHistorial(p => [reg, ...p])
      setForm(p => ({ ...emptyForm, idcentromedico: p.idcentromedico }))
      setSuccess(`✅ Dosis ${numerodosis} de "${nomVacuna}" registrada correctamente`)
    } catch (err) { setError(err.message || 'Error al guardar') }
    finally { setSaving(false) }
  }

  const fmt          = d => d ? new Date(d).toLocaleDateString('es-ES') : '—'
  const nomVacunaReg = r => r?.idvacuna?.nombrevacuna       || '—'
  const nomCentroReg = r => r?.idcentromedico?.nombrecentro || '—'
  const dosisActual  = form.idvacuna ? calcDosis(form.idvacuna)   : null
  const maxDosis     = form.idvacuna ? getMaxDosis(form.idvacuna) : null
  const completo     = dosisActual && maxDosis && dosisActual > maxDosis
  const ultimaDosis  = esUltima(form.idvacuna)

  const colorAlerta = { pendiente:'#ef4444', enviada:'#f59e0b', leida:'#10b981', descartada:'#9ca3af' }

  return (
    <div className="portal-container">

      {/* Encabezado */}
      <div className="portal-header">
        <span className="portal-badge">🏥 Centro Médico</span>
        <h1>{centro?.razonsocial}</h1>
        <p className="portal-subtitle">NIT: {centro?.nit} &nbsp;|&nbsp; {centro?.ciudad}</p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ANALÍTICA DEL CENTRO
      ════════════════════════════════════════════════════════════════════ */}
      <div style={{ background:'linear-gradient(135deg,#f0f9ff,#e0f2fe)', border:'2px solid #0099ab', borderRadius:12, padding:'1.5rem', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: mostrarAnalisis ? '1.5rem' : 0 }}>
          <h2 style={{ margin:0, color:'#0099ab', fontSize:'1.2rem' }}>📊 Analítica del Centro</h2>
          {!mostrarAnalisis
            ? <button onClick={cargarAnalisis} disabled={loadingAnalisis}
                style={{ padding:'0.5rem 1.25rem', background:'#0099ab', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:13 }}>
                {loadingAnalisis ? '⏳ Cargando...' : 'Ver Analítica'}
              </button>
            : <button onClick={() => setMostrarAnalisis(false)}
                style={{ padding:'0.5rem 1.25rem', background:'#ff6b6b', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:13 }}>
                Cerrar
              </button>
          }
        </div>

        {errorAnalisis && (
          <div style={{ background:'#fee2e2', padding:'0.75rem', borderRadius:8, color:'#dc2626', fontSize:13, marginTop:'0.5rem' }}>
            ⚠️ {errorAnalisis}
          </div>
        )}

        {mostrarAnalisis && miCentro && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>

            {/* 1. KPIs del centro */}
            <div>
              <p style={{ margin:'0 0 0.75rem', fontSize:12, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                📊 Indicadores de {miCentro.nombrecentro ?? centro?.razonsocial}
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
                <KpiCard icon="👥" valor={miCentro.personas_vacunadas ?? 0}                                       label="Personas Vacunadas"    color="#0099ab" bg="#f0fdfe" />
                <KpiCard icon="💉" valor={miCentro.total_dosis ?? 0}                                              label="Total Dosis Aplicadas" color="#059669" bg="#d1fae5" />
                <KpiCard icon="📊" valor={(miCentro.promedio_dosis ?? 0).toFixed(2)}                              label="Promedio Dosis/Persona"color="#b45309" bg="#fef9c3" />
                <KpiCard icon="🔔" valor={miCentro.alertas_pendientes ?? 0}                                       label="Alertas Pendientes"    color="#dc2626" bg="#fee2e2" />
                <KpiCard icon="⭐" valor={miCentro.vacuna_top ?? (vacunasCentro[0]?.nombre ?? '—')}               label="Vacuna Más Aplicada"   color="#7c3aed" bg="#ede9fe" small />
                <KpiCard icon="📈" valor={miCentro.pct_del_total != null ? `${miCentro.pct_del_total}%` : '—'}    label="% del Sistema"         color="#0284c7" bg="#e0f2fe" />
              </div>
            </div>

            {/* 2. Vacunas aplicadas en este centro (barras) */}
            {vacunasCentro.length > 0 && (
              <GraficaBarras
                datos={vacunasCentro}
                keyX="nombre"
                keyY="dosis"
                color="#0099ab"
                titulo="💉 Vacunas Aplicadas en Este Centro"
                conclusion={`La vacuna más aplicada en este centro es "${vacunasCentro[0]?.nombre ?? '—'}" con ${vacunasCentro[0]?.dosis ?? 0} dosis. Esto indica las prioridades de vacunación del centro y permite identificar cuáles vacunas tienen mayor demanda.`}
              />
            )}

            {/* 3. Distribución de dosis (torta) */}
            {distribucionDosis.length > 0 && (
              <GraficaTorta
                datos={distribucionDosis}
                keyLabel="etiqueta"
                keyVal="total"
                titulo="🔢 Distribución por Número de Dosis"
                conclusion="La distribución de dosis muestra el nivel de avance en los esquemas de vacunación. Un alto porcentaje de primeras dosis indica que muchos pacientes están iniciando su esquema; un mayor porcentaje de dosis superiores indica continuidad y adherencia al tratamiento."
              />
            )}

            {/* 4. Tendencia mensual del centro */}
            {tendenciaCentro.length > 0 && (
              <GraficaBarras
                datos={tendenciaCentro}
                keyX="mes"
                keyY="total"
                color="#6bcb77"
                titulo="📅 Tendencia Mensual de Vacunaciones"
                conclusion="La tendencia mensual permite identificar picos de demanda y períodos de baja actividad en el centro. Los meses con mayor número de vacunaciones pueden correlacionarse con campañas de salud pública o temporadas de mayor incidencia de enfermedades prevenibles."
              />
            )}

            {/* 5. Alertas de este centro por estado */}
            {alertasCentro.length > 0 && (
              <div>
                <p style={{ margin:'0 0 0.75rem', fontSize:12, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  🔔 Alertas de Este Centro por Estado
                </p>
                <div style={{ background:'white', borderRadius:10, border:'1px solid #e5e7eb', padding:'1.25rem', display:'flex', flexDirection:'column', gap:10 }}>
                  {alertasCentro.map((a, i) => (
                    <Barra key={i}
                      valor={a.cantidad}
                      max={Math.max(...alertasCentro.map(x => x.cantidad || 0), 1)}
                      color={colorAlerta[a.estado] || '#0099ab'}
                      label={a.estado.charAt(0).toUpperCase() + a.estado.slice(1)}
                    />
                  ))}
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display:'flex', alignItems:'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                    <p style={{ margin: 0, fontSize: 12, color: '#6b7280', fontStyle: 'italic', lineHeight: 1.5 }}>
                      <strong style={{ color: '#374151', fontStyle: 'normal' }}>Conclusión:</strong> Las alertas pendientes representan acciones que aún requieren atención del equipo médico. Un volumen alto de alertas pendientes puede indicar la necesidad de reforzar el seguimiento a los pacientes del centro.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Comparación global (ÚNICO dato del sistema) */}
            {comparacionGlobal.length > 1 && (
              <div>
                <p style={{ margin:'0 0 0.75rem', fontSize:12, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  🌐 Posición vs Otros Centros del Sistema
                </p>
                <div style={{ background:'white', borderRadius:10, border:'1px solid #e5e7eb', padding:'1.25rem', display:'flex', flexDirection:'column', gap:8 }}>
                  {comparacionGlobal.map((c, i) => {
                    const esMiCentro = Number(c.idcentromedico) === Number(centros.find(x => x.nombrecentro?.toLowerCase().trim() === centro?.razonsocial?.toLowerCase().trim())?.idcentro)
                                    || c.nombrecentro?.toLowerCase().trim() === centro?.razonsocial?.toLowerCase().trim()
                    const medallas = ['🥇', '🥈', '🥉']
                    return (
                      <div key={i} style={{ background: esMiCentro ? '#f0fdfe' : 'transparent', borderRadius: 8, padding: esMiCentro ? '8px 10px' : '2px 10px', border: esMiCentro ? '2px solid #0099ab' : 'none' }}>
                        <Barra
                          valor={c.personas_vacunadas || 0}
                          max={maxPersonas}
                          color={esMiCentro ? '#0099ab' : '#cbd5e1'}
                          label={`${medallas[i] ?? `#${i+1}`} ${c.nombrecentro ?? '—'}${esMiCentro ? ' (tú)' : ''}`}
                          sublabel={`${c.personas_vacunadas ?? 0} personas`}
                        />
                      </div>
                    )
                  })}
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display:'flex', alignItems:'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                    <p style={{ margin: 0, fontSize: 12, color: '#6b7280', fontStyle: 'italic', lineHeight: 1.5 }}>
                      <strong style={{ color: '#374151', fontStyle: 'normal' }}>Conclusión:</strong> La comparación entre centros permite evaluar el desempeño relativo en cobertura de vacunación. Los centros con mayor número de personas vacunadas demuestran una mejor capacidad de atención y alcance en su comunidad.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DATOS DEL CENTRO
      ════════════════════════════════════════════════════════════════════ */}
      <div className="portal-form-section" style={{ marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', gap:'1rem' }}>
          <h2 style={{ margin:0 }}>Datos del Centro</h2>
          {!editando
            ? <button onClick={() => setEditando(true)}  style={{ padding:'0.35rem 0.85rem', fontSize:13, fontWeight:600, background:'white', color:'#0099ab', border:'1.5px solid #cbd5e1', borderRadius:8, cursor:'pointer' }}>✏️ Editar perfil</button>
            : <button onClick={() => setEditando(false)} style={{ padding:'0.35rem 0.85rem', fontSize:13, fontWeight:600, background:'white', color:'#64748b', border:'1.5px solid #cbd5e1', borderRadius:8, cursor:'pointer' }}>Cancelar</button>
          }
        </div>
        <div className="info-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
          {[['NIT (no editable)', centro?.nit], ['Razón Social', centro?.razonsocial], ['Dirección', centro?.direccion], ['Ciudad', centro?.ciudad], ['Teléfono', centro?.telefono]].map(([lbl, val]) => (
            <div key={lbl}>
              <label style={{ fontSize:12, color:'#64748b', display:'block', marginBottom:4, fontWeight:600 }}>{lbl}</label>
              <p style={{ margin:0, fontWeight:600 }}>{val || '—'}</p>
            </div>
          ))}
        </div>
        {editMsg    && <div className="success-message" style={{ marginTop:'0.75rem' }}>{editMsg}</div>}
        {editErrMsg && <div className="error-message"   style={{ marginTop:'0.75rem' }}>{editErrMsg}</div>}
        {editando && (
          <form onSubmit={handleSavePerfil} style={{ marginTop:'1.25rem', borderTop:'1px solid #e2e8f0', paddingTop:'1.25rem' }}>
            <p style={{ margin:'0 0 1rem', fontWeight:600, color:'var(--primary-color)' }}>Actualizar datos editables</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Razón Social *</label>
                <input type="text" value={editData.razonsocial} maxLength={120}
                  onChange={e => { setEditData(p => ({ ...p, razonsocial: e.target.value.slice(0,120) })); setEditErr(p => ({ ...p, razonsocial:'' })) }} />
                {editErr.razonsocial && <span className="field-error">{editErr.razonsocial}</span>}
              </div>
              <div className="form-group">
                <label>Dirección *</label>
                <input type="text" value={editData.direccion} maxLength={150}
                  onChange={e => { setEditData(p => ({ ...p, direccion: e.target.value.slice(0,150) })); setEditErr(p => ({ ...p, direccion:'' })) }} />
                {editErr.direccion && <span className="field-error">{editErr.direccion}</span>}
              </div>
              <div className="form-group">
                <label>Ciudad *</label>
                <select value={editData.ciudad} onChange={e => { setEditData(p => ({ ...p, ciudad: e.target.value })); setEditErr(p => ({ ...p, ciudad:'' })) }}>
                  <option value="">-- Seleccionar --</option>
                  {CIUDADES_COLOMBIA.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {editErr.ciudad && <span className="field-error">{editErr.ciudad}</span>}
              </div>
              <div className="form-group">
                <label>Teléfono * <small style={{ color:'#94a3b8' }}>(10 dígitos)</small></label>
                <input type="tel" value={editData.telefono} inputMode="numeric" maxLength={10}
                  onChange={e => { setEditData(p => ({ ...p, telefono: e.target.value.replace(/\D/g,'').slice(0,10) })); setEditErr(p => ({ ...p, telefono:'' })) }} />
                {editErr.telefono && <span className="field-error">{editErr.telefono}</span>}
              </div>
            </div>
            <p style={{ fontSize:12, color:'#64748b', margin:'0.5rem 0 1rem' }}>⚠️ El NIT no puede modificarse.</p>
            <button type="submit" className="btn-primary" disabled={savingEdit}>{savingEdit ? 'Guardando...' : 'Guardar cambios'}</button>
          </form>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          REGISTRAR VACUNACIÓN
      ════════════════════════════════════════════════════════════════════ */}
      <div className="portal-form-section">
        <h2>Registrar Vacunación</h2>
        <form onSubmit={handleSubmit}>
          <p className="form-section-title">👤 Buscar Paciente</p>
          <div className="form-row" style={{ alignItems:'flex-end' }}>
            <div className="form-group">
              <label>Número de Documento *</label>
              <input type="text" value={docBusqueda} placeholder="1001234567" disabled={buscando}
                inputMode="numeric" maxLength={15}
                onChange={e => { setDocBusqueda(e.target.value.replace(/\D/g,'').slice(0,15)); setErrorPaciente('') }}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), buscarPaciente())} />
            </div>
            <div className="form-group" style={{ flex:'0 0 auto' }}>
              <button type="button" className="btn-primary" style={{ marginTop:0 }} onClick={buscarPaciente} disabled={buscando}>
                {buscando ? 'Buscando...' : '🔍 Buscar'}
              </button>
            </div>
          </div>
          {errorPaciente && <div className="error-message">{errorPaciente}</div>}

          {paciente && (
            <div className="paciente-encontrado">
              <div className="paciente-encontrado-header">
                <span className="paciente-badge">✅ Paciente encontrado</span>
                <span style={{ fontSize:13, color:'#64748b' }}>Solo el paciente puede editar sus datos</span>
              </div>
              <div className="form-row">
                {[['Tipo Doc.', paciente.tipodocumento], ['Nº Doc.', paciente.idusuario], ['Nombre', paciente.nombre], ['Apellido', paciente.apellido]].map(([l,v]) => (
                  <div className="form-group" key={l}><label>{l}</label><input type="text" value={v||'—'} readOnly className="input-readonly" /></div>
                ))}
              </div>
              <div className="form-row">
                {[['Correo', paciente.email], ['Teléfono', paciente.telefono], ['Tipo Sangre', paciente.tiposangre], ['F. Nacimiento', fmt(paciente.fechanacimiento)]].map(([l,v]) => (
                  <div className="form-group" key={l}><label>{l}</label><input type="text" value={v||'—'} readOnly className="input-readonly" /></div>
                ))}
              </div>
              {historial.length > 0 && (
                <div className="historial-rapido">
                  <p className="historial-rapido-titulo">📋 Vacunas previas</p>
                  <div className="historial-rapido-lista">
                    {historial.map(r => (
                      <span key={r.idregistro} className="historial-chip">
                        {nomVacunaReg(r)} · Dosis {r.numerodosis} · {fmt(r.fechaaplicacion)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {paciente && (
            <>
              <p className="form-section-title">💉 Datos de la Vacuna</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Vacuna *</label>
                  <select name="idvacuna" value={form.idvacuna} onChange={handleVacunaChange}>
                    <option value="">-- Seleccionar vacuna --</option>
                    {vacunas.map(v => <option key={v.idvacuna} value={v.idvacuna}>{v.nombrevacuna}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Número de Dosis</label>
                  <div className="dosis-auto">
                    {!form.idvacuna
                      ? <span className="dosis-placeholder">Se calculará al elegir vacuna</span>
                      : completo
                        ? <span className="dosis-completa">⛔ Esquema completo ({maxDosis}/{maxDosis})</span>
                        : <span className="dosis-valor">Dosis {dosisActual} de {maxDosis}</span>
                    }
                  </div>
                </div>
                <div className="form-group">
                  <label>Fecha de Aplicación *</label>
                  <input type="date" name="fechaaplicacion" value={form.fechaaplicacion} onChange={handleFechaChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Lote de Vacuna *</label>
                  <input type="text" value={form.lotevacuna} placeholder="LOT2026-001" maxLength={30}
                    onChange={e => setForm(p => ({ ...p, lotevacuna: e.target.value.replace(/[^a-zA-Z0-9\-]/g,'').slice(0,30) }))} />
                </div>
                <div className="form-group">
                  <label>Centro Médico</label>
                  <select name="idcentromedico" value={form.idcentromedico} onChange={e => setForm(p => ({ ...p, idcentromedico: e.target.value }))}>
                    <option value="">-- Seleccionar --</option>
                    {centros.map(c => <option key={c.idcentro} value={c.idcentro}>{c.nombrecentro} — {c.ciudad}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Próxima Dosis
                    {ultimaDosis && <small style={{ color:'#94a3b8', marginLeft:6 }}>(esquema completo)</small>}
                    {!ultimaDosis && form.proximadosisfecha && <small style={{ color:'#0099ab', marginLeft:6 }}>(auto)</small>}
                  </label>
                  <input type="date" name="proximadosisfecha"
                    value={ultimaDosis ? '' : form.proximadosisfecha}
                    onChange={ultimaDosis ? undefined : e => setForm(p => ({ ...p, proximadosisfecha: e.target.value }))}
                    readOnly={ultimaDosis} disabled={ultimaDosis}
                    style={ultimaDosis ? { background:'#f1f5f9', color:'#94a3b8', cursor:'not-allowed', border:'1px solid #e2e8f0' } : {}} />
                  {ultimaDosis && <small style={{ color:'#94a3b8', fontSize:12 }}>No aplica — última dosis</small>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group form-full">
                  <label>Observaciones</label>
                  <input type="text" name="observaciones" value={form.observaciones}
                    onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))} placeholder="Opcional" maxLength={300} />
                </div>
              </div>
              {error   && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <button type="submit" className="btn-primary" disabled={saving || completo}>
                {saving ? 'Guardando...' : 'Registrar Vacunación'}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Registros de la sesión */}
      {registros.length > 0 && (
        <div className="portal-registros">
          <h2>Registros de esta sesión ({registros.length})</h2>
          <div className="registros-table-container">
            <table className="registros-table">
              <thead>
                <tr><th>Paciente</th><th>Vacuna</th><th>Dosis</th><th>Fecha</th><th>Lote</th><th>Centro</th></tr>
              </thead>
              <tbody>
                {registros.map(r => (
                  <tr key={r.idregistro}>
                    <td>{r.idusuario?.nombre} {r.idusuario?.apellido}<br /><small>{r.idusuario?.tipodocumento} {r.idusuario?.idusuario}</small></td>
                    <td>{nomVacunaReg(r)}</td><td>{r.numerodosis}</td>
                    <td>{fmt(r.fechaaplicacion)}</td><td>{r.lotevacuna || '—'}</td><td>{nomCentroReg(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}