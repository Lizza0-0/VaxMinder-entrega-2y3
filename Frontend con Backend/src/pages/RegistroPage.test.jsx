import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { RegistroPage } from './RegistroPage'

// Función auxiliar: renderiza RegistroPage con un mock de register en el contexto.
const renderRegistro = (registerFn = vi.fn().mockResolvedValue({ success: true })) => {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ register: registerFn }}>
        <RegistroPage />
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('RegistroPage — estructura del formulario', () => {
  it('muestra el título "Crear Cuenta"', () => {
    renderRegistro()
    expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('renderiza los campos principales del formulario', () => {
    renderRegistro()
    expect(screen.getByPlaceholderText('Ana María')).toBeInTheDocument()      // nombre
    expect(screen.getByPlaceholderText('García López')).toBeInTheDocument()   // apellido
    expect(screen.getByPlaceholderText('correo@ejemplo.com')).toBeInTheDocument() // email
    expect(screen.getByPlaceholderText('1234567890')).toBeInTheDocument()     // documento
    expect(screen.getByPlaceholderText('3001234567')).toBeInTheDocument()     // teléfono
  })

  it('muestra el botón "Crear Cuenta"', () => {
    renderRegistro()
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('muestra el enlace para ir al login', () => {
    renderRegistro()
    expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument()
  })
})

describe('RegistroPage — validaciones al enviar vacío', () => {
  it('muestra múltiples errores "Requerido" al enviar sin datos', async () => {
    renderRegistro()
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      const errores = screen.getAllByText('Requerido')
      // idusuario, nombre, apellido, tipodocumento, fechanacimiento, tiposangre, telefono
      expect(errores.length).toBeGreaterThanOrEqual(5)
    })
  })

  it('muestra "Correo inválido" cuando el email está vacío', async () => {
    renderRegistro()
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(screen.getByText('Correo inválido')).toBeInTheDocument()
    })
  })

  it('muestra error de contraseña corta', async () => {
    renderRegistro()
    fireEvent.change(screen.getByPlaceholderText(/mínimo 6 caracteres/i), {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument()
    })
  })
})

describe('RegistroPage — comportamiento de los campos', () => {
  it('el campo de nombre solo acepta letras', () => {
    renderRegistro()
    const nombreInput = screen.getByPlaceholderText('Ana María')
    fireEvent.change(nombreInput, { target: { value: 'Ana123' } })
    // handleSoloLetras elimina los números → solo queda "Ana"
    expect(nombreInput).toHaveValue('Ana')
  })

  it('el campo de teléfono solo acepta números', () => {
    renderRegistro()
    const telInput = screen.getByPlaceholderText('3001234567')
    fireEvent.change(telInput, { target: { value: '300abc456' } })
    // handleSoloNumeros elimina las letras → solo queda "300456"
    expect(telInput).toHaveValue('300456')
  })

  it('el campo de documento no acepta más de 15 dígitos', () => {
    renderRegistro()
    const docInput = screen.getByPlaceholderText('1234567890')
    fireEvent.change(docInput, { target: { value: '1234567890123456' } }) // 16 dígitos
    expect(docInput.value.length).toBeLessThanOrEqual(15)
  })

  it('muestra el botón "Registrando..." mientras se procesa la solicitud', async () => {
    const registerFn = vi.fn(() => new Promise(() => {})) // nunca resuelve → simula carga
    renderRegistro(registerFn)

    // Llenar campos mínimos para pasar la validación del formulario
    fireEvent.change(screen.getByPlaceholderText('1234567890'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByPlaceholderText('Ana María'),   { target: { value: 'Ana' } })
    fireEvent.change(screen.getByPlaceholderText('García López'), { target: { value: 'García' } })
    fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { target: { value: 'ana@test.com' } })
    fireEvent.change(screen.getByPlaceholderText(/mínimo 6 caracteres/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('3001234567'), { target: { value: '3001234567' } })

    // Los dos selects empiezan con "Seleccionar...": primero tipodocumento, luego tiposangre
    const [tipoDocSelect, tipoSangreSelect] = screen.getAllByDisplayValue('Seleccionar...')
    fireEvent.change(tipoDocSelect,   { target: { value: 'CC' } })
    fireEvent.change(tipoSangreSelect, { target: { value: 'O+' } })

    // Fecha de nacimiento (input type="date" no tiene placeholder ni label asociado)
    const dateInput = document.querySelector('input[name="fechanacimiento"]')
    fireEvent.change(dateInput, { target: { value: '2000-05-15' } })

    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registrando/i })).toBeDisabled()
    })
  })
})
