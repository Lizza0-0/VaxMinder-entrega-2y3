import pandas as pd
import json
import os

RUTA_JSON = os.path.join(
    os.path.dirname(__file__), "..", "..", "Frontend con Backend", "public", "graficos"
)


def transformar_datos(df_registros, df_vacunas):
    os.makedirs(RUTA_JSON, exist_ok=True)

    # ===========================================================
    # FILTROS — 5 preguntas de negocio con query() y operadores
    # ===========================================================

    # Filtro 1: ¿Cuántos registros corresponden a dosis de refuerzo?
    # Una dosis mayor a 1 indica que el paciente ya recibió la primera dosis
    filtro_refuerzo = df_registros.query("numerodosis > 1")
    print(f"[Filtro 1] Dosis de refuerzo (numerodosis > 1): {len(filtro_refuerzo)} registros")

    # Filtro 2: ¿Cuántas vacunaciones se realizaron en 2025 o después?
    filtro_2025 = df_registros.query("año_aplicacion >= 2025")
    print(f"[Filtro 2] Vacunaciones desde 2025: {len(filtro_2025)} registros")

    # Filtro 3: ¿Qué vacunas del catálogo requieren refuerzo Y múltiples dosis?
    filtro_vacunas_refuerzo = df_vacunas.query("requiererefuerzo == True and dosisrequeridas >= 2")
    print(f"[Filtro 3] Vacunas con refuerzo obligatorio y múltiples dosis: {len(filtro_vacunas_refuerzo)} vacunas")

    # Filtro 4: ¿Cuántas vacunas tienen intervalo largo entre dosis (más de 30 días)?
    filtro_intervalo_largo = df_vacunas.query("intervalodosisdias > 30 and dosisrequeridas > 1")
    print(f"[Filtro 4] Vacunas con intervalo >30 días entre dosis: {len(filtro_intervalo_largo)} vacunas")

    # Filtro 5: ¿Cuántos pacientes tienen próxima dosis en los próximos 60 días?
    filtro_proxima_dosis = df_registros.query(
        "dias_para_proxima_dosis >= 0 and dias_para_proxima_dosis <= 60"
    )
    print(f"[Filtro 5] Próxima dosis en los siguientes 60 días: {len(filtro_proxima_dosis)} registros")

    # ===========================================================
    # AGRUPACIONES — groupby para indicadores y gráficas
    # ===========================================================

    # Agrupación 1: Vacunaciones por mes (serie temporal para gráfica de líneas)
    agrupacion_por_mes = (
        df_registros.groupby("año_mes")["idregistro"]
        .count()
        .reset_index(name="conteo")
        .sort_values("año_mes")
    )

    # Agrupación 2: Vacunaciones por tipo de vacuna (para gráfica de barras)
    agrupacion_por_vacuna = (
        df_registros.groupby("nombrevacuna")["idregistro"]
        .count()
        .reset_index(name="conteo")
        .sort_values("conteo", ascending=False)
    )

    # Agrupación 3: Distribución por número de dosis (para torta e histograma)
    agrupacion_por_dosis = (
        df_registros.groupby("numerodosis")["idregistro"]
        .count()
        .reset_index(name="conteo")
    )
    agrupacion_por_dosis["etiqueta"] = agrupacion_por_dosis["numerodosis"].apply(
        lambda d: "Primera dosis" if d == 1 else f"Dosis {int(d)}"
    )

    # ===========================================================
    # EXPORTAR JSON — para KPI cards del dashboard React
    # ===========================================================

    resumen = {
        "total_registros": int(len(df_registros)),
        "vacunas_requieren_refuerzo": int((df_vacunas["requiererefuerzo"] == True).sum()),
        "promedio_intervalo_dias": round(float(df_vacunas["intervalodosisdias"].mean()), 1),
        "dosis_refuerzo": int(len(filtro_refuerzo)),
        "proxima_dosis_60_dias": int(len(filtro_proxima_dosis)),
        "total_vacunas_catalogo": int(len(df_vacunas)),
    }

    with open(os.path.join(RUTA_JSON, "resumen_vacunaciones.json"), "w", encoding="utf-8") as f:
        json.dump(resumen, f, ensure_ascii=False, indent=2)
    print("JSON exportado: resumen_vacunaciones.json")

    with open(os.path.join(RUTA_JSON, "agrupacion_por_vacuna.json"), "w", encoding="utf-8") as f:
        json.dump(agrupacion_por_vacuna.to_dict(orient="records"), f, ensure_ascii=False, indent=2)
    print("JSON exportado: agrupacion_por_vacuna.json")

    return {
        "filtro_refuerzo": filtro_refuerzo,
        "filtro_2025": filtro_2025,
        "filtro_vacunas_refuerzo": filtro_vacunas_refuerzo,
        "filtro_intervalo_largo": filtro_intervalo_largo,
        "filtro_proxima_dosis": filtro_proxima_dosis,
        "agrupacion_por_mes": agrupacion_por_mes,
        "agrupacion_por_vacuna": agrupacion_por_vacuna,
        "agrupacion_por_dosis": agrupacion_por_dosis,
        "df_vacunas_limpio": df_vacunas,
    }
