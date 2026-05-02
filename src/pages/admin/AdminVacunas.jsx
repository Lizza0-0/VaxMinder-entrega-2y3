import { useEffect, useState } from 'react'
import { adminService, vacunasService } from '../../services/index'
import '../../styles/admin.css'

const FORM_VACIO = {
  nombrevacuna: '', descripcion: '', edadrecomendada: '', dosisrequeridas: '', intervaloentredosis: ''
}

export const AdminVacunas = () => {
  const [vacunas, setVacunas]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editando, setEditando]   = useState(null)
  const [formData, setFormData]   = useState(FORM_VACIO)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  useEffect(() => {
    vacunasService.obtenerVacunas().then(data => {
      setVacunas(data)
      setLoading(false)
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const abrirNueva = () => {
    setEditando(null)
    setFormData(FORM_VACIO)
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  const abrirEditar = (v) => {
    setEditando(v.idvacuna)
    setFormData({
      nombrevacuna:        v.nombrevacuna,
      descripcion:         v.descripcion,
      edadrecomendada:     String(v.edadrecomendada),
      dosisrequeridas:     String(v.dosisrequeridas),
      intervaloentredosis: String(v.intervaloentredosis)
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

    if (!formData.nombrevacuna.trim()) { setError('El nombre de la vacuna es requerido'); return }
    if (formData.edadrecomendada === '') { setError('La edad recomendada es requerida'); return }
    if (!formData.dosisrequeridas)       { setError('Las dosis requeridas son necesarias'); return }

    const payload = {
      nombrevacuna:        formData.nombrevacuna.trim(),
      descripcion:         formData.descripcion.trim(),
      edadrecomendada:     Number(formData.edadrecomendada),
      dosisrequeridas:     Number(formData.dosisrequeridas),
      intervaloentredosis: Number(formData.intervaloentredosis)
    }

    setSaving(true)
    try {
      if (editando) {
        const actualizada = await adminService.actualizarVacuna(editando, payload)
        setVacunas(prev => prev.map(v => v.idvacuna === editando ? actualizada : v))
        setSuccess('Vacuna actualizada correctamente')
      } else {
        const nueva = await adminService.agregarVacuna(payload)
        setVacunas(prev => [...prev, nueva])
        setSuccess('Vacuna agregada correctamente')
      }
      setShowForm(false)
      setEditando(null)
      setFormData(FORM_VACIO)
    } catch (err) {
      setError(err.message || 'Error al guardar la vacuna')
    } finally {
      setSaving(false)
    }
  }

  const fmtEdad = (meses) => {
    if (meses === 0) return 'Recién nacido'
    if (meses < 12)  return `${meses} meses`
    const anos = Math.floor(meses / 12)
    const m    = meses % 12
    return m === 0 ? `${anos} año${anos > 1 ? 's' : ''}` : `${anos} año${anos > 1 ? 's' : ''} ${m} mes${m > 1 ? 'es' : ''}`
  }

  if (loading) return <div className="admin-container"><p>Cargando...</p></div>

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Catálogo de Vacunas</h1>
        <p className="page-description">Agrega y edita las vacunas disponibles en el sistema</p>
      </div>

      {success && <div className="success-message" style={{ marginBottom: '1rem' }}>{success}</div>}

      {showForm && (
        <div className="admin-form-box">
          <h3>{editando ? 'Editar Vacuna' : 'Agregar Nueva Vacuna'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre de la vacuna *</label>
                <input name="nombrevacuna" value={formData.nombrevacuna}
                  onChange={handleChange} placeholder="Ej: BCG" />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input name="descripcion" value={formData.descripcion}
                  onChange={handleChange} placeholder="Breve descripción" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Edad recomendada (meses) *</label>
                <input type="number" name="edadrecomendada" value={formData.edadrecomendada}
                  onChange={handleChange} placeholder="0" min="0" />
              </div>
              <div className="form-group">
                <label>Dosis requeridas *</label>
                <input type="number" name="dosisrequeridas" value={formData.dosisrequeridas}
                  onChange={handleChange} placeholder="1" min="1" />
              </div>
              <div className="form-group">
                <label>Intervalo entre dosis (días)</label>
                <input type="number" name="intervaloentredosis" value={formData.intervaloentredosis}
                  onChange={handleChange} placeholder="0" min="0" />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : editando ? 'Actualizar' : 'Agregar Vacuna'}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelar}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-section-header">
        <h2>Lista de Vacunas ({vacunas.length})</h2>
        {!showForm && (
          <button className="btn-primary" onClick={abrirNueva}>+ Agregar Vacuna</button>
        )}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vacuna</th>
              <th>Descripción</th>
              <th>Edad recomendada</th>
              <th>Dosis</th>
              <th>Intervalo (días)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacunas.map(v => (
              <tr key={v.idvacuna}>
                <td><strong>{v.nombrevacuna}</strong></td>
                <td>{v.descripcion}</td>
                <td>{fmtEdad(v.edadrecomendada)}</td>
                <td>{v.dosisrequeridas}</td>
                <td>{v.intervaloentredosis || '—'}</td>
                <td>
                  <button className="btn-table primary" onClick={() => abrirEditar(v)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
