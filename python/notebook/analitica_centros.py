"""
analitica_centros.py – Funciones especializadas en analítica de centros médicos
Genera agrupaciones específicamente para el dashboard de centros médicos

Utilizadas por: python/main.py para exportar datos a PortalCentroPage
"""

import pandas as pd


def generar_analitica_centros(df_registros, df_vacunas, df_centros):
    """
    Genera agrupaciones analíticas enfocadas en los centros médicos.
    Retorna un diccionario con insights para el portal de centros.
    
    Agrupaciones generadas:
    - Centro performance: personas vacunadas, dosis, promedio, etc.
    - Vacunas más aplicadas por centro
    - Tendencia temporal por centro
    - Cumplimiento de esquema por centro
    """
    analitica = {}
    
    # ── AGRUPACION 1: Performance de centros ────────────────────────────────
    # Estadísticas resumidas de cada centro médico
    if not df_registros.empty and "idcentromedico" in df_registros.columns:
        df_temp = df_registros.dropna(subset=["idcentromedico"]).copy()
        
        if not df_temp.empty:
            # Agrupar por centro
            centro_agg = df_temp.groupby("idcentromedico").agg({
                "idusuario": "nunique",           # personas únicas
                "idregistro": "count",            # total dosis aplicadas
                "numerodosis": ["mean", "max"],  # promedio y máximo de dosis
            }).reset_index()
            
            centro_agg.columns = ["idcentromedico", "personas_vacunadas", "total_dosis", 
                                 "promedio_dosis", "max_dosis"]
            
            # Merge con nombres de centros
            if not df_centros.empty and "idcentro" in df_centros.columns:
                centro_agg = centro_agg.merge(
                    df_centros[["idcentro", "nombrecentro", "ciudad", "tipocentro"]],
                    left_on="idcentromedico",
                    right_on="idcentro",
                    how="left"
                )
            
            centro_agg["promedio_dosis"] = centro_agg["promedio_dosis"].round(2)
            centro_agg = centro_agg.sort_values("personas_vacunadas", ascending=False)
            
            analitica["centros_performance"] = centro_agg
            print(f"  ✓ Analítica de centros (performance): {len(centro_agg)} centros")
        else:
            analitica["centros_performance"] = pd.DataFrame()
    else:
        analitica["centros_performance"] = pd.DataFrame()
    
    
    # ── AGRUPACION 2: Vacunas más aplicadas por centro ──────────────────────
    # Top 5 vacunas en cada centro
    if not df_registros.empty and "idcentromedico" in df_registros.columns and "nombrevacuna" in df_registros.columns:
        vacunas_centro = df_registros.dropna(subset=["idcentromedico"]).groupby(
            ["idcentromedico", "nombrevacuna"]
        )["idregistro"].count().reset_index(name="cantidad")
        
        vacunas_centro = vacunas_centro.sort_values(["idcentromedico", "cantidad"], ascending=[True, False])
        analitica["vacunas_por_centro"] = vacunas_centro
        print(f"  ✓ Análitica de centros (vacunas): {len(vacunas_centro)} combinaciones")
    else:
        analitica["vacunas_por_centro"] = pd.DataFrame()
    
    
    # ── AGRUPACION 3: Cumplimiento de esquema por centro ───────────────────
    # Porcentaje de personas que completaron esquema en cada centro
    if (not df_registros.empty and not df_vacunas.empty and 
        "idcentromedico" in df_registros.columns and "dosisrequeridas" in df_vacunas.columns):
        
        df_temp = df_registros.dropna(subset=["idcentromedico"]).merge(
            df_vacunas[["idvacuna", "dosisrequeridas"]],
            on="idvacuna",
            how="left"
        )
        
        # Por usuario y vacuna, contar max dosis
        esquema_temp = df_temp.groupby(["idcentromedico", "idusuario", "idvacuna"]).agg({
            "numerodosis": "max",
            "dosisrequeridas": "first"
        }).reset_index()
        
        # Marcar como completo
        esquema_temp["completo"] = esquema_temp["numerodosis"] >= esquema_temp["dosisrequeridas"]
        
        # Contar por centro
        esquema_centro = esquema_temp.groupby("idcentromedico").agg({
            "idusuario": "nunique",
            "completo": "sum"
        }).reset_index()
        esquema_centro.columns = ["idcentromedico", "total_usuarios", "usuarios_esquema_completo"]
        esquema_centro["porcentaje_cumplimiento"] = (
            (esquema_centro["usuarios_esquema_completo"] / esquema_centro["total_usuarios"] * 100)
            .round(2)
        )
        
        analitica["esquema_cumplimiento_centro"] = esquema_centro
        print(f"  ✓ Analítica de centros (cumplimiento): {len(esquema_centro)} centros")
    else:
        analitica["esquema_cumplimiento_centro"] = pd.DataFrame()
    
    
    # ── AGRUPACION 4: Tendencia temporal por centro ────────────────────────
    # Vacunaciones por mes en cada centro (top 5 centros)
    if not df_registros.empty and "idcentromedico" in df_registros.columns and "fechaaplicacion" in df_registros.columns:
        df_temp = df_registros.dropna(subset=["idcentromedico", "fechaaplicacion"]).copy()
        
        if not df_temp.empty:
            df_temp["mes_aplicacion"] = df_temp["fechaaplicacion"].dt.to_period("M").astype(str)
            
            # Top 5 centros por volumen
            top_centros = df_registros.dropna(subset=["idcentromedico"]).groupby("idcentromedico")[
                "idregistro"
            ].count().nlargest(5).index.tolist()
            
            if top_centros:
                tendencia = df_temp[df_temp["idcentromedico"].isin(top_centros)].groupby(
                    ["idcentromedico", "mes_aplicacion"]
                )["idregistro"].count().reset_index(name="total")
                
                analitica["tendencia_temporal_centros"] = tendencia.sort_values(
                    ["idcentromedico", "mes_aplicacion"]
                )
                print(f"  ✓ Analítica de centros (tendencia): {len(top_centros)} centros top")
            else:
                analitica["tendencia_temporal_centros"] = pd.DataFrame()
        else:
            analitica["tendencia_temporal_centros"] = pd.DataFrame()
    else:
        analitica["tendencia_temporal_centros"] = pd.DataFrame()
    
    
    # ── AGRUPACION 5: Resumen ejecutivo por centro ───────────────────────
    # KPI clave para cada centro
    if not analitica["centros_performance"].empty:
        kpi_centros = analitica["centros_performance"][[
            "idcentromedico", "nombrecentro", "ciudad", "personas_vacunadas", 
            "total_dosis", "promedio_dosis"
        ]].copy()
        
        analitica["kpi_centros"] = kpi_centros
        print(f"  ✓ KPI por centros: {len(kpi_centros)} indicadores")
    else:
        analitica["kpi_centros"] = pd.DataFrame()
    
    
    return analitica


def generar_analitica_paciente(df_registros, df_vacunas, idusuario):
    """
    Genera analítica personalizada para un paciente específico.
    
    Retorna:
    - Vacunas que tiene aplicadas
    - Cuántas personas tienen esas vacunas
    - Cuántos completaron esquema
    - Progreso del paciente
    """
    analitica = {}
    
    # ── Registros del paciente ──────────────────────────────────────────────
    registros_paciente = df_registros[df_registros["idusuario"] == idusuario]
    
    if registros_paciente.empty:
        analitica["mensaje"] = "No hay registros de vacunación"
        analitica["vacunas_paciente"] = []
        analitica["progreso"] = {"dosis_aplicadas": 0, "dosis_requeridas": 0}
        return analitica
    
    # ── Vacunas del paciente ────────────────────────────────────────────────
    vacunas_unicas = registros_paciente["idvacuna"].unique()
    vacunas_paciente = []
    
    for vid in vacunas_unicas:
        reg = registros_paciente[registros_paciente["idvacuna"] == vid].iloc[0]
        vacunas_paciente.append({
            "idvacuna": vid,
            "nombrevacuna": reg.get("nombrevacuna", f"Vacuna {vid}"),
            "dosis_aplicadas": registros_paciente[registros_paciente["idvacuna"] == vid]["numerodosis"].max(),
        })
    
    # ── Personas con mismas vacunas ─────────────────────────────────────────
    personas_mismas_vacunas = []
    vacunas_ids = [v["idvacuna"] for v in vacunas_paciente]
    
    for vacuna_info in vacunas_paciente:
        # Contar únicos usuarios con esta vacuna
        personas = df_registros[df_registros["idvacuna"] == vacuna_info["idvacuna"]]["idusuario"].nunique()
        
        # Contar con esquema completo
        registros_vacuna = df_registros[df_registros["idvacuna"] == vacuna_info["idvacuna"]]
        dosis_max_por_usuario = registros_vacuna.groupby("idusuario")["numerodosis"].max()
        
        vacuna_info_full = df_vacunas[df_vacunas["idvacuna"] == vacuna_info["idvacuna"]].iloc[0]
        dosis_requeridas = vacuna_info_full.get("dosisrequeridas", 1) if not df_vacunas.empty else 1
        
        completos = (dosis_max_por_usuario >= dosis_requeridas).sum()
        
        personas_mismas_vacunas.append({
            "nombrevacuna": vacuna_info["nombrevacuna"],
            "personas_vacunadas": personas,
            "personas_esquema_completo": completos,
            "porcentaje_completo": round((completos / personas * 100) if personas > 0 else 0, 2)
        })
    
    # ── Progreso del paciente ───────────────────────────────────────────────
    dosis_requeridas_total = 0
    for vacuna_info in vacunas_paciente:
        vacuna_full = df_vacunas[df_vacunas["idvacuna"] == vacuna_info["idvacuna"]].iloc[0]
        dosis_requeridas_total += vacuna_full.get("dosisrequeridas", 1) if not df_vacunas.empty else 1
    
    dosis_aplicadas = len(registros_paciente)
    progreso = {
        "dosis_aplicadas": dosis_aplicadas,
        "dosis_requeridas": dosis_requeridas_total,
        "porcentaje": round((dosis_aplicadas / dosis_requeridas_total * 100) if dosis_requeridas_total > 0 else 0, 2)
    }
    
    # ── Mensaje motivacional ────────────────────────────────────────────────
    if progreso["dosis_aplicadas"] >= progreso["dosis_requeridas"]:
        mensaje = f"¡Excelente! Has completado tu esquema de vacunación. Continúa protegiendo tu salud."
    else:
        faltantes = progreso["dosis_requeridas"] - progreso["dosis_aplicadas"]
        mensaje = f"Te faltan {faltantes} dosis. Mira cuántas personas ya completaron. ¡Tú también puedes!"
    
    analitica["vacunas_paciente"] = vacunas_paciente
    analitica["personas_mismas_vacunas"] = personas_mismas_vacunas
    analitica["progreso"] = progreso
    analitica["mensaje"] = mensaje
    
    return analitica
