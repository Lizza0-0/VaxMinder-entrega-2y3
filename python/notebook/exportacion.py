import json
import os
import pandas as pd

RUTA_DATA = os.path.join(os.path.dirname(__file__), "..", "..",
                         "Frontend con Backend", "src", "assets", "data")

ARCHIVOS = {
    "vacunaciones_por_vacuna":        "vacunaciones_por_vacuna.json",
    "vacunaciones_por_dosis":         "vacunaciones_por_dosis.json",
    "alertas_por_estado":             "alertas_por_estado.json",
    "alertas_por_tipo":               "alertas_por_tipo.json",
    "vacunaciones_por_mes":           "vacunaciones_por_mes.json",
    "centros_por_ciudad":             "centros_por_ciudad.json",
    "vacunaciones_por_centro":        "vacunaciones_por_centro.json",
    "personas_por_vacuna":            "personas_por_vacuna.json",
    "esquemas_completados":           "esquemas_completados.json",
    "estado_vacunacion_por_usuario":  "estado_vacunacion_por_usuario.json",
    "resumen_vacunacion_por_usuario": "resumen_vacunacion_por_usuario.json",
}


def _serial(obj):
    if hasattr(obj, "isoformat"): return obj.isoformat()
    if hasattr(obj, "item"):      return obj.item()
    return str(obj)


def _df_json(df, ruta):
    records = []
    for rec in df.to_dict(orient="records"):
        row = {}
        for k, v in rec.items():
            if isinstance(v, dict):   row[k] = v
            elif hasattr(v, "item"):  row[k] = v.item()
            elif hasattr(v, "isoformat"): row[k] = v.isoformat()
            elif v != v:              row[k] = None
            else:                     row[k] = v
        records.append(row)
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2, default=_serial)


def exportar_json(agrupaciones, kpis):
    os.makedirs(RUTA_DATA, exist_ok=True)
    for clave, archivo in ARCHIVOS.items():
        dato = agrupaciones.get(clave)
        if isinstance(dato, pd.DataFrame) and not dato.empty:
            try:
                _df_json(dato, os.path.join(RUTA_DATA, archivo))
                print(f"  exportado: {archivo} ({len(dato)} registros)")
            except Exception as e:
                print(f"  error: {archivo} — {e}")
    with open(os.path.join(RUTA_DATA, "kpis.json"), "w", encoding="utf-8") as f:
        json.dump(kpis, f, ensure_ascii=False, indent=2, default=_serial)
    print("  exportado: kpis.json")


def exportar_resumen_txt(agrupaciones, kpis, filtros):
    os.makedirs(RUTA_DATA, exist_ok=True)
    lineas = [
        "=" * 60,
        "  RESUMEN DE ANALISIS - VAXMINDER",
        "=" * 60, "",
        "KPIs:",
        *[f"  {k}: {v}" for k, v in kpis.items()],
        "", "Filtros:",
        *[f"  {k}: {len(v)} registros" for k, v in filtros.items() if isinstance(v, pd.DataFrame)],
        "", "Agrupaciones:",
        *[f"  {k}: {len(v)} registros" for k, v in agrupaciones.items()
          if isinstance(v, pd.DataFrame) and k != "kpis"],
        "", "Graficas generadas (src/assets/graficos/):",
        "  1. barras_vacunaciones.png",
        "  2. torta_dosis.png",
        "  3. lineas_vacunaciones_tiempo.png",
        "  4. barras_alertas_estado.png",
        "  5. torta_tipo_alerta.png",
        "  6. barras_centros_ciudad.png",
        "  7. estado_vacunacion_pacientes.png",
        "  8. vacunas_pendientes_catalogo.png",
        "  9. esquemas_completados.png",
        "=" * 60,
    ]
    with open(os.path.join(RUTA_DATA, "resumen_analisis.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(lineas))
    print("  exportado: resumen_analisis.txt")
