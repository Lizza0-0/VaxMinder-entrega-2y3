const BASE_URL = 'http://localhost:8080/api'

const authHeader = () => {
  const token = localStorage.getItem('vax_token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...authHeader()
})

// ─── centrosService ───────────────────────────────────────────────────────────

export const centrosService = {
  obtenerCentros: async () => {
    const res = await fetch(`${BASE_URL}/centrosmedicos`, { headers: authHeader() })
    if (!res.ok) throw new Error('Error al obtener centros')
    return res.json()
  }
}

// ─── vacunasService ───────────────────────────────────────────────────────────

export const vacunasService = {
  obtenerVacunas: async () => {
    const res = await fetch(`${BASE_URL}/vacunascatalogo`, { headers: authHeader() })
    if (!res.ok) throw new Error('Error al obtener vacunas')
    return res.json()
  },

  obtenerSugeridas: async (idusuario) => {
    const res = await fetch(`${BASE_URL}/vacunascatalogo/sugeridas/${idusuario}`, { headers: authHeader() })
    if (!res.ok) return { vacunas: [] }
    return res.json()
  }
}

// ─── carnetService ────────────────────────────────────────────────────────────

export const carnetService = {
  obtenerCarnet: async (idusuario) => {
    const res = await fetch(`${BASE_URL}/registrovacunacion/usuario/${idusuario}`, { headers: authHeader() })
    if (!res.ok) throw new Error('Error al obtener carnet')
    return res.json()
  },

  agregarVacunacion: async (idusuario, v) => {
    const payload = {
      idusuario:        idusuario,
      idvacuna:         v.vacunaId,
      fechaaplicacion:  v.fecha,
      numerodosis:      v.dosis,
      lotevacuna:       v.lote,
      observaciones:    v.observaciones || '',
      proximadosisfecha: v.fechaProxima || null,
      idcentromedico:   v.centroId || null
    }
    const res = await fetch(`${BASE_URL}/registrovacunacion`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al registrar vacunación')
    }
    return res.json()
  }
}

// ─── alertasService ───────────────────────────────────────────────────────────

export const alertasService = {
  obtenerAlertas: async (idusuario) => {
    const res = await fetch(`${BASE_URL}/alertas/usuario/${idusuario}`, { headers: authHeader() })
    if (!res.ok) throw new Error('Error al obtener alertas')
    return res.json()
  }
}

// ─── adminService ─────────────────────────────────────────────────────────────

export const adminService = {
  obtenerUsuarios: async () => {
    const res = await fetch(`${BASE_URL}/usuarios`, { headers: authHeader() })
    if (!res.ok) throw new Error('Error al obtener usuarios')
    const todos = await res.json()
    return todos.filter(u => u.rol !== 'admin')
  },

  eliminarUsuario: async (idusuario) => {
    const res = await fetch(`${BASE_URL}/usuarios/${idusuario}`, {
      method: 'DELETE',
      headers: authHeader()
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al eliminar usuario')
    }
    return res.json()
  },

  actualizarUsuario: async (idusuario, updates) => {
    const res = await fetch(`${BASE_URL}/usuarios/${idusuario}`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify(updates)
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al actualizar usuario')
    }
    return res.json()
  },

  agregarVacuna: async (vacuna) => {
    const payload = {
      nombrevacuna:       vacuna.nombrevacuna,
      descripcion:        vacuna.descripcion,
      edadrecomendada:    vacuna.edadrecomendada ? parseInt(vacuna.edadrecomendada) : null,
      dosisrequeridas:    parseInt(vacuna.dosisrequeridas),
      intervalodosisdias: vacuna.intervalodosisdias != null ? parseInt(vacuna.intervalodosisdias) : null,
      requiererefuerzo:   vacuna.requiererefuerzo || false
    }
    const res = await fetch(`${BASE_URL}/vacunascatalogo`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al agregar vacuna')
    }
    return res.json()
  },

  actualizarVacuna: async (idvacuna, updates) => {
    const payload = {
      ...updates,
      edadrecomendada:    updates.edadrecomendada ? parseInt(updates.edadrecomendada) : null,
      dosisrequeridas:    parseInt(updates.dosisrequeridas),
      intervalodosisdias: updates.intervalodosisdias ? parseInt(updates.intervalodosisdias) : null
    }
    const res = await fetch(`${BASE_URL}/vacunascatalogo/${idvacuna}`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al actualizar vacuna')
    }
    return res.json()
  },

  agregarCentro: async (centro) => {
    const res = await fetch(`${BASE_URL}/centrosmedicos`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(centro)
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al agregar centro')
    }
    return res.json()
  },

  actualizarCentro: async (idcentro, updates) => {
    const res = await fetch(`${BASE_URL}/centrosmedicos/${idcentro}`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify(updates)
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al actualizar centro')
    }
    return res.json()
  }
}

// ─── historialService ─────────────────────────────────────────────────────────

export const historialService = {
  obtenerHistorial: async (idusuario) => {
    const res = await fetch(`${BASE_URL}/historialpdf/usuario/${idusuario}`, { headers: authHeader() })
    if (!res.ok) throw new Error('Error al obtener historial')
    return res.json()
  },

  guardarHistorial: async (idusuario, _archivo, nombreArchivo) => {
    const payload = {
      idusuario,
      nombrearchivo: nombreArchivo,
      rutaarchivo:   `/pdf/${nombreArchivo}`
    }
    const res = await fetch(`${BASE_URL}/historialpdf`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Error al guardar historial')
    return res.json()
  }
}
