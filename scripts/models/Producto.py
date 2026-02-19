from __future__ import annotations

from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from decimal import Decimal
from datetime import date, time


class Producto(BaseModel):
    # --- Clave primaria (NOT NULL) ---
    ID_Articulo: int

    # --- Campos ---
    Codigo: str
    Nombre: Optional[str] = None
    Unidad: Optional[str] = None
    Precio: Optional[Decimal] = None
    Iva: Optional[Decimal] = None
    CostoPromedio: Optional[Decimal] = None
    FechaUltCompra: Optional[date] = None
    CostoUltCompra: Optional[Decimal] = None
    Existencia: Optional[Decimal] = None
    FechaUltSalida: Optional[date] = None
    Moneda: Optional[str] = None
    PrecioVenta: Optional[Decimal] = None
    ControlaSerie: Optional[str] = None
    ClaveArticulo: Optional[str] = None
    DescripcionTecnica: Optional[str] = None
    Ubicacion: Optional[str] = None
    NotasUbicacion: Optional[str] = None
    Modelo: Optional[str] = None
    PrecioMinVenta: Optional[Decimal] = None
    Tipo: Optional[str] = None
    Clasif1: Optional[str] = None
    Clasif2: Optional[str] = None
    Clasif3: Optional[str] = None
    Clasif4: Optional[str] = None
    Clasif5: Optional[str] = None
    Clasif6: Optional[int] = None
    Clasif7: Optional[int] = None
    PrecioMayoreo: Optional[Decimal] = None
    StockMaximo: Optional[Decimal] = None
    StockMinimo: Optional[Decimal] = None
    IEPS: Optional[Decimal] = None
    Descuento: Optional[Decimal] = None
    Empaque: Optional[Decimal] = None
    FechaAlta: Optional[date] = None
    Peso: Optional[Decimal] = None
    PesoMinimo: Optional[Decimal] = None
    PesoMaximo: Optional[Decimal] = None
    PrecioLista1: Optional[Decimal] = None
    PrecioLista2: Optional[Decimal] = None
    PrecioLista3: Optional[Decimal] = None
    PrecioLista4: Optional[Decimal] = None
    PrecioLista5: Optional[Decimal] = None
    PrecioLista6: Optional[Decimal] = None
    PrecioLista7: Optional[Decimal] = None
    PrecioLista8: Optional[Decimal] = None
    PrecioLista9: Optional[Decimal] = None
    PrecioLista10: Optional[Decimal] = None
    PrecioLista11: Optional[Decimal] = None
    PrecioLista12: Optional[Decimal] = None
    PrecioLista13: Optional[Decimal] = None
    PrecioLista14: Optional[Decimal] = None
    PrecioLista15: Optional[Decimal] = None
    PrecioLista16: Optional[Decimal] = None
    PrecioLista17: Optional[Decimal] = None
    PrecioLista18: Optional[Decimal] = None
    PrecioLista19: Optional[Decimal] = None
    PrecioLista20: Optional[Decimal] = None
    Ing_UnidadMedida: Optional[str] = None
    Ing_Concentracion: Optional[int] = None
    CostoFleteUnitario: Optional[Decimal] = None
    Utilidad1: Optional[Decimal] = None
    Utilidad2: Optional[Decimal] = None
    Utilidad3: Optional[Decimal] = None
    Utilidad4: Optional[Decimal] = None
    Utilidad5: Optional[Decimal] = None
    Utilidad6: Optional[Decimal] = None
    Utilidad7: Optional[Decimal] = None
    Utilidad8: Optional[Decimal] = None
    Utilidad9: Optional[Decimal] = None
    Utilidad10: Optional[Decimal] = None
    Utilidad11: Optional[Decimal] = None
    Utilidad12: Optional[Decimal] = None
    Utilidad13: Optional[Decimal] = None
    Utilidad14: Optional[Decimal] = None
    Utilidad15: Optional[Decimal] = None
    Utilidad16: Optional[Decimal] = None
    Utilidad17: Optional[Decimal] = None
    Utilidad18: Optional[Decimal] = None
    Utilidad19: Optional[Decimal] = None
    Utilidad20: Optional[Decimal] = None
    Escala1: Optional[Decimal] = None
    Escala2: Optional[Decimal] = None
    Escala3: Optional[Decimal] = None
    Escala4: Optional[Decimal] = None
    Escala5: Optional[Decimal] = None
    ListaPrecioEscala1: Optional[int] = None
    ListaPrecioEscala2: Optional[int] = None
    ListaPrecioEscala3: Optional[int] = None
    ListaPrecioEscala4: Optional[int] = None
    ListaPrecioEscala5: Optional[int] = None
    IDProveedor1: Optional[int] = None
    IDProveedor2: Optional[int] = None
    IDProveedor3: Optional[int] = None
    CodigoBarras: Optional[str] = None
    Almacen: Optional[int] = None
    Etiqueta: Optional[str] = None
    UnidadCompra: Optional[str] = None
    FactorConv: Optional[Decimal] = None
    Equivalencia1: Optional[str] = None
    Equivalencia2: Optional[str] = None
    Equivalencia3: Optional[str] = None
    Equivalencia4: Optional[str] = None
    Equivalencia5: Optional[str] = None
    Ubicacion2: Optional[str] = None
    Ubicacion3: Optional[str] = None
    Ubicacion4: Optional[str] = None
    Ubicacion5: Optional[str] = None
    Ubicacion6: Optional[str] = None
    Ubicacion7: Optional[str] = None
    Ubicacion8: Optional[str] = None
    DctoProv1: Optional[Decimal] = None
    DctoProv2: Optional[Decimal] = None
    DctoProv3: Optional[Decimal] = None
    DctoProv4: Optional[Decimal] = None
    DctoProv5: Optional[Decimal] = None
    DctoProv6: Optional[Decimal] = None
    DctoProv7: Optional[Decimal] = None
    DctoProv8: Optional[Decimal] = None
    CTACOMPAQ1: Optional[str] = None
    CTACOMPAQ2: Optional[str] = None
    CTACOMPAQ3: Optional[str] = None
    CTACOMPAQ4: Optional[str] = None
    Consumo: Optional[Decimal] = None
    Maximoi: Optional[Decimal] = None
    Minimoi: Optional[Decimal] = None
    FechaModif_Costo_Reposicion: Optional[date] = None
    HoraModif_Costo_Reposicion: Optional[time] = None
    UsuarioModif_Costo_Reposicion: Optional[int] = None
    FechaCambio_Precio1: Optional[date] = None
    HoraCambio_Precio1: Optional[time] = None
    UsuarioCambio_Precio1: Optional[int] = None
    FechaCambio_Precio2: Optional[date] = None
    HoraCambio_Precio2: Optional[time] = None
    UsuarioCambio_Precio2: Optional[int] = None
    FechaCambio_Precio3: Optional[date] = None
    HoraCambio_Precio3: Optional[time] = None
    UsuarioCambio_Precio3: Optional[int] = None
    FechaCambio_Precio4: Optional[date] = None
    HoraCambio_Precio4: Optional[time] = None
    UsuarioCambio_Precio4: Optional[int] = None
    FechaCambio_Precio5: Optional[date] = None
    HoraCambio_Precio5: Optional[time] = None
    UsuarioCambio_Precio5: Optional[int] = None
    Prov_Alterno_Imp1: Optional[int] = None
    Prov_Alterno_Imp2: Optional[int] = None
    Prov_Alterno_Imp3: Optional[int] = None
    Quien_Compra: Optional[str] = None
    Indica_Resurtido: Optional[str] = None
    SubAlmacen: Optional[int] = None
    Solicitante: Optional[int] = None
    MUBMin: Optional[Decimal] = None
    MUBMax: Optional[Decimal] = None
    Foto: Optional[str] = None
    Iner: Optional[int] = None
    Masters: Optional[int] = None
    Marca: Optional[int] = None
    Dimension: Optional[Decimal] = None
    Exis1: Optional[Decimal] = None
    Exis2: Optional[Decimal] = None
    Exis3: Optional[Decimal] = None
    Exis4: Optional[Decimal] = None
    Exis5: Optional[Decimal] = None
    Apartados: Optional[Decimal] = None
    Fisico: Optional[Decimal] = None
    CbarrasInner: Optional[str] = None
    CbarrasMaster: Optional[str] = None
    Exis6: Optional[int] = None
    Exis7: Optional[int] = None
    Exis8: Optional[int] = None
    Exis9: Optional[int] = None
    Linea: Optional[int] = None
    Inventariable: Optional[int] = None
    estatusprov: Optional[str] = None
    cambio: Optional[int] = None
    c_ClaveProdServ: Optional[str] = None
    c_ClaveUnidad: Optional[str] = None
    Codigo2: Optional[str] = None
    Empresa: Optional[int] = None
    imagen: Optional[str] = None
    Exis11: Optional[int] = None
    Exis22: Optional[int] = None
    Cambio2: Optional[int] = None
    Codigo22: Optional[str] = None
    Precio22: Optional[Decimal] = None
    PrecioVentaAnt: Optional[Decimal] = None
    Precio3: Optional[Decimal] = None
    PrecioVenta3: Optional[Decimal] = None
    PrecioAnt: Optional[Decimal] = None
    CostoAnt: Optional[Decimal] = None
    Exis10: Optional[int] = None
    Exis12: Optional[int] = None
    ExisSR: Optional[int] = None
    ExisL: Optional[int] = None
    ExisM: Optional[int] = None
    ExisI: Optional[int] = None
    PrecioSuferre: Optional[Decimal] = None
    CostoSuferre: Optional[Decimal] = None

    @classmethod
    def from_row(cls, columns: List[str], row: List[Any] | tuple[Any, ...]) -> "Producto":
        """
        Crea un Producto a partir de una fila (tuple/list) y la lista de columnas.
        Útil con pyodbc: columns = [c[0] for c in cursor.description]
        """
        data: Dict[str, Any] = dict(zip(columns, row))
        return cls(**data)

    @classmethod
    def from_json(cls, data: dict) -> "Producto":
        """
        Crea un Producto a partir de una fila (tuple/list) y la lista de columnas.
        Útil con pyodbc: columns = [c[0] for c in cursor.description]
        """
        return cls(**data)


# Si haces SELECT explícito en este orden, puedes reutilizar este arreglo:
PRODUCTO_COLUMNS: List[str] = [
    "Codigo", "Nombre", "Unidad", "Precio", "Iva", "CostoPromedio", "FechaUltCompra",
    "CostoUltCompra", "Existencia", "FechaUltSalida", "Moneda", "PrecioVenta", "ControlaSerie",
    "ClaveArticulo", "DescripcionTecnica", "Ubicacion", "NotasUbicacion", "Modelo",
    "PrecioMinVenta", "Tipo", "Clasif1", "Clasif2", "Clasif3", "Clasif4", "Clasif5",
    "Clasif6", "Clasif7", "PrecioMayoreo", "StockMaximo", "StockMinimo", "IEPS", "Descuento",
    "Empaque", "FechaAlta", "Peso", "PesoMinimo", "PesoMaximo", "PrecioLista1", "PrecioLista2",
    "PrecioLista3", "PrecioLista4", "PrecioLista5", "PrecioLista6", "PrecioLista7", "PrecioLista8",
    "PrecioLista9", "PrecioLista10", "PrecioLista11", "PrecioLista12", "PrecioLista13",
    "PrecioLista14", "PrecioLista15", "PrecioLista16", "PrecioLista17", "PrecioLista18",
    "PrecioLista19", "PrecioLista20", "Ing_UnidadMedida", "Ing_Concentracion",
    "CostoFleteUnitario", "Utilidad1", "Utilidad2", "Utilidad3", "Utilidad4", "Utilidad5",
    "Utilidad6", "Utilidad7", "Utilidad8", "Utilidad9", "Utilidad10", "Utilidad11", "Utilidad12",
    "Utilidad13", "Utilidad14", "Utilidad15", "Utilidad16", "Utilidad17", "Utilidad18",
    "Utilidad19", "Utilidad20", "Escala1", "Escala2", "Escala3", "Escala4", "Escala5",
    "ListaPrecioEscala1", "ListaPrecioEscala2", "ListaPrecioEscala3", "ListaPrecioEscala4",
    "ListaPrecioEscala5", "IDProveedor1", "IDProveedor2", "IDProveedor3", "CodigoBarras",
    "Almacen", "Etiqueta", "UnidadCompra", "FactorConv", "ID_Articulo", "Equivalencia1",
    "Equivalencia2", "Equivalencia3", "Equivalencia4", "Equivalencia5", "Ubicacion2",
    "Ubicacion3", "Ubicacion4", "Ubicacion5", "Ubicacion6", "Ubicacion7", "Ubicacion8",
    "DctoProv1", "DctoProv2", "DctoProv3", "DctoProv4", "DctoProv5", "DctoProv6", "DctoProv7",
    "DctoProv8", "CTACOMPAQ1", "CTACOMPAQ2", "CTACOMPAQ3", "CTACOMPAQ4", "Consumo", "Maximoi",
    "Minimoi", "FechaModif_Costo_Reposicion", "HoraModif_Costo_Reposicion",
    "UsuarioModif_Costo_Reposicion", "FechaCambio_Precio1", "HoraCambio_Precio1",
    "UsuarioCambio_Precio1", "FechaCambio_Precio2", "HoraCambio_Precio2",
    "UsuarioCambio_Precio2", "FechaCambio_Precio3", "HoraCambio_Precio3",
    "UsuarioCambio_Precio3", "FechaCambio_Precio4", "HoraCambio_Precio4",
    "UsuarioCambio_Precio4", "FechaCambio_Precio5", "HoraCambio_Precio5",
    "UsuarioCambio_Precio5", "Prov_Alterno_Imp1", "Prov_Alterno_Imp2", "Prov_Alterno_Imp3",
    "Quien_Compra", "Indica_Resurtido", "SubAlmacen", "Solicitante", "MUBMin", "MUBMax", "Foto",
    "Iner", "Masters", "Marca", "Dimension", "Exis1", "Exis2", "Exis3", "Exis4", "Exis5",
    "Apartados", "Fisico", "CbarrasInner", "CbarrasMaster", "Exis6", "Exis7", "Exis8", "Exis9",
    "Linea", "Inventariable", "estatusprov", "cambio", "c_ClaveProdServ", "c_ClaveUnidad",
    "Codigo2", "Empresa", "imagen", "Exis11", "Exis22", "Cambio2", "Codigo22", "Precio22",
    "PrecioVentaAnt", "Precio3", "PrecioVenta3", "PrecioAnt", "CostoAnt", "Exis10", "Exis12",
    "ExisSR", "ExisL", "ExisM", "ExisI", "PrecioSuferre", "CostoSuferre"
]
