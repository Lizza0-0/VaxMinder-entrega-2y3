"""
GUÍA DE DEBUG PARA VERIFICAR QUE LA ANALÍTICA CARGA CORRECTAMENTE

Si la analítica no está cargando en el Frontend, sigue estos pasos:
"""

import os
import json

print("=" * 80)
print("VERIFICACIÓN DE ARCHIVOS JSON GENERADOS")
print("=" * 80)

DATA_DIR = os.path.join(
    os.path.dirname(__file__), "..",
    "Frontend con Backend", "src", "assets", "data"
)

archivos_esperados = [
    "personas_por_vacuna.json",
    "vacunaciones_por_centro.json",
    "esquemas_completados.json",
    "kpis.json"
]

print(f"\n📂 Directorio esperado: {DATA_DIR}\n")

for archivo in archivos_esperados:
    ruta_completa = os.path.join(DATA_DIR, archivo)
    existe = os.path.exists(ruta_completa)
    
    if existe:
        tamaño = os.path.getsize(ruta_completa)
        with open(ruta_completa, 'r', encoding='utf-8') as f:
            contenido = json.load(f)
        
        if isinstance(contenido, list):
            registros = len(contenido)
            print(f"✅ {archivo}")
            print(f"   Tamaño: {tamaño} bytes")
            print(f"   Registros: {registros}")
            
            # Mostrar sample
            if registros > 0:
                print(f"   Sample: {json.dumps(contenido[0], ensure_ascii=False, indent=4)[:200]}...")
        else:
            print(f"✅ {archivo}")
            print(f"   Tamaño: {tamaño} bytes")
            print(f"   Keys: {list(contenido.keys())}")
        print()
    else:
        print(f"❌ {archivo} - NO ENCONTRADO")
        print(f"   Ruta: {ruta_completa}\n")

print("=" * 80)
print("INSTRUCCIONES SI NO ENTIENDEN:")
print("=" * 80)
print("""
1️⃣  VERIFICA QUE python/main.py SE EJECUTÓ SIN ERRORES
    cd python && python main.py

2️⃣  VERIFICA QUE LOS ARCHIVOS EXISTAN EN:
    Frontend con Backend/src/assets/data/
    
3️⃣  EN NAVEGADOR, ABRE LA CONSOLA (F12) Y:
    - Busca errores de red (404) en la pestaña "Network"
    - Busca errores en la consola: "Error cargando personas_por_vacuna.json"

4️⃣  ASEGÚRATE QUE EL SERVIDOR REACT ESTÁ CORRIENDO:
    cd "Frontend con Backend"
    npm run dev

5️⃣  PRUEBA LA RUTA MANUALMENTE:
    - Abre en el navegador: http://localhost:5173/assets/data/personas_por_vacuna.json
    - Deberías ver el JSON con los datos

6️⃣  SI SIGUE SIN FUNCIONAR:
    - Limpia caché del navegador (Ctrl+Shift+Delete)
    - Recarga la página (Ctrl+F5)
    - Reinicia el servidor React: npm run dev
""")

print("\n" + "=" * 80)
print("✓ VERIFICACIÓN COMPLETADA")
print("=" * 80)
