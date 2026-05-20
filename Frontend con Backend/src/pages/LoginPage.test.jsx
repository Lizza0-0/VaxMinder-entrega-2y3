import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LoginPage } from './LoginPage'

// Función auxiliar: renderiza LoginPage con el contexto y la ruta indicados.
// path: la URL simulada (determina si es paciente o centro).
// loginFn / loginCentroFn: funciones mock que sustituyen las llamadas reales a la API.
const renderLogin = (
  path = '/login/paciente',
  loginFn = vi.fn().mockResolvedValue({ success: true }),
  loginCentroFn = vi.fn().mockResolvedValue({ success: true })
) => {
  const authValue = { login: loginFn, loginCentro: loginCentroFn }
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthContext.Provider value={authValue}>
        <LoginPage />
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('LoginPage — vista de paciente (/login/paciente)', () => {
  it('muestra el título "Iniciar Sesión"', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('muestra la etiqueta "Número de Documento"', () => {
    renderLogin()
    expect(screen.getByLabelText(/número de documento/i)).toBeInTheDocument()
  })

  it('muestra el enlace "Regístrate aquí"', () => {
    renderLogin()
    expect(screen.getByText(/regístrate aquí/i)).toBeInTheDocument()
  })

  it('muestra error si se envía con documento vacío', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => {
      expect(screen.getByText(/ingresa tu número de documento/i)).toBeInTheDocument()
    })
  })

  it('muestra error si el documento está lleno pero la contraseña vacía', async () => {
    renderLogin()
    fireEvent.change(screen.getByLabelText(/número de documento/i), {
      target: { value: '12345678' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => {
      expect(screen.getByText(/por favor ingresa tu contraseña/i)).toBeInTheDocument()
    })
  })

  it('llama a la función login con los datos ingresados', async () => {
    const loginFn = vi.fn().mockResolvedValue({ success: true })
    renderLogin('/login/paciente', loginFn)
    fireEvent.change(screen.getByLabelText(/número de documento/i), {
      target: { value: '12345678' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'mipassword' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledWith('12345678', 'mipassword')
    })
  })

  it('muestra el botón deshabilitado y con texto "Ingresando..." mientras carga', async () => {
    // login que nunca resuelve → el componente queda en estado loading
    const loginFn = vi.fn(() => new Promise(() => {}))
    renderLogin('/login/paciente', loginFn)
    fireEvent.change(screen.getByLabelText(/número de documento/i), {
      target: { value: '12345678' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'mipassword' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ingresando/i })).toBeDisabled()
    })
  })
})

describe('LoginPage — vista de centro (/login/centro)', () => {
  it('muestra la etiqueta "NIT (sin dígito de verificación)"', () => {
    renderLogin('/login/centro')
    expect(screen.getByLabelText(/nit/i)).toBeInTheDocument()
  })

  it('muestra el enlace "Registrar Centro Médico"', () => {
    renderLogin('/login/centro')
    expect(screen.getByText(/registrar centro médico/i)).toBeInTheDocument()
  })

  it('muestra error si el NIT contiene letras', async () => {
    renderLogin('/login/centro')
    fireEvent.change(screen.getByLabelText(/nit/i), { target: { value: 'abc123' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'mipassword' } })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))
    await waitFor(() => {
      expect(
        screen.getByText(/el nit debe contener solo dígitos/i)
      ).toBeInTheDocument()
    })
  })
})
