import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/navbar.css'

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>💉 VaxMinder</span>
        </Link>
        
        {user ? (
          <div className="navbar-menu">
            <div className="nav-info">
              <span className="user-name">Bienvenido, {user.nombres}</span>
            </div>
            <ul className="nav-list">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/carnet">Mi Carnet</Link></li>
              <li><Link to="/centros">Centros Médicos</Link></li>
              <li><Link to="/alertas">Alertas</Link></li>
              <li><Link to="/historial">Historial</Link></li>
            </ul>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn-link">Ingresar</Link>
            <Link to="/registro" className="btn-link primary">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
