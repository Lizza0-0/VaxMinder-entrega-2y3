import requests

def consumir_registros_vacunacion():
    url = "http://localhost:8080/api/registrovacunacion"
    respuesta = requests.get(url)
    respuesta.raise_for_status()
    return respuesta.json()

def consumir_catalogo_vacunas():
    url = "http://localhost:8080/api/vacunascatalogo"
    respuesta = requests.get(url)
    respuesta.raise_for_status()
    return respuesta.json()
