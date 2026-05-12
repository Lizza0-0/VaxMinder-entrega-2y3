import { useEffect, useState } from 'react'
import { centrosService } from '../services/index'
import '../styles/centros.css'

// CentrosMedicos del backend: { idcentro, nombrecentro, direccion, ciudad, telefono, tipocentro }

export const CentrosPage = () => {
  const [centros, setCentros] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro]   = useState('')
  const [modal, setModal]     = useState(null)
  const [error, setError]     = useState('')

  useEffect(() => {
    centrosService.obtenerCentros()
      .then(d => setCentros(d))
      .catch(() => setError('Error al cargar centros médicos'))
      .finally(() => setLoading(false))
  }, [])

  const centrosFiltrados = centros.filter(c =>
    c.nombrecentro?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.ciudad?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.tipocentro?.toLowerCase().includes(filtro.toLowerCase())
  )

  if (loading) return <div className="loading">Cargando centros...</div>

  return (
    <div className="centros-container">
      <div className="centros-header">
        <p className="page-subtitle">Directorio</p>
        <h1>Centros Médicos</h1>
        <p>Encuentra los centros de vacunación disponibles</p>
        <input
          type="text"
          placeholder="Buscar por nombre, ciudad o tipo..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{marginTop:'1rem',padding:'0.65rem 1rem',border:'1.5px solid #e2e8f0',borderRadius:'0.5rem',fontSize:'0.95rem',width:'100%',maxWidth:'400px'}}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="centros-grid">
        {centrosFiltrados.map(c => (
          <div className="centro-card" key={c.idcentro}>
            <div className="centro-icon">🏥</div>
            <h3>{c.nombrecentro}</h3>
            <div className="centro-info">
              <p><strong>Tipo:</strong> {c.tipocentro || '—'}</p>
              <p><strong>Ciudad:</strong> {c.ciudad}</p>
              <p><strong>Dirección:</strong> {c.direccion}</p>
              <p><strong>Teléfono:</strong> {c.telefono || '—'}</p>
            </div>
            <button className="btn-secondary" onClick={() => setModal(c)}>Ver detalles</button>
          </div>
        ))}
        {centrosFiltrados.length === 0 && (
          <div className="empty-state" style={{gridColumn:'1/-1'}}>
            <p>No se encontraron centros con ese criterio</p>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="modal-icon">🏥</div>
            <h2>{modal.nombrecentro}</h2>
            <span className="modal-badge">{modal.tipocentro || 'Centro Médico'}</span>
            <div className="modal-info">
              <div className="modal-info-row"><span className="modal-info-label">Ciudad</span><span>{modal.ciudad}</span></div>
              <div className="modal-info-row"><span className="modal-info-label">Dirección</span><span>{modal.direccion}</span></div>
              <div className="modal-info-row"><span className="modal-info-label">Teléfono</span><span>{modal.telefono || '—'}</span></div>
            </div>
            <a className="btn-primary modal-maps-btn"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(modal.nombrecentro+' '+modal.ciudad)}`}
              target="_blank" rel="noopener noreferrer">
              Ver en Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
