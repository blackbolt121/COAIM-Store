FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

FROM gradle:8.12.1-jdk21 AS build

WORKDIR /app

COPY build.gradle settings.gradle* ./
COPY gradle ./gradle
COPY src ./src
COPY --from=frontend-build /app/src/main/resources/static ./src/main/resources/static

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/build/libs/*SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
