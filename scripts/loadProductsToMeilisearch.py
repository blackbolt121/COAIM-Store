import os

import requests
from meilisearch import Client


API_URL = os.getenv("SMARTSHOP_API_URL", "http://localhost:8080")
MEILI_HOST = os.getenv("MEILI_HOST", "http://localhost:7700")
MEILI_API_KEY = os.getenv("MEILI_API_KEY")
MEILI_INDEX_PRODUCTS = os.getenv("MEILI_INDEX_PRODUCTS", "products")
ADMIN_EMAIL = os.getenv("SMARTSHOP_ADMIN_EMAIL", "rego199903@gmail.com")
ADMIN_PASSWORD = os.getenv("SMARTSHOP_ADMIN_PASSWORD", "Ruberego990301@")


response = requests.api.post(
    f"{API_URL}/auth/login",
    json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
)
data = response.json()
headers = {"Authorization": "Bearer " + data["access_token"]}

client = Client(MEILI_HOST, MEILI_API_KEY) if MEILI_API_KEY else Client(MEILI_HOST)

# Crear índice si no existe
try:
    client.create_index(uid=MEILI_INDEX_PRODUCTS, options={'primaryKey': 'id'})
except Exception as e:
    if "index_already_exists" not in str(e):
        print("Error creando índice:", e)

index = client.index(uid=MEILI_INDEX_PRODUCTS)


def flatten_product(product):
    vendor = product.get("vendor") or {}
    return {
        "id": product.get("id"),
        "name": product.get("name"),
        "sku": product.get("sku"),
        "description": product.get("description"),
        "price": product.get("price", 0),
        "imageUrl": product.get("imageUrl"),
        "category": product.get("category"),
        "vendorId": vendor.get("vendorId"),
        "vendorName": vendor.get("vendorName"),
    }


isLast = True
page = 0

while isLast:
    product_response = requests.get(f"{API_URL}/rest/api/1/producto/all?size=1000&page={page}", headers=headers)
    product_data = product_response.json()
    product_list = [flatten_product(product) for product in product_data["content"]]
    if len(product_list) > 0:
        index.add_documents(product_list)
    page += 1
    isLast = not product_data.get("last", True)
