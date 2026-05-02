// ============================================================
// VaxMinder – services/index.js  (localStorage, sin backend)
// Todas las variables mantienen el mismo nombre que antes.
// ============================================================

// ─── Datos semilla ───────────────────────────────────────────────────────────

const CENTROS_SEMILLA = [
  { idcentro: 1, nombrecentro: 'Hospital San Ignacio', direccion: 'Cra 7 # 40-62', ciudad: 'Bogotá', telefono: '6013208354', tipocentro: 'Hospital' },
  { idcentro: 2, nombrecentro: 'Clínica Las Américas', direccion: 'Diagonal 75B # 2A-80', ciudad: 'Medellín', telefono: '6046341900', tipocentro: 'Clínica' },
  { idcentro: 3, nombrecentro: 'Centro de Salud El Poblado', direccion: 'Cra 43A # 10-5', ciudad: 'Medellín', telefono: '6044441234', tipocentro: 'Centro de Salud' },
  { idcentro: 4, nombrecentro: 'Hospital Universitario del Valle', direccion: 'Cll 5 # 36-08', ciudad: 'Cali', telefono: '6023547300', tipocentro: 'Hospital' },
  { idcentro: 5, nombrecentro: 'IPS Comfenalco Cartagena', direccion: 'Av El Lago # 38-90', ciudad: 'Cartagena', telefono: '6056601111', tipocentro: 'IPS' }
]

const VACUNAS_SEMILLA = [
  { idvacuna: 1, nombrevacuna: 'BCG', descripcion: 'Protege contra la tuberculosis', edadrecomendada: 0, dosisrequeridas: 1, intervaloentredosis: 0 },
  { idvacuna: 2, nombrevacuna: 'Hepatitis B', descripcion: 'Previene la hepatitis B', edadrecomendada: 0, dosisrequeridas: 3, intervaloentredosis: 30 },
  { idvacuna: 3, nombrevacuna: 'Pentavalente (DPT+HiB+HepB)', descripcion: 'Difteria, Tos ferina, Tétanos, Hib, Hepatitis B', edadrecomendada: 2, dosisrequeridas: 3, intervaloentredosis: 60 },
  { idvacuna: 4, nombrevacuna: 'Polio (IPV)', descripcion: 'Previene la poliomielitis', edadrecomendada: 2, dosisrequeridas: 4, intervaloentredosis: 60 },
  { idvacuna: 5, nombrevacuna: 'Rotavirus', descripcion: 'Previene gastroenteritis por rotavirus', edadrecomendada: 2, dosisrequeridas: 2, intervaloentredosis: 60 },
  { idvacuna: 6, nombrevacuna: 'Neumococo', descripcion: 'Previene neumonía, meningitis y otitis', edadrecomendada: 2, dosisrequeridas: 3, intervaloentredosis: 60 },
  { idvacuna: 7, nombrevacuna: 'Influenza', descripcion: 'Gripa estacional', edadrecomendada: 6, dosisrequeridas: 1, intervaloentredosis: 365 },
  { idvacuna: 8, nombrevacuna: 'Triple Viral (MMR)', descripcion: 'Sarampión, Paperas, Rubéola', edadrecomendada: 12, dosisrequeridas: 2, intervaloentredosis: 90 },
  { idvacuna: 9, nombrevacuna: 'Varicela', descripcion: 'Previene la varicela (chickenpox)', edadrecomendada: 12, dosisrequeridas: 2, intervaloentredosis: 90 },
  { idvacuna: 10, nombrevacuna: 'Fiebre Amarilla', descripcion: 'Obligatoria para zonas tropicales', edadrecomendada: 12, dosisrequeridas: 1, intervaloentredosis: 0 },
  { idvacuna: 11, nombrevacuna: 'VPH (Papiloma)', descripcion: 'Previene el Virus del Papiloma Humano', edadrecomendada: 144, dosisrequeridas: 2, intervaloentredosis: 180 },
  { idvacuna: 12, nombrevacuna: 'Tétanos y Difteria (Td)', descripcion: 'Refuerzo para adultos', edadrecomendada: 120, dosisrequeridas: 3, intervaloentredosis: 365 },
  { idvacuna: 13, nombrevacuna: 'COVID-19', descripcion: 'Vacuna contra el coronavirus SARS-CoV-2', edadrecomendada: 60, dosisrequeridas: 2, intervaloentredosis: 28 }
]

// ─── helpers ─────────────────────────────────────────────────────────────────

const initSemilla = () => {
  if (!localStorage.getItem('vax_centros'))
    localStorage.setItem('vax_centros', JSON.stringify(CENTROS_SEMILLA))
  if (!localStorage.getItem('vax_vacunas'))
    localStorage.setItem('vax_vacunas', JSON.stringify(VACUNAS_SEMILLA))
}

initSemilla()

const getLS = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback }
}
const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const delay = (ms = 50) => new Promise(r => setTimeout(r, ms))

// ─── centrosService ───────────────────────────────────────────────────────────

export const centrosService = {
  obtenerCentros: async () => {
    await delay()
    return getLS('vax_centros')
  }
}

// ─── vacunasService ───────────────────────────────────────────────────────────

export const vacunasService = {
  obtenerVacunas: async () => {
    await delay()
    return getLS('vax_vacunas')
  },
  obtenerSugeridas: async (cedula) => {
    await delay()
    const userRaw = localStorage.getItem('vax_user')
    if (!userRaw) return { vacunas: [] }
    const usr = JSON.parse(userRaw)
    if (!usr.fechanacimiento) return { vacunas: [] }

    const hoy = new Date()
    const nac = new Date(usr.fechanacimiento)
    const meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())

    const todas = getLS('vax_vacunas')
    const carnet = getLS(`vax_carnet_${cedula}`)
    const yaAplicadas = new Set(carnet.map(r => r.idvacuna))

    const sugeridas = todas
      .filter(v => meses >= v.edadrecomendada && !yaAplicadas.has(v.idvacuna))
      .map(v => ({
        id_vacuna:        v.idvacuna,
        nombre_vacuna:    v.nombrevacuna,
        descripcion:      v.descripcion,
        dosis_requeridas: v.dosisrequeridas
      }))

    return { vacunas: sugeridas }
  }
}

// ─── carnetService ────────────────────────────────────────────────────────────

export const carnetService = {
  obtenerCarnet: async (cedula) => {
    await delay()
    return getLS(`vax_carnet_${cedula}`)
  },
  agregarVacunacion: async (cedula, v) => {
    await delay()
    const carnet = getLS(`vax_carnet_${cedula}`)
    const nuevo = {
      idregistro:       Date.now(),
      idusuario:        cedula,
      idvacuna:         v.vacunaId,
      fechaaplicacion:  v.fecha,
      numerodosis:      v.dosis,
      lotevacuna:       v.lote,
      observaciones:    v.observaciones || '',
      proximadosisfecha: v.fechaProxima,
      idcentromedico:   v.centroId
    }
    setLS(`vax_carnet_${cedula}`, [...carnet, nuevo])

    // Genera alerta automática igual que el backend
    if (v.fechaProxima) {
      const vacuna = getLS('vax_vacunas').find(vac => vac.idvacuna === v.vacunaId)
      const nombreVacuna = vacuna ? vacuna.nombrevacuna : 'vacuna'
      const alertas = getLS(`vax_alertas_${cedula}`)
      const nuevaAlerta = {
        idalerta:    Date.now() + 1,
        idusuario:   cedula,
        mensaje:     `Recuerda aplicarte la próxima dosis de ${nombreVacuna}`,
        fechaalerta: v.fechaProxima,
        estado:      'pendiente'
      }
      setLS(`vax_alertas_${cedula}`, [...alertas, nuevaAlerta])
    }

    return nuevo
  }
}

// ─── alertasService ───────────────────────────────────────────────────────────

export const alertasService = {
  obtenerAlertas: async (cedula) => {
    await delay()
    return getLS(`vax_alertas_${cedula}`)
  }
}

// ─── adminService ─────────────────────────────────────────────────────────────

export const adminService = {
  obtenerUsuarios: async () => {
    await delay()
    const usuarios = getLS('vax_usuarios', [])
    return usuarios.filter(u => u.rol !== 'admin')
  },

  actualizarUsuario: async (idusuario, updates) => {
    await delay()
    const usuarios = getLS('vax_usuarios', [])
    const idx = usuarios.findIndex(u => Number(u.idusuario) === Number(idusuario))
    if (idx === -1) throw new Error('Usuario no encontrado')
    usuarios[idx] = { ...usuarios[idx], ...updates }
    setLS('vax_usuarios', usuarios)
    return usuarios[idx]
  },

  agregarVacuna: async (vacuna) => {
    await delay()
    const vacunas = getLS('vax_vacunas', [])
    const nueva = { ...vacuna, idvacuna: Date.now() }
    setLS('vax_vacunas', [...vacunas, nueva])
    return nueva
  },

  actualizarVacuna: async (idvacuna, updates) => {
    await delay()
    const vacunas = getLS('vax_vacunas', [])
    const idx = vacunas.findIndex(v => v.idvacuna === idvacuna)
    if (idx === -1) throw new Error('Vacuna no encontrada')
    vacunas[idx] = { ...vacunas[idx], ...updates }
    setLS('vax_vacunas', vacunas)
    return vacunas[idx]
  },

  agregarCentro: async (centro) => {
    await delay()
    const centros = getLS('vax_centros', [])
    const nuevo = { ...centro, idcentro: Date.now() }
    setLS('vax_centros', [...centros, nuevo])
    return nuevo
  },

  actualizarCentro: async (idcentro, updates) => {
    await delay()
    const centros = getLS('vax_centros', [])
    const idx = centros.findIndex(c => c.idcentro === idcentro)
    if (idx === -1) throw new Error('Centro no encontrado')
    centros[idx] = { ...centros[idx], ...updates }
    setLS('vax_centros', centros)
    return centros[idx]
  }
}

// ─── historialService ─────────────────────────────────────────────────────────

export const historialService = {
  obtenerHistorial: async (cedula) => {
    await delay()
    return getLS(`vax_historial_${cedula}`)
  },
  guardarHistorial: async (cedula, archivo, nombreArchivo) => {
    await delay()
    const historial = getLS(`vax_historial_${cedula}`)
    const nuevo = {
      idhistorial:      Date.now(),
      idusuario:        cedula,
      nombrearchivo:    nombreArchivo,
      rutaarchivo:      `/pdf/${nombreArchivo}`,
      fechageneracion:  new Date().toISOString()
    }
    setLS(`vax_historial_${cedula}`, [...historial, nuevo])
    return nuevo
  }
}
