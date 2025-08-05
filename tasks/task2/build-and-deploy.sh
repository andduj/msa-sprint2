#!/bin/bash

echo "=== HotelIO Microservices Build and Deploy Script ==="

# Создаем сеть Docker
echo "1. Creating Docker network..."
docker network create hotelio-net 2>/dev/null || echo "Network already exists"

# Сборка booking-service через Docker
echo "2. Building booking-service..."
cd booking-service
docker build -f Dockerfile.build -t booking-service-build .
docker run --rm -v ${PWD}:/app booking-service-build
cd ..

# Сборка booking-history-service
echo "3. Building booking-history-service..."
cd booking-history-service
./gradlew clean build -x test
cd ..

# Проверка JAR файлов
echo "4. Checking JAR files..."
echo "booking-service:"
ls -la booking-service/build/libs/ 2>/dev/null || echo "No JAR files found"
echo "booking-history-service:"
ls -la booking-history-service/build/libs/

# Запуск инфраструктуры
echo "5. Starting infrastructure..."
docker compose up -d monolith-db booking-db history-db zookeeper kafka

# Ждем инициализации Kafka
echo "6. Waiting for Kafka initialization..."
sleep 30

# Запуск микросервисов
echo "7. Starting microservices..."
docker compose up -d booking-service
sleep 10
docker compose up -d booking-history-service
sleep 10
docker compose up -d monolith

# Проверка статуса
echo "8. Checking service status..."
docker ps

echo "=== Build and Deploy Complete ==="
echo "Services should be available at:"
echo "- Monolith: http://localhost:8084"
echo "- Booking Service (gRPC): localhost:9090"
echo "- Booking History Service: http://localhost:8085"
