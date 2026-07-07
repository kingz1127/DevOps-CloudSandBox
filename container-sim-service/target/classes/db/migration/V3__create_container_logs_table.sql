CREATE TABLE container_logs (
                                id BIGSERIAL PRIMARY KEY,
                                container_id INT8 NOT NULL,       -- Matches Java's Long (use VARCHAR(255) if your container IDs are UUIDs)
                                log_line TEXT NOT NULL,
                                logged_at TIMESTAMP NOT NULL
);