import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { carnetService, alertasService, vacunasService } from '../services/index'
import '../styles/dashboard.css'

export const DashboardPage = () => {
  const { user } = useContext(AuthContext)
  const [carnetCount, setCarnetCount] = useState(0)
  const [alertasCount, setAlertasCount] = useState(0)
  const [vacunasStats, setVacunasStats] = useState(0)

  useEffect(() => {
    if (user) {
      // Obtener cantidad de vacunaciones
      const carnet = carnetService.obtenerCarnet(user.id)
      setCarnetCount(carnet.length)

      // Obtener cantidad de alertas
      const alertas = alertasService.obtenerAlertas(user.id)
      setAlertasCount(alertas.filter(a => !a.leida).length)

      // Obtener cantidad total de vacunas disponibles
      const vacunas = vacunasService.obtenerVacunas()
      setVacunasStats(vacunas.length)
    }
  }, [user])

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.nombres}!</h1>
        <p>Tu carnet de vacunación digital</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{carnetCount}</h3>
            <p>Vacunaciones Registradas</p>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3>{alertasCount}</h3>
            <p>Alertas sin Leer</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💉</div>
          <div className="stat-content">
            <h3>{vacunasStats}</h3>
            <p>Vacunas Disponibles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3>{user?.edad || 'N/A'}</h3>
            <p>Años</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Información Personal</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Nombres</label>
            <p>{user?.nombres} {user?.apellidos}</p>
          </div>
          <div className="info-item">
            <label>Documento</label>
            <p>{user?.tipoDocumento}: {user?.documento}</p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{user?.email}</p>
          </div>
          <div className="info-item">
            <label>Edad</label>
            <p>{user?.edad} años</p>
          </div>
        </div>
      </div>
    </div>
  )
}
