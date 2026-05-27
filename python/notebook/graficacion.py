import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

RUTA = os.path.join(os.path.dirname(__file__), "..", "..",
                    "Frontend con Backend", "src", "assets", "graficos")

PAL  = ["#0099ab","#00b4cc","#33c6d8","#66d8e5","#99eaf2","#006d7a","#004d57","#0081a7","#48cae4","#90e0ef"]
ROJO = "#ff6b6b"
VERDE= "#6bcb77"
AMAR = "#ffd93d"
MORA = "#845ec2"
GRIS = "#aaaaaa"


def _style():
    plt.rcParams.update({
        "font.family": "DejaVu Sans",
        "axes.spines.top": False, "axes.spines.right": False,
        "axes.grid": True, "grid.alpha": 0.3, "grid.linestyle": "--",
        "axes.facecolor": "#f8fafb", "figure.facecolor": "white",
    })

def _save(fig, nombre):
    os.makedirs(RUTA, exist_ok=True)
    fig.savefig(os.path.join(RUTA, nombre), dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"  guardada: {nombre}")

def _col(datos, opciones):
    for o in opciones:
        if o in datos.columns:
            return o
    return datos.columns[0]


def graficar_barras_vacunaciones(datos, nombre_archivo="barras_vacunaciones.png"):
    """Grafica 1: vacunaciones totales por tipo de vacuna.
    Conclusion: identifica la vacuna con mayor demanda en el sistema."""
    _style()
    if datos.empty: return
    cx = _col(datos, ["nombrevacuna"])
    cy = _col(datos, ["total_aplicaciones"])
    n  = len(datos)
    col = (PAL * (n // len(PAL) + 1))[:n]
    fig, ax = plt.subplots(figsize=(13, 6))
    bars = ax.bar(datos[cx], datos[cy], color=col, edgecolor="white", linewidth=1.2, zorder=3)
    for b in bars:
        h = b.get_height()
        ax.text(b.get_x() + b.get_width()/2, h + 0.05, str(int(h)),
                ha="center", va="bottom", fontsize=10, fontweight="bold", color="#374151")
    ax.set_title("Vacunaciones por Tipo de Vacuna", fontsize=16, fontweight="bold", pad=16, color="#111827")
    ax.set_xlabel("Vacuna", fontsize=12, color="#6b7280")
    ax.set_ylabel("Total de aplicaciones", fontsize=12, color="#6b7280")
    ax.tick_params(axis="x", rotation=30)
    ax.set_axisbelow(True)
    plt.tight_layout()
    _save(fig, nombre_archivo)


def graficar_torta_dosis(datos, nombre_archivo="torta_dosis.png"):
    """Grafica 2: distribucion por numero de dosis aplicadas.
    Conclusion: muestra la proporcion de primeras dosis frente a dosis de refuerzo."""
    _style()
    if datos.empty: return
    ce = _col(datos, ["etiqueta"])
    cv = _col(datos, ["total"])
    fig, ax = plt.subplots(figsize=(8, 8))
    wedges, texts, autotexts = ax.pie(
        datos[cv], labels=datos[ce], autopct="%1.1f%%",
        colors=[PAL[0], ROJO, AMAR, VERDE, MORA, PAL[1]][:len(datos)],
        startangle=90, wedgeprops={"edgecolor": "white", "linewidth": 2}, pctdistance=0.82)
    for at in autotexts:
        at.set_fontsize(11); at.set_fontweight("bold"); at.set_color("white")
    ax.add_patch(plt.Circle((0, 0), 0.60, color="white"))
    ax.text(0, 0, "Dosis", ha="center", va="center", fontsize=13, fontweight="bold", color="#374151")
    ax.set_title("Distribucion de Registros por Numero de Dosis",
                 fontsize=14, fontweight="bold", pad=16, color="#111827")
    plt.tight_layout()
    _save(fig, nombre_archivo)


def graficar_lineas_tiempo(datos, nombre_archivo="lineas_vacunaciones_tiempo.png"):
    """Grafica 3: tendencia mensual de vacunaciones.
    Conclusion: revela picos de demanda y periodos de baja actividad en el sistema."""
    _style()
    if datos.empty: return
    cx = _col(datos, ["mes_aplicacion"])
    cy = _col(datos, ["total"])
    x  = range(len(datos))
    fig, ax = plt.subplots(figsize=(13, 5))
    ax.fill_between(x, datos[cy], alpha=0.12, color=PAL[0])
    ax.plot(x, datos[cy], marker="o", color=PAL[0], linewidth=2.5, markersize=9,
            markerfacecolor="white", markeredgewidth=2.5, zorder=5)
    for i, v in enumerate(datos[cy]):
        ax.annotate(str(int(v)), xy=(i, v), xytext=(0, 10), textcoords="offset points",
                    ha="center", fontsize=9, fontweight="bold", color="#006d7a")
    ax.set_title("Tendencia Mensual de Vacunaciones", fontsize=16, fontweight="bold", pad=16, color="#111827")
    ax.set_xlabel("Mes de Aplicacion", fontsize=12, color="#6b7280")
    ax.set_ylabel("Total de Vacunaciones", fontsize=12, color="#6b7280")
    ax.set_xticks(list(x))
    ax.set_xticklabels(datos[cx], rotation=40, ha="right", fontsize=9)
    ax.set_axisbelow(True)
    plt.tight_layout()
    _save(fig, nombre_archivo)


def graficar_barras_alertas(datos, nombre_archivo="barras_alertas_estado.png"):
    """Grafica 4: alertas del sistema por estado.
    Conclusion: un alto volumen pendiente indica necesidad de seguimiento activo."""
    _style()
    if datos.empty: return
    ce = _col(datos, ["estado"])
    cc = _col(datos, ["cantidad"])
    cmap = {"pendiente": ROJO, "enviada": AMAR, "leida": VERDE, "descartada": GRIS}
    col  = [cmap.get(e, PAL[0]) for e in datos[ce]]
    fig, ax = plt.subplots(figsize=(10, 5))
    bars = ax.barh(datos[ce], datos[cc], color=col, edgecolor="white", linewidth=1.2, height=0.55, zorder=3)
    for b in bars:
        w = b.get_width()
        ax.text(w + 0.1, b.get_y() + b.get_height()/2, str(int(w)),
                va="center", fontsize=11, fontweight="bold", color="#374151")
    ax.set_title("Alertas del Sistema por Estado", fontsize=16, fontweight="bold", pad=16, color="#111827")
    ax.set_xlabel("Cantidad de Alertas", fontsize=12, color="#6b7280")
    ax.set_ylabel("Estado", fontsize=12, color="#6b7280")
    ax.set_axisbelow(True)
    ax.legend(handles=[mpatches.Patch(color=v, label=k.capitalize()) for k, v in cmap.items()],
              loc="lower right", fontsize=9)
    plt.tight_layout()
    _save(fig, nombre_archivo)


def graficar_torta_tipo_alerta(datos, nombre_archivo="torta_tipo_alerta.png"):
    """Grafica 5: proporcion por tipo de alerta.
    Conclusion: identifica el tipo de alerta mas frecuente para priorizar recursos."""
    _style()
    if datos.empty: return
    ce = _col(datos, ["tipoalerta"])
    cv = _col(datos, ["cantidad"])
    fig, ax = plt.subplots(figsize=(8, 8))
    wedges, texts, autotexts = ax.pie(
        datos[cv], labels=datos[ce], autopct="%1.1f%%",
        colors=[ROJO, AMAR, PAL[0], VERDE][:len(datos)],
        startangle=140, wedgeprops={"edgecolor": "white", "linewidth": 2})
    for at in autotexts:
        at.set_fontsize(11); at.set_fontweight("bold"); at.set_color("white")
    ax.set_title("Proporcion de Alertas por Tipo", fontsize=14, fontweight="bold", pad=16, color="#111827")
    plt.tight_layout()
    _save(fig, nombre_archivo)


def graficar_barras_centros_ciudad(datos, nombre_archivo="barras_centros_ciudad.png"):
    """Grafica 6: centros medicos por ciudad.
    Conclusion: muestra la distribucion geografica de la cobertura del sistema."""
    _style()
    if datos.empty: return
    cx = _col(datos, ["ciudad"])
    cy = _col(datos, ["total_centros"])
    fig, ax = plt.subplots(figsize=(12, 6))
    bars = ax.bar(datos[cx], datos[cy], color=MORA, edgecolor="white", linewidth=1.2, zorder=3)
    for b in bars:
        h = b.get_height()
        ax.text(b.get_x() + b.get_width()/2, h + 0.05, str(int(h)),
                ha="center", va="bottom", fontsize=10, fontweight="bold", color="#374151")
    ax.set_title("Centros Medicos por Ciudad", fontsize=16, fontweight="bold", pad=16, color="#111827")
    ax.set_xlabel("Ciudad", fontsize=12, color="#6b7280")
    ax.set_ylabel("Numero de Centros", fontsize=12, color="#6b7280")
    ax.tick_params(axis="x", rotation=35)
    ax.set_axisbelow(True)
    plt.tight_layout()
    _save(fig, nombre_archivo)


def graficar_estado_vacunacion_pacientes(datos, nombre_archivo="estado_vacunacion_pacientes.png"):
    """Grafica 7: vacunas aplicadas vs pendientes por paciente.
    Conclusion: evidencia el nivel de cobertura individual y detecta pacientes rezagados."""
    _style()
    if datos.empty: return
    res = datos.groupby("idusuario").agg(
        aplicadas=("estado", lambda x: x.isin(["completada", "en_progreso"]).sum()),
        pendientes=("estado", lambda x: (x == "pendiente").sum())
    ).reset_index()
    if res.empty: return
    x, w = np.arange(len(res)), 0.4
    fig, ax = plt.subplots(figsize=(max(10, len(res)*1.2), 6))
    b1 = ax.bar(x - w/2, res["aplicadas"],  w, label="Aplicadas",  color=VERDE, edgecolor="white", zorder=3)
    b2 = ax.bar(x + w/2, res["pendientes"], w, label="Pendientes", color=ROJO,  edgecolor="white", zorder=3)
    for b in list(b1) + list(b2):
        h = b.get_height()
        if h > 0:
            ax.text(b.get_x() + b.get_width()/2, h + 0.05, str(int(h)),
                    ha="center", va="bottom", fontsize=9, fontweight="bold", color="#374151")
    ax.set_title("Vacunas Aplicadas vs Pendientes por Paciente",
                 fontsize=15, fontweight="bold", pad=16, color="#111827")
    ax.set_xlabel("ID Paciente", fontsize=11, color="#6b7280")
    ax.set_ylabel("Numero de Vacunas", fontsize=11, color="#6b7280")
    ax.set_xticks(x); ax.set_xticklabels(res["idusuario"], rotation=30, ha="right", fontsize=8)
    ax.legend(fontsize=11); ax.set_axisbelow(True)
    plt.tight_layout()
    _save(fig, nombre_archivo)


def graficar_vacunas_pendientes_catalogo(datos, datos_vacunas, nombre_archivo="vacunas_pendientes_catalogo.png"):
    """Grafica 8: vacunas del catalogo con mayor numero de pacientes sin aplicar.
    Conclusion: revela la brecha de cobertura mas critica del sistema."""
    _style()
    if datos.empty: return
    pend = datos[datos["estado"] == "pendiente"]
    if pend.empty: return
    cont = (pend.groupby("nombrevacuna")["idusuario"].nunique()
            .reset_index(name="pacientes_pendientes")
            .sort_values("pacientes_pendientes", ascending=True))
    fig, ax = plt.subplots(figsize=(11, max(5, len(cont)*0.6)))
    bars = ax.barh(cont["nombrevacuna"], cont["pacientes_pendientes"],
                   color=ROJO, edgecolor="white", linewidth=1.2, height=0.6, zorder=3)
    for b in bars:
        w = b.get_width()
        ax.text(w + 0.05, b.get_y() + b.get_height()/2, str(int(w)),
                va="center", fontsize=11, fontweight="bold", color="#374151")
    ax.set_title("Vacunas Pendientes por Aplicar", fontsize=14, fontweight="bold", pad=16, color="#111827")
    ax.set_xlabel("Numero de Pacientes", fontsize=11, color="#6b7280")
    ax.set_axisbelow(True)
    plt.tight_layout()
    _save(fig, nombre_archivo)


def graficar_esquemas_completados(datos, nombre_archivo="esquemas_completados.png"):
    """Grafica 9: personas que completaron el esquema de cada vacuna.
    Conclusion: refleja el nivel de adherencia al esquema completo de vacunacion."""
    _style()
    if datos.empty: return
    cx = _col(datos, ["nombrevacuna"])
    cy = _col(datos, ["personas_esquema_completo"])
    fig, ax = plt.subplots(figsize=(12, 6))
    bars = ax.bar(datos[cx], datos[cy], color=VERDE, edgecolor="white", linewidth=1.2, zorder=3)
    for b in bars:
        h = b.get_height()
        ax.text(b.get_x() + b.get_width()/2, h + 0.05, str(int(h)),
                ha="center", va="bottom", fontsize=10, fontweight="bold", color="#374151")
    ax.set_title("Pacientes con Esquema de Vacunacion Completo",
                 fontsize=15, fontweight="bold", pad=16, color="#111827")
    ax.set_xlabel("Vacuna", fontsize=12, color="#6b7280")
    ax.set_ylabel("Personas con esquema completo", fontsize=12, color="#6b7280")
    ax.tick_params(axis="x", rotation=30)
    ax.set_axisbelow(True)
    plt.tight_layout()
    _save(fig, nombre_archivo)
