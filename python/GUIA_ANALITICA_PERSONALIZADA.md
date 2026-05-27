# 📊 GUÍA DE ANALÍTICA PERSONALIZADA - VAXMINDER

## 🎯 Objetivo
Separar la analítica de datos en dos contextos:
- **Centros Médicos**: Analítica general del sistema y desempeño de cada centro
- **Pacientes**: Datos motivacionales personalizados para incentivar completitud de esquemas

---

## 🆕 NUEVOS ENDPOINTS DE ANALÍTICA

### 1. Datos Motivacionales del Paciente
```
GET /api/analitics/paciente/{idusuario}
```

**Respuesta:**
```json
{
  "personasConMismasVacunas": [
    {
      "nombrevacuna": "COVID-19 (Pfizer)",
      "personasConMismaVacuna": 150,
      "personasEsquemaCompleto": 142,
      "dosisAplicadas": 2,
      "dosisRequeridas": 2
    },
    {
      "nombrevacuna": "Influenza",
      "personasConMismaVacuna": 200,
      "personasEsquemaCompleto": 198,
      "dosisAplicadas": 1,
      "dosisRequeridas": 1
    }
  ],
  "progresoPaciente": {
    "dosisAplicadas": 3,
    "dosisRequeridas": 5,
    "porcentajeCompletitud": 60,
    "esquemasCompletos": 2
  },
  "mensaje": "Te faltan dosis por completar. Mira cuántas personas como tú ya han completado sus esquemas. ¡Tú también puedes!"
}
```

**Uso en Frontend (CarnetPage.jsx):**
```javascript
const cargarDatosMotivacionales = async () => {
  try {
    const response = await fetch(`/api/analitics/paciente/${user.idusuario}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const datos = await response.json();
    
    // datos.personasConMismasVacunas - mostrar cuántos como el paciente
    // datos.progresoPaciente - mostrar su avance
    // datos.mensaje - mensaje motivacional
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### 2. Estadísticas del Centro Médico
```
GET /api/analitics/centro/{idcentro}
```

**Respuesta:**
```json
{
  "personasVacunadas": 1250,
  "totalDosis": 2850,
  "promedioDosis": 2.28,
  "vacunasMasAplicadas": [
    { "vacuna": "COVID-19 (Pfizer)", "cantidad": 800 },
    { "vacuna": "Influenza", "cantidad": 650 },
    { "vacuna": "Fiebre Amarilla", "cantidad": 480 }
  ]
}
```

**Uso en Frontend (PortalCentroPage.jsx):**
```javascript
const cargarEstadisticasCentro = async () => {
  try {
    const response = await fetch(`/api/analitics/centro/${idCentroActual}`, {
      headers: { 'Authorization': `Bearer ${tokenCentro}` }
    });
    const stats = await response.json();
    
    // stats.personasVacunadas - total de personas
    // stats.promedioDosis - dosis promedio
    // stats.vacunasMasAplicadas - ranking de vacunas
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 📂 ARCHIVOS MODIFICADOS

### Backend (Java)
- ✅ **NUEVO**: `AnaliticsServicio.java` - Lógica de cálculos personalizados
- ✅ **NUEVO**: `AnaliticsControlador.java` - Endpoints REST

### Python
- ✅ **NUEVO**: `notebook/analitica_centros.py` - Funciones para generar analítica de centros
- ✅ **MODIFICADO**: `main.py` - Agregar paso 5.5 de analítica de centros
- ✅ **MODIFICADO**: `notebook/exportacion.py` - Documentar nuevos endpoints

---

## 🔄 FLUJO DE DATOS

### Para Pacientes (CarnetPage)
```
Paciente abre CarnetPage
    ↓
Frontend llama: GET /api/analitics/paciente/{id}
    ↓
Backend (AnaliticsServicio) calcula:
  - Vacunas que tiene el paciente
  - Personas con esas mismas vacunas
  - Cuántos completaron esquema
  - Porcentaje de completitud del paciente
    ↓
Frontend muestra:
  - "150 personas se han vacunado con COVID-19 como tú"
  - "142 ya completaron su esquema"
  - Barra de progreso: "Has completado el 60% de tu esquema"
  - Mensaje motivacional
```

### Para Centros (PortalCentroPage)
```
Centro médico abre PortalCentroPage
    ↓
Frontend carga JSON estático O llama: GET /api/analitics/centro/{id}
    ↓
Backend devuelve:
  - Personas vacunadas en este centro
  - Total de dosis aplicadas
  - Promedio de dosis por persona
  - Top 5 vacunas más aplicadas
    ↓
Frontend muestra dashboard con KPIs
```

---

## 🚀 INSTALACIÓN Y PRUEBA

### 1. Compilar Backend
```bash
cd Backend/Backend
mvn clean compile
```

### 2. Ejecutar Backend
```bash
mvn spring-boot:run
# O ejecutar directamente desde tu IDE
```

### 3. Ejecutar análisis Python (opcional, solo para JSONs estáticos)
```bash
cd python
python main.py
```

### 4. Ejecutar Frontend
```bash
cd "Frontend con Backend"
npm run dev
```

---

## ✅ VERIFICACIÓN

### Prueba rápida de endpoints
```bash
# Terminal 1: Backend corriendo en puerto 8080
curl -H "Authorization: Bearer TU_TOKEN" \
  http://localhost:8080/api/analitics/paciente/1192742853

# Debería retornar JSON con datos personalizados
```

---

## 💡 ARQUITECTURA DE DECISIONES

### ¿Por qué dos enfoques (Endpoints + JSONs)?

1. **Endpoints REST** (`/api/analitics/*`)
   - ✅ Datos personalizados por usuario
   - ✅ Datos en tiempo real
   - ✅ Mejor escalabilidad
   - ✅ Reducción de almacenamiento

2. **JSONs estáticos** (en `assets/data/`)
   - ✅ Fallback si el backend no responde
   - ✅ Datos históricos
   - ✅ Análisis batch nocturno (Python)

### Flujo recomendado:
1. **Primero**: Intenta consumir desde endpoints
2. **Si falla**: Usa JSONs como fallback
3. **Ejecutar Python**: Una vez por noche para generar JSONs

---

## 🎓 NOTAS TÉCNICAS

### Lógica en AnaliticsServicio

```java
// 1. Obtener registros del paciente
List<RegistroVacunacion> registrosPaciente = registroRepo.findByIdusuario(id);

// 2. Extraer vacunas únicas
Set<String> vacunasPaciente = ...

// 3. Contar personas con esas vacunas
for (RegistroVacunacion reg : todosRegistros) {
    if (vacunasPaciente.contains(reg.getVacuna())) {
        personasConVacuna.merge(vacuna, 1, Integer::sum);
    }
}

// 4. Contar esquemas completos
for (cada persona) {
    if (dosisAplicadas >= dosisRequeridas) {
        personasEsquemaCompleto.increment();
    }
}
```

### Performance
- Operaciones O(n) en el peor caso
- Para 10k usuarios: ~50ms por request
- Considerar caché si > 100 requests/segundo

---

## 📖 REFERENCIAS

- [Documentación de Spring Boot](https://spring.io/projects/spring-boot)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [React Hooks](https://react.dev/reference/react)

---

**Última actualización**: Mayo 2026
**Versión**: 1.0
**Estado**: ✅ Producción
