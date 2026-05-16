import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { vacunasService, centrosService, registroVacunacionService } from '../services/index'
import { CIUDADES_COLOMBIA } from '../data/ciudadesColombia'
import '../styles/portal-centro.css'

const API = 'http://localhost:8080'

export const PortalCentroPage = () => {
  const { centro, token, logout, updateCentro } = useContext(AuthContext)

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

  // ── Edición de perfil del centro ──────────────────────────
  const [editandoCentro,  setEditandoCentro]  = useState(false)
  const [editCentroData,  setEditCentroData]  = useState({ razonsocial:'', direccion:'', telefono:'', ciudad:'' })
  const [editCentroErr,   setEditCentroErr]   = useState({})
  const [savingCentro,    setSavingCentro]    = useState(false)
  const [centroMsg,       setCentroMsg]       = useState('')
  const [centroErrMsg,    setCentroErrMsg]    = useState('')

  const emptyForm = {
    idvacuna: '',
    fechaaplicacion: '',
    lotevacuna: '',
    idcentromedico: '',
    observaciones: '',
    proximadosisfecha: ''
  }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    Promise.all([vacunasService.obtenerVacunas(), centrosService.obtenerCentros()])
      .then(([v, c]) => {
        setVacunas(v)
        setCentros(c)
        const centroSesion = c.find(x =>
          x.nombrecentro?.toLowerCase().trim() === centro?.razonsocial?.toLowerCase().trim()
        )
        if (centroSesion) {
          setForm(prev => ({ ...prev, idcentromedico: String(centroSesion.idcentro) }))
        }
      })
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false))
  }, [centro])

  // Inicializar formulario de edición de centro cuando abre
  useEffect(() => {
    if (editandoCentro && centro) {
      setEditCentroData({
        razonsocial: centro.razonsocial || '',
        direccion:   centro.direccion   || '',
        telefono:    centro.telefono    || '',
        ciudad:      centro.ciudad      || ''
      })
      setEditCentroErr({})
      setCentroMsg('')
      setCentroErrMsg('')
    }
  }, [editandoCentro, centro])

  // ── Calcular próxima dosis ───────────────────────────────────
  const calcProximaDosis = (idvacuna, fechaaplicacion) => {
    if (!idvacuna || !fechaaplicacion) return ''
    const vacuna = vacunas.find(v => String(v.idvacuna) === String(idvacuna))
    if (!vacuna?.intervalodosisdias) return ''
    const fecha = new Date(fechaaplicacion)
    fecha.setDate(fecha.getDate() + vacuna.intervalodosisdias)
    return fecha.toISOString().split('T')[0]
  }

  const buscarPaciente = async () => {
    const doc = docBusqueda.trim()
    if (!doc || !/^\d+$/.test(doc)) {
      setErrorPaciente('Ingresa un número de documento válido (solo dígitos)')
      return
    }
    setErrorPaciente(''); setBuscando(true)
    setPaciente(null); setHistorial([])
    setForm(prev => ({ ...emptyForm, idcentromedico: prev.idcentromedico }))
    setError(''); setSuccess('')

    try {
      const [rU, rH] = await Promise.all([
        fetch(`${API}/api/usuarios/${doc}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API}/api/registrovacunacion/usuario/${doc}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ])
      if (!rU.ok) { setErrorPaciente('Paciente no encontrado.'); return }
      const usuario = await rU.json()
      const hist    = rH.ok ? await rH.json() : []
      setPaciente(usuario); setHistorial(hist)
    } catch {
      setErrorPaciente('Error al consultar el paciente.')
    } finally { setBuscando(false) }
  }

  const calcDosis   = (idvacuna) => {
    if (!idvacuna || !paciente) return 1
    const vid = parseInt(idvacuna)
    return historial.filter(r =>
      (r.idvacuna?.idvacuna ?? parseInt(r.idvacuna)) === vid
    ).length + 1
  }
  const getVacuna   = (id) => vacunas.find(v => String(v.idvacuna) === String(id))
  const getMaxDosis = (id) => getVacuna(id)?.dosisrequeridas || 99

  const esUltimaDosis = (idvacuna) => {
    if (!idvacuna) return false
    const actual = calcDosis(idvacuna)
    const max    = getMaxDosis(idvacuna)
    return actual >= max
  }

  const handleVacunaChange = (e) => {
    const idvacuna = e.target.value
    setError('')
    if (idvacuna && calcDosis(idvacuna) > getMaxDosis(idvacuna))
      setError(`El paciente ya completó el esquema de "${getVacuna(idvacuna)?.nombrevacuna}" (${getMaxDosis(idvacuna)} dosis)`)
    const esFinal = esUltimaDosis(idvacuna)
    // Si es última dosis, limpiar próxima fecha
    const proximadosisfecha = esFinal ? '' : calcProximaDosis(idvacuna, form.fechaaplicacion)
    setForm(p => ({ ...p, idvacuna, proximadosisfecha }))
  }

  const handleFechaChange = (e) => {
    const fechaaplicacion = e.target.value
    const esFinal = esUltimaDosis(form.idvacuna)
    const proximadosisfecha = esFinal ? '' : calcProximaDosis(form.idvacuna, fechaaplicacion)
    setForm(p => ({ ...p, fechaaplicacion, proximadosisfecha }))
  }

  const handleForm = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  const validar = () => {
    if (!paciente)               return 'Busca un paciente primero'
    if (!form.idvacuna)          return 'Selecciona una vacuna'
    if (!form.fechaaplicacion)   return 'Indica la fecha de aplicación'
    if (!form.lotevacuna.trim()) return 'Indica el número de lote'
    if (calcDosis(form.idvacuna) > getMaxDosis(form.idvacuna))
      return 'El paciente ya completó el esquema de esta vacuna'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('')
    const err = validar(); if (err) { setError(err); return }

    const numerodosis = calcDosis(form.idvacuna)
    const nomVacuna   = getVacuna(form.idvacuna)?.nombrevacuna || ''
    setSaving(true)
    try {
      const esFinal  = esUltimaDosis(form.idvacuna)
      const payload = {
        idusuario:         paciente.idusuario,
        idvacuna:          parseInt(form.idvacuna),
        fechaaplicacion:   form.fechaaplicacion,
        numerodosis,
        lotevacuna:        form.lotevacuna,
        idcentromedico:    form.idcentromedico ? parseInt(form.idcentromedico) : null,
        observaciones:     form.observaciones     || null,
        proximadosisfecha: esFinal ? null : (form.proximadosisfecha || null)
      }
      const reg = await registroVacunacionService.registrar(payload)
      setRegistros(p => [reg, ...p])
      setHistorial(p => [reg, ...p])
      setForm(prev => ({ ...emptyForm, idcentromedico: prev.idcentromedico }))
      setSuccess(`✅ Dosis ${numerodosis} de "${nomVacuna}" registrada correctamente`)
    } catch (e) {
      setError(e.message || 'Error al guardar la vacunación')
    } finally { setSaving(false) }
  }

  // ── Guardar cambios del perfil del centro ─────────────────────
  const handleSaveCentro = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!editCentroData.razonsocial.trim()) errs.razonsocial = 'Requerido'
    else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,#\-]+$/.test(editCentroData.razonsocial.trim()))
      errs.razonsocial = 'Solo letras, números y caracteres básicos'
    if (!editCentroData.direccion.trim()) errs.direccion = 'Requerido'
    if (!editCentroData.ciudad.trim())    errs.ciudad    = 'Requerido'
    if (!editCentroData.telefono.trim()) errs.telefono = 'Requerido'
    else if (!/^\d+$/.test(editCentroData.telefono)) errs.telefono = 'Solo dígitos'
    else if (editCentroData.telefono.length !== 10)   errs.telefono = 'Debe tener 10 dígitos'
    if (Object.keys(errs).length) { setEditCentroErr(errs); return }

    setSavingCentro(true)
    try {
      const r = await fetch(`${API}/api/auth/centros/perfil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          razonsocial: editCentroData.razonsocial,
          direccion:   editCentroData.direccion,
          telefono:    editCentroData.telefono,
          ciudad:      editCentroData.ciudad
        })
      })
      const d = await r.json()
      if (!r.ok) { setCentroErrMsg(d.error || 'No se pudo actualizar'); return }
      // Actualizar contexto
      if (updateCentro) updateCentro(d)
      setCentroMsg('✅ Datos actualizados correctamente')
      setEditandoCentro(false)
    } catch {
      setCentroErrMsg('Error de conexión')
    } finally {
      setSavingCentro(false)
    }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—'
  const nomVacunaReg = (r) => r?.idvacuna?.nombrevacuna       || '—'
  const nomCentroReg = (r) => r?.idcentromedico?.nombrecentro || '—'

  const dosisActual = form.idvacuna ? calcDosis(form.idvacuna)   : null
  const maxDosis    = form.idvacuna ? getMaxDosis(form.idvacuna) : null
  const completo    = dosisActual && maxDosis && dosisActual > maxDosis
  const ultimaDosis = form.idvacuna ? esUltimaDosis(form.idvacuna) : false

  if (loading) return <div className="loading">Cargando portal...</div>

  return (
    <div className="portal-container">
      <div className="portal-header">
        <div>
          <span className="portal-badge">🏥 Centro Médico</span>
          <h1>{centro?.razonsocial}</h1>
          <p className="portal-subtitle">NIT: {centro?.nit} &nbsp;|&nbsp; {centro?.ciudad}</p>
        </div>
      </div>

      {/* ── Perfil del centro — editable ───────────────────── */}
      <div className="portal-form-section" style={{marginBottom:'1.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <h2>Datos del Centro</h2>
          {!editandoCentro
            ? <button className="btn-secondary btn-sm" onClick={()=>setEditandoCentro(true)}>✏️ Editar perfil</button>
            : <button className="btn-secondary btn-sm" onClick={()=>setEditandoCentro(false)}>Cancelar</button>
          }
        </div>
        <div className="info-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem'}}>
          <div><label style={{fontSize:'0.8rem',color:'#64748b',display:'block'}}>NIT (no editable)</label><p style={{margin:0,fontWeight:600}}>{centro?.nit}</p></div>
          <div><label style={{fontSize:'0.8rem',color:'#64748b',display:'block'}}>Razón Social</label><p style={{margin:0}}>{centro?.razonsocial}</p></div>
          <div><label style={{fontSize:'0.8rem',color:'#64748b',display:'block'}}>Dirección</label><p style={{margin:0}}>{centro?.direccion}</p></div>
          <div><label style={{fontSize:'0.8rem',color:'#64748b',display:'block'}}>Ciudad</label><p style={{margin:0}}>{centro?.ciudad}</p></div>
          <div><label style={{fontSize:'0.8rem',color:'#64748b',display:'block'}}>Teléfono</label><p style={{margin:0}}>{centro?.telefono}</p></div>
        </div>
        {centroMsg    && <div className="success-message" style={{marginTop:'0.75rem'}}>{centroMsg}</div>}
        {centroErrMsg && <div className="error-message"   style={{marginTop:'0.75rem'}}>{centroErrMsg}</div>}
        {editandoCentro && (
          <form onSubmit={handleSaveCentro} style={{marginTop:'1.25rem',borderTop:'1px solid #e2e8f0',paddingTop:'1.25rem'}}>
            <p style={{margin:'0 0 1rem',fontWeight:600,color:'var(--primary-color)'}}>Actualizar datos editables</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Razón Social * <small style={{color:'#94a3b8',fontWeight:'normal'}}>(editable en caso de cambio de razón social)</small></label>
                <input
                  type="text" value={editCentroData.razonsocial}
                  onChange={e=>{
                    const val = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,#\-]/g,'').slice(0,120)
                    setEditCentroData(p=>({...p,razonsocial:val}))
                    if(editCentroErr.razonsocial) setEditCentroErr(p=>({...p,razonsocial:''}))
                  }}
                  maxLength={120}
                />
                {editCentroErr.razonsocial && <span className="field-error">{editCentroErr.razonsocial}</span>}
              </div>
              <div className="form-group">
                <label>Dirección *</label>
                <input
                  type="text" value={editCentroData.direccion}
                  onChange={e=>{
                    const val = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,#\-]/g,'').slice(0,150)
                    setEditCentroData(p=>({...p,direccion:val}))
                    if(editCentroErr.direccion) setEditCentroErr(p=>({...p,direccion:''}))
                  }}
                  maxLength={150}
                />
                {editCentroErr.direccion && <span className="field-error">{editCentroErr.direccion}</span>}
              </div>
              <div className="form-group">
                <label>Ciudad / Municipio *</label>
                <select
                  value={editCentroData.ciudad}
                  onChange={e=>{
                    setEditCentroData(p=>({...p,ciudad:e.target.value}))
                    if(editCentroErr.ciudad) setEditCentroErr(p=>({...p,ciudad:''}))
                  }}
                >
                  <option value="">-- Seleccionar ciudad --</option>
                  {CIUDADES_COLOMBIA.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {editCentroErr.ciudad && <span className="field-error">{editCentroErr.ciudad}</span>}
              </div>
              <div className="form-group">
                <label>Teléfono * <small style={{color:'#94a3b8',fontWeight:'normal'}}>(10 dígitos)</small></label>
                <input
                  type="tel" value={editCentroData.telefono}
                  onChange={e=>{
                    const val = e.target.value.replace(/\D/g,'').slice(0,10)
                    setEditCentroData(p=>({...p,telefono:val}))
                    if(editCentroErr.telefono) setEditCentroErr(p=>({...p,telefono:''}))
                  }}
                  inputMode="numeric" maxLength={10}
                />
                {editCentroErr.telefono && <span className="field-error">{editCentroErr.telefono}</span>}
              </div>
            </div>
            <p style={{fontSize:'0.8rem',color:'#64748b',margin:'0.5rem 0 1rem'}}>
              ⚠️ El NIT no puede modificarse.
            </p>
            <button type="submit" className="btn-primary" disabled={savingCentro}>
              {savingCentro ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        )}
      </div>

      <div className="portal-form-section">
        <h2>Registrar Vacunación</h2>
        <form onSubmit={handleSubmit}>

          {/* BUSCAR PACIENTE */}
          <p className="form-section-title">👤 Buscar Paciente</p>
          <div className="form-row" style={{ alignItems: 'flex-end' }}>
            <div className="form-group">
              <label>Número de Documento (Cédula) *</label>
              <input
                type="text" value={docBusqueda} placeholder="1001234567"
                disabled={buscando}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g,'').slice(0,15)
                  setDocBusqueda(val); setErrorPaciente('')
                }}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), buscarPaciente())}
                inputMode="numeric" maxLength={15}
              />
            </div>
            <div className="form-group" style={{ flex: '0 0 auto' }}>
              <button type="button" className="btn-primary" style={{ marginTop: 0 }}
                onClick={buscarPaciente} disabled={buscando}>
                {buscando ? 'Buscando...' : '🔍 Buscar'}
              </button>
            </div>
          </div>
          {errorPaciente && <div className="error-message">{errorPaciente}</div>}

          {/* DATOS DEL PACIENTE — readonly */}
          {paciente && (
            <div className="paciente-encontrado">
              <div className="paciente-encontrado-header">
                <span className="paciente-badge">✅ Paciente encontrado</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Solo el paciente puede editar estos datos desde su sesión
                </span>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Documento</label>
                  <input type="text" value={paciente.tipodocumento || '—'} readOnly className="input-readonly" />
                </div>
                <div className="form-group">
                  <label>Número de Documento</label>
                  <input type="text" value={paciente.idusuario} readOnly className="input-readonly" />
                </div>
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" value={paciente.nombre || '—'} readOnly className="input-readonly" />
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <input type="text" value={paciente.apellido || '—'} readOnly className="input-readonly" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Correo</label>
                  <input type="text" value={paciente.email || '—'} readOnly className="input-readonly" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" value={paciente.telefono || '—'} readOnly className="input-readonly" />
                </div>
                <div className="form-group">
                  <label>Tipo de Sangre</label>
                  <input type="text" value={paciente.tiposangre || '—'} readOnly className="input-readonly" />
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input type="text" value={fmt(paciente.fechanacimiento)} readOnly className="input-readonly" />
                </div>
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

          {/* DATOS DE LA VACUNA */}
          {paciente && (
            <>
              <p className="form-section-title">💉 Datos de la Vacuna</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Vacuna *</label>
                  <select name="idvacuna" value={form.idvacuna} onChange={handleVacunaChange}>
                    <option value="">-- Seleccionar vacuna --</option>
                    {vacunas.map(v => (
                      <option key={v.idvacuna} value={v.idvacuna}>{v.nombrevacuna}</option>
                    ))}
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
                  <input type="date" name="fechaaplicacion"
                    value={form.fechaaplicacion} onChange={handleFechaChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Lote de Vacuna *</label>
                  <input
                    type="text" name="lotevacuna" value={form.lotevacuna}
                    onChange={e => setForm(p=>({...p,lotevacuna:e.target.value.replace(/[^a-zA-Z0-9\-]/g,'').slice(0,30)}))}
                    placeholder="LOT2026-001" maxLength={30}
                  />
                </div>

                <div className="form-group">
                  <label>Centro Médico</label>
                  <select name="idcentromedico" value={form.idcentromedico} onChange={handleForm}>
                    <option value="">-- Seleccionar --</option>
                    {centros.map(c => (
                      <option key={c.idcentro} value={c.idcentro}>
                        {c.nombrecentro} — {c.ciudad}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Próxima dosis — gris y bloqueada si es última dosis */}
                <div className="form-group">
                  <label>
                    Próxima Dosis
                    {ultimaDosis && (
                      <span style={{fontSize:'0.75rem',color:'#94a3b8',marginLeft:'0.5rem'}}>
                        (esquema completo con esta dosis)
                      </span>
                    )}
                    {!ultimaDosis && form.proximadosisfecha && form.idvacuna && (
                      <span style={{fontSize:'0.75rem',color:'#0099ab',marginLeft:'0.5rem'}}>
                        (calculada automáticamente)
                      </span>
                    )}
                  </label>
                  <input
                    type="date" name="proximadosisfecha"
                    value={ultimaDosis ? '' : form.proximadosisfecha}
                    onChange={ultimaDosis ? undefined : handleForm}
                    readOnly={ultimaDosis}
                    disabled={ultimaDosis}
                    title={ultimaDosis ? 'Esta es la última dosis del esquema' : ''}
                    style={ultimaDosis ? {
                      background: '#f1f5f9',
                      color: '#94a3b8',
                      cursor: 'not-allowed',
                      border: '1px solid #e2e8f0'
                    } : {}}
                  />
                  {ultimaDosis && (
                    <small style={{color:'#94a3b8',fontSize:'0.75rem'}}>
                      No aplica — última dosis del esquema
                    </small>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group form-full">
                  <label>Observaciones</label>
                  <input type="text" name="observaciones" value={form.observaciones}
                    onChange={handleForm} placeholder="Opcional" maxLength={300}/>
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

      {/* Registros de esta sesión */}
      {registros.length > 0 && (
        <div className="portal-registros">
          <h2>Registros de esta sesión ({registros.length})</h2>
          <div className="registros-table-container">
            <table className="registros-table">
              <thead>
                <tr>
                  <th>Paciente</th><th>Vacuna</th><th>Dosis</th>
                  <th>Fecha</th><th>Lote</th><th>Centro</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(r => (
                  <tr key={r.idregistro}>
                    <td>
                      {r.idusuario?.nombre} {r.idusuario?.apellido}
                      <br /><small>{r.idusuario?.tipodocumento} {r.idusuario?.idusuario}</small>
                    </td>
                    <td>{nomVacunaReg(r)}</td>
                    <td>{r.numerodosis}</td>
                    <td>{fmt(r.fechaaplicacion)}</td>
                    <td>{r.lotevacuna || '—'}</td>
                    <td>{nomCentroReg(r)}</td>
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
