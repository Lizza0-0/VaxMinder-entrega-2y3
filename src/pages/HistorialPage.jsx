import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { historialService } from '../services/index'
import '../styles/historial.css'

export const HistorialPage = () => {
  const { user } = useContext(AuthContext)
  const [historial, setHistorial] = useState([])

  useEffect(() => {
    if (user) {
      const historialData = historialService.obtenerHistorial(user.id)
      // Ordenar por fecha descendente
      const sorted = [...historialData].sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      )
      setHistorial(sorted)
    }
  }, [user])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getIconoTipo = (tipo) => {
    const iconos = {
      'vacunacion': '💉',
      'visita': '🏥',
      'alerta': '🔔',
      'cita': '📅'
    }
    return iconos[tipo] || '📝'
  }

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h1>Historial de Actividades</h1>
        <p>Registro de todas tus acciones en VaxMinder</p>
      </div>

      {historial.length === 0 ? (
        <div className="empty-state">
          <p>No hay actividades registradas</p>
        </div>
      ) : (
        <div className="timeline">
          {historial.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-icon">
                {getIconoTipo(item.tipo)}
              </div>
              <div className="timeline-content">
                <h3>{item.titulo}</h3>
                <p>{item.descripcion}</p>
                <span className="timeline-date">
                  {formatDate(item.fecha)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
