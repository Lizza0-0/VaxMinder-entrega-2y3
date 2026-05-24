import pandas as pd


def describir_datos(data_frame_limpio, nombre="Dataset"):
    print(f"\n*** DESCRIPCION DE: {nombre.upper()} ***")
    print(f"Número de filas: {data_frame_limpio.shape[0]}")
    print(f"Número de columnas: {data_frame_limpio.shape[1]}")
    print(f"Columnas disponibles: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato:\n{data_frame_limpio.dtypes}\n")

    # Estadísticas de columnas numéricas
    columnas_numericas = data_frame_limpio.select_dtypes(include="number").columns.tolist()
    if columnas_numericas:
        print("*** ESTADÍSTICAS NUMÉRICAS ***")
        print(data_frame_limpio[columnas_numericas].describe())

    # Conteos de columnas categóricas (máximo 3 para no saturar la salida)
    columnas_texto = data_frame_limpio.select_dtypes(include=["object", "string"]).columns.tolist()
    if columnas_texto:
        print("\n*** CONTEOS DE COLUMNAS CATEGÓRICAS ***")
        for col in columnas_texto[:3]:
            print(f"\n{col}:\n{data_frame_limpio[col].value_counts().head(10)}")

    # Rango de fechas de columnas datetime
    columnas_fecha = data_frame_limpio.select_dtypes(include=["datetime64[ns]", "datetime64[us]"]).columns.tolist()
    if columnas_fecha:
        print("\n*** RANGOS DE FECHAS ***")
        for col in columnas_fecha:
            print(f"{col} — desde: {data_frame_limpio[col].min()}  hasta: {data_frame_limpio[col].max()}")
