FROM openjdk:17-jdk-slim

WORKDIR /app

COPY build/libs/hotel-service-1.0.0.jar app.jar

EXPOSE 9091

CMD ["java", "-jar", "app.jar"]
