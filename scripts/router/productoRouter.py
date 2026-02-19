# producto_controller.py
from typing import Optional, Dict, Any, List
from database.database import connect

def _rows_to_dicts(cursor, rows) -> List[Dict[str, Any]]:
    cols = [c[0] for c in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def listar_productos(
    limit: int = 100,
    offset: int = 0,
    productoId: Optional[str] = None
) -> Dict[str, Any] | Dict[str, Any]:
    """
    - Si 'productoId' se pasa: devuelve el producto (dict) por CODIGO o {"error": "..."} si no existe.
    - Si no: devuelve lista paginada con {"total","offset","limit","count","data"}.
    """
    if not (1 <= limit <= 1000):
        raise ValueError("limit debe estar entre 1 y 1000")
    if offset < 0:
        raise ValueError("offset debe ser >= 0")

    # Obtener un solo producto por CODIGO
    if productoId:
        sql = "SELECT TOP 1 * FROM [siscad2].[dbo].[sql_Articulo] WHERE [Codigo] = ?;"
        try:
            with connect() as conn:
                cur = conn.cursor()
                row = cur.execute(sql, (productoId,)).fetchone()
                if row is None:
                    return {"error": f"Product {productoId} not found"}
                data = _rows_to_dicts(cur, [row])[0]
                return data
        except Exception as e:
            return {"error": str(e)}

    # Listado paginado
    start_row, end_row = offset + 1, offset + limit
    count_sql = "SELECT COUNT(1) FROM [siscad2].[dbo].[sql_Articulo];"
    page_sql = """
        WITH cte AS (
            SELECT *, ROW_NUMBER() OVER (ORDER BY [Codigo]) AS rn
            FROM [siscad2].[dbo].[sql_Articulo]
        )
        SELECT * FROM cte
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
