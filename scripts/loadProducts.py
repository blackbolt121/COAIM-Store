from router.productoRouter import listar_productos
from models.Producto import Producto
from service.productoService import ProductoSmartShopMapper
import requests
from meilisearch import Client

offset = 0
limit = 1000
isLast = True

response = requests.api.post(
    "http://localhost:8080/auth/login",
    json={"email": "rego199903@gmail.com", "password": "Ruberego990301@"}
)
data = response.json()
headers = {"Authorization": "Bearer " + data["access_token"]}

# ✅ No se necesita apiKey si no tienes master key configurada
client = Client('http://192.168.100.58:7700')

# Crear índice si no existe
try:
    client.create_index(uid='products', options={'primaryKey': 'id'})
except Exception as e:
    if "index_already_exists" not in str(e):
        print("Error creando índice:", e)
    pass

index = client.index(uid='products')

while isLast:
    payload = listar_productos(offset=offset, limit=limit)
    count = payload.get("count")
    products = payload.get("data")

    mapper = ProductoSmartShopMapper()
    arraylist = []
    for product in products:
        product_obj = Producto.from_json(product)
        if product_obj.Marca is None or product_obj.Marca == 0:
            continue

        api_product_format = mapper.productoJson(product_obj)
        print(api_product_format)
        arraylist.append(api_product_format)

        # response = requests.api.post("http://localhost:8080/rest/api/1/producto", headers=headers, json=api_product_format)
        # print(product_obj.Codigo, response.status_code)

    if len(arraylist) > 0:
        index.add_documents(arraylist)
        print(f"✅ {len(arraylist)} productos enviados a Meilisearch (offset={offset})")

    offset += limit
    isLast = payload.get("count") > 0
