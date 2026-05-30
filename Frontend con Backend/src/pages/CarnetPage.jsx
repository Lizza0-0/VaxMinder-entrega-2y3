import { useContext, useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import { AuthContext } from '../context/AuthContext'
import { carnetService, historialService } from '../services/index'
import '../styles/carnet.css'

// GET /api/registrovacunacion/usuario/{id} devuelve:
// {
//   idregistro, fechaaplicacion, numerodosis, lotevacuna, observaciones, proximadosisfecha,
//   idusuario:     { idusuario, nombre, apellido, email, tipodocumento, fechanacimiento, tiposangre, telefono, fecharegistro },
//   idvacuna:      { idvacuna, nombrevacuna, descripcion, dosisrequeridas, ... },
//   idcentromedico:{ idcentro, nombrecentro, ciudad, direccion, telefono, tipocentro } | null
// }
// El carnet muestra:
// - Datos del usuario (de idusuario anidado en cada registro, o del contexto)
// - Por cada registro: vacuna, fecha, dosis, lote, centro, próxima dosis, observaciones

export const CarnetPage = () => {
  const { user }                  = useContext(AuthContext)
  const [carnet,    setCarnet]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  
  // Estado para incentivos de vacunación 
  const [personasVacuna, setPersonasVacuna] = useState([])
  const [esquemasCompletos, setEsquemasCompletos] = useState([])
  const [loadingIncentivos, setLoadingIncentivos] = useState(false)
  const [mostrarIncentivos, setMostrarIncentivos] = useState(false)

  useEffect(() => {
    if (!user) return
    carnetService.obtenerCarnet(user.idusuario)
      .then(d => setCarnet(d))
      .catch(() => setError('Error al cargar el carnet'))
      .finally(() => setLoading(false))
  }, [user])

  // Cargar datos de incentivos 
  const cargarIncentivos = async () => {
    setLoadingIncentivos(true)
    try {
      const [resPersonas, resEsquemas] = await Promise.all([
        fetch('assets/data/personas_por_vacuna.json').then(r => {
          if (!r.ok) throw new Error(`Error ${r.status}`)
          return r.json()
        }).catch(e => {
          console.error('Error cargando personas_por_vacuna.json:', e)
          return []
        }),
        fetch('assets/data/esquemas_completados.json').then(r => {
          if (!r.ok) throw new Error(`Error ${r.status}`)
          return r.json()
        }).catch(e => {
          console.error('Error cargando esquemas_completados.json:', e)
          return []
        })
      ])
      setPersonasVacuna(Array.isArray(resPersonas) ? resPersonas : [])
      setEsquemasCompletos(Array.isArray(resEsquemas) ? resEsquemas : [])
      setMostrarIncentivos(true)
    } catch (e) {
      console.error('Error cargando incentivos:', e)
    }
    setLoadingIncentivos(false)
  }

  // Calcular vacunas faltantes del usuario 
  const calcularVacunasFaltantes = () => {
    if (carnet.length === 0 || !personasVacuna) return []
    
    // Obtener vacunas aplicadas con sus dosis
    const vacunasAplicadas = {}
    carnet.forEach(reg => {
      const nomVacuna = reg.idvacuna?.nombrevacuna || '—'
      const dosisRequeridas = reg.idvacuna?.dosisrequeridas || 1
      if (!vacunasAplicadas[nomVacuna]) {
        vacunasAplicadas[nomVacuna] = { aplicadas: 0, requeridas: dosisRequeridas }
      }
      vacunasAplicadas[nomVacuna].aplicadas += 1
    })
    
    // Filtrar faltantes
    return personasVacuna.filter(v => {
      const status = vacunasAplicadas[v.nombrevacuna]
      // Si no está en el carnet del usuario, o si le faltan dosis
      return !status || status.aplicadas < status.requeridas
    })
  }

  // Leer datos anidados que devuelve el backend
  const getNombreVacuna = (r) => r?.idvacuna?.nombrevacuna            || '—'
  const getNombreCentro = (r) => r?.idcentromedico?.nombrecentro      || '—'
  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—'

  const exportPDF = async () => {
    if (!carnet.length) { setError('No hay registros para exportar'); return }
    setError(''); setSuccess(''); setExporting(true)
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      const W = doc.internal.pageSize.getWidth()
      const M = 14

      // Header 
      doc.setFillColor(26, 58, 92)
      doc.rect(0, 0, W, 30, 'F')
      doc.setTextColor(255)
      doc.setFontSize(20); doc.text('VaxMinder', M, 16)
      doc.setFontSize(9);  doc.text('Carnet Digital de Vacunación', M, 24)
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, W - M, 24, { align: 'right' })

      // Datos del usuario — tabla usuarios 
      doc.setFillColor(240, 247, 251)
      doc.roundedRect(M, 34, W - M * 2, 34, 3, 3, 'F')
      doc.setTextColor(33); doc.setFontSize(9)

      doc.setFont(undefined, 'bold'); doc.text('DATOS DEL PACIENTE', M + 3, 41)
      doc.setFont(undefined, 'normal')

      doc.text(`Tipo Doc: ${user?.tipodocumento || '—'}`, M + 3, 48)
      doc.text(`N° Doc: ${user?.idusuario}`,               M + 3, 54)
      doc.text(`Nombre: ${user?.nombre} ${user?.apellido}`, M + 3, 60)

      doc.text(`Fecha Nac: ${fmt(user?.fechanacimiento)}`,  W / 2 + 5, 48)
      doc.text(`Tipo Sangre: ${user?.tiposangre || '—'}`,   W / 2 + 5, 54)
      doc.text(`Teléfono: ${user?.telefono || '—'}`,        W / 2 + 5, 60)

      // Registros de vacunación 
      let y = 76
      doc.setFontSize(11); doc.setTextColor(26, 58, 92)
      doc.setFont(undefined, 'bold')
      doc.text('REGISTRO DE VACUNAS APLICADAS', M, y)
      doc.setFont(undefined, 'normal')
      y += 8

      carnet.forEach((r, i) => {
        const bH = 34
        if (y + bH > 282) { doc.addPage(); y = 20 }

        doc.setFillColor(i % 2 === 0 ? 240 : 248, 247, 251)
        doc.roundedRect(M, y, W - M * 2, bH, 3, 3, 'F')

        doc.setTextColor(26, 58, 92); doc.setFontSize(9); doc.setFont(undefined, 'bold')
        doc.text(`${getNombreVacuna(r)}`, M + 3, y + 7)
        doc.setFont(undefined, 'normal'); doc.setTextColor(33); doc.setFontSize(8)

        doc.text(`Fecha aplicación: ${fmt(r.fechaaplicacion)}`, M + 3, y + 14)
        doc.text(`Dosis: ${r.numerodosis}`,                     M + 3, y + 20)
        doc.text(`Lote: ${r.lotevacuna || '—'}`,                M + 3, y + 26)

        doc.text(`Centro: ${getNombreCentro(r)}`,               W / 2 + 5, y + 14)
        doc.text(`Próx. dosis: ${fmt(r.proximadosisfecha)}`,    W / 2 + 5, y + 20)
        doc.text(`Obs: ${r.observaciones || '—'}`,              W / 2 + 5, y + 26)

        y += bH + 4
      })

      const fname = `carnet_${user?.idusuario}_${new Date().toISOString().slice(0, 10)}.pdf`
      const blob  = doc.output('blob')
      const url   = URL.createObjectURL(blob)
      const a     = document.createElement('a')
      a.href = url; a.download = fname
      document.body.appendChild(a); a.click(); a.remove()
      URL.revokeObjectURL(url)

      await historialService.guardarHistorial(user.idusuario, blob, fname)
      setSuccess('PDF generado y guardado en historial')
    } catch (e) {
      setError(e?.message || 'Error al exportar el PDF')
    } finally { setExporting(false) }
  }

  if (loading) return <div className="loading">Cargando carnet...</div>

  return (
    <div className="carnet-container">
      <div className="carnet-header">
        <div>
          <p className="page-subtitle">Documento – Carnet Digital</p>
          <h1>Mi Carnet de Vacunación</h1>
          <p className="page-description">Consulta tus vacunas y descarga tu carnet en PDF</p>
        </div>
        <div className="carnet-actions">
          <button className="btn-secondary" onClick={exportPDF} disabled={exporting}>
            {exporting ? 'Exportando...' : '⬇ Descargar PDF'}
          </button>
        </div>
      </div>

      {error   && <div className="error-message"  style={{ marginBottom: '1rem' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: '1rem' }}>{success}</div>}

      {/* Tarjeta datos del usuario — tabla usuarios */}
      <div className="carnet-summary">
        <div className="summary-card">
          <div className="summary-header">
            <div>
              <span className="summary-badge">VaxMinder</span>
              <h2>Datos del Paciente</h2>
            </div>
            <div className="summary-code">VMR-{user?.idusuario}</div>
          </div>
          <div className="summary-grid">
            <div><p className="summary-label">Tipo de Documento</p><p>{user?.tipodocumento || '—'}</p></div>
            <div><p className="summary-label">N° Documento</p>     <p>{user?.idusuario}</p></div>
            <div><p className="summary-label">Nombre</p>           <p>{user?.nombre} {user?.apellido}</p></div>
            <div><p className="summary-label">Fecha de Nacimiento</p><p>{fmt(user?.fechanacimiento)}</p></div>
            <div><p className="summary-label">Tipo de Sangre</p>   <p>{user?.tiposangre || '—'}</p></div>
            <div><p className="summary-label">Teléfono</p>         <p>{user?.telefono   || '—'}</p></div>
            <div><p className="summary-label">Correo</p>           <p>{user?.email      || '—'}</p></div>
            <div><p className="summary-label">Fecha de Registro</p><p>{fmt(user?.fecharegistro)}</p></div>
          </div>
        </div>
      </div>

      {/* ── Panel de Incentivos de Vacunación ─*/}
      <div style={{background:'linear-gradient(135deg,#fff3e0 0%,#ffe0b2 100%)',border:'2px solid #ff9800',borderRadius:'0.75rem',padding:'1.5rem',marginBottom:'1.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <h2 style={{margin:0,color:'#e65100',fontSize:'1.25rem'}}>🎯 ¡Cumple tu Esquema de Vacunación!</h2>
          {!mostrarIncentivos
            ? <button onClick={cargarIncentivos} disabled={loadingIncentivos} style={{padding:'0.5rem 1rem',background:'#ff9800',color:'white',border:'none',borderRadius:'0.5rem',cursor:'pointer',fontWeight:600}}>
              {loadingIncentivos ? 'Cargando...' : 'Ver Incentivos'}
            </button>
            : <button onClick={()=>setMostrarIncentivos(false)} style={{padding:'0.5rem 1rem',background:'#ff6b6b',color:'white',border:'none',borderRadius:'0.5rem',cursor:'pointer',fontWeight:600}}>
              Cerrar
            </button>
          }
        </div>

        {mostrarIncentivos && personasVacuna.length > 0 && (
          <div>
            {/* VACUNAS QUE LE FALTAN - LO MÁS IMPORTANTE */}
            {(() => {
              const vacunasFaltantes = calcularVacunasFaltantes()
              return vacunasFaltantes.length > 0 ? (
                <div style={{marginBottom:'1.5rem',padding:'1rem',background:'white',borderRadius:'0.5rem',border:'2px solid #ff6b6b'}}>
                  <h3 style={{margin:'0 0 1rem',color:'#c63030',fontSize:'1rem'}}>⚠️ Vacunas que te faltan completar:</h3>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1rem'}}>
                    {vacunasFaltantes.map((v, i) => (
                      <div key={i} style={{background:'linear-gradient(135deg,#ff6b6b 0%,#ff5252 100%)',color:'white',padding:'1rem',borderRadius:'0.5rem',textAlign:'center',boxShadow:'0 4px 12px rgba(255, 107, 107, 0.3)'}}>
                        <p style={{margin:'0 0 0.5rem',fontWeight:600,fontSize:'1rem'}}>{v.nombrevacuna}</p>
                        <p style={{margin:'0 0 0.5rem',fontSize:'2rem',fontWeight:'bold'}}>{v.personas_vacunadas}</p>
                        <small style={{opacity:0.95}}>personas ya se vacunaron con ésta</small>
                        <p style={{margin:'0.5rem 0 0',fontSize:'0.85rem',opacity:0.9}}>💪 ¡Tú también puedes!</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{padding:'1rem',background:'white',borderRadius:'0.5rem',border:'2px solid #4caf50',marginBottom:'1.5rem'}}>
                  <p style={{margin:0,color:'#2e7d32',fontSize:'1rem',fontWeight:600}}>✅ ¡Felicidades! Has completado todas tus vacunaciones</p>
                </div>
              )
            })()}

            {/* Vacunas que YA tiene */}
            {carnet.length > 0 && (
              <div style={{marginBottom:'1.5rem'}}>
                <h3 style={{margin:'0 0 1rem',color:'#2e7d32',fontSize:'1rem'}}>✅ Vacunas que ya completaste:</h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'0.75rem'}}>
                  {carnet.map((reg, i) => {
                    const nombreVacuna = reg.idvacuna?.nombrevacuna || '—'
                    const datoVacuna = personasVacuna.find(v => v.nombrevacuna === nombreVacuna)
                    return (
                      <div key={i} style={{background:'white',padding:'0.75rem',borderRadius:'0.5rem',boxShadow:'0 2px 6px rgba(0,0,0,0.1)',borderLeft:'4px solid #4caf50'}}>
                        <p style={{margin:'0 0 0.25rem',fontWeight:600,fontSize:'0.9rem',color:'#333'}}>{nombreVacuna}</p>
                        {datoVacuna ? (
                          <>
                            <p style={{margin:'0 0 0.25rem',fontSize:'1.25rem',fontWeight:'bold',color:'#4caf50'}}>{datoVacuna.personas_vacunadas}</p>
                            <small style={{color:'#666'}}>personas en tu comunidad</small>
                          </>
                        ) : (
                          <small style={{color:'#999'}}>Datos no disponibles</small>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Motivación final */}
            {esquemasCompletos.length > 0 && (
              <div style={{marginTop:'1rem',background:'linear-gradient(135deg,#c8e6c9 0%,#a5d6a7 100%)',padding:'1rem',borderRadius:'0.5rem',borderLeft:'4px solid #2e7d32'}}>
                <h3 style={{margin:'0 0 0.5rem',color:'#1b5e20',fontSize:'0.95rem',fontWeight:600}}>🌟 Historias de éxito en tu comunidad:</h3>
                <div style={{fontSize:'0.9rem',color:'#1b5e20',lineHeight:'1.6'}}>
                  {esquemasCompletos.slice(0, 3).map((e, i) => (
                    <p key={i} style={{margin:'0.25rem 0'}}>
                      • {e.personas_esquema_completo} personas completaron su esquema de {e.nombrevacuna}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabla de vacunas — datos de registrovacunacion */}
      <div className="carnet-list">
        {carnet.length === 0 ? (
          <div className="empty-state">
            <p>No hay vacunaciones registradas aún</p>
            <p className="hint">Las vacunaciones son registradas por el centro médico</p>
          </div>
        ) : (
          <div className="carnet-table-container">
            <table className="carnet-table">
              <thead>
                <tr>
                  <th>Vacuna</th>
                  <th>Fecha Aplicación</th>
                  <th>Dosis</th>
                  <th>Lote</th>
                  <th>Centro Médico</th>
                  <th>Próxima Dosis</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {carnet.map(r => (
                  <tr key={r.idregistro}>
                    <td>{getNombreVacuna(r)}</td>
                    <td>{fmt(r.fechaaplicacion)}</td>
                    <td>{r.numerodosis}</td>
                    <td>{r.lotevacuna  || '—'}</td>
                    <td>{getNombreCentro(r)}</td>
                    <td>{fmt(r.proximadosisfecha)}</td>
                    <td>{r.observaciones || '—'}</td>
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
