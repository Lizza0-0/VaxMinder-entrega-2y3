import pandas as pd


def _nombre_vacuna_map(df_registros, df_vacunas):
    m = {}
    if not df_vacunas.empty and "nombrevacuna" in df_vacunas.columns:
        m.update(dict(zip(df_vacunas["idvacuna"], df_vacunas["nombrevacuna"])))
    if not df_registros.empty and "nombrevacuna" in df_registros.columns:
        tmp = df_registros[["idvacuna", "nombrevacuna"]].dropna().drop_duplicates()
        m.update(dict(zip(tmp["idvacuna"], tmp["nombrevacuna"])))
    return m


def generar_agrupaciones(df_registros, df_vacunas, df_alertas, df_centros):
    ag = {}
    nmap = _nombre_vacuna_map(df_registros, df_vacunas)

    # 1. Aplicaciones totales por vacuna con porcentaje
    if not df_registros.empty and "idvacuna" in df_registros.columns:
        col = "nombrevacuna" if "nombrevacuna" in df_registros.columns else "idvacuna"
        a1 = (df_registros.groupby(col)["idregistro"]
              .count().reset_index(name="total_aplicaciones")
              .sort_values("total_aplicaciones", ascending=False))
        if col == "idvacuna":
            a1 = a1.rename(columns={"idvacuna": "nombrevacuna"})
        total = a1["total_aplicaciones"].sum()
        a1["porcentaje"] = (a1["total_aplicaciones"] / total * 100).round(1) if total else 0
        ag["vacunaciones_por_vacuna"] = a1
    else:
        ag["vacunaciones_por_vacuna"] = pd.DataFrame({"nombrevacuna": [], "total_aplicaciones": [], "porcentaje": []})

    # 2. Distribucion por numero de dosis
    if not df_registros.empty and "numerodosis" in df_registros.columns:
        a2 = (df_registros.groupby("numerodosis")["idregistro"]
              .count().reset_index(name="total").sort_values("numerodosis"))
        a2["etiqueta"] = a2["numerodosis"].apply(lambda x: f"Dosis {int(x)}")
        ag["vacunaciones_por_dosis"] = a2
    else:
        ag["vacunaciones_por_dosis"] = pd.DataFrame({"numerodosis": [], "total": [], "etiqueta": []})

    # 3. Alertas por estado
    if not df_alertas.empty and "estado" in df_alertas.columns:
        ag["alertas_por_estado"] = (df_alertas.groupby("estado")["idalerta"]
                                    .count().reset_index(name="cantidad")
                                    .sort_values("cantidad", ascending=False))
    else:
        ag["alertas_por_estado"] = pd.DataFrame({"estado": [], "cantidad": []})

    # 4. Alertas por tipo
    if not df_alertas.empty and "tipoalerta" in df_alertas.columns:
        ag["alertas_por_tipo"] = (df_alertas.groupby("tipoalerta")["idalerta"]
                                  .count().reset_index(name="cantidad"))
    else:
        ag["alertas_por_tipo"] = pd.DataFrame({"tipoalerta": [], "cantidad": []})

    # 5. Tendencia mensual de vacunaciones
    if not df_registros.empty and "fechaaplicacion" in df_registros.columns:
        tmp = df_registros[df_registros["fechaaplicacion"].notna()].copy()
        tmp["mes_aplicacion"] = tmp["fechaaplicacion"].dt.to_period("M").astype(str)
        ag["vacunaciones_por_mes"] = (tmp.groupby("mes_aplicacion")["idregistro"]
                                      .count().reset_index(name="total")
                                      .sort_values("mes_aplicacion"))
    else:
        ag["vacunaciones_por_mes"] = pd.DataFrame({"mes_aplicacion": [], "total": []})

    # 6. Centros por ciudad
    if not df_centros.empty and "ciudad" in df_centros.columns:
        ag["centros_por_ciudad"] = (df_centros.groupby("ciudad")["idcentro"]
                                    .count().reset_index(name="total_centros")
                                    .sort_values("total_centros", ascending=False))
    else:
        ag["centros_por_ciudad"] = pd.DataFrame({"ciudad": [], "total_centros": []})

    # 7. Panel completo por centro medico
    if not df_registros.empty and "idcentromedico" in df_registros.columns:
        dt = df_registros.dropna(subset=["idcentromedico"]).copy()
        if "nombrevacuna" not in dt.columns or dt["nombrevacuna"].isna().all():
            dt["nombrevacuna"] = dt["idvacuna"].map(nmap).fillna(dt["idvacuna"].astype(str))

        if not dt.empty:
            base = dt.groupby("idcentromedico").agg(
                personas_vacunadas=("idusuario", "nunique"),
                total_dosis=("idregistro", "count"),
                promedio_dosis=("numerodosis", "mean")
            ).reset_index()
            base["promedio_dosis"] = base["promedio_dosis"].round(2)

            total_sis = int(base["total_dosis"].sum())
            base["pct_del_total"] = (base["total_dosis"] / total_sis * 100).round(1) if total_sis else 0.0
            base = base.sort_values("personas_vacunadas", ascending=False).reset_index(drop=True)
            base["ranking"] = base.index + 1
            base["total_centros_sistema"] = len(base)

            # Vacuna top por centro
            vtop = (dt.groupby(["idcentromedico", "nombrevacuna"])["idregistro"]
                    .count().reset_index(name="n")
                    .sort_values("n", ascending=False)
                    .groupby("idcentromedico").first().reset_index()
                    .rename(columns={"nombrevacuna": "vacuna_top", "n": "vacuna_top_aplicaciones"}))
            base = base.merge(vtop[["idcentromedico", "vacuna_top", "vacuna_top_aplicaciones"]], on="idcentromedico", how="left")

            # Detalle de vacunas por centro
            desgl = (dt.groupby(["idcentromedico", "nombrevacuna"]).agg(
                         personas=("idusuario", "nunique"), dosis=("idregistro", "count"))
                     .reset_index())
            vdetalle = (desgl.sort_values("dosis", ascending=False)
                        .groupby("idcentromedico")
                        .apply(lambda g: [{"nombre": r["nombrevacuna"], "personas": int(r["personas"]), "dosis": int(r["dosis"])} for _, r in g.iterrows()])
                        .reset_index().rename(columns={0: "vacunas_detalle"}))
            vtipo = (desgl.groupby("idcentromedico")
                     .apply(lambda g: dict(zip(g["nombrevacuna"], g["personas"].tolist())))
                     .reset_index().rename(columns={0: "vacunas_por_tipo"}))
            base = base.merge(vdetalle, on="idcentromedico", how="left")
            base = base.merge(vtipo,    on="idcentromedico", how="left")

            # Tendencia mensual por centro
            if "fechaaplicacion" in dt.columns:
                tm = dt[dt["fechaaplicacion"].notna()].copy()
                tm["mes"] = tm["fechaaplicacion"].dt.to_period("M").astype(str)
                tend = (tm.groupby(["idcentromedico", "mes"])["idregistro"]
                        .count().reset_index(name="total")
                        .sort_values(["idcentromedico", "mes"]))
                mtend = (tend.groupby("idcentromedico")
                         .apply(lambda g: [{"mes": r["mes"], "total": int(r["total"])} for _, r in g.iterrows()])
                         .reset_index().rename(columns={0: "tendencia_mensual"}))
                base = base.merge(mtend, on="idcentromedico", how="left")

            # Alertas por estado por centro
            if not df_alertas.empty and "idusuario" in df_alertas.columns and "estado" in df_alertas.columns:
                upc = dt.groupby("idcentromedico")["idusuario"].unique().reset_index()
                rows = []
                for _, row in upc.iterrows():
                    ac = df_alertas[df_alertas["idusuario"].isin(row["idusuario"])]
                    rows.append({
                        "idcentromedico": row["idcentromedico"],
                        "alertas_por_estado": ac.groupby("estado").size().to_dict(),
                        "alertas_pendientes": int((ac["estado"] == "pendiente").sum()),
                        "alertas_total": len(ac)
                    })
                dfa = pd.DataFrame(rows)
                base = base.merge(dfa, on="idcentromedico", how="left")
                base["alertas_pendientes"] = base["alertas_pendientes"].fillna(0).astype(int)

            # Distribucion de dosis por centro
            if "numerodosis" in dt.columns:
                dd = dt.groupby(["idcentromedico", "numerodosis"])["idregistro"].count().reset_index(name="total")
                mdd = (dd.sort_values("numerodosis")
                       .groupby("idcentromedico")
                       .apply(lambda g: [{"dosis": f"Dosis {int(r['numerodosis'])}", "total": int(r["total"])} for _, r in g.iterrows()])
                       .reset_index().rename(columns={0: "distribucion_dosis"}))
                base = base.merge(mdd, on="idcentromedico", how="left")

            # Nombre del centro
            if not df_centros.empty and "idcentro" in df_centros.columns:
                cols = ["idcentro", "nombrecentro"] + (["ciudad"] if "ciudad" in df_centros.columns else [])
                base = base.merge(df_centros[cols], left_on="idcentromedico", right_on="idcentro", how="left")

            ag["vacunaciones_por_centro"] = base
            print(f"  vacunaciones por centro: {len(base)} centros")
        else:
            ag["vacunaciones_por_centro"] = pd.DataFrame()
    else:
        ag["vacunaciones_por_centro"] = pd.DataFrame()

    # 8. Personas unicas por vacuna (motivacion paciente)
    if not df_registros.empty and "idvacuna" in df_registros.columns:
        pv = (df_registros.groupby("idvacuna")["idusuario"].nunique()
              .reset_index(name="personas_vacunadas"))
        pv["nombrevacuna"] = pv["idvacuna"].map(nmap).fillna(pv["idvacuna"].astype(str))
        ag["personas_por_vacuna"] = (pv[["nombrevacuna", "personas_vacunadas"]]
                                     .sort_values("personas_vacunadas", ascending=False)
                                     .reset_index(drop=True))
    else:
        ag["personas_por_vacuna"] = pd.DataFrame({"nombrevacuna": [], "personas_vacunadas": []})

    # 9. Esquemas completados por vacuna
    if not df_registros.empty and not df_vacunas.empty and "dosisrequeridas" in df_vacunas.columns:
        tmp = df_registros.merge(df_vacunas[["idvacuna", "dosisrequeridas", "nombrevacuna"]],
                                 on="idvacuna", how="left", suffixes=("", "_cat"))
        if "nombrevacuna" not in tmp.columns or tmp["nombrevacuna"].isna().all():
            tmp["nombrevacuna"] = tmp.get("nombrevacuna_cat", tmp["idvacuna"].astype(str))
        st = tmp.groupby(["idusuario", "idvacuna"]).agg(
            dosis_max=("numerodosis", "max"),
            dosis_req=("dosisrequeridas", "first"),
            nombrevacuna=("nombrevacuna", "first")
        ).reset_index()
        comp = (st[st["dosis_max"] >= st["dosis_req"]]
                .groupby("nombrevacuna")["idusuario"].nunique()
                .reset_index(name="personas_esquema_completo")
                .sort_values("personas_esquema_completo", ascending=False))
        ag["esquemas_completados"] = comp
    else:
        ag["esquemas_completados"] = pd.DataFrame({"nombrevacuna": [], "personas_esquema_completo": []})

    # 10. Estado de vacunacion por usuario
    if not df_registros.empty and not df_vacunas.empty and "dosisrequeridas" in df_vacunas.columns:
        dmax = (df_registros.groupby(["idusuario", "idvacuna"])["numerodosis"]
                .max().reset_index(name="dosis_max_aplicada")
                .merge(df_vacunas[["idvacuna", "dosisrequeridas", "requiererefuerzo"]], on="idvacuna", how="left"))
        dmax["nombrevacuna"] = dmax["idvacuna"].map(nmap).fillna(dmax["idvacuna"].astype(str))
        dmax["dosis_faltantes"] = (dmax["dosisrequeridas"] - dmax["dosis_max_aplicada"]).clip(lower=0)
        dmax["estado"] = dmax["dosis_faltantes"].apply(lambda x: "completada" if x == 0 else "en_progreso")

        par = set(zip(dmax["idusuario"], dmax["idvacuna"]))
        pendientes = []
        for uid in df_registros["idusuario"].unique():
            for _, vrow in df_vacunas.iterrows():
                if (uid, vrow["idvacuna"]) not in par:
                    pendientes.append({
                        "idusuario": uid, "idvacuna": vrow["idvacuna"],
                        "nombrevacuna": nmap.get(vrow["idvacuna"], str(vrow["idvacuna"])),
                        "dosis_max_aplicada": 0,
                        "dosisrequeridas": int(vrow["dosisrequeridas"]),
                        "requiererefuerzo": bool(vrow.get("requiererefuerzo", False)),
                        "dosis_faltantes": int(vrow["dosisrequeridas"]),
                        "estado": "pendiente"
                    })

        cols = ["idusuario", "idvacuna", "nombrevacuna", "dosis_max_aplicada",
                "dosisrequeridas", "requiererefuerzo", "dosis_faltantes", "estado"]
        ev = pd.concat([dmax[cols], pd.DataFrame(pendientes)[cols]], ignore_index=True) if pendientes else dmax[cols].copy()
        ag["estado_vacunacion_por_usuario"] = ev

        resumen = ev.groupby("idusuario").agg(
            vacunas_completadas=("estado", lambda x: (x == "completada").sum()),
            vacunas_en_progreso=("estado", lambda x: (x == "en_progreso").sum()),
            vacunas_pendientes=("estado",  lambda x: (x == "pendiente").sum()),
            vacunas_con_refuerzo=("requiererefuerzo", lambda x: (x & (ev.loc[x.index, "estado"] != "pendiente")).sum()),
        ).reset_index()
        ag["resumen_vacunacion_por_usuario"] = resumen
        print(f"  estado vacunacion: {len(ev)} registros, {resumen['idusuario'].nunique()} usuarios")
    else:
        ag["estado_vacunacion_por_usuario"] = pd.DataFrame()
        ag["resumen_vacunacion_por_usuario"] = pd.DataFrame()

    # KPIs globales
    total_pv = int(df_registros["idusuario"].nunique()) if not df_registros.empty else 0
    top_vac  = str(ag["vacunaciones_por_vacuna"].iloc[0]["nombrevacuna"]) if not ag["vacunaciones_por_vacuna"].empty else ""
    try:
        total_esc = int(ag["esquemas_completados"]["personas_esquema_completo"].sum())
    except Exception:
        total_esc = 0

    ag["kpis"] = {
        "total_vacunaciones":              int(len(df_registros)) if not df_registros.empty else 0,
        "total_vacunas_catalogo":          int(len(df_vacunas))   if not df_vacunas.empty   else 0,
        "alertas_pendientes":              int(len(df_alertas[df_alertas["estado"] == "pendiente"])) if not df_alertas.empty and "estado" in df_alertas.columns else 0,
        "total_centros":                   int(len(df_centros))   if not df_centros.empty   else 0,
        "vacuna_mas_aplicada":             top_vac,
        "total_personas_vacunadas":        total_pv,
        "total_personas_esquema_completo": total_esc,
    }

    for k in ["vacunaciones_por_vacuna", "vacunaciones_por_dosis", "alertas_por_estado",
              "alertas_por_tipo", "vacunaciones_por_mes", "centros_por_ciudad",
              "personas_por_vacuna", "esquemas_completados"]:
        if k in ag:
            print(f"  {k}: {len(ag[k])} registros")

    return ag
