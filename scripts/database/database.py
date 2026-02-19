import pyodbc
import os
import dotenv
from contextlib import contextmanager

dotenv.load_dotenv()
# Datos de conexión

@contextmanager
def connect():
    server = os.getenv("SERVER")
    database = os.getenv("DATABASE")
    username = os.getenv("DBUSERNAME")
    password = os.getenv("DBPASSWORD")
    driver = '{ODBC Driver 17 for SQL Server}'  # Asegúrate de que esté instalado
    try:
        print(f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        # exit()
        # Crear conexión
        conn = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
        )
        print("✅ Conexión exitosa a la base de datos")
        yield conn
    except Exception as e:
        print("❌ Error al conectar o consultar:", e)
