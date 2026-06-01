import { useEffect, useState } from 'react'
import '../styles/dashboard.css'

const GRAFICAS = [
  {
    src: '/src/assets/graficos/barras_vacunaciones.png',
    titulo: 'Vacunaciones por tipo de vacuna',
    conclusion:
      'Identifica cuáles vacunas tienen mayor demanda en la plataforma y cuáles requieren mayor promoción.',
  },
  {
    src: '/src/assets/graficos/torta_dosis.png',
    titulo: 'Distribución por número de dosis',
    conclusion:
      'Muestra qué proporción de registros corresponde a primeras dosis frente a dosis de refuerzo.',
  },
  {
    src: '/src/assets/graficos/lineas_vacunaciones_tiempo.png',
    titulo: 'Evolución temporal de vacunaciones',
    conclusion:
      'Permite identificar picos de demanda y períodos de baja cobertura vacunal a lo largo del tiempo.',
  },
  {
    src: '/src/assets/graficos/barras_alertas_estado.png',
    titulo: 'Alertas por estado',
    conclusion:
      'Revela la distribución de alertas según el estado de cumplimiento de esquemas de vacunación.',
  },
]

export const AnalyticsDashboardPage = () => {
  const [resumen, setResumen] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/src/assets/data/kpis.json')
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setResumen)
      .catch(() => setError(true))
  }, [])

  const kpis = resumen
    ? [
        {
          icono: '💉',
          valor: resumen.total_vacunaciones,
          etiqueta: 'Registros de vacunación',
        },
        {
          icono: '👥',
          valor: resumen.total_personas_vacunadas,
          etiqueta: 'Personas vacunadas',
        },
        {
          icono: '✅',
          valor: resumen.total_personas_esquema_completo,
          etiqueta: 'Esquema completo',
        },
        {
          icono: '📋',
          valor: resumen.total_vacunas_catalogo,
          etiqueta: 'Vacunas en catálogo',
        },
        {
          icono: '⚠️',
          valor: resumen.alertas_pendientes,
          etiqueta: 'Alertas pendientes',
        },
        {
          icono: '🏥',
          valor: resumen.total_centros,
          etiqueta: 'Centros médicos',
        },
      ]
    : []

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <p className="page-subtitle">Análisis de Datos</p>
        <h1>Dashboard Analítico</h1>
        <p>Indicadores y gráficas generadas a partir de los registros de vacunación</p>
      </div>

      {/* KPI Cards */}
      {error && (
        <div className="dashboard-section" style={{ textAlign: 'center', color: '#ef4444' }}>
          <p>
            No se encontraron datos. Ejecuta primero el script Python (<code>main.py</code>) para
            generar los archivos de análisis.
          </p>
        </div>
      )}

      {resumen && (
        <div className="dashboard-grid">
          {kpis.map((kpi, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{kpi.icono}</div>
              <div className="stat-content">
                <h3>{kpi.valor}</h3>
                <p>{kpi.etiqueta}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gráficas */}
      <div className="dashboard-section">
        <h2>Gráficas de análisis</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Generadas con Python (Matplotlib / Seaborn) a partir de los datos consumidos de la API REST.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
            gap: '2rem',
          }}
        >
          {GRAFICAS.map((g, i) => (
            <div
              key={i}
              style={{
                background: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
              }}
            >
              <img
                src={g.src}
                alt={g.titulo}
                style={{ width: '100%', display: 'block' }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div
                style={{
                  display: 'none',
                  height: '200px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  background: '#f8fafc',
                }}
              >
                Gráfica no generada aún — ejecuta main.py
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', color: '#1e293b' }}>
                  {g.titulo}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                  <strong>Conclusión:</strong> {g.conclusion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros aplicados */}
      <div className="dashboard-section">
        <h2>Filtros de negocio aplicados</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Filtro 1</label>
            <p>Registros de dosis de refuerzo (numerodosis &gt; 1)</p>
          </div>
          <div className="info-item">
            <label>Filtro 2</label>
            <p>Vacunaciones realizadas desde 2025 (año_aplicacion &ge; 2025)</p>
          </div>
          <div className="info-item">
            <label>Filtro 3</label>
            <p>Vacunas que requieren refuerzo Y múltiples dosis</p>
          </div>
          <div className="info-item">
            <label>Filtro 4</label>
            <p>Vacunas con intervalo entre dosis mayor a 30 días</p>
          </div>
          <div className="info-item">
            <label>Filtro 5</label>
            <p>Registros con próxima dosis en los siguientes 60 días</p>
          </div>
        </div>
      </div>
    </div>
  )
}
