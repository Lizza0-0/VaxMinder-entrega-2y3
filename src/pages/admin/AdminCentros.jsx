import { useEffect, useState } from 'react'
import { adminService, centrosService } from '../../services/index'
import '../../styles/admin.css'

const FORM_VACIO = {
  nombrecentro: '', direccion: '', ciudad: '', telefono: '', tipocentro: ''
}

export const AdminCentros = () => {
  const [centros, setCentros]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editando, setEditando]   = useState(null)
  const [formData, setFormData]   = useState(FORM_VACIO)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  useEffect(() => {
    centrosService.obtenerCentros().then(data => {
      setCentros(data)
      setLoading(false)
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const abrirNuevo = () => {
    setEditando(null)
    setFormData(FORM_VACIO)
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  const abrirEditar = (c) => {
    setEditando(c.idcentro)
    setFormData({
      nombrecentro: c.nombrecentro,
      direccion:    c.direccion,
      ciudad:       c.ciudad,
      telefono:     c.telefono,
      tipocentro:   c.tipocentro
    })
    setError('')
    setSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelar = () => {
    setShowForm(false)
    setEditando(null)
    setFormData(FORM_VACIO)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.nombrecentro.trim()) { setError('El nombre del centro es requerido'); return }
    if (!formData.ciudad.trim())        { setError('La ciudad es requerida'); return }
    if (!formData.tipocentro)           { setError('El tipo de centro es requerido'); return }

    const payload = {
      nombrecentro: formData.nombrecentro.trim(),
      direccion:    formData.direccion.trim(),
      ciudad:       formData.ciudad.trim(),
      telefono:     formData.telefono.trim(),
      tipocentro:   formData.tipocentro
    }

    setSaving(true)
    try {
      if (editando) {
        const actualizado = await adminService.actualizarCentro(editando, payload)
        setCentros(prev => prev.map(c => c.idcentro === editando ? actualizado : c))
        setSuccess('Centro actualizado correctamente')
      } else {
        const nuevo = await adminService.agregarCentro(payload)
        setCentros(prev => [...prev, nuevo])
        setSuccess('Centro agregado correctamente')
      }
      setShowForm(false)
      setEditando(null)
      setFormData(FORM_VACIO)
    } catch (err) {
      setError(err.message || 'Error al guardar el centro')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-container"><p>Cargando...</p></div>

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Centros Médicos</h1>
        <p className="page-description">Administra los centros médicos registrados en la plataforma</p>
      </div>

      {success && <div className="success-message" style={{ marginBottom: '1rem' }}>{success}</div>}

      {showForm && (
        <div className="admin-form-box">
          <h3>{editando ? 'Editar Centro' : 'Agregar Nuevo Centro Médico'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del centro *</label>
                <input name="nombrecentro" value={formData.nombrecentro}
                  onChange={handleChange} placeholder="Ej: Hospital San Ignacio" />
              </div>
              <div className="form-group">
                <label>Tipo de centro *</label>
                <select name="tipocentro" value={formData.tipocentro} onChange={handleChange}>
                  <option value="">Seleccionar...</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Clínica">Clínica</option>
                  <option value="Centro de Salud">Centro de Salud</option>
                  <option value="IPS">IPS</option>
                  <option value="EPS">EPS</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ciudad *</label>
                <input name="ciudad" value={formData.ciudad}
                  onChange={handleChange} placeholder="Ej: Bogotá" />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input name="direccion" value={formData.direccion}
                  onChange={handleChange} placeholder="Ej: Cra 7 # 40-62" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input name="telefono" value={formData.telefono}
                  onChange={handleChange} placeholder="Ej: 6013208354" />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : editando ? 'Actualizar' : 'Agregar Centro'}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelar}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-section-header">
        <h2>Lista de Centros ({centros.length})</h2>
        {!showForm && (
          <button className="btn-primary" onClick={abrirNuevo}>+ Agregar Centro</button>
        )}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Ciudad</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {centros.map(c => (
              <tr key={c.idcentro}>
                <td><strong>{c.nombrecentro}</strong></td>
                <td>{c.tipocentro}</td>
                <td>{c.ciudad}</td>
                <td>{c.direccion || '—'}</td>
                <td>{c.telefono || '—'}</td>
                <td>
                  <button className="btn-table primary" onClick={() => abrirEditar(c)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
