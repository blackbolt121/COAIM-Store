from pydantic import BaseModel
from typing import Optional

class Estado(BaseModel):
    Numero: int
    Nombre: str
    Usuario: Optional[int] = None
    sysguid_MC006: Optional[str] = None

    @classmethod
    def from_row(cls, row):
        return cls(
            Numero=row.Numero,
            Nombre=row.Nombre,
            Usuario=row.Usuario,
            sysguid_MC006=row.sysguid_MC006
        )
