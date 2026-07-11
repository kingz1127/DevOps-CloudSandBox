# Stage 1: Build the JAR from source
FROM eclipse-temurin:17-jdk-jammy AS build

ARG SERVICE_NAME
WORKDIR /app

# Copy the entire monorepo — needed because Maven's reactor
# has to see the parent POM and any shared/dependency modules
COPY . .

# Build only the target module (and anything it depends on)
RUN ./mvnw clean package -pl ${SERVICE_NAME} -am -DskipTests

# Stage 2: Runtime only (lean JRE)
FROM eclipse-temurin:17-jre-jammy

ARG SERVICE_NAME
WORKDIR /app

COPY --from=build /app/${SERVICE_NAME}/target/${SERVICE_NAME}-*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]