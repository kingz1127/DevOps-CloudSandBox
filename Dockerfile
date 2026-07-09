# ==========================================
# STAGE 1: Cache Dependencies (Global)
# ==========================================
FROM maven:3.8.5-eclipse-temurin-17 AS deps
WORKDIR /app

COPY pom.xml .
COPY discovery-service/pom.xml discovery-service/
COPY config-server/pom.xml config-server/
COPY api-gateway/pom.xml api-gateway/
COPY auth-service/pom.xml auth-service/
COPY container-sim-service/pom.xml container-sim-service/
COPY manifest-service/pom.xml manifest-service/
COPY progress-service/pom.xml progress-service/
COPY loadbalancer-sim-service/pom.xml loadbalancer-sim-service/

RUN mvn dependency:go-offline -B

# ==========================================
# STAGE 2: Build Only the Requested Service
# ==========================================
FROM deps AS build
ARG SERVICE_NAME

# 1. ONLY copy the shared root files and the SPECIFIC service folder
COPY pom.xml .
COPY ${SERVICE_NAME}/ ${SERVICE_NAME}/

# 2. Build ONLY this specific microservice module (Fixed packaging flags)
RUN mvn package -pl :${SERVICE_NAME} -am -DskipTests

# ==========================================
# STAGE 3: Runtime
# ==========================================
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
ARG SERVICE_NAME

# Copy the executable jar safely
COPY --from=build /app/${SERVICE_NAME}/target/${SERVICE_NAME}-*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]