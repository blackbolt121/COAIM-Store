import os
import dotenv
from contextlib import contextmanager

try:
    import pyodbc
except ImportError:
    pyodbc = None

try:
    import pytds
except ImportError:
    pytds = None

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
        if pyodbc is not None:
            print(f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
            conn = pyodbc.connect(
                f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
            )
        elif pytds is not None:
            conn = pytds.connect(
                server=server,
                database=database,
                user=username,
                password=password,
            )
        else:
            raise ImportError("Neither pyodbc nor python-tds is available")
        print("✅ Conexión exitosa a la base de datos")
        try:
            yield conn
        finally:
            conn.close()
    except Exception as e:
        print(f"❌ Error al conectar o consultar ({server}/{database}): {e}")
        raise RuntimeError(f"Could not connect to SQL Server at {server}/{database}") from e
