import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { alertasService, vacunasService } from '../services/index'
import '../styles/alertas.css'

export const AlertasPage = () => {
  const { user } = useContext(AuthContext)
  const [alertas, setAlertas] = useState([])
  const [vacunas, setVacunas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    vacunaId: '',
    fechaProxima: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      const alertasData = alertasService.obtenerAlertas(user.id)
      setAlertas(alertasData)

      const vacunasData = vacunasService.obtenerVacunas()
      setVacunas(vacunasData)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.vacunaId || !formData.fechaProxima) {
      setError('Todos los campos son requeridos')
      return
    }

    const newAlerta = alertasService.crearAlerta(
      user.id,
      parseInt(formData.vacunaId),
      formData.fechaProxima
    )

    setAlertas([...alertas, newAlerta])
    setFormData({ vacunaId: '', fechaProxima: '' })
    setShowForm(false)
  }

  const getNombreVacuna = (vacunaId) => {
    const vacuna = vacunas.find(v => v.id === vacunaId)
    return vacuna?.nombre || 'Desconocida'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  const alertasNoLeidas = alertas.filter(a => !a.leida)

  return (
    <div className="alertas-container">
      <div className="alertas-header">
        <h1>Alertas de Vacunación</h1>
        <p>Mantente al tanto de tus próximas vacunaciones</p>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Crear Alerta'}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>Nueva Alerta de Vacunación</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vacunaId">Vacuna *</label>
                <select
                  id="vacunaId"
                  name="vacunaId"
                  value={formData.vacunaId}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una vacuna</option>
                  {vacunas.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fechaProxima">Fecha Próxima *</label>
                <input
                  type="date"
                  id="fechaProxima"
                  name="fechaProxima"
                  value={formData.fechaProxima}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary">
              Crear Alerta
            </button>
          </form>
        </div>
      )}

      <div className="alertas-section">
        <h2>Alertas Activas ({alertasNoLeidas.length})</h2>
        {alertasNoLeidas.length === 0 ? (
          <div className="empty-state">
            <p>No tienes alertas pendientes</p>
          </div>
        ) : (
          <div className="alertas-list">
            {alertasNoLeidas.map(alerta => (
              <div key={alerta.id} className="alerta-item">
                <div className="alerta-icon">🔔</div>
                <div className="alerta-content">
                  <h3>{getNombreVacuna(alerta.vacunaId)}</h3>
                  <p>Próxima fecha: {formatDate(alerta.fechaProxima)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {alertas.filter(a => a.leida).length > 0 && (
        <div className="alertas-section">
          <h2>Alertas Vistas</h2>
          <div className="alertas-list muted">
            {alertas.filter(a => a.leida).map(alerta => (
              <div key={alerta.id} className="alerta-item">
                <div className="alerta-icon">✓</div>
                <div className="alerta-content">
                  <h3>{getNombreVacuna(alerta.vacunaId)}</h3>
                  <p>Fecha: {formatDate(alerta.fechaProxima)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
