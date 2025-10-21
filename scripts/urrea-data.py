import requests
import json



response = requests.post("https://www.urreanet.com/urreanetnuevo/wsInformacionProducto.php", json={
    "opcion": 4,
    "usuario": "COAIM",
    "password": ""
})



print(response.status_code)

data = response.json()

with open("urrea_products.json", "w", encoding="utf-8") as f:

    f.write(json.dumps(data, indent=2))
    f.close()


