import { useEffect, useState } from 'react'
import { centrosService } from '../services/index'
import '../styles/centros.css'

export const CentrosPage = () => {
  const [centros, setCentros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await centrosService.obtenerCentros()
        setCentros(data)
      } catch {
        setError('No se pudieron cargar los centros medicos')
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
        <h1>Centros Medicos</h1>
        <p>Encuentra los centros de vacunacion disponibles</p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {centros.length === 0 ? (
        <div className="empty-state"><p>No hay centros medicos registrados en la base de datos</p></div>
      ) : (
        <div className="centros-grid">
          {centros.map(centro => (
            <div key={centro.idcentro} className="centro-card">
              <div className="centro-icon">🏥</div>
              <h3>{centro.nombrecentro}</h3>
              <div className="centro-info">
                <p><strong>Direccion:</strong><br/>{centro.direccion}</p>
                <p><strong>Ciudad:</strong><br/>{centro.ciudad}</p>
                <p><strong>Telefono:</strong><br/>{centro.telefono || 'No disponible'}</p>
                <p><strong>Tipo:</strong><br/>{centro.tipocentro || 'General'}</p>
              </div>
              <button className="btn-secondary">Contactar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}