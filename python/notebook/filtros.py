import pandas as pd


def aplicar_filtros(df_registros, df_vacunas, df_usuarios, df_centros, df_alertas):
    """
    Cinco filtros de negocio aplicados con query() y operadores logicos.
    Retorna dict con los DataFrames resultantes.
    """
    f = {}

    # F1: Registros de primeras dosis
    # Pregunta: cuantos pacientes iniciaron un esquema de vacunacion?
    f["primeras_dosis"] = (
        df_registros.query("numerodosis == 1").copy()
        if not df_registros.empty and "numerodosis" in df_registros.columns
        else pd.DataFrame()
    )

    # F2: Vacunas con refuerzo requerido y mas de una dosis
    # Pregunta: que vacunas requieren seguimiento continuo?
    f["vacunas_refuerzo_multidosis"] = (
        df_vacunas[
            (df_vacunas["requiererefuerzo"] == True) &
            (df_vacunas["dosisrequeridas"] > 1)
        ].copy()
        if not df_vacunas.empty and "requiererefuerzo" in df_vacunas.columns
        else pd.DataFrame()
    )

    # F3: Alertas pendientes de envio
    # Pregunta: cuantas alertas aun no han llegado al usuario?
    f["alertas_pendientes"] = (
        df_alertas.query("estado == 'pendiente'").copy()
        if not df_alertas.empty and "estado" in df_alertas.columns
        else pd.DataFrame()
    )

    # F4: Vacunas con intervalo mayor a 20 dias sin refuerzo
    # Pregunta: que vacunas tienen esquema largo pero no requieren refuerzo?
    if not df_vacunas.empty and "intervalodosisdias" in df_vacunas.columns:
        tmp = df_vacunas[df_vacunas["intervalodosisdias"].notna()]
        f["intervalo_largo_sin_refuerzo"] = tmp[
            (tmp["intervalodosisdias"] > 20) & (tmp["requiererefuerzo"] == False)
        ].copy()
    else:
        f["intervalo_largo_sin_refuerzo"] = pd.DataFrame()

    # F5: Registros con proxima dosis programada
    # Pregunta: que pacientes tienen esquema incompleto activo?
    f["con_proxima_dosis"] = (
        df_registros[df_registros["proximadosisfecha"].notna()].copy()
        if not df_registros.empty and "proximadosisfecha" in df_registros.columns
        else pd.DataFrame()
    )

    # F6: Alertas de vencimiento ya enviadas
    # Pregunta: cuantas alertas criticas llegaron efectivamente al usuario?
    f["vencimientos_enviados"] = (
        df_alertas[
            (df_alertas["tipoalerta"] == "vencimiento") &
            (df_alertas["estado"] == "enviada")
        ].copy()
        if not df_alertas.empty and "tipoalerta" in df_alertas.columns
        else pd.DataFrame()
    )

    for nombre, df in f.items():
        print(f"  {nombre}: {len(df)} registros")

    return f
