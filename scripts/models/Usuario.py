from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Usuario(BaseModel):
    Id: int
    Nombre: Optional[str] = None
    Departamento: Optional[str] = None
    usuario: Optional[str] = None
    # contrasena:  🚫 NO EXPONER
    TipoUsuario: Optional[int] = None
    Fecha_UM: Optional[datetime] = None
    Proveedor: Optional[int] = None
    Sucursal: Optional[int] = None
    Autoriza: Optional[str] = None
    Supervisor: Optional[int] = None
    Correo: Optional[str] = None
    Num: Optional[int] = None
    CorreoSup: Optional[str] = None
    Inventarios: Optional[str] = None
    class Config:
        orm_mode = True
