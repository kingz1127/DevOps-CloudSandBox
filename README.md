
# DevOps CloudSandbox 🚀
**Final Semester Project: Localized Enterprise Infrastructure Simulator**

## 📖 Project Overview
CloudSandbox is a microservice-based platform designed to teach DevOps skills (Docker, Kubernetes, Load Balancing) in a data-free, localized environment. It gives students a safe, virtual command line to practice real-world container and cluster operations — without ever touching a real Docker daemon or Kubernetes cluster — while automatically tracking their progress and awarding achievement badges as they learn.

## 🌐 Live Demo
- **Frontend:** [https://dev-ops-cloud-sand-box.vercel.app](https://dev-ops-cloud-sand-box.vercel.app)
- **API Gateway:** [https://api-gateway-ng5g.onrender.com](https://api-gateway-ng5g.onrender.com)
- **API Docs (Swagger):** [https://api-gateway-ng5g.onrender.com/swagger-ui.html](https://api-gateway-ng5g.onrender.com/swagger-ui.html)

## ✨ Features
- **Virtual Docker CLI** — `run`, `ps`, `stop`, `start`, `rm`, all backed by a real state machine, not just UI mocks
- **Virtual kubectl CLI** — `get pods`, `describe pod`, `delete pod`, and `apply -f -` for full YAML manifests
- **Kubernetes Manifest Validator** — checks YAML against best practices (`apiVersion`, `kind`, `metadata`, `replicas`) before simulating a deployment
- **Live Load Balancer Simulator** — round-robin traffic distribution across only currently *running* containers, visualized in real time
- **Infrastructure Dashboard** — manage containers visually (start/stop/delete) outside the terminal
- **Progress Tracking & Badges** — every lifecycle action (Docker or Kubernetes) is logged to a personal Academic Report Card, with badges for Docker Pilot, K8s Captain, and YAML Master
- **JWT-secured microservices** — authenticated routing through the API Gateway, with per-service authorization

## 🏗 Architecture
Built with **Spring Boot 3** and **Spring Cloud**, the system consists of:
- **API Gateway:** Central security (JWT) and routing.
- **Discovery Service:** Netflix Eureka for service orchestration.
- **Config Server:** Centralized YAML configuration management.
- **Auth Service:** User registration, login, and JWT issuance.
- **Container Simulator Service:** Custom state-machine mimicking Docker CLI behavior (run, stop, start, delete).
- **Manifest Service:** K8s YAML validator using SnakeYAML.
- **Progress Service:** Automated student achievement tracking.
- **Load Balancer Sim:** Visual traffic distribution engine using round-robin routing.

## 🛠 Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Cloud, Maven, PostgreSQL.
- **Frontend:** React 18, TypeScript, Tailwind CSS, Xterm.js.
- **Orchestration:** Docker Compose & Kubernetes-style manifest simulation.
- **CI/CD:** GitHub Actions, building and pushing images to Docker Hub.

## ☁️ Deployment & Hosting
This project is deployed entirely on free-tier cloud services:
- **Frontend:** [Vercel](https://vercel.com) — static hosting for the React/Vite app.
- **Backend Microservices:** [Render](https://render.com) — each of the 8 Spring Boot services runs as its own free Web Service, built from a shared multi-stage Dockerfile.
- **Databases:** [Aiven](https://aiven.io) — free-tier PostgreSQL, hosting all four service databases as separate logical databases on a single instance.
- **Container Images:** [Docker Hub](https://hub.docker.com) — CI/CD-built images for every service, published automatically via GitHub Actions on every push to `main`.

## 🚀 Getting Started (Local Development)
1. Clone the repo: `git clone [URL]`
2. Build the JARs: `mvn clean package -DskipTests`
3. Launch the environment: `docker-compose up --build -d`
4. Access UI: `http://localhost:3000`
5. Access Documentation: `http://localhost:8080/swagger-ui.html`

## 📟 Example Commands

**Docker:**
```bash
$ docker run --name my-app --image nginx:latest
$ docker ps
$ docker stop [container_id]
$ docker start [container_id]
$ docker rm [container_id]
```

**Kubernetes:**
```bash
$ kubectl get pods
$ kubectl describe pod [id]
$ kubectl delete pod [id]
$ kubectl apply -f -
# paste your YAML, then type EOF on its own line
```