FROM maven:3.9-eclipse-temurin-17 AS build

ARG SERVICE_NAME
WORKDIR /app

COPY . .

RUN mvn clean package -pl ${SERVICE_NAME} -am -DskipTests

FROM eclipse-temurin:17-jre-jammy
ARG SERVICE_NAME
WORKDIR /app
COPY --from=build /app/${SERVICE_NAME}/target/${SERVICE_NAME}-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]