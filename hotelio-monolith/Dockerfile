FROM openjdk:17-jdk-slim

WORKDIR /app

# Копируем JAR файл из сборки
COPY build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"] 