# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copy the root pom and all service poms
COPY pom.xml .
COPY discovery-service/pom.xml discovery-service/
COPY config-server/pom.xml config-server/
COPY api-gateway/pom.xml api-gateway/
COPY auth-service/pom.xml auth-service/
COPY container-sim-service/pom.xml container-sim-service/
COPY manifest-service/pom.xml manifest-service/

# Download dependencies (this layer is cached)
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app
# This is a placeholder; the docker-compose will specify which JAR to run
COPY --from=build /app/${SERVICE_NAME}/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]