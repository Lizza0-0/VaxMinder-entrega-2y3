import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { historialService } from '../services/index'
import '../styles/historial.css'

export const HistorialPage = () => {
  const { user }                  = useContext(AuthContext)
  const [historial, setHistorial] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!user) return
    const cargar = async () => {
      try {
        const data = await historialService.obtenerHistorial(user.idusuario)
        const sorted = [...data].sort((a, b) =>
          new Date(b.fechageneracion ?? b.fecha_generacion) - new Date(a.fechageneracion ?? a.fecha_generacion)
        )
        setHistorial(sorted)
      } catch {
        setError('Error al cargar el historial')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user])

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '—'

  if (loading) return <div className="historial-container"><p>Cargando historial...</p></div>

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h1>Historial de PDFs</h1>
        <p>Registro de carnets generados</p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {historial.length === 0 ? (
        <div className="empty-state"><p>No hay historial registrado</p></div>
      ) : (
        <div className="timeline">
          {historial.map(item => (
            <div key={item.idhistorial} className="timeline-item">
              <div className="timeline-icon">📄</div>
              <div className="timeline-content">
                <h3>{item.nombrearchivo}</h3>
                <p>{item.rutaarchivo}</p>
                <span className="timeline-date">{fmt(item.fechageneracion ?? item.fecha_generacion)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}