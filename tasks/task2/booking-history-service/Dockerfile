FROM openjdk:17-jdk-slim

WORKDIR /app

# Копируем JAR файл
COPY build/libs/booking-history-service-1.0.0.jar app.jar

# Открываем порт для HTTP
EXPOSE 8080

# Запускаем приложение
CMD ["java", "-jar", "app.jar"] 