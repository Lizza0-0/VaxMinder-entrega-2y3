import { useEffect, useState } from 'react'
import { adminService, carnetService, vacunasService, centrosService } from '../../services/index'
import '../../styles/admin.css'

const FORM_VACIO = {
  vacunaId: '', dosis: '', lote: '', centroId: '', fecha: '', fechaProxima: '', observaciones: ''
}

export const AdminUsuarios = () => {
  const [usuarios, setUsuarios]         = useState([])
  const [filtrados, setFiltrados]       = useState([])
  const [busqueda, setBusqueda]         = useState('')
  const [loading, setLoading]           = useState(true)

  // Paciente seleccionado
  const [paciente, setPaciente]         = useState(null)
  const [carnet, setCarnet]             = useState([])
  const [vacunas, setVacunas]           = useState([])
  const [centros, setCentros]           = useState([])
  const [loadingCarnet, setLoadingCarnet] = useState(false)

  // Formulario vacunación
  const [showForm, setShowForm]         = useState(false)
  const [formData, setFormData]         = useState(FORM_VACIO)
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')

  useEffect(() => {
    Promise.all([
      adminService.obtenerUsuarios(),
      vacunasService.obtenerVacunas(),
      centrosService.obtenerCentros()
    ]).then(([u, v, c]) => {
      setUsuarios(u)
      setFiltrados(u)
      setVacunas(v)
      setCentros(c)
      setLoading(false)
    })
  }, [])

  const handleBusqueda = (e) => {
    const q = e.target.value.toLowerCase()
    setBusqueda(e.target.value)
    setFiltrados(usuarios.filter(u =>
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(q) ||
      String(u.idusuario).includes(q)
    ))
  }

  const seleccionarPaciente = async (u) => {
    setPaciente(u)
    setCarnet([])
    setError('')
    setSuccess('')
    setShowForm(false)
    setLoadingCarnet(true)
    const data = await carnetService.obtenerCarnet(u.idusuario)
    setCarnet(data)
    setLoadingCarnet(false)
  }

  const volverLista = () => {
    setPaciente(null)
    setCarnet([])
    setShowForm(false)
    setError('')
    setSuccess('')
  }

  const getVacunaId     = (v) => v?.id_vacuna    ?? v?.idvacuna
  const getVacunaNombre = (v) => v?.nombre_vacuna ?? v?.nombrevacuna
  const getCentroId     = (c) => c?.id_centro     ?? c?.idcentro
  const getCentroNombre = (c) => c?.nombre_centro  ?? c?.nombrecentro
  const getVal          = (r, ...keys) => keys.reduce((val, k) => val ?? r?.[k], undefined)

  const findVacunaById = (id) => vacunas.find(v => String(getVacunaId(v)) === String(id))

  const getNombreVacuna = (idVacuna) => {
    const id = idVacuna?.id_vacuna ?? idVacuna?.idvacuna ?? idVacuna
    return getVacunaNombre(findVacunaById(id)) || 'Desconocida'
  }

  const getNombreCentro = (idCentro) => {
    const id = idCentro?.id_centro ?? idCentro?.idcentro ?? idCentro
    const c  = centros.find(c => String(getCentroId(c)) === String(id))
    return getCentroNombre(c)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVacunaChange = (e) => {
    const id    = e.target.value
    const vacuna = findVacunaById(id)
    const dosisYa = carnet.filter(r => {
      const idV = getVal(r, 'id_vacuna', 'idvacuna')
      return String(idV) === String(id)
    }).length
    setFormData(prev => ({ ...prev, vacunaId: id, dosis: String(dosisYa + 1) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!formData.vacunaId)     { setError('Selecciona una vacuna'); return }
    if (!formData.dosis)        { setError('Ingresa el número de dosis'); return }
    if (!formData.lote.trim())  { setError('Ingresa el lote de la vacuna'); return }
    if (!formData.fecha)        { setError('Ingresa la fecha de aplicación'); return }

    setSaving(true)
    try {
      const nueva = await carnetService.agregarVacunacion(paciente.idusuario, {
        vacunaId:     parseInt(formData.vacunaId),
        dosis:        parseInt(formData.dosis),
        lote:         formData.lote,
        centroId:     formData.centroId ? parseInt(formData.centroId) : null,
        fecha:        formData.fecha,
        fechaProxima: formData.fechaProxima,
        observaciones: formData.observaciones
      })
      setCarnet(prev => [...prev, nueva])
      setFormData(FORM_VACIO)
      setShowForm(false)
      setSuccess('Vacunación registrada correctamente.')
    } catch {
      setError('Error al guardar la vacunación')
    } finally {
      setSaving(false)
    }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—'
  const calcEdad = (fn) => {
    if (!fn) return '—'
    const hoy = new Date(), nac = new Date(fn)
    let e = hoy.getFullYear() - nac.getFullYear()
    const m = hoy.getMonth() - nac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) e -= 1
    return `${e} años`
  }

  if (loading) return <div className="admin-container"><p>Cargando...</p></div>

  /* ── Vista: lista de pacientes ─────────────────────────────── */
  if (!paciente) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>Gestión de Pacientes</h1>
          <p className="page-description">Busca un paciente para ver o registrar su historial de vacunación</p>
        </div>

        <div className="admin-search">
          <input
            value={busqueda}
            onChange={handleBusqueda}
            placeholder="Buscar por nombre o número de documento..."
          />
        </div>

        <div className="admin-section-header">
          <h2>Pacientes registrados ({filtrados.length})</h2>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Documento</th>
                <th>Tipo Doc.</th>
                <th>Edad</th>
                <th>Tipo de sangre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron pacientes</td></tr>
              ) : filtrados.map(u => (
                <tr key={u.idusuario}>
                  <td><strong>{u.nombre} {u.apellido}</strong></td>
                  <td>{u.idusuario}</td>
                  <td>{u.tipoDocumento}</td>
                  <td>{calcEdad(u.fechanacimiento)}</td>
                  <td>{u.tiposangre || '—'}</td>
                  <td>{u.email}</td>
                  <td>
                    <button className="btn-table primary" onClick={() => seleccionarPaciente(u)}>
                      Ver carnet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  /* ── Vista: carnet del paciente seleccionado ───────────────── */
  return (
    <div className="admin-container">
      <button className="back-link" onClick={volverLista}>← Volver a la lista</button>

      <div className="patient-panel">
        <h3>{paciente.nombre} {paciente.apellido}</h3>
        <div className="patient-info-grid">
          <div><span>Documento</span><p>{paciente.tipoDocumento} {paciente.idusuario}</p></div>
          <div><span>Fecha de nacimiento</span><p>{fmt(paciente.fechanacimiento)}</p></div>
          <div><span>Edad</span><p>{calcEdad(paciente.fechanacimiento)}</p></div>
          <div><span>Tipo de sangre</span><p>{paciente.tiposangre || '—'}</p></div>
          <div><span>Email</span><p>{paciente.email}</p></div>
          <div><span>Teléfono</span><p>{paciente.telefono || '—'}</p></div>
        </div>
      </div>

      {error   && <div className="error-message"   style={{ marginBottom: '1rem' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: '1rem' }}>{success}</div>}

      {showForm && (
        <div className="admin-form-box">
          <h3>Registrar Nueva Vacunación</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Vacuna *</label>
                <select name="vacunaId" value={formData.vacunaId} onChange={handleVacunaChange}>
                  <option value="">-- Selecciona una vacuna --</option>
                  {vacunas.map(v => (
                    <option key={getVacunaId(v)} value={getVacunaId(v)}>
                      {getVacunaNombre(v)} ({v.dosisrequeridas} dosis)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Número de Dosis *</label>
                <input type="number" name="dosis" value={formData.dosis}
                  onChange={handleChange} placeholder="1" min="1" max="10" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Lote de la vacuna *</label>
                <input name="lote" value={formData.lote}
                  onChange={handleChange} placeholder="Ej: LOT2026-96" />
              </div>
              <div className="form-group">
                <label>Centro Médico</label>
                <select name="centroId" value={formData.centroId} onChange={handleChange}>
                  <option value="">-- Selecciona un centro (opcional) --</option>
                  {centros.map(c => (
                    <option key={getCentroId(c)} value={getCentroId(c)}>
                      {getCentroNombre(c)} - {c.ciudad}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Aplicación *</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Fecha Próxima Dosis</label>
                <input type="date" name="fechaProxima" value={formData.fechaProxima} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full-width">
                <label>Observaciones</label>
                <input name="observaciones" value={formData.observaciones}
                  onChange={handleChange} placeholder="Opcional" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Confirmar Registro'}
              </button>
              <button type="button" className="btn-secondary"
                onClick={() => { setShowForm(false); setFormData(FORM_VACIO); setError('') }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-section-header">
        <h2>Historial de vacunación</h2>
        {!showForm && (
          <button className="btn-primary" onClick={() => { setShowForm(true); setError(''); setSuccess('') }}>
            + Registrar Vacunación
          </button>
        )}
      </div>

      {loadingCarnet ? (
        <p>Cargando carnet...</p>
      ) : carnet.length === 0 ? (
        <div className="admin-form-box" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Este paciente no tiene vacunaciones registradas.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vacuna</th>
                <th>Fecha aplicación</th>
                <th>Dosis</th>
                <th>Lote</th>
                <th>Centro</th>
                <th>Próxima dosis</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {carnet.map(r => (
                <tr key={r.idregistro ?? r.id_registro}>
                  <td>{getNombreVacuna(r.id_vacuna ?? r.idvacuna)}</td>
                  <td>{fmt(getVal(r, 'fechaaplicacion', 'fecha_aplicacion'))}</td>
                  <td>{getVal(r, 'numerodosis', 'numero_dosis')}</td>
                  <td>{getVal(r, 'lotevacuna', 'lote_vacuna') || '—'}</td>
                  <td>{getNombreCentro(r.idcentromedico ?? r.id_centro_medico) || '—'}</td>
                  <td>{fmt(getVal(r, 'proximadosisfecha', 'proxima_dosis_fecha', 'fecha_proxima', 'fechaproxima'))}</td>
                  <td>{r.observaciones || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
