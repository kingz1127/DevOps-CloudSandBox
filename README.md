# 🚀 DevOps CloudSandbox

<div align="center">

![DevOps CloudSandbox](https://img.shields.io/badge/DevOps-CloudSandbox-blue?style=for-the-badge&logo=kubernetes)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen?style=flat&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat&logo=react)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-24.0.0-blue?style=flat&logo=docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28-blue?style=flat&logo=kubernetes)](https://kubernetes.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**A lightweight, localized container configuration simulator for learning enterprise infrastructure skills**

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

DevOps CloudSandbox is an interactive learning platform that simulates enterprise infrastructure environments entirely within a localized terminal interface. It teaches students essential DevOps skills including Docker container management, Kubernetes manifest validation, load balancing simulation, and infrastructure monitoring—all without requiring actual cloud resources or incurring costs.

### 🎯 Key Benefits

- **Zero-Cost Learning**: Practice enterprise infrastructure skills without cloud provider fees
- **Realistic Simulation**: Authentic CLI experience with Docker and Kubernetes commands
- **Progress Tracking**: Gamified learning with achievements and progress metrics
- **Self-Contained**: Everything runs locally with Docker Compose
- **Production-Ready**: Built with Spring Boot microservices and React frontend

---

## ✨ Features

### 🐳 Container Management
- Create, start, stop, and delete virtual containers
- Realistic Docker CLI simulation
- Container status monitoring with IP addresses
- Image validation against Docker Hub
- Port mapping and resource limits

### 📄 YAML Manifest Validation
- Validate Kubernetes manifests in real-time
- Enterprise-ready manifest checking
- Multi-document YAML support
- Detailed error reporting with line-specific feedback

### ⚖️ Load Balancer Simulation
- Round-robin traffic distribution
- Visual traffic routing animation
- Real-time logging and monitoring
- Multiple backend node simulation

### 📊 Progress Tracking
- Academic-style report card
- Module completion tracking
- Achievement badges (Docker Pilot, K8s Captain, YAML Master)
- Dynamic ranking system
- Lifecycle action logging

### 🖥️ Interactive Terminal
- Full Docker CLI simulation
- Kubernetes `kubectl` commands
- YAML manifest application
- Real-time command execution
- Multi-line input support

### 🔐 User Management
- JWT-based authentication
- Secure password reset flow
- Role-based access control
- Session management

---

## 🏗️ Architecture

### Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Frontend (React + TypeScript)                   │
│                              Port: 5173                                 │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API Gateway (Spring Cloud Gateway)             │
│                              Port: 8080                                 │
└─────────────┬───────────────┬───────────────┬─────────────┬───────────┘
              │               │               │             │
              ▼               ▼               ▼             ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Auth Service  │ │ Container Sim   │ │ Manifest Valid  │ │  Load Balancer  │
│    Port: 8081   │ │   Port: 8082    │ │   Port: 8083    │ │   Port: 8084    │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
              │               │               │             │
              └───────────────┴───────────────┴─────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Service Discovery (Eureka)                          │
│                              Port: 8761                                 │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Config Server (Spring Cloud Config)                 │
│                              Port: 8888                                 │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     PostgreSQL Databases                               │
│                   Auth | Containers | Progress | Manifest              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Service Dependencies

| Service | Description | Port | Dependencies |
|---------|-------------|------|--------------|
| **API Gateway** | Single entry point for all client requests | 8080 | Eureka, Config Server |
| **Auth Service** | User authentication & authorization | 8081 | PostgreSQL, Eureka |
| **Container Service** | Container lifecycle management | 8082 | PostgreSQL, Eureka |
| **Manifest Service** | YAML manifest validation | 8083 | PostgreSQL, Eureka |
| **Load Balancer** | Traffic distribution simulation | 8084 | Eureka |
| **Progress Service** | User progress tracking | 8085 | PostgreSQL, Eureka |
| **Discovery Service** | Service registration & discovery | 8761 | - |
| **Config Server** | Centralized configuration | 8888 | Eureka |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.4
- **Security**: Spring Security with JWT
- **Database**: PostgreSQL 15
- **ORM**: Spring Data JPA with Hibernate
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Configuration**: Spring Cloud Config Server
- **Container Orchestration**: Docker & Kubernetes

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: React Context API
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Terminal**: XTerm.js
- **HTTP Client**: Axios
- **Notifications**: React Toastify

### DevOps
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus & Grafana (optional)
- **Logging**: ELK Stack (optional)

---

## 🚀 Quick Start

### Prerequisites

- **Docker** 24.0+ & Docker Compose 2.20+
- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.8+
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/kingz1127/devops-cloudsandbox.git
cd devops-cloudsandbox
```

#### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=postgres-auth
DB_PORT=5432
DB_NAME=sandbox_auth

# Email Service (Brevo)
BREVO_USER=your_brevo_username
BREVO_PASS=your_brevo_password

# pgAdmin
PGADMIN_EMAIL=admin@cloudsandbox.com
PGADMIN_PASSWORD=your_pgadmin_password

# Service URLs
CONFIG_SERVER_URI=http://config-server:8888
EUREKA_URI=http://discovery-service:8761/eureka/
FRONTEND_URL=http://localhost:5173
```

#### 3. Build and Start Services

```bash
# Build all services
docker-compose build --no-cache

# Start all services
docker-compose up -d

# Wait for services to be healthy (approximately 30-60 seconds)
docker-compose ps
```

#### 4. Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **API Gateway** | http://localhost:8080 |
| **Eureka Dashboard** | http://localhost:8761 |
| **pgAdmin** | http://localhost:5050 |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |

### Default Credentials

- **pgAdmin**: admin@cloudsandbox.com / your_pgadmin_password
- **Register** a new user through the frontend

---

## 🧪 Testing the Application

### Register a User

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "cohortCode": "COHORT-2026"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

### Run a Container

```bash
# Using the terminal in the frontend
docker run --name my-nginx --image nginx:alpine
```

### Validate a YAML Manifest

```bash
curl -X POST http://localhost:8080/api/v1/manifests/validate \
  -H "Content-Type: application/json" \
  -d '{
    "yaml": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx\nspec:\n  replicas: 3"
  }'
```

### Simulate Load Balancer Traffic

```bash
curl -X POST http://localhost:8080/api/v1/loadbalancers/simulate \
  -H "Content-Type: application/json" \
  -d '["172.17.0.2", "172.17.0.3", "172.17.0.4"]'
```

---

## 📂 Complete Project Structure

```
devops-cloudsandbox/
├── api-gateway/                      # API Gateway Service (Port: 8080)
│   ├── src/main/java/com/cloudsandbox/gateway/
│   │   ├── ApiGatewayApplication.java
│   │   └── filter/
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── bootstrap.yml
│   └── pom.xml
│
├── auth-service/                     # Authentication Service (Port: 8081)
│   ├── src/main/java/com/cloudsandbox/auth/
│   │   ├── AuthServiceApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── MailConfig.java
│   │   ├── controller/AuthController.java
│   │   ├── service/impl/AuthServiceImpl.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── RefreshTokenRepository.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   └── RefreshToken.java
│   │   ├── dto/request/RegisterRequest.java
│   │   ├── dto/response/AuthResponse.java
│   │   └── security/
│   │       ├── JwtService.java
│   │       └── JwtAuthFilter.java
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── container-sim-service/            # Container Simulation Service (Port: 8082)
│   ├── src/main/java/com/cloudsandbox/containersim/
│   │   ├── ContainerSimApplication.java
│   │   ├── controller/ContainerController.java
│   │   ├── service/ContainerService.java
│   │   ├── repository/SimContainerRepository.java
│   │   └── entity/
│   │       ├── SimContainer.java
│   │       └── ContainerStatus.java
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── manifest-service/                 # Manifest Validation Service (Port: 8083)
│   ├── src/main/java/com/cloudsandbox/manifest/
│   │   ├── ManifestServiceApplication.java
│   │   ├── controller/ManifestController.java
│   │   └── service/YamlValidationService.java
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── loadbalancer-sim-service/         # Load Balancer Service (Port: 8084)
│   ├── src/main/java/com/cloudsandbox/loadbalancer/
│   │   ├── LoadBalancerApplication.java
│   │   ├── controller/LoadBalancerController.java
│   │   └── service/LBEngine.java
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── progress-service/                 # Progress Tracking Service (Port: 8085)
│   ├── src/main/java/com/cloudsandbox/progress/
│   │   ├── ProgressServiceApplication.java
│   │   ├── controller/ProgressController.java
│   │   ├── service/ProgressService.java
│   │   ├── repository/StudentProgressRepository.java
│   │   └── entity/StudentProgress.java
│   ├── src/main/resources/application.yml
│   └── pom.xml
│
├── discovery-service/                # Service Discovery (Port: 8761)
│   ├── src/main/java/com/cloudsandbox/discovery/
│   │   └── DiscoveryServiceApplication.java
│   └── pom.xml
│
├── config-server/                    # Configuration Server (Port: 8888)
│   ├── src/main/java/com/cloudsandbox/config/
│   │   └── ConfigServerApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── config-repo/
│   │       ├── application.yml
│   │       ├── auth-service.yml
│   │       ├── api-gateway.yml
│   │       └── manifest-service.yml
│   └── pom.xml
│
├── frontend/                         # React Frontend (Port: 5173)
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── container.service.ts
│   │   │       ├── manifest.service.ts
│   │   │       ├── progress.service.ts
│   │   │       └── lb.service.ts
│   │   ├── components/layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── LandingNavbar.tsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   └── ResetPassword.tsx
│   │   │   ├── dashboard/DashboardPage.tsx
│   │   │   ├── terminal/TerminalPage.tsx
│   │   │   ├── validator/YamlValidatorPage.tsx
│   │   │   ├── progress/ProgressPage.tsx
│   │   │   └── lb/LoadBalancerPage.tsx
│   │   ├── store/AuthContext.tsx
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── Dockerfile
│
├── kubernetes/                       # Kubernetes Deployment Files
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
│
├── docker-compose.yml
├── Dockerfile
├── .env                              # DO NOT COMMIT
├── .gitignore
├── .dockerignore
├── CONTRIBUTING.md
└── README.md
```

---

## 🗄️ Database Schema

### Auth Database (sandbox_auth)

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    cohort_code VARCHAR(20),
    role VARCHAR(20) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(500) UNIQUE NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Container Database (sandbox_containers)

```sql
CREATE TABLE sim_containers (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    image_name VARCHAR(255),
    container_id VARCHAR(50),
    internal_ip VARCHAR(15),
    status VARCHAR(20) DEFAULT 'STOPPED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Progress Database (sandbox_progress)

```sql
CREATE TABLE student_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    score INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    related_container_id VARCHAR(255)
);
```

---

## 🔌 API Endpoints

### Authentication Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Authenticate user |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password with token |
| POST | `/api/v1/auth/refresh` | Refresh JWT token |
| GET | `/api/v1/auth/me` | Get current user info |

### Container Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/containers` | List all containers |
| POST | `/api/v1/containers` | Create/run a container |
| GET | `/api/v1/containers/{id}` | Get container details |
| POST | `/api/v1/containers/{id}/start` | Start a container |
| POST | `/api/v1/containers/{id}/stop` | Stop a container |
| DELETE | `/api/v1/containers/{id}` | Delete a container |

### Manifest Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/manifests/validate` | Validate YAML manifest |

### Load Balancer Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/loadbalancers/simulate` | Simulate traffic routing |

### Progress Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/progress/me` | Get user progress |
| POST | `/api/v1/progress/submit` | Submit module progress |
| DELETE | `/api/v1/progress/by-container/{id}` | Delete progress by container |

---

## 📊 Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace devops-cloudsandbox

# Apply configurations
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# Check deployment status
kubectl get pods -n devops-cloudsandbox
kubectl get services -n devops-cloudsandbox

# Scale deployment
kubectl scale deployment cloudsandbox-deployment -n devops-cloudsandbox --replicas=5
```

---

## 🔒 Security

### Authentication Flow

1. User registers → Server hashes password → User stored in database
2. User logs in → Server validates credentials → JWT token generated
3. JWT token returned to client → Stored in localStorage
4. Token included in `Authorization: Bearer <token>` header
5. Server validates token on each request
6. Refresh token for extended sessions

### Environment Variables (DO NOT COMMIT)

```bash
# .env - Keep this out of version control!
JWT_SECRET=your-256-bit-secret-key
DB_PASSWORD=your_secure_password
BREVO_PASS=your_api_key
PGADMIN_PASSWORD=your_pgadmin_password
```

---

## 📈 Monitoring

```bash
# Health checks for all services
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
# ... and so on

# Metrics endpoints
/actuator/metrics
/actuator/prometheus
```

---

## 🐛 Troubleshooting

### Services Fail to Start
```bash
docker logs <service-name>
docker-compose build --no-cache <service-name>
docker-compose down -v && docker-compose up -d
```

### Port Conflicts
```bash
netstat -tulpn | grep <port>
# Change port in docker-compose.yml
```

### Database Connection Issues
```bash
docker exec -it postgres-auth psql -U postgres -c "SELECT 1"
docker logs postgres-auth --tail 50
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Spring Boot Team
- Docker & Kubernetes Communities
- All Open Source Contributors
- Brevo for email service

---

## 📞 Contact

- **GitHub Issues**: [Report Issue](https://github.com/kingz1127/devops-cloudsandbox/issues)
- **Email**: osunyingboadedeji1@gmail.com

---

<div align="center">

**Made with ❤️ by Oshunyingbo Adedeji**

[⬆ Back to Top](#-devops-cloudsandbox)

</div>