# VaxMinder — Carnet de Vacunación Digital

**Elizabeth Mejia Ochoa · Ana Maria Mestra Perez**  
Proyecto Integrador — Tecnico en Desarrollo de Software, CESDE · 2026

---

## Descripcion

VaxMinder es una aplicacion web full-stack para la gestion digital del historial de vacunacion. Conecta pacientes y centros medicos en un mismo sistema, con analisis de datos integrado mediante Python.

**Paciente**
- Consulta de carnet de vacunacion digital
- Estado de vacunacion: completadas, en progreso y pendientes
- Alertas de proximas dosis y vacunas sugeridas por edad
- Descarga del historial en PDF
- Edicion de correo, telefono y contrasena

**Centro Medico**
- Busqueda de pacientes por numero de documento
- Registro de vacunaciones con calculo automatico de proxima dosis
- Analitica propia del centro: KPIs, tendencia mensual y comparacion con otros centros
- Edicion de perfil institucional (NIT inmutable)

---

## Tecnologias

| Capa | Tecnologia |
|---|---|
| Frontend | React 18, Vite 5, React Router DOM 6, jsPDF |
| Backend | Java 17, Spring Boot 3, Spring Security, JWT, JPA |
| Base de datos | MariaDB / MySQL, phpMyAdmin |
| Analisis de datos | Python 3.10+, Pandas, Matplotlib, requests |

---

## Estructura del Proyecto

```
vaxminder_Final/
├── Frontend con Backend/       React + Vite
│   └── src/
│       ├── pages/              DashboardPage, PortalCentroPage, CarnetPage...
│       ├── context/            AuthContext.jsx
│       ├── services/           index.js (llamadas a la API)
│       ├── assets/
│       │   ├── graficos/       imagenes .png generadas por Python
│       │   └── data/           archivos .json generados por Python
│       └── styles/
├── Backend/
│   └── src/main/java/com/vaxminder/
│       ├── controlador/        8 controladores REST
│       ├── modelo/             7 entidades JPA
│       ├── servicio/           7 servicios
│       └── security/           JwtUtil, JwtFilter
└── python/
    ├── main.py
    └── notebook/
        ├── consumo.py          consume 5 endpoints REST
        ├── limpieza.py         limpieza y validacion de DataFrames
        ├── filtros.py          6 filtros con query() y operadores logicos
        ├── agrupaciones.py     10 agrupaciones con groupby() y KPIs
        ├── graficacion.py      9 graficas con Matplotlib
        └── exportacion.py      exporta .png y .json al frontend
```

---

## Instalacion

### Requisitos previos
- Node.js 18+, Java 17+, Maven 3.8+, Python 3.10+
- MySQL o MariaDB corriendo en el puerto 3306

### 1. Base de datos

Importar el archivo `Backend/Backend/vaxminder_db.sql` desde phpMyAdmin en `http://localhost/phpmyadmin`.

### 2. Backend

Configurar `Backend/Backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vaxminder_db
spring.datasource.username=root
spring.datasource.password=TU_CONTRASENA
```

Ejecutar:
```bash
cd Backend/Backend
mvn spring-boot:run
```

El backend queda disponible en `http://localhost:8080`.

### 3. Python (analisis de datos)

```bash
cd python
pip install -r requirements.txt
python main.py
```

Genera las graficas `.png` y los archivos `.json` en `src/assets/`.

### 4. Frontend

```bash
cd "Frontend con Backend"
npm install
npm run dev
```

Abrir `http://localhost:5173`.

> El backend debe estar corriendo antes de iniciar el frontend y Python.

---

## Flujo de datos Python

```
API REST Spring Boot → requests → Pandas → Matplotlib → assets/ React
```

| Paso | Descripcion |
|---|---|
| Consumo | 5 endpoints GET con autenticacion JWT |
| Limpieza | Normalizacion de campos anidados, fechas y tipos |
| Filtros | 6 filtros de negocio con query() y operadores logicos |
| Agrupaciones | 10 agrupaciones con groupby(), incluyendo panel por centro |
| Graficas | 9 graficas de tipos: barras, torta, lineas, barras horizontales |
| Exportacion | 11 archivos .json y 9 archivos .png |

---

## Endpoints de la API

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| POST | `/api/auth/registro` | Publico | Registro de paciente |
| POST | `/api/auth/login` | Publico | Login de paciente |
| POST | `/api/auth/centros/registro` | Publico | Registro de centro medico |
| POST | `/api/auth/centros/login` | Publico | Login de centro medico |
| PUT | `/api/auth/centros/perfil` | JWT | Editar perfil del centro |
| PUT | `/api/usuarios/{id}` | JWT | Editar perfil del paciente |
| GET | `/api/vacunascatalogo` | Publico | Catalogo de vacunas |
| GET | `/api/vacunascatalogo/sugeridas/{id}` | JWT | Vacunas sugeridas por edad |
| GET | `/api/centrosmedicos` | Publico | Lista de centros medicos |
| POST | `/api/registrovacunacion` | JWT | Registrar vacunacion |
| GET | `/api/registrovacunacion/usuario/{id}` | JWT | Carnet del paciente |
| GET | `/api/alertas/usuario/{id}` | JWT | Alertas del paciente |

---

## Datos de prueba

**Pacientes**

| Documento | Nombre |
|---|---|
| 1192742853 | Anna Mestra |
| 1001234567 | Camila Torres |
| 1002345678 | Andres Gomez |
| 1003456789 | Valentina Cardona |
| 1004567890 | Sebastian Arango |

**Centros medicos** (contrasena: `123456` para todos)

| NIT | Razon Social | Ciudad |
|---|---|---|
| 8000123456 | Hospital San Vicente Fundacion | Medellin |
| 8000234567 | Clinica Las Americas | Medellin |
| 8000345678 | IPS Comfama Bello | Bello |
| 8000456789 | Unidad de Vacunacion Itagui | Itagui |
| 8000789012 | IPS Sura Centro | Medellin |

---

## Funcionalidades destacadas

- Autenticacion JWT separada para pacientes y centros medicos
- Calculo automatico de proxima dosis segun el intervalo de cada vacuna
- Campo "proxima dosis" bloqueado al registrar la ultima dosis del esquema
- Analitica dinamica por centro: cada portal muestra solo sus propios datos
- Comparacion de centros medicos a nivel del sistema
- Estado de vacunacion del paciente con barra de progreso y conclusiones
- Generacion y descarga de carnet en PDF con jsPDF
- Lista completa de municipios de Colombia (DIVIPOLA - DANE)
