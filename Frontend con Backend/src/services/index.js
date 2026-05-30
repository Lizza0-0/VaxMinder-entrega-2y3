const API = 'http://localhost:8080'

const authHdr = () => ({ 'Authorization': `Bearer ${localStorage.getItem('vax_token') || ''}` })
const jsonHdr = () => ({ 'Content-Type': 'application/json', ...authHdr() })

// ── Vacunas catálogo (público, no requiere token) ─────────────
// GET /api/vacunascatalogo
// Response: [{ idvacuna, nombrevacuna, descripcion, edadrecomendada, dosisrequeridas, intervalodosisdias, requiererefuerzo }]
export const vacunasService = {
  obtenerVacunas: async () => {
    const r = await fetch(`${API}/api/vacunascatalogo`)
    if (!r.ok) throw new Error('Error al obtener vacunas')
    return r.json()
  },
  // GET /api/vacunascatalogo/sugeridas/{idusuario}
  // Response: { edad: Integer, vacunas: [...] }
  obtenerSugeridas: async (idusuario) => {
    const r = await fetch(`${API}/api/vacunascatalogo/sugeridas/${idusuario}`, { headers: authHdr() })
    if (!r.ok) throw new Error('Error al obtener sugeridas')
    return r.json()
  }
}

// ── Centros Médicos catálogo (público, no requiere token) ─────
// GET /api/centrosmedicos
// Response: [{ idcentro, nombrecentro, direccion, ciudad, telefono, tipocentro }]
export const centrosService = {
  obtenerCentros: async () => {
    const r = await fetch(`${API}/api/centrosmedicos`)
    if (!r.ok) throw new Error('Error al obtener centros')
    return r.json()
  }
}

// ── Registro de vacunación (requiere token) ───────────────────
// GET /api/registrovacunacion/usuario/{idusuario}
// Response: [{ idregistro, idusuario{...}, idvacuna{idvacuna,nombrevacuna,...},
//             fechaaplicacion, numerodosis, lotevacuna, idcentromedico{...},
//             observaciones, proximadosisfecha, laboratorio, ipsvacunadora,
//             nombrevacunador, nitcentroregistrador,
//             pacientenombre, pacienteapellido, pacientetipodoc, pacientenumerodoc,
//             pacientetelefono, pacientecorreo, pacientedireccion, pacienteciudad }]
export const carnetService = {
  obtenerCarnet: async (idusuario) => {
    const r = await fetch(`${API}/api/registrovacunacion/usuario/${idusuario}`, { headers: authHdr() })
    if (!r.ok) throw new Error('Error al obtener carnet')
    return r.json()
  }
}

// POST /api/registrovacunacion (requiere token)
// Body exacto: RegistroVacunacionDTO
export const registroVacunacionService = {
  registrar: async (payload) => {
    const r = await fetch(`${API}/api/registrovacunacion`, {
      method: 'POST', headers: jsonHdr(), body: JSON.stringify(payload)
    })
    if (!r.ok) {
      const d = await r.json().catch(() => ({}))
      throw new Error(d.error || `Error ${r.status}`)
    }
    return r.json()
  }
}

// ── Alertas (requiere token) ──────────────────────────────────
// GET /api/alertas/usuario/{idusuario}
// Response: [{ idalerta, idusuario{idusuario,nombre,apellido,...},
//             idregistro{...}, tipoalerta, fechaalerta, mensaje, estado, fechaenvio }]
export const alertasService = {
  obtenerAlertas: async (idusuario) => {
    const r = await fetch(`${API}/api/alertas/usuario/${idusuario}`, { headers: authHdr() })
    if (!r.ok) throw new Error('Error al obtener alertas')
    return r.json()
  }
}

// ── Historial PDF (requiere token) ────────────────────────────
// GET /api/historialpdf/usuario/{idusuario}
// Response: [{ idhistorial, idusuario{...}, fechageneracion, nombrearchivo, rutaarchivo }]
// POST /api/historialpdf
// Body: { idusuario: Integer, nombrearchivo: String, rutaarchivo: String }
export const historialService = {
  obtenerHistorial: async (idusuario) => {
    const r = await fetch(`${API}/api/historialpdf/usuario/${idusuario}`, { headers: authHdr() })
    if (!r.ok) throw new Error('Error al obtener historial')
    return r.json()
  },
  guardarHistorial: async (idusuario, _blob, nombrearchivo) => {
    const r = await fetch(`${API}/api/historialpdf`, {
      method: 'POST', headers: jsonHdr(),
      body: JSON.stringify({ idusuario, nombrearchivo, rutaarchivo: `/pdf/${nombrearchivo}` })
    })
    if (!r.ok) { const t = await r.text().catch(() => ''); throw new Error(`Error ${r.status}: ${t}`) }
    return r.json()
  }
}
