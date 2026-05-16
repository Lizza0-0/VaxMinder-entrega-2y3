import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { historialService } from '../services/index'
import '../styles/historial.css'

// HistorialPdf del backend: { idhistorial, idusuario{idusuario,nombre,...},
//   fechageneracion, nombrearchivo, rutaarchivo }

export const HistorialPage = () => {
  const { user }                  = useContext(AuthContext)
  const [historial, setHistorial] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!user) return
    historialService.obtenerHistorial(user.idusuario)
      .then(d => setHistorial([...d].sort((a,b) => new Date(b.fechageneracion) - new Date(a.fechageneracion))))
      .catch(() => setError('Error al cargar historial'))
      .finally(() => setLoading(false))
  }, [user])

  const fmt = (d) => d ? new Date(d).toLocaleString('es-ES') : '—'

  if (loading) return <div className="loading">Cargando historial...</div>

  return (
    <div className="historial-container">
      <div className="historial-header">
        <p className="page-subtitle">Registros</p>
        <h1>Historial de Carnés PDF</h1>
        <p>Todos los carnés que has generado</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {historial.length === 0 ? (
        <div className="empty-state">
          <p>No has generado ningún carnet PDF todavía</p>
          <p style={{fontSize:'0.9rem',color:'#94a3b8'}}>Ve a "Mi Carnet" y descárgalo para registrarlo aquí</p>
        </div>
      ) : (
        <div className="timeline">
          {historial.map((h, i) => (
            <div className="timeline-item" key={h.idhistorial}>
              <div className="timeline-icon">📄</div>
              <div className="timeline-content">
                <h3>{h.nombrearchivo}</h3>
                <p>Generado el {fmt(h.fechageneracion)}</p>
                <span className="timeline-date">#{h.idhistorial}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
