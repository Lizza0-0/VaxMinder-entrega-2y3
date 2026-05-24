import matplotlib.pyplot as plt
import seaborn as sns
import os

# Ruta hacia la carpeta public del frontend React (donde Vite sirve archivos estáticos)
RUTA_ASSETS = os.path.join(
    os.path.dirname(__file__), "..", "..", "Frontend con Backend", "public", "graficos"
)


def crear_ruta_si_no_existe(ruta_destino):
    os.makedirs(ruta_destino, exist_ok=True)


def graficar_lineas(datos_agrupados, columna_eje_x, columna_eje_y,
                    titulo="Gráfico de líneas", color_linea="#2196F3",
                    nombre_archivo="lineas.png", ruta_destino=RUTA_ASSETS):
    # Tendencia temporal: útil para ver evolución de vacunaciones por mes
    crear_ruta_si_no_existe(ruta_destino)
    figura, area_dibujo = plt.subplots(figsize=(10, 5))

    area_dibujo.plot(
        datos_agrupados[columna_eje_x],
        datos_agrupados[columna_eje_y],
        marker="o",
        color=color_linea,
        linewidth=2
    )

    area_dibujo.set_title(titulo, fontsize=14)
    area_dibujo.set_xlabel(columna_eje_x, fontsize=12)
    area_dibujo.set_ylabel(columna_eje_y, fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.6)
    plt.xticks(rotation=45)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, nombre_archivo)
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de líneas guardado en: {ruta_completa}")


def graficar_barras(datos_agrupados, columna_categorias, columna_valores,
                    titulo="Gráfico de barras", color_barras="#4CAF50",
                    nombre_archivo="barras.png", ruta_destino=RUTA_ASSETS):
    # Comparación de cantidades entre categorías (ej. vacunas más aplicadas)
    crear_ruta_si_no_existe(ruta_destino)
    figura, area_dibujo = plt.subplots(figsize=(10, 5))

    area_dibujo.bar(
        datos_agrupados[columna_categorias],
        datos_agrupados[columna_valores],
        color=color_barras,
        edgecolor="black"
    )

    area_dibujo.set_title(titulo, fontsize=14)
    area_dibujo.set_xlabel(columna_categorias, fontsize=12)
    area_dibujo.set_ylabel(columna_valores, fontsize=12)
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, nombre_archivo)
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


def graficar_torta(datos_agrupados, columna_etiquetas, columna_valores,
                   titulo="Gráfico de torta", lista_colores=None,
                   nombre_archivo="torta.png", ruta_destino=RUTA_ASSETS):
    # Proporción de cada categoría respecto al total (ej. distribución de dosis)
    crear_ruta_si_no_existe(ruta_destino)

    if lista_colores is None:
        lista_colores = ["#FF9800", "#2196F3", "#4CAF50", "#E91E63", "#9C27B0"]

    figura, area_dibujo = plt.subplots(figsize=(8, 8))
    cantidad_categorias = len(datos_agrupados)

    area_dibujo.pie(
        datos_agrupados[columna_valores],
        labels=datos_agrupados[columna_etiquetas],
        autopct="%1.1f%%",
        colors=lista_colores[:cantidad_categorias],
        startangle=90,
        wedgeprops={"edgecolor": "black", "linewidth": 0.5}
    )

    area_dibujo.set_title(titulo, fontsize=14)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, nombre_archivo)
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de torta guardado en: {ruta_completa}")


def graficar_mapa_calor(datos_agrupados, columna_filas, columna_columnas, columna_valores,
                        titulo="Mapa de calor", paleta_color="YlOrRd",
                        nombre_archivo="mapa_calor.png", ruta_destino=RUTA_ASSETS):
    # Intensidad de combinaciones fila-columna (ej. tipo de vacuna vs centro médico)
    crear_ruta_si_no_existe(ruta_destino)

    tabla_pivote = datos_agrupados.pivot_table(
        index=columna_filas,
        columns=columna_columnas,
        values=columna_valores,
        aggfunc="sum",
        fill_value=0
    )

    figura, area_dibujo = plt.subplots(figsize=(10, 6))

    sns.heatmap(
        tabla_pivote,
        annot=True,
        fmt=".0f",
        cmap=paleta_color,
        ax=area_dibujo,
        linewidths=0.5,
        linecolor="gray"
    )

    area_dibujo.set_title(titulo, fontsize=14)
    plt.xticks(rotation=45)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, nombre_archivo)
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Mapa de calor guardado en: {ruta_completa}")


def graficar_scatter(datos, columna_x, columna_y, columna_etiqueta=None,
                     titulo="Gráfico de dispersión", color="#9C27B0",
                     nombre_archivo="scatter.png", ruta_destino=RUTA_ASSETS):
    # Relación entre dos variables numéricas (ej. dosis requeridas vs intervalo)
    crear_ruta_si_no_existe(ruta_destino)
    figura, area_dibujo = plt.subplots(figsize=(10, 6))

    area_dibujo.scatter(
        datos[columna_x],
        datos[columna_y],
        color=color,
        alpha=0.7,
        edgecolors="black",
        s=120
    )

    if columna_etiqueta:
        for _, fila in datos.iterrows():
            area_dibujo.annotate(
                str(fila[columna_etiqueta]),
                (fila[columna_x], fila[columna_y]),
                textcoords="offset points",
                xytext=(6, 4),
                fontsize=8
            )

    area_dibujo.set_title(titulo, fontsize=14)
    area_dibujo.set_xlabel(columna_x, fontsize=12)
    area_dibujo.set_ylabel(columna_y, fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, nombre_archivo)
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de dispersión guardado en: {ruta_completa}")


def graficar_histograma(datos, columna, titulo="Histograma", color="#FF5722",
                        bins=10, nombre_archivo="histograma.png", ruta_destino=RUTA_ASSETS):
    # Distribución de frecuencias de una variable numérica (ej. número de dosis)
    crear_ruta_si_no_existe(ruta_destino)
    figura, area_dibujo = plt.subplots(figsize=(10, 5))

    area_dibujo.hist(
        datos[columna].dropna(),
        bins=bins,
        color=color,
        edgecolor="black",
        alpha=0.85
    )

    area_dibujo.set_title(titulo, fontsize=14)
    area_dibujo.set_xlabel(columna, fontsize=12)
    area_dibujo.set_ylabel("Frecuencia", fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, nombre_archivo)
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Histograma guardado en: {ruta_completa}")
