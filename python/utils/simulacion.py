import random

from datetime import datetime,timedelta

def generar_simulacion(numeroSimulaciones):

    nombres=["esterilizacion","corte uñas","vacunacion"]
    codigos=["am001","am045","am300"]
    costos=[350000,100000,250000]
    fechaInicio=datetime(2026,1,2)

    simulaciones=[]
    for _ in range(numeroSimulaciones):

        simulacion={
            "id":random.randint(0,200),
            "servicio":random.choice(nombres),
            "costo":random.choice(costos),
            "codigo":random.choice(codigos),
            "fecha":fechaInicio+timedelta(days=random.randint(0,60))
        }

        #Inyectando errores controlados 
        probabilidadError=random.random()
        if(probabilidadError<0.2):
            simulacion["id"]=None
        elif(probabilidadError<0.4):
            simulacion["servicio"]=random.choice(["clase de python","clase de ingles"])
        elif(probabilidadError<0.5):
            simulacion["costo"]=random.choice([0,-10000,None])
        elif(probabilidadError<0.8):
            simulacion["codigo"]=" "+simulacion["codigo"].upper()
        elif(probabilidadError<0.9):
            simulacion["fecha"]=None

        simulaciones.append(simulacion)
    return simulaciones
