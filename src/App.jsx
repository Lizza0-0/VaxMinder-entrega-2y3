import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { LoginPage } from './pages/LoginPage'
import { RegistroPage } from './pages/RegistroPage'
import { DashboardPage } from './pages/DashboardPage'
import { CarnetPage } from './pages/CarnetPage'
import { CentrosPage } from './pages/CentrosPage'
import { AlertasPage } from './pages/AlertasPage'
import { HistorialPage } from './pages/HistorialPage'
import { HomePage } from './pages/HomePage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsuarios } from './pages/admin/AdminUsuarios'
import { AdminVacunas } from './pages/admin/AdminVacunas'
import { AdminCentros } from './pages/admin/AdminCentros'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login/paciente" element={<LoginPage />} />
              <Route path="/login/centro"   element={<LoginPage />} />
              <Route path="/login"          element={<Navigate to="/login/paciente" replace />} />
              <Route path="/registro"       element={<RegistroPage />} />

              {/* Rutas de Usuario */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/carnet"    element={<ProtectedRoute><CarnetPage /></ProtectedRoute>} />
              <Route path="/centros"   element={<ProtectedRoute><CentrosPage /></ProtectedRoute>} />
              <Route path="/alertas"   element={<ProtectedRoute><AlertasPage /></ProtectedRoute>} />
              <Route path="/historial" element={<ProtectedRoute><HistorialPage /></ProtectedRoute>} />

              {/* Rutas de Administrador */}
              <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/usuarios"  element={<AdminRoute><AdminUsuarios /></AdminRoute>} />
              <Route path="/admin/vacunas"   element={<AdminRoute><AdminVacunas /></AdminRoute>} />
              <Route path="/admin/centros"   element={<AdminRoute><AdminCentros /></AdminRoute>} />

              {/* Ruta 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
