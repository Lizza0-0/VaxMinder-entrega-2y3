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
          <h1>¡Bienvenido de nuevo!</h1>
          <p>
            {user.rol === 'admin'
              ? 'Gestiona vacunaciones y pacientes desde el panel'
              : 'Consulta tu carnet de vacunación digital'}
          </p>
          <Link
            to={user.rol === 'admin' ? '/admin' : '/dashboard'}
            className="btn-primary btn-large"
          >
            Ir a mi panel
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
        <p className="subtitle">¿Cómo deseas acceder a la plataforma?</p>

        <div className="role-cards">
          {/* Paciente */}
          <div className="role-card">
            <div className="role-card-icon role-icon-paciente">
              <span>👤</span>
            </div>
            <h3>Soy Paciente</h3>
            <p>Consulta y descarga tu carnet de vacunación digital</p>
            <div className="role-card-actions">
              <Link to="/login/paciente" className="btn-primary">Ingresar</Link>
              <Link to="/registro" className="btn-role-outline">Crear cuenta</Link>
            </div>
          </div>

          {/* Centro de Salud */}
          <div className="role-card role-card-centro">
            <div className="role-card-icon role-icon-centro">
              <span>🏥</span>
            </div>
            <h3>Soy Centro de Salud</h3>
            <p>Administra y registra vacunaciones de tus pacientes</p>
            <div className="role-card-actions">
              <Link to="/login/centro" className="btn-primary">Ingresar</Link>
            </div>
          </div>
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
        <h2>¿Eres paciente y aún no tienes cuenta?</h2>
        <p>Regístrate gratis y lleva tu carnet siempre contigo</p>
        <Link to="/registro" className="btn-primary btn-large">
          Crear Mi Cuenta
        </Link>
      </div>
    </div>
  )
}
