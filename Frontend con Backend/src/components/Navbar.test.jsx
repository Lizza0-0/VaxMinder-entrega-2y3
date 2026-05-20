import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Navbar } from './Navbar'

// Función auxiliar: renderiza Navbar con el estado de autenticación indicado.
// authValue puede incluir: user, centro, logout
const renderNavbar = (authValue = {}) => {
  const defaults = { user: null, centro: null, logout: vi.fn() }
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ ...defaults, ...authValue }}>
        <Navbar />
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('Navbar — sin sesión iniciada', () => {
  it('muestra el logo VaxMinder', () => {
    renderNavbar()
    expect(screen.getByText(/VaxMinder/i)).toBeInTheDocument()
  })

  it('NO muestra el botón "Cerrar Sesión" cuando no hay sesión', () => {
    renderNavbar()
    expect(screen.queryByRole('button', { name: /cerrar sesión/i })).not.toBeInTheDocument()
  })

  it('NO muestra enlaces de navegación cuando no hay sesión', () => {
    renderNavbar()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })
})

describe('Navbar — sesión de paciente', () => {
  const userMock = { nombre: 'Ana García' }

  it('muestra el nombre del usuario con bienvenida', () => {
    renderNavbar({ user: userMock })
    expect(screen.getByText(/bienvenido, ana garcía/i)).toBeInTheDocument()
  })

  it('muestra los enlaces del menú del paciente', () => {
    renderNavbar({ user: userMock })
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Mi Carnet')).toBeInTheDocument()
    expect(screen.getByText('Centros Médicos')).toBeInTheDocument()
    expect(screen.getByText('Alertas')).toBeInTheDocument()
    expect(screen.getByText('Historial')).toBeInTheDocument()
  })

  it('muestra el botón "Cerrar Sesión"', () => {
    renderNavbar({ user: userMock })
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()
  })

  it('llama a logout al hacer clic en "Cerrar Sesión"', () => {
    const logout = vi.fn()
    renderNavbar({ user: userMock, logout })
    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }))
    expect(logout).toHaveBeenCalledTimes(1)
  })
})

describe('Navbar — sesión de centro médico', () => {
  const centroMock = { razonsocial: 'Clínica San José' }

  it('muestra el nombre del centro', () => {
    renderNavbar({ centro: centroMock })
    expect(screen.getByText(/clínica san josé/i)).toBeInTheDocument()
  })

  it('muestra el enlace "Portal"', () => {
    renderNavbar({ centro: centroMock })
    expect(screen.getByText('Portal')).toBeInTheDocument()
  })

  it('muestra el botón "Cerrar Sesión" para centros', () => {
    renderNavbar({ centro: centroMock })
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()
  })

  it('llama a logout al cerrar sesión del centro', () => {
    const logout = vi.fn()
    renderNavbar({ centro: centroMock, logout })
    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }))
    expect(logout).toHaveBeenCalledTimes(1)
  })
})
