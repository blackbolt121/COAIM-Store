# estado_controller.py
from typing import Dict, Any, List
from database.database import connect

def _rows_to_dicts(cursor, rows) -> List[Dict[str, Any]]:
    cols = [c[0] for c in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def listar_estados(limit: int = 100, offset: int = 0) -> Dict[str, Any]:
    """
    Retorna una lista paginada de estados desde la base de datos.
    Compatible con SQL Server 2008 (usa ROW_NUMBER en lugar de OFFSET/FETCH).
    Respuesta: {"total": int, "offset": int, "limit": int, "data": list[dict]}
    """
    # Validaciones equivalentes a Query(ge/le)
    if not (1 <= limit <= 1000):
        raise ValueError("limit debe estar entre 1 y 1000")
    if not (0 <= offset <= 1000):
        raise ValueError("offset debe estar entre 0 y 1000")

    start_row = offset + 1
    end_row = offset + limit

    sql = """
    WITH cte AS (
        SELECT
            [Numero],
            [Nombre],
            [Usuario],
            [sysguid_MC006],
            ROW_NUMBER() OVER (ORDER BY [Numero]) AS rn
        FROM [siscad2].[dbo].[sql_MC006]
    )
    SELECT [Numero], [Nombre], [Usuario], [sysguid_MC006]
    FROM cte
    WHERE rn BETWEEN ? AND ?
    ORDER BY rn;
    """

    try:
        with connect() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, (start_row, end_row))
            rows = cursor.fetchall()
            data = _rows_to_dicts(cursor, rows)

        return {
            "total": len(data),
            "offset": offset,
            "limit": limit,
            "data": data
        }
    except Exception as e:
        return {"error": str(e)}
