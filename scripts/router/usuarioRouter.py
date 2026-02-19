# usuario_controller.py
from typing import Any, Dict, List, Optional
from database.database import connect

USUARIOS_COLUMNS = [
    "Id", "Nombre", "Departamento", "usuario", "TipoUsuario", "Fecha_UM", "Proveedor",
    "Sucursal", "Autoriza", "Supervisor", "Correo", "Num", "CorreoSup", "Inventarios"
]
COLUMNS_SQL = ",".join(f"[{c}]" for c in USUARIOS_COLUMNS)

def _rows_to_dicts(cursor, rows) -> List[Dict[str, Any]]:
    cols = [c[0] for c in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def listar_usuarios(
    limit: int = 100,
    offset: int = 0,
    usuarioId: Optional[int] = None
) -> Dict[str, Any]:
    """
    - Si 'usuarioId' se pasa: devuelve un solo usuario (dict) o {"error": "..."}.
    - Si no: devuelve lista paginada con {"total","offset","limit","count","data"}.
    """
    if not (1 <= limit <= 1000):
        raise ValueError("limit debe estar entre 1 y 1000")
    if offset < 0:
        raise ValueError("offset debe ser >= 0")
    if usuarioId is not None and usuarioId < 0:
        raise ValueError("usuarioId debe ser >= 0")

    # Caso: un solo usuario por Id
    if usuarioId is not None:
        sql_one = f"SELECT TOP 1 {COLUMNS_SQL} FROM [siscad2].[dbo].[sql_Usuarios] WHERE [Id] = ? ORDER BY [Id];"
        try:
            with connect() as conn:
                cur = conn.cursor()
                row = cur.execute(sql_one, (usuarioId,)).fetchone()
                if row is None:
                    return {"error": "User not found", "id": usuarioId}
                data = _rows_to_dicts(cur, [row])[0]
                return data
        except Exception as e:
            return {"error": str(e)}

    # Caso: listado paginado (SQL Server 2008 con ROW_NUMBER)
    start_row, end_row = offset + 1, offset + limit
    count_sql = "SELECT COUNT(1) FROM [siscad2].[dbo].[sql_Usuarios];"
    page_sql = f"""
        WITH cte AS (
            SELECT {COLUMNS_SQL}, ROW_NUMBER() OVER (ORDER BY [Id]) AS rn
            FROM [siscad2].[dbo].[sql_Usuarios]
        )
        SELECT {COLUMNS_SQL}
        FROM cte
        WHERE rn BETWEEN CAST(? AS INT) AND CAST(? AS INT)
        ORDER BY rn;
    """

    try:
        with connect() as conn:
            cur = conn.cursor()
            total = cur.execute(count_sql).fetchone()[0]
            cur.execute(page_sql, (start_row, end_row))
            rows = cur.fetchall()
            data = _rows_to_dicts(cur, rows)
        return {"total": total, "offset": offset, "limit": limit, "count": len(data), "data": data}
    except Exception as e:
        return {"error": str(e)}

def obtener_usuario(id: int) -> Dict[str, Any]:
    """
    Devuelve un usuario por Id o {"error": "..."} si no existe.
    """
    if id < 0:
        raise ValueError("id debe ser >= 0")
    sql = f"SELECT TOP 1 {COLUMNS_SQL} FROM [siscad2].[dbo].[sql_Usuarios] WHERE [Id] = ? ORDER BY [Id];"
    try:
        with connect() as conn:
            cur = conn.cursor()
            row = cur.execute(sql, (id,)).fetchone()
            if row is None:
                return {"error": "Usuario no encontrado", "id": id}
            return _rows_to_dicts(cur, [row])[0]
    except Exception as e:
        return {"error": str(e)}
