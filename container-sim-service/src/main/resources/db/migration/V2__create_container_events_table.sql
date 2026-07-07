CREATE TABLE container_events (
                                  id BIGSERIAL PRIMARY KEY,
                                  container_id INT8 NOT NULL, -- BIGINT matching Java's Long
                                  event_type VARCHAR(30) NOT NULL,
                                  event_timestamp TIMESTAMP NOT NULL,
                                  details TEXT
);