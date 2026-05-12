import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { alertasService } from '../services/index'
import '../styles/alertas.css'

export const AlertasPage = () => {
  const { user }              = useContext(AuthContext)
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!user) return
    const cargar = async () => {
      try {
        const data = await alertasService.obtenerAlertas(user.idusuario)
        setAlertas(data)
      } catch {
        setError('Error al cargar las alertas')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user])

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '—'

  const pendientes = alertas.filter(a => a.estado === 'pendiente')
  const vistas     = alertas.filter(a => a.estado !== 'pendiente')

  if (loading) return <div className="alertas-container"><p>Cargando alertas...</p></div>

  return (
    <div className="alertas-container">
      <div className="alertas-header">
        <h1>Mis Alertas de Vacunación</h1>
        <p>El sistema genera tus alertas automáticamente cuando registras una vacunación</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="alertas-section">
        <h2>Próximas dosis ({pendientes.length})</h2>
        {pendientes.length === 0 ? (
          <div className="empty-state">
            <p>No tienes alertas pendientes</p>
            <p className="hint">Al registrar una vacunación con fecha de próxima dosis, el sistema genera la alerta automáticamente</p>
          </div>
        ) : (
          <div className="alertas-list">
            {pendientes.map(a => (
              <div key={a.idalerta} className="alerta-item">
                <div className="alerta-icon">🔔</div>
                <div className="alerta-content">
                  <h3>{a.mensaje}</h3>
                  <p>Fecha programada: {fmt(a.fechaalerta)}</p>
                  <span className="alerta-badge pendiente">Pendiente</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {vistas.length > 0 && (
        <div className="alertas-section">
          <h2>Alertas anteriores</h2>
          <div className="alertas-list muted">
            {vistas.map(a => (
              <div key={a.idalerta} className="alerta-item">
                <div className="alerta-icon">✓</div>
                <div className="alerta-content">
                  <h3>{a.mensaje}</h3>
                  <p>Fecha: {fmt(a.fechaalerta)}</p>
                  <span className="alerta-badge vista">Completada</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}