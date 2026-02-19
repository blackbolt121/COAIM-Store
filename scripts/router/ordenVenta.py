from typing import Dict, Any, List
from database.database import connect

def _rows_to_dicts(cursor, rows) -> List[Dict[str, Any]]:
    cols = [c[0] for c in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def listar_ordenes_venta(limit: int = 100, offset: int = 0) -> Dict[str, Any]:
    """Lista paginada de órdenes de venta."""
    if not (1 <= limit <= 1000):
        raise ValueError("limit debe estar entre 1 y 1000")
    if offset < 0:
        raise ValueError("offset debe ser >= 0")

    start_row, end_row = offset + 1, offset + limit

    query_total = """
        SELECT COUNT(1)
        FROM [siscad2].[dbo].[sql_OrdenVenta]
        WHERE FECHA IS NOT NULL AND Estatus != 'Remision' AND NumCliente != 0;
    """

    query_page = """
        WITH cte AS (
            SELECT [OrdenVenta],[Fecha],[NumCliente],[OrdenCompra],[Agente],[FormaPago],[NumCotizacion],
                   [SalidaAlmacen],[OrdenServicio],[IVA],[Moneda],[TipoCambio],[Estatus],[FolioFactura],
                   [NumeroFactura],[Almacen],[Impuesto],[Transporte],[Elaboro],[Notas],[ListaPrecio],
                   [FechaVence],[DiasCredito],[Subtotal],[Total],[Saldo],
                   ROW_NUMBER() OVER (ORDER BY [Fecha] DESC) AS rn
            FROM [siscad2].[dbo].[sql_OrdenVenta]
            WHERE FECHA IS NOT NULL AND Estatus != 'Remision' AND NumCliente != 0
        )
        SELECT [OrdenVenta],[Fecha],[NumCliente],[OrdenCompra],[Agente],[FormaPago],[NumCotizacion],
               [SalidaAlmacen],[OrdenServicio],[IVA],[Moneda],[TipoCambio],[Estatus],[FolioFactura],
               [NumeroFactura],[Almacen],[Impuesto],[Transporte],[Elaboro],[Notas],[ListaPrecio],
               [FechaVence],[DiasCredito],[Subtotal],[Total],[Saldo]
        FROM cte
        WHERE rn BETWEEN ? AND ?
        ORDER BY rn;
    """

    try:
        with connect() as conn:
            cur = conn.cursor()
            total = cur.execute(query_total).fetchone()[0]
            cur.execute(query_page, (start_row, end_row))
            rows = cur.fetchall()
            data = _rows_to_dicts(cur, rows)
        return {"total": total, "offset": offset, "limit": limit, "count": len(data), "data": data}
    except Exception as e:
        return {"error": str(e)}

def listar_detalles_por_orden(orden_venta: int) -> Dict[str, Any]:
    """Devuelve los renglones de detalle para una OrdenVenta."""
    if orden_venta < 0:
        raise ValueError("orden_venta debe ser >= 0")

    sql = """
        SELECT [sysguid_DetalleOrdenVenta],[OrdenVenta],[Renglon],[Articulo],[Cantidad],[CantSurt],[Descripcion],
               [Des_Brev],[Modelo],[Moneda],[Costo],[PrecioUni],[Descuento],[Promocion],[Comision],[BackOrder],
               [Iva],[Unidades],[Modificado],[Servicio],[Id_DetOrdVenta],[Notas],[Anticipo],[Disponible_Surtir],
               [Surtidor],[Fechaini_Surtido],[Horaini_Surtido],[Fechafin_Surtido],[Horafin_Surtido],
               [Estatus_Surtido],[Almacen],[Prioridad],[A_Surtir],[SubAlmacen],[CantEmpacada],[Subtotal],[Total],
               [Poriva],[Devueltas],[EstDevueltas],[Proveedor],[Autoriza],[FechaAutoriza],[HoraAutoriza],[Rifa],
               [fecha],[ExisBak],[estatus],[Linea],[Estatus2],[Fecha2],[Ofertas],[c_ClaveProdServ],[c_ClaveUnidad],
               [Saldo],[Costo2],[Ordenventa2],[descuento1],[Empresa],[sku]
        FROM [siscad2].[dbo].[sql_DetalleOrdenVenta]
        WHERE [OrdenVenta] = ?
        ORDER BY [Renglon] ASC;
    """

    try:
        with connect() as conn:
            cur = conn.cursor()
            cur.execute(sql, (orden_venta,))
            rows = cur.fetchall()
            data = _rows_to_dicts(cur, rows)
        return {"orden_venta": orden_venta, "total": len(data), "data": data}
    except Exception as e:
        return {"error": str(e)}
