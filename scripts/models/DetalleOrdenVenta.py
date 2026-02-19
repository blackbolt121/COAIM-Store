# models/DetalleOrdenVenta.py
from dataclasses import dataclass
from typing import Optional, List

detalle_orden_venta_columns: List[str] = [
    "sysguid_DetalleOrdenVenta",
    "OrdenVenta",
    "Renglon",
    "Articulo",
    "Cantidad",
    "CantSurt",
    "Descripcion",
    "Des_Brev",
    "Modelo",
    "Moneda",
    "Costo",
    "PrecioUni",
    "Descuento",
    "Promocion",
    "Comision",
    "BackOrder",
    "Iva",
    "Unidades",
    "Modificado",
    "Servicio",
    "Id_DetOrdVenta",
    "Notas",
    "Anticipo",
    "Disponible_Surtir",
    "Surtidor",
    "Fechaini_Surtido",
    "Horaini_Surtido",
    "Fechafin_Surtido",
    "Horafin_Surtido",
    "Estatus_Surtido",
    "Almacen",
    "Prioridad",
    "A_Surtir",
    "SubAlmacen",
    "CantEmpacada",
    "Subtotal",
    "Total",
    "Poriva",
    "Devueltas",
    "EstDevueltas",
    "Proveedor",
    "Autoriza",
    "FechaAutoriza",
    "HoraAutoriza",
    "Rifa",
    "fecha",
    "ExisBak",
    "estatus",
    "Linea",
    "Estatus2",
    "Fecha2",
    "Ofertas",
    "c_ClaveProdServ",
    "c_ClaveUnidad",
    "Saldo",
    "Costo2",
    "Ordenventa2",
    "descuento1",
    "Empresa",
    "sku",
]

@dataclass
class DetalleOrdenVenta:
    sysguid_DetalleOrdenVenta: Optional[str] = None
    OrdenVenta: Optional[int] = None
    Renglon: Optional[int] = None
    Articulo: Optional[str] = None
    Cantidad: Optional[float] = None
    CantSurt: Optional[float] = None
    Descripcion: Optional[str] = None          # varchar(max)
    Des_Brev: Optional[str] = None
    Modelo: Optional[str] = None
    Moneda: Optional[str] = None
    Costo: Optional[float] = None              # decimal(15,5)
    PrecioUni: Optional[float] = None          # decimal(11,2)
    Descuento: Optional[float] = None          # decimal(7,2)
    Promocion: Optional[float] = None          # decimal(7,2)
    Comision: Optional[float] = None           # decimal(7,2)
    BackOrder: Optional[str] = None
    Iva: Optional[float] = None                # decimal(15,2)
    Unidades: Optional[str] = None
    Modificado: Optional[str] = None
    Servicio: Optional[str] = None
    Id_DetOrdVenta: Optional[int] = None
    Notas: Optional[str] = None
    Anticipo: Optional[float] = None           # decimal(18,4)
    Disponible_Surtir: Optional[float] = None  # decimal(13,4)
    Surtidor: Optional[int] = None
    Fechaini_Surtido: Optional[str] = None     # date
    Horaini_Surtido: Optional[str] = None      # time(0)
    Fechafin_Surtido: Optional[str] = None     # date
    Horafin_Surtido: Optional[str] = None      # time(0)
    Estatus_Surtido: Optional[str] = None
    Almacen: Optional[int] = None
    Prioridad: Optional[int] = None
    A_Surtir: Optional[float] = None           # decimal(13,4)
    SubAlmacen: Optional[int] = None
    CantEmpacada: Optional[float] = None       # decimal(13,4)
    Subtotal: Optional[float] = None           # decimal(10,2)
    Total: Optional[float] = None              # decimal(18,2)
    Poriva: Optional[float] = None             # decimal(5,2)
    Devueltas: Optional[float] = None          # decimal(13,4)
    EstDevueltas: Optional[str] = None
    Proveedor: Optional[int] = None
    Autoriza: Optional[str] = None
    FechaAutoriza: Optional[str] = None        # date
    HoraAutoriza: Optional[str] = None         # time(7)
    Rifa: Optional[str] = None
    fecha: Optional[str] = None                # date
    ExisBak: Optional[float] = None            # decimal(18,2)
    estatus: Optional[str] = None
    Linea: Optional[int] = None
    Estatus2: Optional[str] = None
    Fecha2: Optional[str] = None               # date
    Ofertas: Optional[int] = None
    c_ClaveProdServ: Optional[str] = None      # nchar(10)
    c_ClaveUnidad: Optional[str] = None        # nchar(5)
    Saldo: Optional[float] = None              # decimal(18,4)
    Costo2: Optional[float] = None             # decimal(18,4)
    Ordenventa2: Optional[int] = None
    descuento1: Optional[float] = None         # decimal(13,4)
    Empresa: Optional[int] = None
    sku: Optional[int] = None

    @classmethod
    def from_row(cls, row: list, columns: List[str] = detalle_orden_venta_columns):
        if not row:
            return None
        data = dict(zip(columns, row))
        return cls(**data)
