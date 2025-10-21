FROM openjdk:21

WORKDIR /app

COPY ./build/libs/smartshop-0.0.1-SNAPSHOT.jar .
COPY ./build/libs/smartshop-0.0.1-SNAPSHOT-plain.jar .

CMD ["ls", "-l"]
CMD ["java", "-jar", "/app/smartshop-0.0.1-SNAPSHOT.jar"]
