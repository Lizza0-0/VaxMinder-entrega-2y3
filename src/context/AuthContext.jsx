import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

const BASE_URL = 'http://localhost:8080/api'

const calcularEdad = (fechanacimiento) => {
  if (!fechanacimiento) return null
  const hoy = new Date()
  const nac = new Date(fechanacimiento)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const mes = hoy.getMonth() - nac.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad -= 1
  return edad
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('vax_token')
    const u = localStorage.getItem('vax_user')
    if (t && u) {
      const parsed = JSON.parse(u)
      setToken(t)
      setUser({ ...parsed, edad: calcularEdad(parsed.fechanacimiento) })
    }
    setLoading(false)
  }, [])

  const guardarSesion = (nuevoToken, usuarioBackend) => {
    const conEdad = {
      idusuario:       usuarioBackend.idusuario,
      nombre:          usuarioBackend.nombre,
      apellido:        usuarioBackend.apellido,
      email:           usuarioBackend.email,
      fechanacimiento: usuarioBackend.fechanacimiento,
      tiposangre:      usuarioBackend.tiposangre,
      telefono:        usuarioBackend.telefono,
      fecharegistro:   usuarioBackend.fecharegistro,
      tipodocumento:   usuarioBackend.tipodocumento || '',
      rol:             usuarioBackend.rol || 'usuario',
      edad:            calcularEdad(usuarioBackend.fechanacimiento)
    }
    setToken(nuevoToken)
    setUser(conEdad)
    localStorage.setItem('vax_token', nuevoToken)
    localStorage.setItem('vax_user', JSON.stringify(conEdad))
  }

  const register = async (formData) => {
    try {
      const payload = {
        idusuario:       formData.idusuario,
        nombre:          formData.nombre,
        apellido:        formData.apellido,
        email:           formData.email,
        contrasena:      formData.contrasena,
        fechanacimiento: formData.fechanacimiento,
        tiposangre:      formData.tiposangre,
        telefono:        formData.telefono,
        tipodocumento:   formData.tipoDocumento || formData.tipodocumento || ''
      }
      const res = await fetch(`${BASE_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error || 'Error al registrar' }
      guardarSesion(data.token, data.usuario)
      return { success: true }
    } catch {
      return { success: false, message: 'No se pudo conectar con el servidor' }
    }
  }

  const login = async (idusuario, contrasena) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idusuario, contrasena })
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error || 'Credenciales incorrectas' }
      guardarSesion(data.token, data.usuario)
      return { success: true, rol: data.usuario.rol || 'usuario' }
    } catch {
      return { success: false, message: 'No se pudo conectar con el servidor' }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const t = localStorage.getItem('vax_token')
      const res = await fetch(`${BASE_URL}/usuarios/${user.idusuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${t}`
        },
        body: JSON.stringify({
          nombre:    user.nombre,
          apellido:  user.apellido,
          email:     updates.email,
          telefono:  updates.telefono,
          ...(updates.contrasena ? { contrasena: updates.contrasena } : {})
        })
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error || 'Error al actualizar' }
      guardarSesion(t, data)
      return { success: true }
    } catch {
      return { success: false, message: 'No se pudo actualizar la información' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('vax_token')
    localStorage.removeItem('vax_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
