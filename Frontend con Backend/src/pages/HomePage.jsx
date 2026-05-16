import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/home.css'

export const HomePage = () => {
  const { user, centro } = useContext(AuthContext)
  const navigate = useNavigate()

  if (user) {
    return (
      <div className="home-container">
        <div className="home-hero">
          <h1>¡Bienvenido de nuevo!</h1>
          <p>Consulta tu carnet de vacunación digital</p>
          <Link to="/dashboard" className="btn-primary btn-large">Ir a mi panel</Link>
        </div>
      </div>
    )
  }

  if (centro) {
    return (
      <div className="home-container">
        <div className="home-hero">
          <h1>¡Bienvenido!</h1>
          <p>{centro.razonsocial}</p>
          <Link to="/centro/portal" className="btn-primary btn-large">Ir al Portal</Link>
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
          <div className="role-card">
            <div className="role-card-icon role-icon-paciente"><span>👤</span></div>
            <h3>Soy Paciente</h3>
            <p>Consulta y descarga tu carnet de vacunación digital</p>
            <div className="role-card-actions">
              <Link to="/login/paciente" className="btn-primary">Ingresar</Link>
              <Link to="/registro" className="btn-role-outline">Crear cuenta</Link>
            </div>
          </div>

          <div className="role-card role-card-centro">
            <div className="role-card-icon role-icon-centro"><span>🏥</span></div>
            <h3>Soy Centro Médico</h3>
            <p>Registra vacunaciones de tus pacientes con NIT</p>
            <div className="role-card-actions">
              <Link to="/login/centro" className="btn-primary">Ingresar</Link>
              <Link to="/centro/registro" className="btn-role-outline">Registrarse</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
