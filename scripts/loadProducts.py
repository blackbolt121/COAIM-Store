import os
from router.productoRouter import listar_productos
from models.Producto import Producto
from service.productoService import ProductoSmartShopMapper
from meilisearch import Client

offset = 0
limit = 1000
isLast = True

API_URL = os.getenv("SMARTSHOP_API_URL", "http://localhost:8080")
MEILI_HOST = os.getenv("MEILI_HOST", "http://localhost:7700")
MEILI_API_KEY = os.getenv("MEILI_API_KEY")
MEILI_INDEX_PRODUCTS = os.getenv("MEILI_INDEX_PRODUCTS", "products")

client = Client(MEILI_HOST, MEILI_API_KEY) if MEILI_API_KEY else Client(MEILI_HOST)

# Crear índice si no existe
try:
    client.create_index(uid=MEILI_INDEX_PRODUCTS, options={'primaryKey': 'id'})
except Exception as e:
    if "index_already_exists" not in str(e):
        print("Error creando índice:", e)
    pass

index = client.index(uid=MEILI_INDEX_PRODUCTS)

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
