# 💉 VaxMinder – Carnet Digital de Vacunación

Aplicación web desarrollada en **React + Vite** como proyecto integrador del segundo avance (Funcionalidad e Interactividad). Permite registrar usuarios, iniciar sesión, gestionar un carnet de vacunación digital, consultar centros médicos, revisar alertas de próximas dosis y descargar el historial en PDF. Todos los datos se persisten en **localStorage** (sin backend en esta etapa).

---

## 🚀 Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:5173
```

---

## 🗺️ Mapa de Rutas

| Ruta | Componente | Tipo | Descripción |
|---|---|---|---|
| `/` | `HomePage` | Pública | Página de bienvenida |
| `/login` | `LoginPage` | Pública | Inicio de sesión |
| `/registro` | `RegistroPage` | Pública | Registro de nuevo usuario |
| `/dashboard` | `DashboardPage` | **Privada** | Panel principal del usuario |
| `/carnet` | `CarnetPage` | **Privada** | Carnet de vacunación y registro de vacunas |
| `/centros` | `CentrosPage` | **Privada** | Listado de centros médicos |
| `/alertas` | `AlertasPage` | **Privada** | Alertas de próximas dosis |
| `/historial` | `HistorialPage` | **Privada** | Historial de PDFs generados |
| `/*` | — | — | Redirige a `/` (404 catch-all) |

---

## 🔐 Protección de Rutas

La protección se implementa mediante el componente envolvente `ProtectedRoute` ubicado en `src/components/ProtectedRoute.jsx`.

### ¿Cómo funciona?

```jsx
// src/components/ProtectedRoute.jsx
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <div>Cargando...</div>
  if (!user)   return <Navigate to="/login" replace />

  return children
}
```

1. Lee el estado `user` del **AuthContext** (que a su vez lee `vax_token` y `vax_user` del localStorage al montar).
2. Si `loading` es `true` muestra un indicador mientras restaura la sesión.
3. Si `user` es `null` (no autenticado), redirige al `/login` con `<Navigate replace />`, impidiendo que el usuario vuelva atrás con el botón del navegador.
4. Si `user` existe, renderiza el componente hijo normalmente.

En `App.jsx` todas las rutas privadas se envuelven así:

```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── context/
│   └── AuthContext.jsx       # Estado global de autenticación (Context + Provider)
├── components/
│   ├── Navbar.jsx            # Barra de navegación (recibe user via Context)
│   └── ProtectedRoute.jsx    # Componente envolvente para rutas privadas
├── pages/
│   ├── HomePage.jsx          # Landing page pública
│   ├── LoginPage.jsx         # HU06 – Inicio de sesión
│   ├── RegistroPage.jsx      # HU05 – Registro de usuario
│   ├── DashboardPage.jsx     # Panel principal con stats y edición de perfil
│   ├── CarnetPage.jsx        # HU08/HU09 – Visualización y registro de vacunas
│   ├── CentrosPage.jsx       # Listado de centros médicos
│   ├── AlertasPage.jsx       # HU08 – Alertas de próximas dosis
│   └── HistorialPage.jsx     # Historial de PDFs exportados
├── services/
│   └── index.js              # Mocks y lógica de datos (sin fetch aún)
├── styles/                   # CSS por módulo
├── App.jsx                   # Definición de rutas con React Router
└── main.jsx                  # Punto de entrada
```

### Principio clave: datos centralizados en `services/`

Ningún componente "quema" datos directamente. Todo fluye desde `src/services/index.js`, lo que permite que en el **Momento 3** solo sea necesario reemplazar las funciones locales por llamadas `fetch` con `useEffect`, sin tocar los componentes.

---

## 🔄 Flujo de Datos

### Context API (AuthContext)
El estado de autenticación (`user`, `token`, `loading`) se comparte globalmente a través de `AuthContext`. Cualquier componente puede consumirlo con `useContext(AuthContext)` sin necesidad de pasar props manualmente.

```
AuthProvider
  └── Navbar          → lee user para mostrar nombre / botón logout
  └── ProtectedRoute  → lee user para decidir si renderiza o redirige
  └── DashboardPage   → lee user para mostrar info y llama updateProfile
  └── CarnetPage      → lee user.idusuario para cargar/guardar carnet
  └── AlertasPage     → lee user.idusuario para cargar alertas
  └── HistorialPage   → lee user.idusuario para cargar historial
```

### Props
Los datos cargados desde `services/` se pasan como props a los sub-elementos de UI dentro de cada página:

```
CarnetPage (estado: carnet[], vacunas[], centros[])
  └── <table> → recibe filas mapeadas del array carnet
  └── <select> → recibe vacunas[] y centros[] como options
```

---

## 📦 Dependencias

### Producción
| Dependencia | Versión | Uso |
|---|---|---|
| `react` | ^18.2.0 | Librería principal |
| `react-dom` | ^18.2.0 | Renderizado en el DOM |
| `react-router-dom` | ^6.30.3 | Navegación dinámica entre páginas |
| `jspdf` | ^2.5.2 | Generación y descarga de PDF del carnet |

### Desarrollo
| Dependencia | Versión | Uso |
|---|---|---|
| `vite` | ^4.3.9 | Bundler y servidor de desarrollo |
| `@vitejs/plugin-react` | ^4.0.0 | Soporte JSX y Fast Refresh |

---

## 💾 Estructura del LocalStorage

| Clave | Contenido |
|---|---|
| `vax_token` | Token de sesión simulado |
| `vax_user` | Objeto del usuario autenticado |
| `vax_usuarios` | Array de todos los usuarios registrados |
| `vax_centros` | Catálogo de centros médicos (semilla) |
| `vax_vacunas` | Catálogo de vacunas (semilla) |
| `vax_carnet_{id}` | Registros de vacunación por usuario |
| `vax_alertas_{id}` | Alertas de próximas dosis por usuario |
| `vax_historial_{id}` | Historial de PDFs exportados por usuario |

---

## ✅ Historias de Usuario implementadas

| HU | Descripción | Estado |
|---|---|---|
| HU05 | Registro de usuario (nombres, tipoDocumento, documento, edad) | ✅ |
| HU06 | Inicio de sesión con validación de documento | ✅ |
| HU07 | Rutas privadas protegidas con redirección al login | ✅ |
| HU08 | Visualización de datos mediante props y listado dinámico | ✅ |
| HU09 | Registro de vacunación con formulario controlado (useState) | ✅ |
| HU10 | Cierre de sesión (logout) seguro | ✅ |
| HU12 | Documentación técnica (este README) | ✅ |

---

## 🔮 Proyección al Momento 3

El código está preparado para conectar el backend real con mínimos cambios:

1. En `src/services/index.js`, reemplazar cada función local por un `fetch` a la API.
2. En `src/context/AuthContext.jsx`, reemplazar la lógica de localStorage por llamadas a `/api/auth/login` y `/api/auth/registro`.
3. Los nombres de todas las variables (`idusuario`, `tiposangre`, `fechanacimiento`, etc.) ya coinciden exactamente con el DTO del backend, por lo que no se requiere ningún mapeo adicional.
