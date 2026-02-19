# detalle orden venta
from typing import Optional, Dict, Any
from service.clienteService import getClientes


def fetch_clientes(
        limit: int = 100,
        offset: int = 0,
        clienteId: Optional[int] = None
) -> Dict[str, Any]:
    """
    Función equivalente al endpoint /cliente de FastAPI,
    pero sin usar ningún framework web.

    Args:
        limit (int): número máximo de resultados (1 a 1000)
        offset (int): desplazamiento (>= 0)
        clienteId (int, optional): ID del cliente (>= 0)

    Returns:
        dict: resultado de getClientes(...)
    """
    # Validaciones equivalentes a las de Query()
    if not (1 <= limit <= 1000):
        raise ValueError("limit debe estar entre 1 y 1000")
    if offset < 0:
        raise ValueError("offset debe ser >= 0")
    if clienteId is not None and clienteId < 0:
        raise ValueError("clienteId debe ser >= 0")

    # Llamada al servicio real
    result = getClientes(limit=limit, offset=offset, clienteId=clienteId)
    return result
