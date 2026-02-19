# detalle_orden_venta_controller.py
from typing import Optional, Dict, Any, List
from database.database import connect

def _rows_to_dicts(cursor, rows) -> List[Dict[str, Any]]:
    cols = [c[0] for c in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def listar_detalles_orden_venta(
    orden_venta: Optional[int] = None,
    limit: int = 100,
    offset: int = 0,
) -> Dict[str, Any]:
    """
    - Si 'orden_venta' se pasa: devuelve TODOS los renglones para esa orden (sin paginar).
    - Si no se pasa: devuelve paginado usando ROW_NUMBER (compatible con SQL Server 2008).
    Retorna dict con 'data' como list[dict].
    """
    if not (1 <= limit <= 5000):
        raise ValueError("limit debe estar entre 1 y 5000")
    if not (0 <= offset <= 5000):
        raise ValueError("offset debe estar entre 0 y 5000")
    if orden_venta is not None and orden_venta < 0:
        raise ValueError("orden_venta debe ser >= 0")

    try:
        with connect() as conn:
            cur = conn.cursor()

            if orden_venta is not None:
                sql = """
                SELECT
                    [sysguid_DetalleOrdenVenta],[OrdenVenta],[Renglon],[Articulo],[Cantidad],[CantSurt],
                    [Descripcion],[Des_Brev],[Modelo],[Moneda],[Costo],[PrecioUni],[Descuento],[Promocion],
                    [Comision],[BackOrder],[Iva],[Unidades],[Modificado],[Servicio],[Id_DetOrdVenta],[Notas],
                    [Anticipo],[Disponible_Surtir],[Surtidor],[Fechaini_Surtido],[Horaini_Surtido],
                    [Fechafin_Surtido],[Horafin_Surtido],[Estatus_Surtido],[Almacen],[Prioridad],[A_Surtir],
                    [SubAlmacen],[CantEmpacada],[Subtotal],[Total],[Poriva],[Devueltas],[EstDevueltas],
                    [Proveedor],[Autoriza],[FechaAutoriza],[HoraAutoriza],[Rifa],[fecha],[ExisBak],[estatus],
                    [Linea],[Estatus2],[Fecha2],[Ofertas],[c_ClaveProdServ],[c_ClaveUnidad],[Saldo],[Costo2],
                    [Ordenventa2],[descuento1],[Empresa],[sku]
                FROM [siscad2].[dbo].[sql_DetalleOrdenVenta]
                WHERE [OrdenVenta] = ?
                ORDER BY [Renglon] ASC;
                """
                cur.execute(sql, (orden_venta,))
                rows = cur.fetchall()
                data = _rows_to_dicts(cur, rows)
                return {"orden_venta": orden_venta, "total": len(data), "data": data}

            # paginado con ROW_NUMBER
            start_row = offset + 1
            end_row = offset + limit

            sql = """
            WITH cte AS (
                SELECT
                    [sysguid_DetalleOrdenVenta],[OrdenVenta],[Renglon],[Articulo],[Cantidad],[CantSurt],
                    [Descripcion],[Des_Brev],[Modelo],[Moneda],[Costo],[PrecioUni],[Descuento],[Promocion],
                    [Comision],[BackOrder],[Iva],[Unidades],[Modificado],[Servicio],[Id_DetOrdVenta],[Notas],
                    [Anticipo],[Disponible_Surtir],[Surtidor],[Fechaini_Surtido],[Horaini_Surtido],
                    [Fechafin_Surtido],[Horafin_Surtido],[Estatus_Surtido],[Almacen],[Prioridad],[A_Surtir],
                    [SubAlmacen],[CantEmpacada],[Subtotal],[Total],[Poriva],[Devueltas],[EstDevueltas],
                    [Proveedor],[Autoriza],[FechaAutoriza],[HoraAutoriza],[Rifa],[fecha],[ExisBak],[estatus],
                    [Linea],[Estatus2],[Fecha2],[Ofertas],[c_ClaveProdServ],[c_ClaveUnidad],[Saldo],[Costo2],
                    [Ordenventa2],[descuento1],[Empresa],[sku],
                    ROW_NUMBER() OVER (ORDER BY [OrdenVenta] ASC, [Renglon] ASC) AS rn
                FROM [siscad2].[dbo].[sql_DetalleOrdenVenta]
            )
            SELECT
                [sysguid_DetalleOrdenVenta],[OrdenVenta],[Renglon],[Articulo],[Cantidad],[CantSurt],
                [Descripcion],[Des_Brev],[Modelo],[Moneda],[Costo],[PrecioUni],[Descuento],[Promocion],
                [Comision],[BackOrder],[Iva],[Unidades],[Modificado],[Servicio],[Id_DetOrdVenta],[Notas],
                [Anticipo],[Disponible_Surtir],[Surtidor],[Fechaini_Surtido],[Horaini_Surtido],
                [Fechafin_Surtido],[Horafin_Surtido],[Estatus_Surtido],[Almacen],[Prioridad],[A_Surtir],
                [SubAlmacen],[CantEmpacada],[Subtotal],[Total],[Poriva],[Devueltas],[EstDevueltas],
                [Proveedor],[Autoriza],[FechaAutoriza],[HoraAutoriza],[Rifa],[fecha],[ExisBak],[estatus],
                [Linea],[Estatus2],[Fecha2],[Ofertas],[c_ClaveProdServ],[c_ClaveUnidad],[Saldo],[Costo2],
                [Ordenventa2],[descuento1],[Empresa],[sku]
            FROM cte
            WHERE rn BETWEEN ? AND ?
            ORDER BY rn;
            """
            cur.execute(sql, (start_row, end_row))
            rows = cur.fetchall()
            data = _rows_to_dicts(cur, rows)
            return {"total": len(data), "offset": offset, "limit": limit, "data": data}

    except Exception as e:
        return {"error": str(e)}
