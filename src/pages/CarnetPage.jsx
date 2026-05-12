import { useContext, useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import { AuthContext } from '../context/AuthContext'
import { carnetService, vacunasService, centrosService, historialService } from '../services/index'
import '../styles/carnet.css'

export const CarnetPage = () => {
  const { user }                  = useContext(AuthContext)
  const [carnet, setCarnet]       = useState([])
  const [vacunas, setVacunas]     = useState([])
  const [centros, setCentros]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

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

  const getVacunaId     = (v) => v?.id_vacuna   ?? v?.idvacuna
  const getVacunaNombre = (v) => v?.nombre_vacuna ?? v?.nombrevacuna
  const getCentroId     = (c) => c?.id_centro    ?? c?.idcentro
  const getCentroNombre = (c) => c?.nombre_centro ?? c?.nombrecentro
  const getVal          = (r, ...keys) => keys.reduce((val, k) => val ?? r?.[k], undefined)

  const findVacunaById = (id) => vacunas.find(v => String(getVacunaId(v)) === String(id))

  const getNombreVacuna = (idVacuna) => {
    const id = idVacuna?.id_vacuna ?? idVacuna?.idvacuna ?? idVacuna
    return getVacunaNombre(findVacunaById(id)) || 'Desconocida'
  }

  const getNombreCentro = (idCentro) => {
    const id = idCentro?.id_centro ?? idCentro?.idcentro ?? idCentro
    const centro = centros.find(c => String(getCentroId(c)) === String(id))
    return getCentroNombre(centro)
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—'

  const exportCarnetPdf = async () => {
    if (!carnet.length) { setError('No hay registros para exportar'); return }
    setError('')
    setSuccess('')
    setExporting(true)
    try {
      const doc       = new jsPDF({ unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin    = 14

      doc.setFillColor(1, 99, 83)
      doc.rect(0, 0, pageWidth, 32, 'F')
      doc.setTextColor(255)
      doc.setFontSize(24)
      doc.text('VaxMinder', margin, 20)
      doc.setFontSize(11)
      doc.text('Carnet Digital de Vacunación', margin, 27)
      doc.setFontSize(10)
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - margin, 27, { align: 'right' })

      const top = 42
      doc.setFillColor(241, 245, 249)
      doc.roundedRect(margin, top, pageWidth - margin * 2, 32, 4, 4, 'F')
      doc.setTextColor(33)
      doc.setFontSize(10)
      doc.text(`Paciente: ${user?.nombre ?? ''} ${user?.apellido ?? ''}`, margin + 2, top + 8)
      doc.text(`Cédula: ${user?.idusuario ?? ''}`, margin + 2, top + 15)
      doc.text(`Tipo de sangre: ${user?.tiposangre || '—'}`, margin + 2, top + 22)
      doc.text(`Nacimiento: ${fmt(user?.fechanacimiento)}`, pageWidth / 2 + 10, top + 8)
      doc.text(`Edad: ${user?.edad ?? '—'} años`, pageWidth / 2 + 10, top + 15)
      doc.text(`Email: ${user?.email ?? '—'}`, pageWidth / 2 + 10, top + 22)

      let y = top + 46
      doc.setFontSize(12)
      doc.setTextColor(1, 99, 83)
      doc.text('Registro de vacunas aplicadas', margin, y)
      y += 8

      doc.setFontSize(10)
      carnet.forEach((registro) => {
        const nombre    = getNombreVacuna(registro.id_vacuna ?? registro.idvacuna)
        const fecha     = fmt(getVal(registro, 'fechaaplicacion', 'fecha_aplicacion'))
        const dosis     = getVal(registro, 'numerodosis', 'numero_dosis')
        const lote      = getVal(registro, 'lotevacuna', 'lote_vacuna')
        const centro    = getNombreCentro(registro.idcentromedico ?? registro.id_centro_medico) || '—'
        const proxima   = fmt(getVal(registro, 'proximadosisfecha', 'proxima_dosis_fecha', 'fecha_proxima', 'fechaproxima'))
        const obs       = registro.observaciones || '—'
        const blockH    = 42

        if (y + blockH > 282) { doc.addPage(); y = 20 }

        doc.setFillColor(241, 245, 249)
        doc.roundedRect(margin, y, pageWidth - margin * 2, blockH, 4, 4, 'F')
        doc.setTextColor(1, 99, 83)
        doc.setFontSize(10)
        doc.text(`Vacuna: ${nombre}`, margin + 3, y + 8)
        doc.setFontSize(9)
        doc.setTextColor(33)
        doc.text(`Fecha aplicación: ${fecha}`,         margin + 3,          y + 15)
        doc.text(`Centro de aplicación: ${centro}`,    margin + 3,          y + 21)
        doc.text(`Próxima dosis: ${proxima}`,           margin + 3,          y + 27)
        doc.text(`Dosis: ${dosis}`,                     pageWidth / 2 + 10,  y + 15)
        doc.text(`Lote: ${lote || '—'}`,                pageWidth / 2 + 10,  y + 21)
        doc.text(`Observaciones: ${obs}`,               margin + 3,          y + 34, { maxWidth: pageWidth - margin * 4 })
        y += blockH + 6
      })

      const filename = `carnet_${user?.idusuario ?? 'usuario'}_${new Date().toISOString().slice(0, 10)}.pdf`
      const pdfBlob  = doc.output('blob')
      const url      = URL.createObjectURL(pdfBlob)
      const link     = document.createElement('a')
      link.href      = url
      link.download  = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      await historialService.guardarHistorial(user.idusuario, pdfBlob, filename)
      setSuccess('PDF generado y guardado en el historial')
    } catch (err) {
      setError(err?.message || 'Error al exportar el carnet a PDF')
    } finally {
      setExporting(false)
    }
  }

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
        </div>
      </div>

      {error   && <div className="error-message"   style={{ marginBottom: '1rem' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: '1rem' }}>{success}</div>}

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
              <p>{user?.nombre ?? ''} {user?.apellido ?? ''}</p>
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
              <p>{user?.tiposangre || '—'}</p>
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

      <div className="carnet-list">
        {carnet.length === 0 ? (
          <div className="empty-state">
            <p>No hay vacunaciones registradas</p>
            <p className="hint">El personal médico registrará tus vacunas en el sistema</p>
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
                    <td>{fmt(getVal(v, 'fechaaplicacion', 'fecha_aplicacion'))}</td>
                    <td>{getVal(v, 'numerodosis', 'numero_dosis')}</td>
                    <td>{getVal(v, 'lotevacuna', 'lote_vacuna') || '—'}</td>
                    <td>{getNombreCentro(v.idcentromedico ?? v.id_centro_medico) || '—'}</td>
                    <td>{fmt(getVal(v, 'proximadosisfecha', 'proxima_dosis_fecha', 'fecha_proxima', 'fechaproxima'))}</td>
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
