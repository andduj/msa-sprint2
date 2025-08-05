FROM eclipse-temurin:17-jdk

WORKDIR /app

# Копируем JAR файл
COPY build/libs/booking-service-1.0.0.jar app.jar

# Открываем порт для gRPC
EXPOSE 9090

# Запускаем приложение
CMD ["java", "-jar", "app.jar"] 