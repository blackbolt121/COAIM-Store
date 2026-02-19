from database.database import connect
import requests
import dotenv

dotenv.load_dotenv()
with connect() as connection:
    cursor = connection.cursor()
    marcas = cursor.execute("SELECT * FROM Sql_Marca;").fetchall()
    response = requests.api.post("http://localhost:8080/auth/login", json={"email":"rego199903@gmail.com", "password":"Ruberego990301@"})
    data = response.json()
    print(data)

    headers = {"Authorization": "Bearer " + data["access_token"]}


    for marca in marcas:
        print(marca[0], marca[1].strip())

        response = requests.api.post("http://localhost:8080/rest/api/1/vendor", headers=headers, json={
            "vendorName": marca[1].strip()
        })
        print(response.status_code)



