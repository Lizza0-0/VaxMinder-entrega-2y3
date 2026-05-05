import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

// ─── helpers ────────────────────────────────────────────────────────────────

const calcularEdad = (fechanacimiento) => {
  if (!fechanacimiento) return null
  const hoy = new Date()
  const nac = new Date(fechanacimiento)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const mes = hoy.getMonth() - nac.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad -= 1
  return edad
}

const generarToken = (idusuario) =>
  `mock-jwt-${idusuario}-${Date.now()}`

// ─── helpers localStorage ────────────────────────────────────────────────────

const getUsuarios = () => {
  try { return JSON.parse(localStorage.getItem('vax_usuarios') || '[]') } catch { return [] }
}
const setUsuarios = (lista) =>
  localStorage.setItem('vax_usuarios', JSON.stringify(lista))

// ─── Seed admin ──────────────────────────────────────────────────────────────

const initAdmin = () => {
  const usuarios = getUsuarios()
  const adminExiste = usuarios.find(u => u.rol === 'admin')
  if (!adminExiste) {
    const admin = {
      idusuario:       'CMED01',
      nombre:          'Admin',
      apellido:        'VaxMinder',
      email:           'admin@vaxminder.com',
      contrasena:      'admin123',
      fechanacimiento: '1990-01-01',
      tiposangre:      'O+',
      telefono:        '3001234567',
      tipoDocumento:   'CC',
      fecharegistro:   '2024-01-01',
      rol:             'admin'
    }
    setUsuarios([...usuarios, admin])
  }
}

initAdmin()

// ─── Provider ────────────────────────────────────────────────────────────────

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
      tipoDocumento:   usuarioBackend.tipoDocumento || '',
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
      const usuarios = getUsuarios()
      const existe = usuarios.find(u => String(u.idusuario) === String(formData.idusuario))
      if (existe) return { success: false, message: 'Ya existe un usuario con ese número de documento' }

      const tipoDoc = formData.tipoDocumento || ''
      if (!tipoDoc) return { success: false, message: 'El tipo de documento es requerido' }
      if (!['CC', 'TI', 'RC'].includes(tipoDoc))
        return { success: false, message: 'Tipo de documento no válido. Opciones: CC, TI, RC' }

      const hoy = new Date()
      const nac = new Date(formData.fechanacimiento)
      let edad = hoy.getFullYear() - nac.getFullYear()
      const mes = hoy.getMonth() - nac.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad -= 1
      if (edad >= 18 && tipoDoc !== 'CC')
        return { success: false, message: 'Los mayores de 18 años deben registrarse con Cédula de Ciudadanía (CC)' }

      const nuevoUsuario = {
        idusuario:       Number(formData.idusuario),
        nombre:          formData.nombre,
        apellido:        formData.apellido,
        email:           formData.email,
        contrasena:      formData.contrasena,
        fechanacimiento: formData.fechanacimiento,
        tiposangre:      formData.tiposangre,
        telefono:        formData.telefono,
        tipoDocumento:   tipoDoc,
        fecharegistro:   new Date().toISOString().slice(0, 10),
        rol:             'usuario'
      }
      setUsuarios([...usuarios, nuevoUsuario])

      const nuevoToken = generarToken(nuevoUsuario.idusuario)
      guardarSesion(nuevoToken, nuevoUsuario)
      return { success: true }
    } catch {
      return { success: false, message: 'Error al registrar el usuario' }
    }
  }

  const login = async (idusuario, contrasena) => {
    try {
      const usuarios = getUsuarios()
      const usuario = usuarios.find(
        u => String(u.idusuario) === String(idusuario) && u.contrasena === contrasena
      )
      if (!usuario) return { success: false, message: 'Número de documento o contraseña incorrecta' }

      const nuevoToken = generarToken(usuario.idusuario)
      guardarSesion(nuevoToken, usuario)
      return { success: true, rol: usuario.rol || 'usuario' }
    } catch {
      return { success: false, message: 'Error al iniciar sesión' }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const usuarios = getUsuarios()
      const idx = usuarios.findIndex(u => Number(u.idusuario) === Number(user.idusuario))
      if (idx === -1) return { success: false, message: 'Usuario no encontrado' }

      usuarios[idx] = {
        ...usuarios[idx],
        email:    updates.email,
        telefono: updates.telefono,
        ...(updates.contrasena ? { contrasena: updates.contrasena } : {})
      }
      setUsuarios(usuarios)

      const updatedUser = { ...usuarios[idx], edad: calcularEdad(usuarios[idx].fechanacimiento) }
      setUser(updatedUser)
      localStorage.setItem('vax_user', JSON.stringify(updatedUser))
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
