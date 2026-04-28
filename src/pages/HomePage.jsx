import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/home.css'

export const HomePage = () => {
  const { user } = useContext(AuthContext)

  if (user) {
    return (
      <div className="home-container">
        <div className="home-hero">
          <h1>¡Bienvenido a VaxMinder!</h1>
          <p>Tu carnet de vacunación digital seguro y accesible</p>
          <Link to="/dashboard" className="btn-primary btn-large">
            Ir a Mi Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>VaxMinder</h1>
        <p>Tu Carnet de Vacunación Digital</p>
        <p className="subtitle">Mantén tu historial de vacunaciones seguro y accesible en todo momento</p>
        
        <div className="hero-buttons">
          <Link to="/login" className="btn-primary btn-large">
            Ingresar
          </Link>
          <Link to="/registro" className="btn-secondary btn-large">
            Crear Cuenta
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>¿Por qué VaxMinder?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Digital</h3>
            <p>Accede a tu carnet desde cualquier dispositivo</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Seguro</h3>
            <p>Tu información está protegida y privada</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💉</div>
            <h3>Completo</h3>
            <p>Registro de todas tus vacunaciones</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Alertas</h3>
            <p>Recordatorios de tus próximas vacunaciones</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Centros</h3>
            <p>Ubica centros médicos cercanos</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Historial</h3>
            <p>Acceso a tu historial completo</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>¿Listo para comenzar?</h2>
        <p>Registrate hoy y mantén tu carnet de vacunación siempre a mano</p>
        <Link to="/registro" className="btn-primary btn-large">
          Crear Mi Cuenta
        </Link>
      </div>
    </div>
  )
}
