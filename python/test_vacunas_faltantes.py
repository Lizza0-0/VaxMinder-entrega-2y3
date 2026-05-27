"""
TEST SCRIPT: Validar lógica de "vacunas faltantes" 
Este script simula lo que hará React en el CarnetPage
"""

import json
import os

# Ruta de datos
DATA_DIR = os.path.join(
    os.path.dirname(__file__), "..",
    "Frontend con Backend", "src", "assets", "data"
)

# Simular carnet de un usuario (debe venir del backend)
# Ejemplo: usuario tiene 3 vacunaciones
carnet_ejemplo = [
    {
        "idvacuna": {"nombrevacuna": "COVID-19 Bivalente", "dosisrequeridas": 3},
        "numerodosis": 1
    },
    {
        "idvacuna": {"nombrevacuna": "Tetanos Td", "dosisrequeridas": 1},
        "numerodosis": 1
    }
]

# Cargar datos de comunidad
personas_por_vacuna_path = os.path.join(DATA_DIR, "personas_por_vacuna.json")
with open(personas_por_vacuna_path, 'r', encoding='utf-8') as f:
    personas_por_vacuna = json.load(f)

print("=" * 70)
print("TEST: CÁLCULO DE VACUNAS FALTANTES")
print("=" * 70)

print("\n📋 CARNET DEL USUARIO (simulado):")
for reg in carnet_ejemplo:
    nombre = reg["idvacuna"]["nombrevacuna"]
    dosis = reg["numerodosis"]
    requeridas = reg["idvacuna"]["dosisrequeridas"]
    print(f"  • {nombre}: Dosis {dosis}/{requeridas}")

print("\n👥 DATOS DE COMUNIDAD (personas_por_vacuna.json):")
for v in personas_por_vacuna:
    print(f"  • {v['nombrevacuna']}: {v['personas_vacunadas']} personas")

# Lógica de vacunas faltantes (igual a React)
print("\n" + "=" * 70)
print("CÁLCULO: Vacunas que le FALTAN al usuario")
print("=" * 70)

vacunasAplicadas = {}
for reg in carnet_ejemplo:
    nomVacuna = reg["idvacuna"]["nombrevacuna"]
    dosisRequeridas = reg["idvacuna"]["dosisrequeridas"]
    if nomVacuna not in vacunasAplicadas:
        vacunasAplicadas[nomVacuna] = {"aplicadas": 0, "requeridas": dosisRequeridas}
    vacunasAplicadas[nomVacuna]["aplicadas"] += 1

print("\n✅ ESQUEMA ACTUAL:")
for vacuna, status in vacunasAplicadas.items():
    aplicadas = status["aplicadas"]
    requeridas = status["requeridas"]
    progreso = "▓" * aplicadas + "░" * (requeridas - aplicadas)
    print(f"  {vacuna}: {progreso} ({aplicadas}/{requeridas})")

vacunasFaltantes = []
for v in personas_por_vacuna:
    status = vacunasAplicadas.get(v["nombrevacuna"])
    # Si no está en el carnet, o si le faltan dosis
    if not status or status["aplicadas"] < status["requeridas"]:
        vacunasFaltantes.append(v)

print("\n⚠️ VACUNAS QUE FALTAN COMPLETAR:")
if vacunasFaltantes:
    for v in vacunasFaltantes:
        print(f"  🔴 {v['nombrevacuna']}")
        print(f"      → {v['personas_vacunadas']} personas ya se vacunaron con esta")
else:
    print("  ✅ ¡El usuario ha completado todas sus vacunaciones!")

print("\n" + "=" * 70)
print("RESULTADO: TEST COMPLETADO ✓")
print("=" * 70)
