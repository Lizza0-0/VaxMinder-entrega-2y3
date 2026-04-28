import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { carnetService, vacunasService } from '../services/index'
import '../styles/carnet.css'

export const CarnetPage = () => {
  const { user } = useContext(AuthContext)
  const [carnet, setCarnet] = useState([])
  const [vacunas, setVacunas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    vacunaId: '',
    dosis: '',
    centro: '',
    fecha: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      // Obtener carnet del usuario
      const carnetData = carnetService.obtenerCarnet(user.id)
      setCarnet(carnetData)

      // Obtener lista de vacunas disponibles
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

    // Validaciones
    if (!formData.vacunaId || !formData.dosis || !formData.centro || !formData.fecha) {
      setError('Todos los campos son requeridos')
      return
    }

    // Agregar vacunación
    const newVacunacion = carnetService.agregarVacunacion(user.id, {
      vacunaId: parseInt(formData.vacunaId),
      dosis: parseInt(formData.dosis),
      centro: formData.centro,
      fecha: formData.fecha
    })

    // Actualizar carnet
    setCarnet([...carnet, newVacunacion])

    // Limpiar formulario
    setFormData({
      vacunaId: '',
      dosis: '',
      centro: '',
      fecha: ''
    })
    setShowForm(false)
  }

  const getNombreVacuna = (vacunaId) => {
    const vacuna = vacunas.find(v => v.id === vacunaId)
    return vacuna?.nombre || 'Desconocida'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  return (
    <div className="carnet-container">
      <div className="carnet-header">
        <h1>Mi Carnet de Vacunación</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Agregar Vacunación'}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>Registrar Nueva Vacunación</h2>
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
                      {v.nombre} - {v.enfermedad}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dosis">Número de Dosis *</label>
                <input
                  type="number"
                  id="dosis"
                  name="dosis"
                  value={formData.dosis}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="centro">Centro Médico *</label>
                <input
                  type="text"
                  id="centro"
                  name="centro"
                  value={formData.centro}
                  onChange={handleChange}
                  placeholder="Nombre del centro"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fecha">Fecha *</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary">
              Guardar Vacunación
            </button>
          </form>
        </div>
      )}

      <div className="carnet-list">
        {carnet.length === 0 ? (
          <div className="empty-state">
            <p>No hay vacunaciones registradas</p>
            <p className="hint">Registra tu primera vacunación para mantener tu carnet actualizado</p>
          </div>
        ) : (
          <div className="vaccination-cards">
            {carnet.map(v => (
              <div key={v.id} className="vaccination-card">
                <div className="card-header">
                  <h3>{getNombreVacuna(v.vacunaId)}</h3>
                  <span className="badge">Dosis {v.dosis}</span>
                </div>
                <div className="card-body">
                  <p><strong>Centro:</strong> {v.centro}</p>
                  <p><strong>Fecha:</strong> {formatDate(v.fecha)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
