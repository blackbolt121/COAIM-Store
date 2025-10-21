#!/bin/bash
APP_NAME="smartshop-0.0.1-SNAPSHOT.jar"
APP_DIR="/home/ubuntu/app"
LOG_FILE="$APP_DIR/app.log"
export SPRING_DATASOURCE_URL=jdbc:mysql://database.smartshop.internal:3306/test
export SPRING_DATASOURCE_USERNAME=admin
export SPRING_DATASOURCE_PASSWORD=yourpassword123

cd $APP_DIR

echo "Iniciando la aplicación Spring Boot..." >> $LOG_FILE 2>&1

# Ejecutar la aplicación en segundo plano
nohup java -jar $APP_NAME >> $LOG_FILE 2>&1 &
echo $! > app.pid  # Guardar el PID del proceso

echo "Aplicación iniciada con PID $(cat app.pid)" >> $LOG_FILE 2>&1
