import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { alertasService } from '../services/index'
import '../styles/alertas.css'

// Alerta del backend: { idalerta, idusuario{idusuario,nombre,...},
//   idregistro{idregistro,...}, tipoalerta, fechaalerta, mensaje, estado, fechaenvio }

export const AlertasPage = () => {
  const { user }              = useContext(AuthContext)
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!user) return
    alertasService.obtenerAlertas(user.idusuario)
      .then(d => setAlertas(d))
      .catch(() => setError('Error al cargar alertas'))
      .finally(() => setLoading(false))
  }, [user])

  const pendientes = alertas.filter(a => a.estado === 'pendiente')
  const vistas     = alertas.filter(a => a.estado !== 'pendiente')
  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—'

  if (loading) return <div className="loading">Cargando alertas...</div>

  return (
    <div className="alertas-container">
      <div className="alertas-header">
        <p className="page-subtitle">Notificaciones</p>
        <h1>Mis Alertas</h1>
        <p>Recordatorios de tus próximas vacunaciones</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="alertas-section">
        <h2>Pendientes ({pendientes.length})</h2>
        <div className="alertas-list">
          {pendientes.length === 0
            ? <div className="empty-state"><p>No tienes alertas pendientes</p></div>
            : pendientes.map(a => (
              <div className="alerta-item" key={a.idalerta}>
                <div className="alerta-icon">🔔</div>
                <div className="alerta-content">
                  <h3>{a.tipoalerta}</h3>
                  <p>{a.mensaje}</p>
                  <p style={{fontSize:'0.85rem',opacity:0.8}}>Fecha: {fmt(a.fechaalerta)}</p>
                  <span className="alerta-badge pendiente">pendiente</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {vistas.length > 0 && (
        <div className="alertas-section">
          <h2>Historial ({vistas.length})</h2>
          <div className="alertas-list muted">
            {vistas.map(a => (
              <div className="alerta-item" key={a.idalerta} style={{opacity:0.6}}>
                <div className="alerta-icon">✅</div>
                <div className="alerta-content">
                  <h3>{a.tipoalerta}</h3>
                  <p>{a.mensaje}</p>
                  <p style={{fontSize:'0.85rem'}}>Fecha: {fmt(a.fechaalerta)}</p>
                  <span className="alerta-badge vista">{a.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
