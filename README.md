# DevOps CloudSandbox 🚀
**Final Semester Project: Localized Enterprise Infrastructure Simulator**

## 📖 Project Overview
CloudSandbox is a microservice-based platform designed to teach DevOps skills (Docker, Kubernetes, Load Balancing) in a data-free, localized environment.

## 🏗 Architecture
Built with **Spring Boot 3** and **Spring Cloud**, the system consists of:
- **API Gateway:** Central security (JWT) and routing.
- **Discovery Service:** Netflix Eureka for service orchestration.
- **Config Server:** Centralized YAML configuration management.
- **Simulator Service:** Custom state-machine mimicking Docker CLI.
- **Manifest Service:** K8s YAML validator using SnakeYAML.
- **Progress Service:** Automated student achievement tracking.
- **Load Balancer Sim:** Visual traffic distribution engine.

## 🛠 Tech Stack
- **Backend:** Java 17, Maven, PostgreSQL.
- **Frontend:** React 18, TypeScript, Tailwind CSS, Xterm.js.
- **Orchestration:** Docker Compose & Kubernetes Manifests.
- **CI/CD:** GitHub Actions.

## 🚀 Getting Started
1. Clone the repo: `git clone [URL]`
2. Build the JARs: `mvn clean package -DskipTests`
3. Launch the environment: `docker-compose up --build -d`
4. Access UI: `http://localhost:3000`
5. Access Documentation: `http://localhost:8080/swagger-ui.html`
