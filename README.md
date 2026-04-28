# VaxMinder - Carnet de Vacunación Digital

## 📋 Descripción del Proyecto

VaxMinder es una aplicación web moderna construida con **React** y **Vite** que permite a los usuarios gestionar su carnet de vacunación digital. La aplicación implementa un sistema completo de autenticación, navegación dinámica, gestión de estado y rutas protegidas.

## 🎯 Objetivos del Proyecto (Hito 2)

- ✅ Aplicación modularizada en componentes y páginas
- ✅ Flujo de información mediante Props y Context API
- ✅ Navegación dinámica entre páginas y subpáginas
- ✅ Lógica de acceso con Login y Registro
- ✅ Páginas protegidas basadas en autenticación
- ✅ Gestión de estado con React Hooks (useState, useContext)
- ✅ Datos simulados con servicios (Mocks)
- ✅ Validaciones en formularios
- ✅ Persistencia de datos en localStorage

## 📁 Estructura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── Navbar.jsx          # Barra de navegación principal
│   └── ProtectedRoute.jsx  # Componente para proteger rutas privadas
├── pages/                   # Páginas principales de la aplicación
│   ├── HomePage.jsx        # Página de inicio
│   ├── LoginPage.jsx       # Página de login
│   ├── RegistroPage.jsx    # Página de registro
│   ├── DashboardPage.jsx   # Dashboard del usuario
│   ├── CarnetPage.jsx      # Gestión del carnet de vacunación
│   ├── CentrosPage.jsx     # Listado de centros médicos
│   ├── AlertasPage.jsx     # Gestión de alertas
│   └── HistorialPage.jsx   # Historial de actividades
├── context/                # Context API para estado global
│   └── AuthContext.jsx     # Contexto de autenticación
├── services/               # Servicios y mocks de datos
│   └── index.js           # Todos los servicios simulados
├── styles/                 # Estilos CSS
│   ├── index.css          # Estilos globales
│   ├── navbar.css         # Estilos de navegación
│   ├── auth.css           # Estilos de autenticación
│   ├── home.css           # Estilos de home
│   ├── dashboard.css      # Estilos de dashboard
│   ├── carnet.css         # Estilos de carnet
│   ├── centros.css        # Estilos de centros
│   ├── alertas.css        # Estilos de alertas
│   ├── historial.css      # Estilos de historial
│   └── App.css            # Estilos de app
├── App.jsx                 # Componente raíz con rutas
└── main.jsx                # Punto de entrada de la aplicación
```


La aplicación estará disponible en `http://localhost:5173`

## 📱 Funcionalidades Implementadas

### 1. Sistema de Autenticación (HU05, HU06)
- **Registro de Usuarios**: Formulario completo con validaciones
  - Nombres, Apellidos
  - Tipo de Documento y Número
  - Edad y Email
  - Almacenamiento en localStorage

- **Login**: Acceso con número de documento
  - Validación de usuario existente
  - Persistencia de sesión
  - Restauración automática al recargar

### 2. Rutas Protegidas (HU07)
- Componente `ProtectedRoute` que valida autenticación
- Redirección automática a login si no está logueado
- Protección de todas las páginas privadas

### 3. Gestión de Carnet de Vacunación (HU08, HU09)
- Visualización de vacunaciones registradas
- Formulario para registrar nueva vacunación
  - Selección de vacuna
  - Número de dosis
  - Centro médico
  - Fecha
- Tarjetas visuales con información de vacunas
- Validaciones de campos requeridos

### 4. Centros Médicos
- Listado dinámico de centros disponibles
- Información: ubicación, teléfono, horario
- Tarjetas interactivas

### 5. Alertas de Vacunación
- Creación de alertas para próximas vacunas
- Visualización de alertas activas
- Registro de alertas vistas
- Validaciones en formularios

### 6. Historial de Actividades
- Timeline visual de actividades
- Registro automático de eventos
- Ordenamiento cronológico

### 7. Dashboard
- Estadísticas visuales
- Información del usuario
- Acceso rápido a funcionalidades

### 8. Cierre de Sesión (HU10)
- Botón logout en navbar
- Limpieza de sesión y localStorage
- Redirección a home

## 🔐 Lógica de Acceso y Autenticación

### AuthContext (Context API)
El contexto maneja:
- **State**: Usuario logueado, estado de carga
- **Métodos**: login(), register(), logout()
- **Persistencia**: localStorage para mantener sesión

### ProtectedRoute
- Valida si hay usuario logueado
- Si no: Redirige a `/login`
- Si sí: Renderiza el componente protegido

### Flow de Autenticación
```
Usuario no autenticado
    ↓
Accede a /registro o /login
    ↓
Llena formulario (registro) o documento (login)
    ↓
AuthContext guarda en localStorage y state
    ↓
ProtectedRoute valida y permite acceso
    ↓
Usuario ve su Dashboard
    ↓
Logout limpia state y localStorage
```

## 📊 Gestión de Estado

### useState Hooks
- Formularios: `formData`, `error`, `loading`
- Listas: `carnet`, `centros`, `alertas`, `historial`
- UI: `showForm`

### Context API
- `AuthContext`: Usuario global y métodos de autenticación

### Flujo de Datos (Props)
- Componentes reciben datos como props
- Props.children para composición
- Callbacks para eventos

## 🔄 Flujo de Datos entre Componentes

```
App (Rutas principales)
  ├── AuthProvider (Context global)
  │   └── Navbar (Usa AuthContext para mostrar usuario)
  │       └── Pages (Rutas protegidas por ProtectedRoute)
  │           ├── DashboardPage
  │           │   ├── useState para stats
  │           │   └── Services para obtener datos
  │           ├── CarnetPage
  │           │   ├── useState para carnet list
  │           │   ├── Formulario controlado
  │           │   └── Service carnetService
  │           └── AlertasPage, CentrosPage, etc.
```

## 💾 Servicios y Mocks de Datos

Ubicación: `src/services/index.js`

Servicios implementados:
- `usuariosService`: Gestión de usuarios
- `carnetService`: Vacunaciones del usuario
- `centrosService`: Centros médicos disponibles
- `vacunasService`: Catálogo de vacunas
- `alertasService`: Alertas de vacunación
- `historialService`: Historial de actividades

Todos usan **localStorage** para persistencia simulada.

## ✅ Validaciones Implementadas

### Registro
- Nombres y apellidos no vacíos
- Documento requerido
- Edad válida (0-120)
- Email válido (regex)

### Login
- Documento no vacío
- Documento debe existir

### Carnet
- Todos los campos requeridos
- Vacuna, dosis, centro, fecha obligatorios

### Alertas
- Vacuna y fecha próxima obligatorios

### Feedback Visual
- Mensajes de error con estilo específico
- Estados de loading en botones
- Disabled para inputs durante procesamiento

## 🎨 Estilos y Diseño

- **CSS Modular**: Un archivo CSS por página/componente
- **Variables CSS**: Colores, sombras, espaciados centralizados
- **Responsive Design**: Mobile-first approach
- **Gradientes**: Gradientes de color en secciones principales
- **Animaciones**: Transiciones suaves en hover

### Paleta de Colores
- Primary: #4f46e5 (Indigo)
- Secondary: #06b6d4 (Cyan)
- Danger: #ef4444 (Red)
- Success: #10b981 (Green)
- Warning: #f59e0b (Amber)

## 📝 Rutas de la Aplicación

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Pública | Página de inicio |
| `/login` | Pública | Iniciar sesión |
| `/registro` | Pública | Crear cuenta |
| `/dashboard` | Protegida | Dashboard del usuario |
| `/carnet` | Protegida | Mi carnet de vacunación |
| `/centros` | Protegida | Centros médicos |
| `/alertas` | Protegida | Gestión de alertas |
| `/historial` | Protegida | Historial de actividades |

## 🔧 Dependencias Principales

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.0"
}
```

## 🧪 Testing Manual

### Flujo de Registro
1. Ir a `/registro`
2. Llenar todos los campos
3. Hacer clic en "Crear Cuenta"
4. Sistema debe ir a `/dashboard`

### Flujo de Login
1. Ir a `/login`
2. Ingresar documento usado en registro
3. Sistema debe ir a `/dashboard`

### Rutas Protegidas
1. Sin sesión: Acceder a `/carnet` redirige a `/login`
2. Con sesión: `/carnet` muestra el carnet

### Gestión de Datos
1. Agregar vacunación en `/carnet`
2. Ver datos en dashboard stats
3. Recargar página - datos persisten

## 📚 Conceptos Clave Utilizados

### React Hooks
- **useState**: Gestión de estado local
- **useContext**: Acceso a contexto global
- **useEffect**: Efectos secundarios
- **useNavigate**: Navegación programática

### React Router
- BrowserRouter: Enrutador principal
- Routes: Definición de rutas
- Navigate: Redirecciones

### Context API
- createContext: Crear contexto
- Provider: Proveedor de contexto
- useContext: Consumir contexto

### localStorage
- Persistencia de usuarios
- Persistencia de sesión
- Almacenamiento de datos simulados

## 🎓 Aprendizajes y Arquitectura

### Separación de Responsabilidades
- **Pages**: Lógica de paginas y manejo de estado
- **Components**: Componentes reutilizables sin lógica
- **Services**: Acceso a datos y lógica de negocio
- **Context**: Estado global

### Props Drilling Alternativo
En lugar de pasar props a través de múltiples niveles, usamos:
- Context API para estado global (AuthContext)
- Services para datos compartidos

### Validación en Cliente
Todas las validaciones ocurren en el cliente:
- Validaciones en formularios antes de guardar
- Mensajes de error claros
- Feedback visual inmediato

## 🚀 Próximas Mejoras

- [ ] Integración con API real
- [ ] Autenticación con JWT
- [ ] Carga de documentos (fotos de vacunas)
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Multiidioma
- [ ] Exportar carnet PDF

## 👥 Equipo de Desarrollo

Este proyecto fue construido siguiendo los estándares de:
- Arquitectura de componentes React
- Gestión de estado con Hooks
- Ruteo dinámico con React Router
- Estilos modulares con CSS

## 📄 Licencia

Este proyecto es parte del programa académico de desarrollo web con React.

---

**Última actualización**: Abril 2026  
**Versión**: 1.0.0 (Hito 2 - Funcional)
