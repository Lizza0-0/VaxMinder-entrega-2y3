import requests

BASE_URL  = "http://localhost:8080/api"
IDUSUARIO = 1192742853
CONTRASENA = "123456"


def _get(endpoint):
    r = requests.get(f"{BASE_URL}/{endpoint}", headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.json()


def _auth():
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"idusuario": IDUSUARIO, "contrasena": CONTRASENA},
                      timeout=10)
    r.raise_for_status()
    return r.json().get("token")


TOKEN   = _auth()
HEADERS = {"Authorization": f"Bearer {TOKEN}"}


def consumir_registros_vacunacion():
    return _get("registrovacunacion")

def consumir_vacunas_catalogo():
    return _get("vacunascatalogo")

def consumir_usuarios():
    return _get("usuarios")

def consumir_centros_medicos():
    return _get("centrosmedicos")

def consumir_alertas():
    return _get("alertas")
