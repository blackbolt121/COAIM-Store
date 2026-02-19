import requests
from meilisearch import Client



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

isLast = True
page = 0

while isLast:
    product_response = requests.get(f"http://localhost:8080/rest/api/1/producto/all?size=1000&page={page}", headers=headers)
    product_data = product_response.json()
    product_list = product_data["content"]
    index.add_documents(product_list)
    page += 1
    isLast = not product_data.get("last", True)
