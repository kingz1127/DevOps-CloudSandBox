#
#FROM maven:3.9-eclipse-temurin-17 AS build
#ARG SERVICE_NAME
#WORKDIR /app
#
## Copy everything
#COPY . .
#
## Build only the requested service - skip dependency download and use offline mode
#RUN mvn clean package -pl ${SERVICE_NAME} -am -DskipTests -Dmaven.javadoc.skip=true --fail-never
#
## ==========================================
## STAGE 2: Production Runtime
## ==========================================
#FROM eclipse-temurin:17-jre-jammy
#ARG SERVICE_NAME
#WORKDIR /app
#
## Copy the JAR from the build stage
#COPY --from=build /app/${SERVICE_NAME}/target/${SERVICE_NAME}-*.jar app.jar
#
## Security: Don't run as root
#RUN useradd -m sandboxuser
#USER sandboxuser
#
#ENTRYPOINT ["java", "-jar", "app.jar"]



FROM maven:3.9-eclipse-temurin-17 AS build
ARG SERVICE_NAME
WORKDIR /app

# Copy everything
COPY . .

# Build only the requested service - use full module path
RUN mvn clean package -pl ./${SERVICE_NAME} -am -DskipTests -Dmaven.javadoc.skip=true

FROM eclipse-temurin:17-jre-jammy
ARG SERVICE_NAME
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/${SERVICE_NAME}/target/${SERVICE_NAME}-*.jar app.jar

RUN useradd -m sandboxuser
USER sandboxuser

ENTRYPOINT ["java", "-jar", "app.jar"]