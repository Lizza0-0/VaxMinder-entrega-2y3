import { useEffect, useState } from 'react'
import { centrosService } from '../services/index'
import '../styles/centros.css'

export const CentrosPage = () => {
  const [centros, setCentros]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [selectedCentro, setSelected] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await centrosService.obtenerCentros()
        setCentros(data)
      } catch {
        setError('No se pudieron cargar los centros médicos')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  if (loading) return <div className="centros-container"><p>Cargando centros...</p></div>

  return (
    <div className="centros-container">
      <div className="centros-header">
        <h1>Centros Médicos</h1>
        <p>Encuentra los centros de vacunación disponibles</p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {centros.length === 0 ? (
        <div className="empty-state"><p>No hay centros médicos registrados en la base de datos</p></div>
      ) : (
        <div className="centros-grid">
          {centros.map(centro => (
            <div key={centro.idcentro} className="centro-card">
              <div className="centro-icon">🏥</div>
              <h3>{centro.nombrecentro}</h3>
              <div className="centro-info">
                <p><strong>Dirección:</strong><br/>{centro.direccion}</p>
                <p><strong>Ciudad:</strong><br/>{centro.ciudad}</p>
                <p><strong>Teléfono:</strong><br/>{centro.telefono || 'No disponible'}</p>
                <p><strong>Tipo:</strong><br/>{centro.tipocentro || 'General'}</p>
              </div>
              <button className="btn-secondary" onClick={() => setSelected(centro)}>Ver detalles</button>
            </div>
          ))}
        </div>
      )}

      {selectedCentro && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="modal-icon">🏥</div>
            <h2>{selectedCentro.nombrecentro}</h2>
            <span className="modal-badge">{selectedCentro.tipocentro || 'General'}</span>
            <div className="modal-info">
              <div className="modal-info-row">
                <span className="modal-info-label">Dirección</span>
                <span>{selectedCentro.direccion}</span>
              </div>
              <div className="modal-info-row">
                <span className="modal-info-label">Ciudad</span>
                <span>{selectedCentro.ciudad}</span>
              </div>
              <div className="modal-info-row">
                <span className="modal-info-label">Teléfono</span>
                <span>{selectedCentro.telefono || 'No disponible'}</span>
              </div>
            </div>
            <a
              className="btn-primary modal-maps-btn"
              href={`https://www.google.com/maps/search/${encodeURIComponent(selectedCentro.nombrecentro + ', ' + selectedCentro.ciudad + ', Colombia')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  )
}