import requests
import urllib3
import json
urllib3.disable_warnings()



data = requests.api.post("https://localhost:8080/auth/login", json={
    "email": "test@test.com", 
    "password": "password"
}, verify=False)


res = dict(data.json())

access_token = res.get("access_token")


if access_token is None:
    exit(1)

flag = True

content = []
page = 0
while flag == True:
    data = requests.api.get(f"https://localhost:8080/rest/api/1/urrea/producto/all?page={page}&size=2000", headers={
        "Authorization": f"Bearer {access_token}"
    }, verify=False)

    print(data.status_code)

    if data.status_code != 200:
        exit(1)

    aux = data.json()
    content += aux["content"]
    if aux["last"] == True:
        break
    page += 1




available_skus = set(map(lambda x: x["codigo"], content))
print(len(available_skus))
data_urrea = None
with open("./urrea_products.json", "r") as f:
#with open("./failed_inserts.json", "r") as f:
    data_urrea = json.loads("".join(f.readlines()))
    f.close()
productos = data_urrea["resultadoDispMasiva"]
all_skus = set(map(lambda x: x["codigo"], productos))
print(len(all_skus))

print(len(all_skus-available_skus))

missing_products = [producto for producto in productos if producto["codigo"] not in available_skus]

with open("failed_inserts.json", "w", encoding="utf-8") as file:
    file.write(json.dumps(missing_products, indent=2))


for producto in missing_products:
    request = requests.api.post(f"https://localhost:8080/rest/api/1/urrea/producto",
            json=producto,
            headers={"Authorization": f"Bearer {access_token}"
        }, verify=False)

    print(request.status_code)


increment = 0
for sku in available_skus:
    data = requests.api.put(f"https://localhost:8080/rest/api/1/urrea/producto/asProduct?codigo={sku}", headers={
        "Authorization": f"Bearer {access_token}"
    }, verify=False)

    if data.status_code != 200:
        print(f"Failed: {sku}")
    print(increment, len(available_skus), end="\r")
    increment+=1