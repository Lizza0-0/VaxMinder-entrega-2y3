/**
 * EJEMPLOS DE INTEGRACIÓN - NUEVOS ENDPOINTS DE ANALÍTICA
 * 
 * Nota: No modificamos los archivos existentes, pero aquí muestras
 * exactamente cómo consumir los nuevos endpoints en cada página.
 */

// ═══════════════════════════════════════════════════════════════════════════
// 1. INTEGRACIÓN EN CarnetPage.jsx (Pacientes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Agregar este código a CarnetPage.jsx para consumir datos motivacionales
 * del paciente de forma personalizada
 */

// Dentro del componente CarnetPage, agregar estos estados:
const [datosMotivacionales, setDatosMotivacionales] = useState(null);
const [cargandoMotivacionales, setCargandoMotivacionales] = useState(false);
const [errorMotivacionales, setErrorMotivacionales] = useState('');

// Función para cargar datos motivacionales personalizados
const cargarDatosMotivacionales = async () => {
  if (!user || !user.idusuario) return;
  
  setCargandoMotivacionales(true);
  setErrorMotivacionales('');
  
  try {
    const response = await fetch(
      `http://localhost:8080/api/analitics/paciente/${user.idusuario}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Si tienes token en contexto
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const datos = await response.json();
    setDatosMotivacionales(datos);
    
  } catch (error) {
    console.error('Error cargando datos motivacionales:', error);
    setErrorMotivacionales('No se pudieron cargar los datos motivacionales');
  } finally {
    setCargandoMotivacionales(false);
  }
};

// Llamar cuando el componente se monta o cuando el usuario cambia
useEffect(() => {
  if (user) {
    cargarDatosMotivacionales();
  }
}, [user]);

// ── Renderizar los datos en JSX ──
return (
  <div className="carnet-container">
    {/* ... contenido existente ... */}
    
    {/* NUEVA SECCIÓN: Incentivos Personalizados */}
    {datosMotivacionales && (
      <div className="incentivos-container" style={{ marginTop: '2rem', padding: '1.5rem', 
        backgroundColor: '#f0f7ff', borderRadius: '0.5rem', borderLeft: '4px solid #0099ab' }}>
        
        <h3 style={{ color: '#0099ab', marginBottom: '1rem' }}>
          🎯 Tu Progreso de Vacunación
        </h3>
        
        {/* Progreso General */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>Completitud General</span>
            <span style={{ color: '#0099ab', fontWeight: 600 }}>
              {datosMotivacionales.progresoPaciente.porcentajeCompletitud}%
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '10px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '5px', 
            overflow: 'hidden' 
          }}>
            <div style={{
              width: `${datosMotivacionales.progresoPaciente.porcentajeCompletitud}%`,
              height: '100%',
              backgroundColor: '#6bcb77',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.3rem' }}>
            {datosMotivacionales.progresoPaciente.dosisAplicadas} de{' '}
            {datosMotivacionales.progresoPaciente.dosisRequeridas} dosis aplicadas
          </p>
        </div>
        
        {/* Mensaje Motivacional */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.3rem',
          marginBottom: '1.5rem',
          fontStyle: 'italic',
          color: '#333',
          borderLeft: '3px solid #ffd93d'
        }}>
          💪 {datosMotivacionales.mensaje}
        </div>
        
        {/* Comparativa por Vacuna */}
        <div>
          <h4 style={{ color: '#0099ab', marginBottom: '1rem' }}>
            Comparativa por Vacuna
          </h4>
          
          {datosMotivacionales.personasConMismasVacunas.map((vac, idx) => (
            <div key={idx} style={{
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.3rem'
            }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                {vac.nombrevacuna}
              </p>
              
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <p>✅ {vac.personasConMismaVacuna} personas se han vacunado con {vac.nombrevacuna}</p>
                <p>🎉 {vac.personasEsquemaCompleto} ya completaron su esquema</p>
                <p>📊 Tú ya tienes {vac.dosisAplicadas} de {vac.dosisRequeridas} dosis</p>
              </div>
              
              {vac.dosisAplicadas >= vac.dosisRequeridas && (
                <p style={{ color: '#6bcb77', fontWeight: 600, marginTop: '0.5rem' }}>
                  ✨ ¡Esquema completo para esta vacuna!
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    
    {cargandoMotivacionales && <p>Cargando datos motivacionales...</p>}
    {errorMotivacionales && <p style={{ color: 'red' }}>{errorMotivacionales}</p>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// 2. INTEGRACIÓN EN PortalCentroPage.jsx (Centros Médicos)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Agregar este código a PortalCentroPage.jsx para consumir datos de analítica
 * del centro médico
 */

// Dentro del componente PortalCentroPage, agregar estos estados:
const [estadisticasCentro, setEstadisticasCentro] = useState(null);
const [cargandoEstadisticas, setCargandoEstadisticas] = useState(false);
const [errorEstadisticas, setErrorEstadisticas] = useState('');

// Función para cargar estadísticas del centro
const cargarEstadisticasCentro = async () => {
  if (!centro || !centro.nit) return;
  
  // Obtener el idcentro del objeto centro o de los centros cargados
  let idcentroactual = null;
  if (centros && centros.length > 0) {
    const centroEncontrado = centros.find(c => 
      c.nombrecentro?.toLowerCase().trim() === centro?.razonsocial?.toLowerCase().trim()
    );
    idcentroactual = centroEncontrado?.idcentro;
  }
  
  if (!idcentroactual) return;
  
  setCargandoEstadisticas(true);
  setErrorEstadisticas('');
  
  try {
    const response = await fetch(
      `http://localhost:8080/api/analitics/centro/${idcentroactual}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const datos = await response.json();
    setEstadisticasCentro(datos);
    
  } catch (error) {
    console.error('Error cargando estadísticas del centro:', error);
    setErrorEstadisticas('No se pudieron cargar las estadísticas');
  } finally {
    setCargandoEstadisticas(false);
  }
};

// Llamar cuando el componente se monta o cuando cambia el centro
useEffect(() => {
  if (centro && centros && centros.length > 0) {
    cargarEstadisticasCentro();
  }
}, [centro, centros]);

// ── Renderizar en JSX ──
return (
  <div className="portal-centro-container">
    {/* ... contenido existente ... */}
    
    {/* NUEVA SECCIÓN: Estadísticas del Centro */}
    {estadisticasCentro && (
      <div className="estadisticas-centro" style={{
        marginTop: '2rem',
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '0.5rem',
        border: '1px solid #ddd'
      }}>
        
        <h3 style={{ color: '#1a3a5c', marginBottom: '1.5rem' }}>
          📊 Estadísticas de tu Centro Médico
        </h3>
        
        {/* KPIs Principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Personas Vacunadas</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0099ab' }}>
              {estadisticasCentro.personasVacunadas}
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Total Dosis Aplicadas</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6bcb77' }}>
              {estadisticasCentro.totalDosis}
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Promedio Dosis/Persona</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffd93d' }}>
              {estadisticasCentro.promedioDosis.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Vacunas Más Aplicadas */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem'
        }}>
          <h4 style={{ color: '#1a3a5c', marginBottom: '1rem' }}>
            🏆 Top 5 Vacunas Más Aplicadas
          </h4>
          
          {estadisticasCentro.vacunasMasAplicadas && estadisticasCentro.vacunasMasAplicadas.length > 0 ? (
            <div>
              {estadisticasCentro.vacunasMasAplicadas.map((vacuna, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '30px',
                      height: '30px',
                      backgroundColor: ['#0099ab', '#6bcb77', '#ffd93d', '#ff6b6b', '#aaa'][idx],
                      borderRadius: '50%',
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: '30px',
                      marginRight: '1rem',
                      fontWeight: 'bold'
                    }}>
                      {idx + 1}
                    </span>
                    <span>{vacuna.vacuna}</span>
                  </span>
                  <span style={{
                    fontWeight: 'bold',
                    color: '#0099ab',
                    fontSize: '1.1rem'
                  }}>
                    {vacuna.cantidad}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999' }}>Sin datos disponibles</p>
          )}
        </div>
      </div>
    )}
    
    {cargandoEstadisticas && <p>Cargando estadísticas del centro...</p>}
    {errorEstadisticas && <p style={{ color: 'red' }}>{errorEstadisticas}</p>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// 3. SERVICIO REUTILIZABLE (services/analitics.js)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Crear un archivo: Frontend con Backend/src/services/analitics.js
 * Para centralizar las llamadas a la nueva API de analítica
 */

const API = 'http://localhost:8080/api';

const analiticsService = {
  /**
   * Obtiene datos motivacionales personalizados del paciente
   */
  obtenerDatosMotivacionalesPaciente: async (idusuario, token) => {
    const response = await fetch(
      `${API}/analitics/paciente/${idusuario}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    return response.json();
  },
  
  /**
   * Obtiene estadísticas del centro médico
   */
  obtenerEstadisticasCentro: async (idcentro, token) => {
    const response = await fetch(
      `${API}/analitics/centro/${idcentro}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    return response.json();
  }
};

export default analiticsService;

// Uso en componentes:
// import analiticsService from '../services/analitics';
// const datos = await analiticsService.obtenerDatosMotivacionalesPaciente(id, token);

// ═══════════════════════════════════════════════════════════════════════════
// 4. ESTILOS CSS RECOMENDADOS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Agregar a styles/carnet.css o styles/portal-centro.css
 */

/* Contenedor de incentivos para pacientes */
.incentivos-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f0f7ff;
  border-radius: 0.5rem;
  border-left: 4px solid #0099ab;
}

.incentivos-container h3 {
  color: #0099ab;
  margin-bottom: 1rem;
}

.progreso-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progreso-bar-fill {
  height: 100%;
  background-color: #6bcb77;
  transition: width 0.3s ease;
}

.vacuna-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.3rem;
}

/* Contenedor de estadísticas para centros */
.estadisticas-centro {
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
}

.kpi-card {
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.kpi-card p:first-child {
  color: #999;
  font-size: 0.9rem;
}

.kpi-card p:last-child {
  font-size: 2rem;
  font-weight: bold;
}
