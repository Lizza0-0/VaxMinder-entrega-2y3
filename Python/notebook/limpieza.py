import pandas as pd
from datetime import date

def limpiar_registros(df_sucio):
    df = df_sucio.copy()

    # Extraer campos desde objetos anidados que retorna Spring Boot
    df["idusuario_id"] = df["idusuario"].apply(
        lambda x: x.get("idusuario") if isinstance(x, dict) else x
    )
    df["nombrevacuna"] = df["idvacuna"].apply(
        lambda x: x.get("nombrevacuna") if isinstance(x, dict) else None
    )
    df["dosisrequeridas_vacuna"] = df["idvacuna"].apply(
        lambda x: x.get("dosisrequeridas") if isinstance(x, dict) else None
    )
    df["nombrecentro"] = df["idcentromedico"].apply(
        lambda x: x.get("nombrecentro") if isinstance(x, dict) else None
    )

    # Limpieza de textos
    df["nombrevacuna"] = df["nombrevacuna"].astype("string").str.strip().str.title()
    df["nombrecentro"] = df["nombrecentro"].astype("string").str.strip()
    df["lotevacuna"] = df["lotevacuna"].astype("string").str.strip().str.upper()

    # Convertir campos numéricos
    df["idregistro"] = pd.to_numeric(df["idregistro"], errors="coerce")
    df["numerodosis"] = pd.to_numeric(df["numerodosis"], errors="coerce")
    df["idusuario_id"] = pd.to_numeric(df["idusuario_id"], errors="coerce")
    df["dosisrequeridas_vacuna"] = pd.to_numeric(df["dosisrequeridas_vacuna"], errors="coerce")

    # Validar rangos numéricos esperados
    df = df[df["idregistro"] > 0]
    df = df[df["numerodosis"] >= 1]

    # Convertir fechas
    df["fechaaplicacion"] = pd.to_datetime(df["fechaaplicacion"], errors="coerce")
    df["proximadosisfecha"] = pd.to_datetime(df["proximadosisfecha"], errors="coerce")

    # Reemplazar fecha de aplicación nula por fecha por defecto
    fecha_default = pd.to_datetime("2025-01-01")
    df["fechaaplicacion"] = df["fechaaplicacion"].fillna(fecha_default)

    # Campos derivados de fecha para filtros y agrupaciones
    df["año_aplicacion"] = df["fechaaplicacion"].dt.year
    df["año_mes"] = df["fechaaplicacion"].dt.to_period("M").astype(str)

    # Días restantes para la próxima dosis desde hoy
    hoy = pd.Timestamp(date.today())
    df["dias_para_proxima_dosis"] = (df["proximadosisfecha"] - hoy).dt.days

    # Eliminar registros con campos obligatorios nulos
    columnas_obligatorias = ["idregistro", "nombrevacuna", "numerodosis", "fechaaplicacion"]
    df = df.dropna(subset=columnas_obligatorias)

    return df


def limpiar_vacunas(df_sucio):
    df = df_sucio.copy()

    # Limpieza de textos
    df["nombrevacuna"] = df["nombrevacuna"].astype("string").str.strip().str.title()
    df["descripcion"] = df["descripcion"].astype("string").str.strip()
    df["edadrecomendada"] = df["edadrecomendada"].astype("string").str.strip()

    # Convertir campos numéricos
    df["idvacuna"] = pd.to_numeric(df["idvacuna"], errors="coerce")
    df["dosisrequeridas"] = pd.to_numeric(df["dosisrequeridas"], errors="coerce")
    df["intervalodosisdias"] = pd.to_numeric(df["intervalodosisdias"], errors="coerce").fillna(0)

    # Validar rangos esperados
    df = df[df["idvacuna"] > 0]
    df = df[df["dosisrequeridas"] >= 1]

    # Asegurar tipo booleano
    df["requiererefuerzo"] = df["requiererefuerzo"].fillna(False).astype(bool)

    # Eliminar registros con campos obligatorios nulos
    df = df.dropna(subset=["idvacuna", "nombrevacuna", "dosisrequeridas"])

    return df
