import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restaurar sesión desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (documento) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(u => u.documento === documento)
    
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('currentUser', JSON.stringify(foundUser))
      return { success: true }
    }
    return { success: false, message: 'Documento no encontrado' }
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Validar que el documento no exista
    if (users.some(u => u.documento === userData.documento)) {
      return { success: false, message: 'El documento ya está registrado' }
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      registroDate: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    setUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
