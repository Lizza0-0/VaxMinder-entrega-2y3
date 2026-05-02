import { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
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
              <span className="user-name">
                {user.rol === 'admin' ? 'Admin' : 'Bienvenido'}, {user.nombre}
              </span>
            </div>
            <ul className="nav-list">
              {user.rol === 'admin' ? (
                <>
                  <li><NavLink to="/admin" end>Panel Admin</NavLink></li>
                  <li><NavLink to="/admin/usuarios">Usuarios</NavLink></li>
                  <li><NavLink to="/admin/vacunas">Vacunas</NavLink></li>
                  <li><NavLink to="/admin/centros">Centros Médicos</NavLink></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                  <li><NavLink to="/carnet">Mi Carnet</NavLink></li>
                  <li><NavLink to="/centros">Centros Médicos</NavLink></li>
                  <li><NavLink to="/alertas">Alertas</NavLink></li>
                  <li><NavLink to="/historial">Historial</NavLink></li>
                </>
              )}
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
