import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegistroPage } from './pages/RegistroPage'
import { DashboardPage } from './pages/DashboardPage'
import { CarnetPage } from './pages/CarnetPage'
import { CentrosPage } from './pages/CentrosPage'
import { AlertasPage } from './pages/AlertasPage'
import { HistorialPage } from './pages/HistorialPage'
import { HomePage } from './pages/HomePage'
import { PortalCentroPage } from './pages/PortalCentroPage'
import { RegistroCentroPage } from './pages/RegistroCentroPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login/paciente" element={<LoginPage />} />
              <Route path="/login/centro"   element={<LoginPage />} />
              <Route path="/login"          element={<Navigate to="/login/paciente" replace />} />
              <Route path="/registro"       element={<RegistroPage />} />
              <Route path="/centro/registro" element={<RegistroCentroPage />} />

              {/* Protegidas paciente */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/carnet"    element={<ProtectedRoute><CarnetPage /></ProtectedRoute>} />
              <Route path="/centros"   element={<ProtectedRoute><CentrosPage /></ProtectedRoute>} />
              <Route path="/alertas"   element={<ProtectedRoute><AlertasPage /></ProtectedRoute>} />
              <Route path="/historial" element={<ProtectedRoute><HistorialPage /></ProtectedRoute>} />

              {/* Protegidas centro */}
              <Route path="/centro/portal" element={<ProtectedRoute centroOnly><PortalCentroPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}
export default App
