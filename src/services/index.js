// Servicios simulados (Mocks) para VaxMinder

export const usuariosService = {
  obtenerUsuarios: () => {
    return JSON.parse(localStorage.getItem('users') || '[]')
  },
  
  obtenerUsuarioPorDocumento: (documento) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    return users.find(u => u.documento === documento)
  }
}

export const carnetService = {
  obtenerCarnet: (usuarioId) => {
    const carnets = JSON.parse(localStorage.getItem('carnets') || '[]')
    return carnets.filter(c => c.usuarioId === usuarioId)
  },

  agregarVacunacion: (usuarioId, vacunacion) => {
    const carnets = JSON.parse(localStorage.getItem('carnets') || '[]')
    const newVacunacion = {
      id: Date.now(),
      usuarioId,
      ...vacunacion,
      fecha: new Date().toISOString()
    }
    carnets.push(newVacunacion)
    localStorage.setItem('carnets', JSON.stringify(carnets))
    return newVacunacion
  }
}

export const centrosService = {
  obtenerCentros: () => {
    const stored = localStorage.getItem('centros')
    if (stored) return JSON.parse(stored)
    
    const centrosMock = [
      {
        id: 1,
        nombre: 'Centro Médico San José',
        ubicacion: 'Calle Principal 123',
        telefono: '(555) 123-4567',
        horario: 'Lunes a Viernes 8:00 AM - 6:00 PM'
      },
      {
        id: 2,
        nombre: 'Clínica de Vacunación Central',
        ubicacion: 'Avenida Principal 456',
        telefono: '(555) 234-5678',
        horario: 'Lunes a Sábado 7:00 AM - 7:00 PM'
      },
      {
        id: 3,
        nombre: 'Instituto de Salud Preventiva',
        ubicacion: 'Carrera 10 789',
        telefono: '(555) 345-6789',
        horario: 'Lunes a Viernes 9:00 AM - 5:00 PM'
      }
    ]
    localStorage.setItem('centros', JSON.stringify(centrosMock))
    return centrosMock
  }
}

export const vacunasService = {
  obtenerVacunas: () => {
    const stored = localStorage.getItem('vacunas')
    if (stored) return JSON.parse(stored)
    
    const vacunasMock = [
      { id: 1, nombre: 'COVID-19', enfermedad: 'Coronavirus', dosis: 3 },
      { id: 2, nombre: 'Influenza', enfermedad: 'Gripe', dosis: 1 },
      { id: 3, nombre: 'Polio', enfermedad: 'Poliomielitis', dosis: 3 },
      { id: 4, nombre: 'Triple Viral', enfermedad: 'Sarampión, Paperas, Rubéola', dosis: 2 },
      { id: 5, nombre: 'Hepatitis B', enfermedad: 'Hepatitis B', dosis: 3 },
      { id: 6, nombre: 'DPT', enfermedad: 'Difteria, Pertosis, Tétanos', dosis: 3 }
    ]
    localStorage.setItem('vacunas', JSON.stringify(vacunasMock))
    return vacunasMock
  }
}

export const alertasService = {
  obtenerAlertas: (usuarioId) => {
    const alertas = JSON.parse(localStorage.getItem('alertas') || '[]')
    return alertas.filter(a => a.usuarioId === usuarioId)
  },

  crearAlerta: (usuarioId, vacunaId, fechaProxima) => {
    const alertas = JSON.parse(localStorage.getItem('alertas') || '[]')
    const newAlerta = {
      id: Date.now(),
      usuarioId,
      vacunaId,
      fechaProxima,
      tipo: 'vacunacion_proxima',
      leida: false
    }
    alertas.push(newAlerta)
    localStorage.setItem('alertas', JSON.stringify(alertas))
    return newAlerta
  }
}

export const historialService = {
  obtenerHistorial: (usuarioId) => {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]')
    return historial.filter(h => h.usuarioId === usuarioId)
  },

  agregarEntrada: (usuarioId, entrada) => {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]')
    const newEntrada = {
      id: Date.now(),
      usuarioId,
      ...entrada,
      fecha: new Date().toISOString()
    }
    historial.push(newEntrada)
    localStorage.setItem('historial', JSON.stringify(historial))
    return newEntrada
  }
}
