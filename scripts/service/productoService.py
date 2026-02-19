from models.Producto import Producto
import requests
from database.database import connect
class ProductoSmartShopMapper:

    def __init__(self):
        self.coaim_vendors = dict()
        self.vendors = dict()
        self.coaimVendors()
        self.loadVendors()
        pass


    def coaimVendors(self):
        with connect() as con:
            cur = con.cursor()
            marcas = cur.execute("SELECT * FROM Sql_Marca;").fetchall()
            self.coaim_vendors = dict({str(marca[0]): marca[1].strip() for marca in marcas })


    def loadVendors(self):

        url = 'http://localhost:8080/rest/api/1/vendor/all'
        response = requests.api.get(url)
        data = response.json()

        self.vendors = dict({vendor["vendorName"]: vendor["vendorId"] for vendor in data})


    def productoJson(self, producto: Producto) -> dict:

        data = dict()
        sku = self.coaim_vendors.get(str(producto.Marca), 'GEN') + "-" + producto.Codigo.strip()
        data["name"] = producto.Nombre
        data["price"] = float(producto.PrecioLista1)
        data["descripcion"] = producto.DescripcionTecnica if producto.DescripcionTecnica is not None else ""
        data["vendor"] = {
            "vendorId": self.vendors.get(self.coaim_vendors.get(str(producto.Marca), ""), None),
            "vendorName": self.coaim_vendors.get(str(producto.Marca), "")
        }
        data["sku"] = str(sku)
        data["imageUrl"] = "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80"

        return data