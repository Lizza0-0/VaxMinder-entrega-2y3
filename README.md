# 💉 VaxMinder — Carnet de Vacunación Digital

VaxMinder es una aplicación web full-stack para la gestión digital del historial de vacunación. Permite a los pacientes consultar su carnet de vacunación, recibir alertas de próximas dosis y descargar su historial en PDF. Los centros médicos pueden registrar vacunaciones y administrar su perfil institucional.

---

## 📋 Descripción General

El sistema maneja dos tipos de usuarios:

**👤 Paciente**
- Registro e inicio de sesión con cédula
- Consulta de carnet de vacunación digital
- Alertas de próximas dosis pendientes
- Vacunas sugeridas según edad
- Descarga de historial en PDF
- Edición de correo, teléfono y contraseña

**🏥 Centro Médico**
- Registro e inicio de sesión con NIT
- Búsqueda de pacientes por número de documento
- Registro de vacunaciones con cálculo automático de próxima dosis
- Bloqueo automático del campo "próxima dosis" en la última dosis del esquema
- Edición de perfil: razón social, dirección, ciudad y teléfono (NIT inmutable)

---

## 🚀 Tecnologías Utilizadas

### Frontend
| Tecnología | Descripción |
|---|---|
| React 18 | Librería de interfaz de usuario |
| Vite 5 | Empaquetador y servidor de desarrollo |
| React Router DOM 6 | Enrutamiento de páginas |
| jsPDF + html2canvas | Generación de PDF del carnet |
| CSS Modules | Estilos por módulo |

### Backend
| Tecnología | Descripción |
|---|---|
| Java 17 | Lenguaje principal |
| Spring Boot 3 | Framework principal |
| Spring Security | Autenticación y autorización |
| JWT (JSON Web Token) | Manejo de sesiones stateless |
| Spring Data JPA | Acceso a base de datos |
| Maven | Gestión de dependencias |

### Base de Datos
| Tecnología | Descripción |
|---|---|
| MariaDB 10.4 / MySQL | Motor de base de datos |
| phpMyAdmin 5.2 | Administración visual |

---

## 📁 Estructura del Proyecto

```
vaxminder_Final/
│
├── Frontend con Backend/          ← Aplicación React (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx        ← Manejo de sesión (paciente y centro)
│       ├── data/
│       │   └── ciudadesColombia.js    ← Lista completa de municipios de Colombia
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegistroPage.jsx
│       │   ├── RegistroCentroPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── CarnetPage.jsx
│       │   ├── AlertasPage.jsx
│       │   ├── HistorialPage.jsx
│       │   ├── CentrosPage.jsx
│       │   └── PortalCentroPage.jsx
│       ├── services/
│       │   └── index.js               ← Llamadas a la API REST
│       └── styles/
│           ├── index.css
│           ├── auth.css
│           ├── dashboard.css
│           ├── carnet.css
│           ├── alertas.css
│           ├── historial.css
│           ├── portal-centro.css
│           ├── centros.css
│           ├── home.css
│           └── navbar.css
│
└── Backend/
    └── Backend/
        ├── pom.xml
        ├── vaxminder_db.sql           ← Script de base de datos listo para importar
        └── src/main/
            ├── resources/
            │   └── application.properties
            └── java/com/vaxminder/
                ├── VaxminderApplication.java
                ├── config/            SecurityConfig.java
                ├── controlador/       8 controladores REST
                ├── dto/               10 objetos de transferencia
                ├── modelo/            7 entidades JPA
                ├── repositorio/       7 repositorios
                ├── servicio/          7 servicios
                └── security/          JwtUtil.java, JwtFilter.java
```

---

## ⚙️ Instalación y Configuración

### Requisitos previos
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL o MariaDB
- phpMyAdmin (opcional pero recomendado)

---

### 1. Base de Datos

1. Abre **phpMyAdmin** en `http://localhost/phpmyadmin`
2. Selecciona el servidor raíz (sin ninguna base de datos seleccionada)
3. Ve a la pestaña **Importar**
4. Selecciona el archivo `Backend/Backend/vaxminder_db.sql`
5. Clic en **Ejecutar**

Esto creará automáticamente la base de datos `vaxminder_db` con todas las tablas y datos de prueba incluidos.

---

### 2. Backend (Spring Boot)

1. Abre la carpeta `Backend/Backend/` en **IntelliJ IDEA**
2. Configura tus credenciales en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vaxminder_db
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA
```

3. Ejecuta la aplicación — corre en el puerto **8080**:
```bash
mvn spring-boot:run
```

---

### 3. Frontend (React + Vite)

1. Abre una terminal en la carpeta `Frontend con Backend/`
2. Instala las dependencias:
```bash
npm install
```
3. Inicia el servidor de desarrollo:
```bash
npm run dev
```
4. Abre el navegador en **http://localhost:5173**

> ⚠️ El backend debe estar corriendo en el puerto 8080 antes de iniciar el frontend.

---

## 🔗 Endpoints de la API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/registro` | Público | Registro de paciente |
| POST | `/api/auth/login` | Público | Login de paciente |
| POST | `/api/auth/centros/registro` | Público | Registro de centro médico |
| POST | `/api/auth/centros/login` | Público | Login de centro médico |
| PUT | `/api/auth/centros/perfil` | JWT | Editar perfil del centro |
| PUT | `/api/usuarios/{id}` | JWT | Editar perfil del paciente |
| GET | `/api/vacunascatalogo` | Público | Catálogo de vacunas |
| GET | `/api/vacunascatalogo/sugeridas/{id}` | JWT | Vacunas sugeridas por edad |
| GET | `/api/centrosmedicos` | Público | Lista de centros médicos |
| POST | `/api/registrovacunacion` | JWT | Registrar vacunación |
| GET | `/api/registrovacunacion/usuario/{id}` | JWT | Carnet del paciente |
| GET | `/api/alertas/usuario/{id}` | JWT | Alertas del paciente |
| GET | `/api/historialpdf/usuario/{id}` | JWT | Historial de PDFs |
| POST | `/api/historialpdf` | JWT | Guardar registro de PDF |

---

## 👤 Datos de Prueba

### Pacientes registrados
| Documento | Nombre | Tipo Sangre |
|---|---|---|
| 1192742853 | Anna Mestra | A+ |
| 1001234567 | Camila Torres | O+ |
| 1002345678 | Andrés Gómez | A+ |
| 1003456789 | Valentina Cardona | B+ |
| 1004567890 | Sebastián Arango | AB+ |
| 1038134116 | Carlos Mestra | O+ |

### Centros Médicos registrados
| NIT | Razón Social | Ciudad |
|---|---|---|
| 8000123456 | Hospital San Vicente Fundación | Medellín |
| 8000234567 | Clínica Las Américas | Medellín |
| 8000345678 | IPS Comfama Bello | Bello |
| 8000456789 | Unidad de Vacunación Itagüí | Itagüí |
| 8000567890 | Hospital General de Medellín | Medellín |
| 8000678901 | Clínica Soma | Medellín |
| 8000789012 | IPS Sura Centro | Medellín |
| 8000890123 | Puesto de Salud Envigado | Envigado |
| 8000901234 | Clínica León XIII | Medellín |
| 8001012345 | Centro Salud Pablo Tobón Uribe | Medellín |

---

## ✨ Funcionalidades Destacadas

- 🔐 Autenticación JWT separada para pacientes y centros médicos
- 💉 Cálculo automático de próxima dosis según el intervalo de cada vacuna
- 🚫 Campo "próxima dosis" se deshabilita y pone en gris al registrar la última dosis del esquema
- 📄 Generación y descarga de carnet en PDF con jsPDF
- 🔔 Sistema de alertas de próximas dosis pendientes
- 🗺️ Lista desplegable con todos los municipios y ciudades de Colombia (DIVIPOLA - DANE)
- ✅ Validaciones en tiempo real: solo letras en nombres, solo números en documentos y teléfonos, máximo 10 dígitos en teléfono
- 🏥 Portal del centro médico con búsqueda de pacientes y registro de vacunaciones
- ✏️ Edición de perfil para pacientes y centros médicos (NIT inmutable)

---

## 👩‍💻 Desarrollado por

Proyecto académico — Ingeniería de Sistemas
**VaxMinder** © 2026
