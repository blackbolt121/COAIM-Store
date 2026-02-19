from dataclasses import dataclass
from typing import Optional


client_columns = [
    "sysguid_MC003", "Ciudad", "Numero", "Nombre", "Direccion", "Colonia",
    "Ciudad1", "Estado", "CP", "Telefono", "Telefono2", "Telefono3", "Fax",
    "Contacto", "Agente", "Giro", "FechaAlta", "FechaBaja", "Rfc", "Estatus",
    "FechaSuspencion", "FechaReactivacion", "Saldo", "Usuario", "Notas",
    "ObservaImprime", "NotasBaja", "DiasCredito", "LimiteCredito", "Prospecto",
    "ListaPrecio", "Email", "Email2", "PaginaWeb", "ClienteMostrador",
    "Responsable", "CTACOMPAQ", "BackOrder", "Tolerancia", "Curp",
    "CTACOMPAQ2", "CTACOMPAQ3", "UsuarioWeb", "Passwordweb", "Retencion",
    "PorRetencion", "DiasRevision", "DiasPago", "EntregaEmbarque",
    "HoraEmbarque", "LugarDeEmbarque", "RazonSocialEmbarque",
    "DireccionEmbarque", "ColoniaEmbarque", "CiudadEmbarque",
    "EstadoEmbarque", "CPEmbarque", "NoInterior", "NoExterior",
    "ReferenciaDomicilio", "Pais", "Transportista", "OrdComp", "DctoProntoPag",
    "NumCuenta", "Cobrador", "AtiendeCredito", "ISR", "PorISR", "cliente_alf",
    "fecha_ultimacompra", "fecha_ultimopago", "hora_alta", "Usuario_Alta",
    "Contrarecibo", "NotasRevision", "Lugar", "Encargado_Compras",
    "Encargado_Pagos", "Horaini_Rev", "Horafin_Rev", "Horaini_Pago",
    "Horafin_Pago", "Fecha_UltimoCambioLC", "Hora_UltimoCambioLC",
    "Usuario_UltimoCambioLC", "Referencia_Banco1", "Referencia_Banco2",
    "Cuenta_Bancaria1", "Cuenta_Bancaria2", "Cuenta_Bancaria3",
    "Cuenta_Bancaria4", "DiasRevision2", "HoraIni_Rev2", "HoraFin_Rev2",
    "DiasPago2", "HoraIni_Pago2", "HoraFin_Pago2", "CuotaMensual",
    "EntreCalle", "YCalle", "FacturaUc", "FacruraUp", "ImporteUc", "ImporteUp",
    "Municipio", "FechaAutoPedido", "HoraAutoPedido", "UsuarioAutoPedido",
    "ArtUrrMes", "MontVtaUrr", "PorBonUrr", "MetodoPago", "ClaveMP",
    "ClaveBanco", "Trimestre", "DiasCredito2", "MetodoPago2", "UsoCfdi",
    "NotaNoPedido", "Nopedido", "FechaNopedido", "C1", "C2", "C3", "C4", "C5",
    "C6", "C7", "FechaNopago", "NotaNoPago", "Nopago", "DescuentoClie",
    "Regimen", "Id_Ubicacion", "c_Estado", "c_Municipio", "c_Localidad",
    "c_Colonia", "c_EstadoDestino", "c_MunicipioDestino", "c_LocalidadDestino",
    "c_ColoniaDestino", "NoInteriorEmb", "NoExteriorEmb", "TelefonoEnvio",
    "LocalidadEmb", "Monedero", "Medio", "rn"
]


@dataclass
class Cliente:
    sysguid_MC003: Optional[str] = None
    Ciudad: Optional[str] = None
    Numero: Optional[int] = None
    Nombre: Optional[str] = None
    Direccion: Optional[str] = None
    Colonia: Optional[str] = None
    Ciudad1: Optional[str] = None
    Estado: Optional[str] = None
    CP: Optional[str] = None
    Telefono: Optional[str] = None
    Telefono2: Optional[str] = None
    Telefono3: Optional[str] = None
    Fax: Optional[str] = None
    Contacto: Optional[str] = None
    Agente: Optional[str] = None
    Giro: Optional[str] = None
    FechaAlta: Optional[str] = None
    FechaBaja: Optional[str] = None
    Rfc: Optional[str] = None
    Estatus: Optional[str] = None
    FechaSuspencion: Optional[str] = None
    FechaReactivacion: Optional[str] = None
    Saldo: Optional[float] = None
    Usuario: Optional[str] = None
    Notas: Optional[str] = None
    ObservaImprime: Optional[str] = None
    NotasBaja: Optional[str] = None
    DiasCredito: Optional[int] = None
    LimiteCredito: Optional[float] = None
    Prospecto: Optional[str] = None
    ListaPrecio: Optional[str] = None
    Email: Optional[str] = None
    Email2: Optional[str] = None
    PaginaWeb: Optional[str] = None
    ClienteMostrador: Optional[str] = None
    Responsable: Optional[str] = None
    CTACOMPAQ: Optional[str] = None
    BackOrder: Optional[str] = None
    Tolerancia: Optional[str] = None
    Curp: Optional[str] = None
    CTACOMPAQ2: Optional[str] = None
    CTACOMPAQ3: Optional[str] = None
    UsuarioWeb: Optional[str] = None
    Passwordweb: Optional[str] = None
    Retencion: Optional[str] = None
    PorRetencion: Optional[float] = None
    DiasRevision: Optional[int] = None
    DiasPago: Optional[int] = None
    EntregaEmbarque: Optional[str] = None
    HoraEmbarque: Optional[str] = None
    LugarDeEmbarque: Optional[str] = None
    RazonSocialEmbarque: Optional[str] = None
    DireccionEmbarque: Optional[str] = None
    ColoniaEmbarque: Optional[str] = None
    CiudadEmbarque: Optional[str] = None
    EstadoEmbarque: Optional[str] = None
    CPEmbarque: Optional[str] = None
    NoInterior: Optional[str] = None
    NoExterior: Optional[str] = None
    ReferenciaDomicilio: Optional[str] = None
    Pais: Optional[str] = None
    Transportista: Optional[str] = None
    OrdComp: Optional[str] = None
    DctoProntoPag: Optional[float] = None
    NumCuenta: Optional[str] = None
    Cobrador: Optional[str] = None
    AtiendeCredito: Optional[str] = None
    ISR: Optional[str] = None
    PorISR: Optional[float] = None
    cliente_alf: Optional[str] = None
    fecha_ultimacompra: Optional[str] = None
    fecha_ultimopago: Optional[str] = None
    hora_alta: Optional[str] = None
    Usuario_Alta: Optional[str] = None
    Contrarecibo: Optional[str] = None
    NotasRevision: Optional[str] = None
    Lugar: Optional[str] = None
    Encargado_Compras: Optional[str] = None
    Encargado_Pagos: Optional[str] = None
    Horaini_Rev: Optional[str] = None
    Horafin_Rev: Optional[str] = None
    Horaini_Pago: Optional[str] = None
    Horafin_Pago: Optional[str] = None
    Fecha_UltimoCambioLC: Optional[str] = None
    Hora_UltimoCambioLC: Optional[str] = None
    Usuario_UltimoCambioLC: Optional[str] = None
    Referencia_Banco1: Optional[str] = None
    Referencia_Banco2: Optional[str] = None
    Cuenta_Bancaria1: Optional[str] = None
    Cuenta_Bancaria2: Optional[str] = None
    Cuenta_Bancaria3: Optional[str] = None
    Cuenta_Bancaria4: Optional[str] = None
    DiasRevision2: Optional[int] = None
    HoraIni_Rev2: Optional[str] = None
    HoraFin_Rev2: Optional[str] = None
    DiasPago2: Optional[int] = None
    HoraIni_Pago2: Optional[str] = None
    HoraFin_Pago2: Optional[str] = None
    CuotaMensual: Optional[float] = None
    EntreCalle: Optional[str] = None
    YCalle: Optional[str] = None
    FacturaUc: Optional[str] = None
    FacruraUp: Optional[str] = None
    ImporteUc: Optional[float] = None
    ImporteUp: Optional[float] = None
    Municipio: Optional[str] = None
    FechaAutoPedido: Optional[str] = None
    HoraAutoPedido: Optional[str] = None
    UsuarioAutoPedido: Optional[str] = None
    ArtUrrMes: Optional[int] = None
    MontVtaUrr: Optional[float] = None
    PorBonUrr: Optional[float] = None
    MetodoPago: Optional[str] = None
    ClaveMP: Optional[str] = None
    ClaveBanco: Optional[str] = None
    Trimestre: Optional[str] = None
    DiasCredito2: Optional[int] = None
    MetodoPago2: Optional[str] = None
    UsoCfdi: Optional[str] = None
    NotaNoPedido: Optional[str] = None
    Nopedido: Optional[str] = None
    FechaNopedido: Optional[str] = None
    C1: Optional[str] = None
    C2: Optional[str] = None
    C3: Optional[str] = None
    C4: Optional[str] = None
    C5: Optional[str] = None
    C6: Optional[str] = None
    C7: Optional[str] = None
    FechaNopago: Optional[str] = None
    NotaNoPago: Optional[str] = None
    Nopago: Optional[str] = None
    DescuentoClie: Optional[float] = None
    Regimen: Optional[str] = None
    Id_Ubicacion: Optional[str] = None
    c_Estado: Optional[str] = None
    c_Municipio: Optional[str] = None
    c_Localidad: Optional[str] = None
    c_Colonia: Optional[str] = None
    c_EstadoDestino: Optional[str] = None
    c_MunicipioDestino: Optional[str] = None
    c_LocalidadDestino: Optional[str] = None
    c_ColoniaDestino: Optional[str] = None
    NoInteriorEmb: Optional[str] = None
    NoExteriorEmb: Optional[str] = None
    TelefonoEnvio: Optional[str] = None
    LocalidadEmb: Optional[str] = None
    Monedero: Optional[str] = None
    Medio: Optional[str] = None
    rn: Optional[str] = None


    @classmethod
    def from_row(cls, columns: list[str] = client_columns, row: list = []):


        if len(row) == 0:
            return None
        """Crea un objeto ClienteMC003 a partir de una fila y los nombres de columnas"""
        data = dict(zip(columns, row))
        return cls(**data)