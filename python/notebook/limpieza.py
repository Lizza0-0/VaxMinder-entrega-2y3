import pandas as pd


def _to_df(datos):
    return pd.DataFrame(datos) if isinstance(datos, list) else datos.copy()


def _unnest(df, col, id_key):
    if col in df.columns and df[col].dtype == object:
        df[col] = df[col].apply(lambda x: x.get(id_key) if isinstance(x, dict) else x)
    return df


def _to_numeric(df, cols):
    for c in cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")
    return df


def _to_datetime(df, cols):
    for c in cols:
        if c in df.columns:
            df[c] = pd.to_datetime(df[c], errors="coerce")
    return df


def limpiar_registros_vacunacion(datos):
    df = _to_df(datos)

    _unnest(df, "idusuario", "idusuario")

    if "idvacuna" in df.columns:
        df["nombrevacuna"] = df["idvacuna"].apply(
            lambda x: x.get("nombrevacuna") if isinstance(x, dict) else None
        )
        df["idvacuna"] = df["idvacuna"].apply(
            lambda x: x.get("idvacuna") if isinstance(x, dict) else x
        )

    if "idcentromedico" in df.columns and df["idcentromedico"].dtype == object:
        df["idcentromedico"] = df["idcentromedico"].apply(
            lambda x: x.get("idcentro") if isinstance(x, dict) else x
        )

    _to_datetime(df, ["fechaaplicacion", "proximadosisfecha"])
    _to_numeric(df, ["idregistro", "idusuario", "idvacuna", "numerodosis", "idcentromedico"])

    required = [c for c in ["idregistro", "idusuario", "idvacuna", "fechaaplicacion", "numerodosis"] if c in df.columns]
    df = df.dropna(subset=required)
    df = df[df["numerodosis"] >= 1]
    df = df[df["idregistro"] > 0]
    df = df.drop_duplicates(subset=["idregistro"]).reset_index(drop=True)

    print(f"  registros vacunacion: {len(df)}")
    return df


def limpiar_vacunas_catalogo(datos):
    df = _to_df(datos)
    _to_numeric(df, ["idvacuna", "dosisrequeridas", "intervalodosisdias"])
    df = df.dropna(subset=["idvacuna", "nombrevacuna", "dosisrequeridas"])
    df = df[(df["idvacuna"] > 0) & (df["dosisrequeridas"] >= 1)]
    if "nombrevacuna" in df.columns:
        df["nombrevacuna"] = df["nombrevacuna"].astype(str).str.strip()
    df = df.drop_duplicates(subset=["idvacuna"]).reset_index(drop=True)
    print(f"  vacunas catalogo: {len(df)}")
    return df


def limpiar_usuarios(datos):
    df = _to_df(datos)
    _to_datetime(df, ["fechanacimiento", "fecharegistro"])
    _to_numeric(df, ["idusuario"])
    df = df.dropna(subset=["idusuario", "nombre", "apellido", "email"])
    df = df[df["idusuario"] > 0]
    df = df[df["email"].str.contains("@", na=False) & df["email"].str.contains(r"\.", na=False)]
    df = df.drop_duplicates(subset=["idusuario"]).reset_index(drop=True)
    print(f"  usuarios: {len(df)}")
    return df


def limpiar_centros_medicos(datos):
    df = _to_df(datos)
    _to_numeric(df, ["idcentro"])
    df = df.dropna(subset=["idcentro", "nombrecentro", "ciudad"])
    df = df[df["idcentro"] > 0]
    for col in ["ciudad", "nombrecentro"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
    df = df.drop_duplicates(subset=["idcentro"]).reset_index(drop=True)
    print(f"  centros medicos: {len(df)}")
    return df


def limpiar_alertas(datos):
    df = _to_df(datos)
    _unnest(df, "idusuario", "idusuario")
    _to_datetime(df, ["fechaalerta", "fechaenvio"])
    _to_numeric(df, ["idalerta", "idusuario"])
    df = df.dropna(subset=["idalerta", "idusuario", "tipoalerta", "estado"])
    df = df[df["idalerta"] > 0]
    if "estado" in df.columns:
        df["estado"] = df["estado"].astype(str).str.strip().str.lower()
        df = df[df["estado"].isin(["pendiente", "enviada", "leida", "descartada"])]
    df = df.drop_duplicates(subset=["idalerta"]).reset_index(drop=True)
    print(f"  alertas: {len(df)}")
    return df
