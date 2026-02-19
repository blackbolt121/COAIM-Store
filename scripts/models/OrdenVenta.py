from dataclasses import dataclass
from typing import Optional, List


orden_venta_columns: List[str] = [
    "OrdenVenta", "Fecha", "NumCliente", "OrdenCompra", "Agente", "FormaPago",
    "NumCotizacion", "SalidaAlmacen", "OrdenServicio", "IVA", "Moneda",
    "TipoCambio", "Estatus", "FolioFactura", "NumeroFactura", "Almacen",
    "Impuesto", "Transporte", "Elaboro", "Notas", "ListaPrecio", "FechaVence",
    "DiasCredito", "SubtotalSur", "IvaSur", "TotalSur", "Descuento1",
    "Descuento2", "Descuento", "FechaElab_date", "FechaElab_time",
    "FechaEntrega", "HoraEntrega", "FechaRecolecta", "HoraRecolecta",
    "Quienrecibe", "FechaEvento", "EntregaEmbarque", "HoraEmbarque",
    "LugarDeEmbarque", "RazonSocialEmbarque", "DireccionEmbarque",
    "ColoniaEmbarque", "CiudadEmbarque", "EstadoEmbarque", "CPEmbarque",
    "Prioridad", "FechaCapturaIni", "FechaCapturaFin", "HoraCapturaIni",
    "HoraCapturaFin", "FechaSurtidoIni", "FechaSurtidoFin", "HoraSurtidoIni",
    "HoraSurtidoFin", "EmpleadoSurtido", "FechaFacturaIni", "FechaFacturaFin",
    "HoraFacturaIni", "HoraFacturaFin", "FechaEmpaqueIni", "FechaEmpaqueFin",
    "HoraEmpaqueIni", "HoraEmpaqueFin", "EmpleadoEmpaque", "FechaEmbarqueIni",
    "FechaEmbarqueFin", "HoraEmbarqueIni", "HoraEmbarqueFin", "CantPaq1",
    "CantPaq2", "CantPaq3", "TipoContacto", "FechaInternet", "HoraInternet",
    "GeneraInter", "IPPedido", "Jalador", "Subtotal", "Total", "Saldo",
    "NotaCancelacion", "ConceptoCancelacion", "Paciente", "Remision",
    "FechaXml", "TipoVenta", "Pagotarjeta", "EmpleadoFactura", "EmpleadoTimbra",
    "HoraTimbraIni", "HoraTimbraFin", "FechaTimbra", "MetodoPago", "NumRef",
    "Jaula", "EstatusJaula", "FechaRemIni", "FechaRemFin", "HoraRemIni",
    "HoraRemFin", "Verificado", "Backorder", "EstatusEmb", "DetalleEmb",
    "NotaEmb", "UsuarioEsc", "FechaEsc", "HoraEsc", "Maquina", "FechaCompPago",
    "NotasCompPago", "UsuarioCompPago", "HoraCompPago", "ClaveMetodoPago",
    "UsuarioGuia", "HoraGuia", "FechaGuia", "ClaveBanc", "NoGuia",
    "MetodoPago2", "UsoCfdi", "Notas2", "Precios", "Ordenventa2", "TipoPedido",
    "Nreferencia", "MetoPago2", "Exis1", "CurpSurt", "Amacen", "CurpSurtJaula",
    "HoraSurFin", "HoraSurIni", "UsuarioValJaula"
]


@dataclass
class OrdenVenta:
    OrdenVenta: Optional[int] = None
    Fecha: Optional[str] = None               # date
    NumCliente: Optional[int] = None
    OrdenCompra: Optional[str] = None
    Agente: Optional[int] = None
    FormaPago: Optional[str] = None
    NumCotizacion: Optional[int] = None
    SalidaAlmacen: Optional[int] = None
    OrdenServicio: Optional[int] = None
    IVA: Optional[float] = None               # decimal(15,2)
    Moneda: Optional[str] = None
    TipoCambio: Optional[float] = None        # decimal(9,2)
    Estatus: Optional[str] = None
    FolioFactura: Optional[str] = None
    NumeroFactura: Optional[int] = None
    Almacen: Optional[int] = None
    Impuesto: Optional[str] = None
    Transporte: Optional[int] = None
    Elaboro: Optional[int] = None
    Notas: Optional[str] = None
    ListaPrecio: Optional[int] = None
    FechaVence: Optional[str] = None          # date
    DiasCredito: Optional[int] = None
    SubtotalSur: Optional[float] = None       # decimal(9,2)
    IvaSur: Optional[float] = None            # decimal(9,2)
    TotalSur: Optional[float] = None          # decimal(9,2)
    Descuento1: Optional[float] = None        # decimal(7,2)
    Descuento2: Optional[float] = None        # decimal(7,2)
    Descuento: Optional[float] = None         # decimal(9,2)
    FechaElab_date: Optional[str] = None      # date
    FechaElab_time: Optional[str] = None      # time(0)
    FechaEntrega: Optional[str] = None        # date
    HoraEntrega: Optional[str] = None         # time(0)
    FechaRecolecta: Optional[str] = None      # date
    HoraRecolecta: Optional[str] = None       # time(0)
    Quienrecibe: Optional[str] = None
    FechaEvento: Optional[str] = None         # date
    EntregaEmbarque: Optional[str] = None
    HoraEmbarque: Optional[str] = None        # varchar(11)
    LugarDeEmbarque: Optional[str] = None
    RazonSocialEmbarque: Optional[str] = None
    DireccionEmbarque: Optional[str] = None
    ColoniaEmbarque: Optional[str] = None
    CiudadEmbarque: Optional[str] = None
    EstadoEmbarque: Optional[str] = None
    CPEmbarque: Optional[int] = None
    Prioridad: Optional[int] = None
    FechaCapturaIni: Optional[str] = None     # date
    FechaCapturaFin: Optional[str] = None     # date
    HoraCapturaIni: Optional[str] = None      # time(0)
    HoraCapturaFin: Optional[str] = None      # time(0)
    FechaSurtidoIni: Optional[str] = None     # date
    FechaSurtidoFin: Optional[str] = None     # date
    HoraSurtidoIni: Optional[str] = None      # time(0)
    HoraSurtidoFin: Optional[str] = None      # time(0)
    EmpleadoSurtido: Optional[int] = None
    FechaFacturaIni: Optional[str] = None     # date
    FechaFacturaFin: Optional[str] = None     # date
    HoraFacturaIni: Optional[str] = None      # time(0)
    HoraFacturaFin: Optional[str] = None      # time(0)
    FechaEmpaqueIni: Optional[str] = None     # date
    FechaEmpaqueFin: Optional[str] = None     # date
    HoraEmpaqueIni: Optional[str] = None      # time(0)
    HoraEmpaqueFin: Optional[str] = None      # time(0)
    EmpleadoEmpaque: Optional[int] = None
    FechaEmbarqueIni: Optional[str] = None    # date
    FechaEmbarqueFin: Optional[str] = None    # date
    HoraEmbarqueIni: Optional[str] = None     # time(0)
    HoraEmbarqueFin: Optional[str] = None     # time(0)
    CantPaq1: Optional[int] = None
    CantPaq2: Optional[int] = None
    CantPaq3: Optional[int] = None
    TipoContacto: Optional[int] = None
    FechaInternet: Optional[str] = None       # date
    HoraInternet: Optional[str] = None        # time(0)
    GeneraInter: Optional[str] = None
    IPPedido: Optional[str] = None
    Jalador: Optional[int] = None
    Subtotal: Optional[float] = None          # decimal(18,4)
    Total: Optional[float] = None             # decimal(18,4)
    Saldo: Optional[float] = None             # decimal(10,4)
    NotaCancelacion: Optional[str] = None
    ConceptoCancelacion: Optional[str] = None
    Paciente: Optional[int] = None
    Remision: Optional[int] = None
    FechaXml: Optional[str] = None            # datetime2(7)
    TipoVenta: Optional[str] = None
    Pagotarjeta: Optional[float] = None       # decimal(18,4)
    EmpleadoFactura: Optional[int] = None
    EmpleadoTimbra: Optional[int] = None
    HoraTimbraIni: Optional[str] = None       # time(0)
    HoraTimbraFin: Optional[str] = None       # time(0)
    FechaTimbra: Optional[str] = None         # date
    MetodoPago: Optional[str] = None          # nchar(40)
    NumRef: Optional[str] = None              # nchar(4)
    Jaula: Optional[str] = None
    EstatusJaula: Optional[str] = None
    FechaRemIni: Optional[str] = None         # date
    FechaRemFin: Optional[str] = None         # date
    HoraRemIni: Optional[str] = None          # time(0)
    HoraRemFin: Optional[str] = None          # time(0)
    Verificado: Optional[str] = None          # nchar(1) (posible flag)
    Backorder: Optional[str] = None           # nchar(1) (posible flag)
    EstatusEmb: Optional[str] = None
    DetalleEmb: Optional[str] = None
    NotaEmb: Optional[str] = None
    UsuarioEsc: Optional[int] = None
    FechaEsc: Optional[str] = None            # date
    HoraEsc: Optional[str] = None             # time(0)
    Maquina: Optional[str] = None
    FechaCompPago: Optional[str] = None       # date
    NotasCompPago: Optional[str] = None
    UsuarioCompPago: Optional[int] = None
    HoraCompPago: Optional[str] = None        # time(0)
    ClaveMetodoPago: Optional[str] = None
    UsuarioGuia: Optional[int] = None
    HoraGuia: Optional[str] = None            # time(0)
    FechaGuia: Optional[str] = None           # date
    ClaveBanc: Optional[str] = None
    NoGuia: Optional[int] = None
    MetodoPago2: Optional[str] = None
    UsoCfdi: Optional[str] = None
    Notas2: Optional[str] = None
    Precios: Optional[int] = None
    Ordenventa2: Optional[int] = None
    TipoPedido: Optional[str] = None          # char(1)
    Nreferencia: Optional[str] = None
    MetoPago2: Optional[str] = None
    Exis1: Optional[int] = None
    CurpSurt: Optional[str] = None
    Amacen: Optional[int] = None
    CurpSurtJaula: Optional[str] = None
    HoraSurFin: Optional[str] = None          # time(0)
    HoraSurIni: Optional[str] = None          # time(0)
    UsuarioValJaula: Optional[str] = None

    @classmethod
    def from_row(cls, columns: List[str] = orden_venta_columns, row: List = []):
        if not row:
            return None
        data = dict(zip(columns, row))
        return cls(**data)
