from db.connect import connect
from typing import List, Any, Dict
from models.Cliente import Cliente
from fastapi import HTTPException
from starlette.responses import JSONResponse




"""
    Tabla especializada para clientes es: sql_MC003
"""
def getClientes(offset, limit, clienteId):

    if clienteId is not None:
        print(clienteId)
        sql = f"""
        SELECT *
          FROM [siscad2].[dbo].[sql_MC003]
         WHERE [Numero] = ?
        """

        try:
            with connect() as conn:
                cur = conn.cursor()
                cur.execute(sql, (clienteId,))
                rows = cur.fetchone()
                columns = [c[0] for c in cur.description]
                if rows is None:
                    return JSONResponse({"message": "User not found"}, 404)
                clienteData: Cliente = Cliente(**dict(zip(columns, rows)))
                return clienteData
        except Exception as e:
            print(f"❌ Error usuario: {e}")
            raise HTTPException(status_code=500, detail="Error consultando usuarios")


    start_row = offset + 1
    end_row = offset + limit
    query = """
    WITH cte AS (
        SELECT
            *,
            ROW_NUMBER() OVER (ORDER BY [Numero]) AS rn
        FROM [siscad2].[dbo].[sql_MC003]
    )
    SELECT *
    FROM cte
    WHERE rn BETWEEN CAST(? AS INT) AND CAST(? AS INT)
    ORDER BY rn;
    """
    count_query = "SELECT COUNT(1) FROM [siscad2].[dbo].[sql_MC003];"
    with connect() as conn:
        cur = conn.cursor()

        # Total de registros
        total = cur.execute(count_query).fetchone()[0]

        # Paginación
        cur.execute(query, (start_row, end_row))
        columns = [c[0] for c in cur.description]
        rows = cur.fetchall()

        # Convertir cada fila a dict o modelo
        clientes: List[Any] = []
        for row in rows:
            data: Dict[str, Any] = dict(zip(columns, row))
            cliente = Cliente(**data)  # si es Pydantic; si es dataclass usa asdict
            clientes.append(cliente)

        return {
            "total": total,
            "offset": offset,
            "limit": limit,
            "count": len(clientes),
            "data": clientes
        }