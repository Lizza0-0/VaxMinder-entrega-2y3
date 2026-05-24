import pandas as pd

from notebook.consumo import consumir_registros_vacunacion, consumir_catalogo_vacunas
from notebook.limpieza import limpiar_registros, limpiar_vacunas
from notebook.transformacion import transformar_datos
from notebook.graficacion import (
    graficar_lineas,
    graficar_barras,
    graficar_torta,
    graficar_scatter,
    graficar_histograma,
)
from notebook.descripcion import describir_datos

# =============================================================
# 1. CONSUMO DE DATOS — API REST Spring Boot (2 endpoints)
# =============================================================
print("=== CONSUMIENDO DATOS DE LA API REST ===")
datos_registros = consumir_registros_vacunacion()   # /api/registrovacunacion
datos_vacunas = consumir_catalogo_vacunas()          # /api/vacunascatalogo

df_registros_sucio = pd.DataFrame(datos_registros)
df_vacunas_sucio = pd.DataFrame(datos_vacunas)

print(f"Registros de vacunación recibidos: {len(df_registros_sucio)}")
print(f"Vacunas en catálogo recibidas:      {len(df_vacunas_sucio)}")

# =============================================================
# 2. LIMPIEZA — normalización, validación y campos derivados
# =============================================================
print("\n=== LIMPIANDO DATOS ===")
df_registros = limpiar_registros(df_registros_sucio)
df_vacunas = limpiar_vacunas(df_vacunas_sucio)

print(f"Registros válidos tras limpieza: {len(df_registros)}")
print(f"Vacunas válidas tras limpieza:   {len(df_vacunas)}")

# =============================================================
# 3. DESCRIPCIÓN ESTADÍSTICA
# =============================================================
describir_datos(df_registros, nombre="Registros de vacunación")
describir_datos(df_vacunas, nombre="Catálogo de vacunas")

# =============================================================
# 4. FILTROS, AGRUPACIONES Y EXPORTACIÓN JSON
# =============================================================
print("\n=== APLICANDO FILTROS Y AGRUPACIONES ===")
resultados = transformar_datos(df_registros, df_vacunas)

# =============================================================
# 5. GENERACIÓN DE GRÁFICAS (5 tipos distintos)
# =============================================================
print("\n=== GENERANDO GRÁFICAS ===")

# Gráfica 1 — Líneas: evolución mensual de vacunaciones
# Conclusión: permite identificar picos de demanda y períodos de baja cobertura
graficar_lineas(
    resultados["agrupacion_por_mes"],
    columna_eje_x="año_mes",
    columna_eje_y="conteo",
    titulo="Evolución mensual de vacunaciones aplicadas",
    color_linea="#2196F3",
    nombre_archivo="lineas_vacunaciones_por_mes.png",
)

# Gráfica 2 — Barras: vacunaciones por tipo de vacuna
# Conclusión: identifica cuáles vacunas tienen mayor demanda en la plataforma
graficar_barras(
    resultados["agrupacion_por_vacuna"],
    columna_categorias="nombrevacuna",
    columna_valores="conteo",
    titulo="Total de vacunaciones aplicadas por tipo de vacuna",
    color_barras="#4CAF50",
    nombre_archivo="barras_vacunaciones_por_vacuna.png",
)

# Gráfica 3 — Torta: distribución de registros por número de dosis
# Conclusión: muestra qué proporción de pacientes recibe refuerzos vs primera dosis
graficar_torta(
    resultados["agrupacion_por_dosis"],
    columna_etiquetas="etiqueta",
    columna_valores="conteo",
    titulo="Distribución de registros por número de dosis",
    nombre_archivo="torta_distribucion_dosis.png",
)

# Gráfica 4 — Scatter: dosis requeridas vs intervalo entre dosis por vacuna
# Conclusión: revela si vacunas con más dosis tienen intervalos mayores (correlación esperada)
graficar_scatter(
    resultados["df_vacunas_limpio"],
    columna_x="dosisrequeridas",
    columna_y="intervalodosisdias",
    columna_etiqueta="nombrevacuna",
    titulo="Dosis requeridas vs Intervalo entre dosis por vacuna",
    color="#9C27B0",
    nombre_archivo="scatter_dosis_vs_intervalo.png",
)

# Gráfica 5 — Histograma: distribución del número de dosis aplicadas en los registros
# Conclusión: evidencia si la mayoría de registros corresponden a primeras dosis o a refuerzos
graficar_histograma(
    df_registros,
    columna="numerodosis",
    titulo="Distribución del número de dosis aplicadas",
    color="#FF5722",
    bins=5,
    nombre_archivo="histograma_numerodosis.png",
)

print("\n=== PIPELINE COMPLETADO EXITOSAMENTE ===")
print("Gráficas (.png) y datos (.json) guardados en: Frontend con Backend/public/graficos/")
