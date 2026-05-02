import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService, vacunasService, centrosService } from '../../services/index'
import '../../styles/admin.css'

export const AdminDashboard = () => {
  const [stats, setStats]   = useState({ usuarios: 0, vacunas: 0, centros: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const [usuarios, vacunas, centros] = await Promise.all([
        adminService.obtenerUsuarios(),
        vacunasService.obtenerVacunas(),
        centrosService.obtenerCentros()
      ])
      setStats({ usuarios: usuarios.length, vacunas: vacunas.length, centros: centros.length })
      setLoading(false)
    }
    cargar()
  }, [])

  if (loading) return <div className="admin-container"><p>Cargando...</p></div>

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p className="page-description">Gestiona pacientes, vacunas y centros médicos</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-number">{stats.usuarios}</span>
            <span className="stat-label">Pacientes registrados</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-number">{stats.vacunas}</span>
            <span className="stat-label">Vacunas en catálogo</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-number">{stats.centros}</span>
            <span className="stat-label">Centros médicos</span>
          </div>
        </div>
      </div>

      <div className="admin-cards">
        <Link to="/admin/usuarios" className="admin-card">
          <h3>Gestionar Pacientes</h3>
          <p>Ver, editar y registrar vacunas en el carnet de cualquier paciente</p>
        </Link>
        <Link to="/admin/vacunas" className="admin-card">
          <h3>Catálogo de Vacunas</h3>
          <p>Agregar y editar las vacunas disponibles en el sistema</p>
        </Link>
        <Link to="/admin/centros" className="admin-card">
          <h3>Centros Médicos</h3>
          <p>Administrar los centros médicos registrados en la plataforma</p>
        </Link>
      </div>
    </div>
  )
}
