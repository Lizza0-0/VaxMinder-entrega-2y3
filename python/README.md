# VaxMinder – Módulo de Análisis Python

## Flujo del Proyecto
```
API REST Spring Boot → Python requests → Pandas → Matplotlib → Dashboard React
```

## Requisitos previos
1. El backend Spring Boot debe estar corriendo en `http://localhost:8080`
2. Python 3.10+ instalado
3. Dependencias instaladas

## Instalación
```bash
cd python
pip install -r requirements.txt
```

## Ejecución
```bash
# Desde la carpeta /python
python main.py
```

## Estructura
```
python/
├── main.py                     ← Punto de entrada principal
├── requirements.txt
└── notebook/
    ├── consumo.py              ← Consume 5 endpoints de la API REST
    ├── limpieza.py             ← Limpia y valida los DataFrames
    ├── filtros.py              ← 6 filtros con query() y operadores lógicos
    ├── agrupaciones.py         ← groupby() + KPIs
    ├── graficacion.py          ← 6 gráficas con Matplotlib
    └── exportacion.py          ← Exporta .png y .json
```

## Endpoints consumidos
| Endpoint                     | Descripción                            |
|------------------------------|----------------------------------------|
| GET /api/registrovacunacion  | Registros de vacunación del sistema    |
| GET /api/vacunascatalogo     | Catálogo de vacunas disponibles        |
| GET /api/usuarios            | Usuarios registrados                   |
| GET /api/centrosmedicos      | Centros médicos                        |
| GET /api/alertas             | Alertas generadas por el sistema       |

## Gráficas generadas
1. **barras_vacunaciones.png** – Vacunaciones por tipo de vacuna (barras)
2. **torta_dosis.png** – Distribución por número de dosis (pie)
3. **lineas_vacunaciones_tiempo.png** – Tendencia mensual (líneas)
4. **barras_alertas_estado.png** – Alertas por estado (barras horizontales)
5. **torta_tipo_alerta.png** – Proporción por tipo de alerta (pie)
6. **barras_centros_ciudad.png** – Centros médicos por ciudad (barras)

## Salida
Las gráficas `.png` y archivos `.json` se guardan automáticamente en:
```
Frontend con Backend/src/assets/graficos/   ← imágenes .png
Frontend con Backend/src/assets/data/       ← datos .json
```
El DashboardPage de React los consume automáticamente.
