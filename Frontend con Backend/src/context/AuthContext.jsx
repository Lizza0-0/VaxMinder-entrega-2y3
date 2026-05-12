import { createContext, useState, useEffect } from 'react'
export const AuthContext = createContext()
const API = 'http://localhost:8080'

const calcEdad = (fechanacimiento) => {
  if (!fechanacimiento) return null
  const h = new Date(), n = new Date(fechanacimiento)
  let e = h.getFullYear() - n.getFullYear()
  if (h.getMonth() - n.getMonth() < 0 || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) e--
  return e
}

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [centro,  setCentro]  = useState(null)
  const [token,   setToken]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('vax_token')
    const u = localStorage.getItem('vax_user')
    const c = localStorage.getItem('vax_centro')
    if (t && u) { const p = JSON.parse(u); setToken(t); setUser({ ...p, edad: calcEdad(p.fechanacimiento) }) }
    else if (t && c) { setToken(t); setCentro(JSON.parse(c)) }
    setLoading(false)
  }, [])

  const guardarPaciente = (tok, u) => {
    const s = { idusuario: u.idusuario, nombre: u.nombre, apellido: u.apellido,
      email: u.email, tipodocumento: u.tipodocumento, fechanacimiento: u.fechanacimiento,
      tiposangre: u.tiposangre, telefono: u.telefono, fecharegistro: u.fecharegistro,
      edad: calcEdad(u.fechanacimiento) }
    setToken(tok); setUser(s); setCentro(null)
    localStorage.setItem('vax_token', tok)
    localStorage.setItem('vax_user', JSON.stringify(s))
    localStorage.removeItem('vax_centro')
  }

  const guardarCentro = (tok, c) => {
    const s = { nit: c.nit, razonsocial: c.razonsocial, tipodocumento: c.tipodocumento,
      direccion: c.direccion, ciudad: c.ciudad, telefono: c.telefono, fecharegistro: c.fecharegistro }
    setToken(tok); setCentro(s); setUser(null)
    localStorage.setItem('vax_token', tok)
    localStorage.setItem('vax_centro', JSON.stringify(s))
    localStorage.removeItem('vax_user')
  }

  const login = async (idusuario, contrasena) => {
    try {
      const r = await fetch(`${API}/api/auth/login`, { method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ idusuario: Number(idusuario), contrasena }) })
      const d = await r.json()
      if (!r.ok) return { success:false, message: d.error || 'Cédula o contraseña incorrecta' }
      guardarPaciente(d.token, d.usuario)
      return { success:true }
    } catch { return { success:false, message:'No se pudo conectar con el servidor (puerto 8080)' } }
  }

  const register = async (f) => {
    try {
      const r = await fetch(`${API}/api/auth/registro`, { method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ idusuario: Number(f.idusuario), nombre: f.nombre,
          apellido: f.apellido, email: f.email, contrasena: f.contrasena,
          tipodocumento: f.tipodocumento, fechanacimiento: f.fechanacimiento,
          tiposangre: f.tiposangre, telefono: f.telefono }) })
      const d = await r.json()
      if (!r.ok) return { success:false, message: d.error || 'Error al registrarse' }
      guardarPaciente(d.token, d.usuario)
      return { success:true }
    } catch { return { success:false, message:'No se pudo conectar con el servidor (puerto 8080)' } }
  }

  const loginCentro = async (nit, contrasena) => {
    try {
      const r = await fetch(`${API}/api/auth/centros/login`, { method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ nit, contrasena }) })
      const d = await r.json()
      if (!r.ok) return { success:false, message: d.error || 'NIT o contraseña incorrectos' }
      guardarCentro(d.token, d.centro)
      return { success:true }
    } catch { return { success:false, message:'No se pudo conectar con el servidor (puerto 8080)' } }
  }

  const registerCentro = async (f) => {
    try {
      const r = await fetch(`${API}/api/auth/centros/registro`, { method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ nit: f.nit, razonsocial: f.razonsocial, tipodocumento:'NIT',
          direccion: f.direccion, ciudad: f.ciudad, telefono: f.telefono, contrasena: f.contrasena }) })
      const d = await r.json()
      if (!r.ok) return { success:false, message: d.error || 'Error al registrarse' }
      guardarCentro(d.token, d.centro)
      return { success:true }
    } catch { return { success:false, message:'No se pudo conectar con el servidor (puerto 8080)' } }
  }

  const updateProfile = async (updates) => {
    try {
      const r = await fetch(`${API}/api/usuarios/${user.idusuario}`, { method:'PUT',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({ idusuario: user.idusuario, nombre: user.nombre,
          apellido: user.apellido, email: updates.email, telefono: updates.telefono,
          fechanacimiento: user.fechanacimiento, tiposangre: user.tiposangre,
          tipodocumento: user.tipodocumento,
          ...(updates.contrasena ? { contrasena: updates.contrasena } : {}) }) })
      const d = await r.json()
      if (!r.ok) return { success:false, message: d.error || 'No se pudo actualizar' }
      const u = { ...d, edad: calcEdad(d.fechanacimiento) }
      setUser(u); localStorage.setItem('vax_user', JSON.stringify(u))
      return { success:true }
    } catch { return { success:false, message:'No se pudo conectar con el servidor' } }
  }

  // Actualiza el contexto/localStorage del centro con los datos devueltos por el backend
  const updateCentro = (updated) => {
    const s = {
      nit:           updated.nit          ?? centro?.nit,
      razonsocial:   updated.razonsocial  ?? centro?.razonsocial,
      tipodocumento: updated.tipodocumento ?? centro?.tipodocumento,
      direccion:     updated.direccion    ?? centro?.direccion,
      ciudad:        updated.ciudad       ?? centro?.ciudad,
      telefono:      updated.telefono     ?? centro?.telefono,
      fecharegistro: updated.fecharegistro ?? centro?.fecharegistro
    }
    setCentro(s)
    localStorage.setItem('vax_centro', JSON.stringify(s))
  }

  const logout = () => {
    setUser(null); setCentro(null); setToken(null)
    localStorage.removeItem('vax_token')
    localStorage.removeItem('vax_user')
    localStorage.removeItem('vax_centro')
  }

  return (
    <AuthContext.Provider value={{ user, centro, token, loading, login, register, loginCentro, registerCentro, updateProfile, updateCentro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
