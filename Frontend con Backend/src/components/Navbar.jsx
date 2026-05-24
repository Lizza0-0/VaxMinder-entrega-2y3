import { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/navbar.css'

export const Navbar = () => {
  const { user, centro, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">💉 VaxMinder</Link>

        {/* Sesión de paciente */}
        {user && (
          <div className="navbar-menu">
            <div className="nav-info">
              <span className="user-name">Bienvenido, {user.nombre}</span>
            </div>
            <ul className="nav-list">
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/carnet">Mi Carnet</NavLink></li>
              <li><NavLink to="/centros">Centros Médicos</NavLink></li>
              <li><NavLink to="/alertas">Alertas</NavLink></li>
              <li><NavLink to="/historial">Historial</NavLink></li>
              <li><NavLink to="/analytics">Analítica</NavLink></li>
            </ul>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </div>
        )}

        {/* Sesión de centro */}
        {centro && !user && (
          <div className="navbar-menu">
            <div className="nav-info">
              <span className="user-name">🏥 {centro.razonsocial}</span>
            </div>
            <ul className="nav-list">
              <li><NavLink to="/centro/portal">Portal</NavLink></li>
            </ul>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </div>
        )}

      </div>
    </nav>
  )
}
