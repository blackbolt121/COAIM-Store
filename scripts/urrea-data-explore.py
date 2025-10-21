import json
import requests
import dotenv
import os
import urllib3

urllib3.disable_warnings()

dotenv.load_dotenv()



data = None
with open("./urrea_products.json", "r") as f:
#with open("./failed_inserts.json", "r") as f:
    data = json.loads("".join(f.readlines()))
    f.close()

product_keys = set()

productos = data["resultadoDispMasiva"]
for producto in productos:
    product_keys.update(producto.keys())

failed_inserts = []

username = os.getenv("username")
password = os.getenv("password")

data = requests.api.post("https://localhost:8080/auth/login", json={
    "email": "test@test.com", 
    "password": "password"
}, verify=False)

res = dict(data.json())

access_token = res.get("access_token")

total_productos = len(productos)
index = 0
for producto in productos:
    index+=1
    print(index, total_productos, end='\r')
    
    request = requests.api.get(f"https://localhost:8080/rest/api/1/urrea/producto?codigo={str(producto['codigo']).replace("/","-").replace(" ", "_")}",
        headers={"Authorization": f"Bearer {access_token}"
    }, verify=False)

    if request.status_code == 200:
        continue
    else:
        request = requests.api.post(f"https://localhost:8080/rest/api/1/urrea/producto",
            json=producto,
            headers={"Authorization": f"Bearer {access_token}"
        }, verify=False)
    
    if request.status_code != 200:
        try:
            print(request.json())
            failed_inserts.append(producto)
            print("Already added")
            continue
        except:
            input(json.dumps(producto, indent=4))
    
print()
failed_inserts2 = []

with open("failed_inserts.json", "w", encoding="utf-8") as file:
    print("Failed inserts: ", len(failed_inserts))
    
    for producto in failed_inserts:
        request = requests.api.post(f"https://localhost:8080/rest/api/1/urrea/producto",
            json=producto,
            headers={"Authorization": f"Bearer {access_token}"
        }, verify=False)
        
        print(request.status_code)
        if request.status_code != 200:
            print(producto["codigo"])
            failed_inserts2.append(producto)
    
    file.write(json.dumps(failed_inserts2, indent=2))