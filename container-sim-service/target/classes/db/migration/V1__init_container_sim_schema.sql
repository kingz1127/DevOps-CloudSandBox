CREATE TABLE sim_containers (
                                id VARCHAR(36) PRIMARY KEY,
                                user_id VARCHAR(100) NOT NULL,
                                name VARCHAR(255) NOT NULL,
                                image_name VARCHAR(255) NOT NULL,
                                container_id VARCHAR(12),
                                internal_ip VARCHAR(15),
                                status VARCHAR(20),
                                created_at TIMESTAMP,
                                updated_at TIMESTAMP
);