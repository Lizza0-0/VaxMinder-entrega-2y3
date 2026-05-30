import pandas as pd

from notebook.consumo import (
    consumir_registros_vacunacion, consumir_vacunas_catalogo,
    consumir_usuarios, consumir_centros_medicos, consumir_alertas,
)
from notebook.limpieza import (
    limpiar_registros_vacunacion, limpiar_vacunas_catalogo,
    limpiar_usuarios, limpiar_centros_medicos, limpiar_alertas,
)
from notebook.filtros     import aplicar_filtros
from notebook.agrupaciones import generar_agrupaciones
from notebook.graficacion import (
    graficar_barras_vacunaciones, graficar_torta_dosis,
    graficar_lineas_tiempo, graficar_barras_alertas,
    graficar_torta_tipo_alerta, graficar_barras_centros_ciudad,
    graficar_estado_vacunacion_pacientes, graficar_vacunas_pendientes_catalogo,
    graficar_esquemas_completados,
)
from notebook.exportacion import exportar_json, exportar_resumen_txt


def sep(titulo):
    print(f"\n{'=' * 55}\n  {titulo}\n{'=' * 55}")


sep("PASO 1: CONSUMO DE ENDPOINTS")
datos_registros = consumir_registros_vacunacion()
datos_vacunas   = consumir_vacunas_catalogo()
datos_usuarios  = consumir_usuarios()
datos_centros   = consumir_centros_medicos()
datos_alertas   = consumir_alertas()
print(f"  registros={len(datos_registros)}, vacunas={len(datos_vacunas)}, "
      f"usuarios={len(datos_usuarios)}, centros={len(datos_centros)}, alertas={len(datos_alertas)}")

sep("PASO 2: CARGA EN DATAFRAMES")
df_registros = pd.DataFrame(datos_registros)
df_vacunas   = pd.DataFrame(datos_vacunas)
df_usuarios  = pd.DataFrame(datos_usuarios)
df_centros   = pd.DataFrame(datos_centros)
df_alertas   = pd.DataFrame(datos_alertas)

sep("PASO 3: LIMPIEZA")
df_registros = limpiar_registros_vacunacion(df_registros)
df_vacunas   = limpiar_vacunas_catalogo(df_vacunas)
df_usuarios  = limpiar_usuarios(df_usuarios)
df_centros   = limpiar_centros_medicos(df_centros)
df_alertas   = limpiar_alertas(df_alertas)

sep("PASO 4: FILTROS")
filtros = aplicar_filtros(df_registros, df_vacunas, df_usuarios, df_centros, df_alertas)

sep("PASO 5: AGRUPACIONES Y KPIs")
agrupaciones = generar_agrupaciones(df_registros, df_vacunas, df_alertas, df_centros)
kpis = agrupaciones["kpis"]
for k, v in kpis.items():
    print(f"  {k}: {v}")

sep("PASO 6: GRAFICAS")
graficar_barras_vacunaciones(agrupaciones["vacunaciones_por_vacuna"])
graficar_torta_dosis(agrupaciones["vacunaciones_por_dosis"])
graficar_lineas_tiempo(agrupaciones["vacunaciones_por_mes"])
graficar_barras_alertas(agrupaciones["alertas_por_estado"])
graficar_torta_tipo_alerta(agrupaciones["alertas_por_tipo"])
graficar_barras_centros_ciudad(agrupaciones["centros_por_ciudad"])
graficar_estado_vacunacion_pacientes(agrupaciones["estado_vacunacion_por_usuario"])
graficar_vacunas_pendientes_catalogo(agrupaciones["estado_vacunacion_por_usuario"], df_vacunas)
graficar_esquemas_completados(agrupaciones["esquemas_completados"])

sep("PASO 7: EXPORTACION")
exportar_json(agrupaciones, kpis)
exportar_resumen_txt(agrupaciones, kpis, filtros)

print("\nAnalisis completado. Levanta el frontend con: npm run dev\n")
