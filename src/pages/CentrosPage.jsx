import { useEffect, useState } from 'react'
import { centrosService } from '../services/index'
import '../styles/centros.css'

export const CentrosPage = () => {
  const [centros, setCentros] = useState([])

  useEffect(() => {
    const centrosData = centrosService.obtenerCentros()
    setCentros(centrosData)
  }, [])

  return (
    <div className="centros-container">
      <div className="centros-header">
        <h1>Centros Médicos</h1>
        <p>Encuentra los centros de vacunación disponibles</p>
      </div>

      <div className="centros-grid">
        {centros.map(centro => (
          <div key={centro.id} className="centro-card">
            <div className="centro-icon">🏥</div>
            <h3>{centro.nombre}</h3>
            <div className="centro-info">
              <p>
                <strong>📍 Ubicación:</strong><br/>
                {centro.ubicacion}
              </p>
              <p>
                <strong>📞 Teléfono:</strong><br/>
                {centro.telefono}
              </p>
              <p>
                <strong>⏰ Horario:</strong><br/>
                {centro.horario}
              </p>
            </div>
            <button className="btn-secondary">
              Contactar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
