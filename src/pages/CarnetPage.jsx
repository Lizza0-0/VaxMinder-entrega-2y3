import { useContext, useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import { AuthContext } from '../context/AuthContext'
import { carnetService, vacunasService, centrosService, historialService } from '../services/index'
import '../styles/carnet.css'

export const CarnetPage = () => {
  const { user }                = useContext(AuthContext)
  const [carnet, setCarnet]     = useState([])
  const [vacunas, setVacunas]   = useState([])
  const [centros, setCentros]   = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [formData, setFormData] = useState({
    vacunaId: '', dosis: '', lote: '', centroId: '', fecha: '', fechaProxima: '', observaciones: ''
  })

  useEffect(() => {
    if (!user) return
    const cargar = async () => {
      try {
        const [carnetData, vacunasData, centrosData] = await Promise.all([
          carnetService.obtenerCarnet(user.idusuario),
          vacunasService.obtenerVacunas(),
          centrosService.obtenerCentros()
        ])
        setCarnet(carnetData)
        setVacunas(vacunasData)
        setCentros(centrosData)
      } catch {
        setError('Error al cargar el carnet')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user])

  const getVacunaId = (vacuna) => vacuna?.id_vacuna ?? vacuna?.idvacuna
  const getVacunaNombre = (vacuna) => vacuna?.nombre_vacuna ?? vacuna?.nombrevacuna
  const getCentroId = (centro) => centro?.id_centro ?? centro?.idcentro
  const getCentroNombre = (centro) => centro?.nombre_centro ?? centro?.nombrecentro
  const getRegistroValue = (registro, ...keys) => keys.reduce((value, key) => value ?? registro?.[key], undefined)

  const findVacunaById = (id) => vacunas.find(v => String(getVacunaId(v)) === String(id))

  // Al seleccionar vacuna, auto-calcular dosis sugerida
  const handleVacunaChange = (e) => {
    const id = e.target.value
    const vacuna = findVacunaById(id)
    const dosisYaAplicadas = carnet.filter(r => {
      const idV = getRegistroValue(r, 'id_vacuna', 'idvacuna')
      return String(idV) === String(id)
    }).length
    setFormData(prev => ({
      ...prev,
      vacunaId: id,
      dosis: String(dosisYaAplicadas + 1)
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const exportCarnetPdf = async () => {
    if (!carnet.length) {
      setError('No hay registros para exportar')
      return
    }

    setError('')
    setSuccess('')
    setExporting(true)

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 14

      doc.setFillColor(1, 99, 83)
      doc.rect(0, 0, pageWidth, 32, 'F')
      doc.setTextColor(255)
      doc.setFontSize(24)
      doc.text('VaxMinder', margin, 20)
      doc.setFontSize(11)
      doc.text('Carnet Digital de Vacunación', margin, 27)
      doc.setFontSize(10)
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - margin, 27, { align: 'right' })

      const userDetailsTop = 42
      doc.setFillColor(241, 245, 249)
      doc.roundedRect(margin, userDetailsTop, pageWidth - margin * 2, 32, 4, 4, 'F')
      doc.setTextColor(33)
      doc.setFontSize(10)
      doc.text(`Paciente: ${(user?.nombre || user?.nombres) ?? ''} ${(user?.apellido || user?.apellidos) ?? ''}`, margin + 2, userDetailsTop + 8)
      doc.text(`Cédula: ${user?.idusuario ?? ''}`, margin + 2, userDetailsTop + 15)
      doc.text(`Tipo de sangre: ${(user?.tipoSangre ?? user?.tiposangre) || '—'}`, margin + 2, userDetailsTop + 22)
      doc.text(`Nacimiento: ${fmt(user?.fechanacimiento)}`, pageWidth / 2 + 10, userDetailsTop + 8)
      doc.text(`Edad: ${user?.edad ?? '—'} años`, pageWidth / 2 + 10, userDetailsTop + 15)
      doc.text(`Email: ${user?.email ?? '—'}`, pageWidth / 2 + 10, userDetailsTop + 22)

      let y = userDetailsTop + 46
      doc.setFontSize(12)
      doc.setTextColor(1, 99, 83)
      doc.text('Registro de vacunas aplicadas', margin, y)
      y += 8

      doc.setFontSize(10)
      carnet.forEach((registro) => {
        const nombre = getNombreVacuna(registro.id_vacuna ?? registro.idvacuna)
        const fecha = fmt(getRegistroValue(registro, 'fechaaplicacion', 'fecha_aplicacion'))
        const dosis = getRegistroValue(registro, 'numerodosis', 'numero_dosis')
        const lote = getRegistroValue(registro, 'lotevacuna', 'lote_vacuna')
        const centro = getNombreCentro(registro.idcentromedico ?? registro.id_centro_medico) || '—'
        const proxima = fmt(getRegistroValue(registro, 'proximadosisfecha', 'proxima_dosis_fecha', 'fecha_proxima', 'fechaproxima'))
        const observaciones = registro.observaciones || '—'

        const blockHeight = 42
        if (y + blockHeight > 282) {
          doc.addPage()
          y = 20
        }

        doc.setFillColor(241, 245, 249)
        doc.roundedRect(margin, y, pageWidth - margin * 2, blockHeight, 4, 4, 'F')
        doc.setTextColor(1, 99, 83)
        doc.setFontSize(10)
        doc.text(`Vacuna: ${nombre}`, margin + 3, y + 8)

        doc.setFontSize(9)
        doc.setTextColor(33)
        doc.text(`Fecha aplicación: ${fecha}`, margin + 3, y + 15)
        doc.text(`Centro de aplicación: ${centro}`, margin + 3, y + 21)
        doc.text(`Próxima dosis: ${proxima}`, margin + 3, y + 27)
        doc.text(`Dosis: ${dosis}`, pageWidth / 2 + 10, y + 15)
        doc.text(`Lote: ${lote || '—'}`, pageWidth / 2 + 10, y + 21)
        doc.text(`Observaciones: ${observaciones}`, margin + 3, y + 34, { maxWidth: pageWidth - margin * 4 })

        y += blockHeight + 6
      })

      const filename = `carnet_${user?.idusuario ?? 'usuario'}_${new Date().toISOString().slice(0, 10)}.pdf`
      const pdfBlob = doc.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      await historialService.guardarHistorial(user.idusuario, pdfBlob, filename)
      setSuccess('PDF generado y guardado en el historial')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Error al exportar el carnet a PDF')
    } finally {
      setExporting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!formData.vacunaId)       { setError('Selecciona una vacuna'); return }
    if (!formData.dosis)          { setError('Ingresa el numero de dosis'); return }
    if (!formData.lote.trim())    { setError('Ingresa el lote de la vacuna'); return }
    if (!formData.fecha)          { setError('Ingresa la fecha de aplicacion'); return }
    if (!formData.fechaProxima)   { setError('Ingresa la fecha de proxima dosis'); return }

    setSaving(true)
    try {
      const nueva = await carnetService.agregarVacunacion(user.idusuario, {
        vacunaId:      parseInt(formData.vacunaId),
        dosis:         parseInt(formData.dosis),
        lote:          formData.lote,
        centroId:      formData.centroId ? parseInt(formData.centroId) : null,
        fecha:         formData.fecha,
        fechaProxima:  formData.fechaProxima,
        observaciones: formData.observaciones
      })
      setCarnet(prev => [...prev, nueva])
      setFormData({ vacunaId: '', dosis: '', lote: '', centroId: '', fecha: '', fechaProxima: '', observaciones: '' })
      setShowForm(false)
      setSuccess('Vacunacion registrada correctamente. Se genero una alerta para tu proxima dosis.')
    } catch {
      setError('Error al guardar la vacunacion')
    } finally {
      setSaving(false)
    }
  }

  const getNombreVacuna = (idVacuna) => {
    const id = idVacuna?.id_vacuna ?? idVacuna?.idvacuna ?? idVacuna
    const vacuna = findVacunaById(id)
    return getVacunaNombre(vacuna) || 'Desconocida'
  }

  const getNombreCentro = (idCentro) => {
    const id = idCentro?.id_centro ?? idCentro?.idcentro ?? idCentro
    const centro = centros.find(c => String(getCentroId(c)) === String(id))
    return getCentroNombre(centro)
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—'

  if (loading) return <div className="carnet-container"><p>Cargando carnet...</p></div>

  return (
    <div className="carnet-container">
      <div className="carnet-header">
        <div>
          <p className="page-subtitle">Documento – Carnet Digital</p>
          <h1>Mi Carnet de Vacunación</h1>
          <p className="page-description">Consulta tus vacunas aplicadas y descarga tu carnet en PDF.</p>
        </div>
        <div className="carnet-actions">
          <button className="btn-secondary" onClick={exportCarnetPdf} disabled={exporting || loading}>
            {exporting ? 'Exportando...' : 'Descargar PDF'}
          </button>
          <button className="btn-primary" onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }}>
            {showForm ? 'Cancelar' : '+ Registrar Vacunación'}
          </button>
        </div>
      </div>

      {success && <div className="success-message" style={{marginBottom:'1rem'}}>{success}</div>}

      <div className="carnet-summary">
        <div className="summary-card">
          <div className="summary-header">
            <div>
              <span className="summary-badge">VaxMinder</span>
              <h2>Carnet Digital</h2>
            </div>
            <div className="summary-code">VMR - {user?.idusuario ?? '0000'}</div>
          </div>
          <div className="summary-grid">
            <div>
              <p className="summary-label">Paciente</p>
              <p>{(user?.nombre || user?.nombres) ?? ''} {(user?.apellido || user?.apellidos) ?? ''}</p>
            </div>
            <div>
              <p className="summary-label">Cédula</p>
              <p>{user?.idusuario}</p>
            </div>
            <div>
              <p className="summary-label">Fecha de nacimiento</p>
              <p>{fmt(user?.fechanacimiento)}</p>
            </div>
            <div>
              <p className="summary-label">Tipo de sangre</p>
              <p>{(user?.tipoSangre ?? user?.tiposangre) || '—'}</p>
            </div>
            <div>
              <p className="summary-label">Edad</p>
              <p>{user?.edad ?? '—'} años</p>
            </div>
            <div>
              <p className="summary-label">Email</p>
              <p>{user?.email || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>Registrar Nueva Vacunacion</h2>
          <p className="section-hint">Una vez guardado, el registro no puede modificarse.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vacunaId">Vacuna *</label>
                <select id="vacunaId" name="vacunaId" value={formData.vacunaId} onChange={handleVacunaChange}>
                  <option value="">-- Selecciona una vacuna --</option>
                  {vacunas.map(v => (
                    <option key={getVacunaId(v)} value={getVacunaId(v)}>
                      {getVacunaNombre(v)} ({v.dosis_requeridas ?? v.dosisrequeridas} dosis)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dosis">Numero de dosis *</label>
                <input type="number" id="dosis" name="dosis" value={formData.dosis}
                  onChange={handleChange} placeholder="1" min="1" max="10" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lote">Lote de la vacuna *</label>
                <input type="text" id="lote" name="lote" value={formData.lote}
                  onChange={handleChange} placeholder="Ej: LOT2026-96" />
              </div>
              <div className="form-group">
                <label htmlFor="centroId">Centro medico</label>
                <select id="centroId" name="centroId" value={formData.centroId} onChange={handleChange}>
                  <option value="">-- Selecciona un centro (opcional) --</option>
                  {centros.map(c => (
                    <option key={getCentroId(c)} value={getCentroId(c)}>{getCentroNombre(c)} - {c.ciudad}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha">Fecha de aplicacion *</label>
                <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="fechaProxima">Fecha proxima dosis *</label>
                <input type="date" id="fechaProxima" name="fechaProxima"
                  value={formData.fechaProxima} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="observaciones">Observaciones</label>
                <input type="text" id="observaciones" name="observaciones"
                  value={formData.observaciones} onChange={handleChange} placeholder="Opcional" />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Confirmar Registro'}
            </button>
          </form>
        </div>
      )}

      <div className="carnet-list">
        {carnet.length === 0 ? (
          <div className="empty-state">
            <p>No hay vacunaciones registradas</p>
            <p className="hint">Registra tu primera vacunacion para mantener tu carnet actualizado</p>
          </div>
        ) : (
          <div className="carnet-table-container">
            <table className="carnet-table">
              <thead>
                <tr>
                  <th>Vacuna</th>
                  <th>Fecha de aplicación</th>
                  <th>Dosis</th>
                  <th>Lote</th>
                  <th>Centro de aplicación</th>
                  <th>Próxima dosis</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {carnet.map(v => (
                  <tr key={v.idregistro ?? v.id_registro}>
                    <td>{getNombreVacuna(v.id_vacuna ?? v.idvacuna)}</td>
                    <td>{fmt(getRegistroValue(v, 'fechaaplicacion', 'fecha_aplicacion'))}</td>
                    <td>{getRegistroValue(v, 'numerodosis', 'numero_dosis')}</td>
                    <td>{getRegistroValue(v, 'lotevacuna', 'lote_vacuna') || '—'}</td>
                    <td>{getNombreCentro(v.idcentromedico ?? v.id_centro_medico) || '—'}</td>
                    <td>{fmt(getRegistroValue(v, 'proximadosisfecha', 'proxima_dosis_fecha', 'fecha_proxima', 'fechaproxima'))}</td>
                    <td>{v.observaciones || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}