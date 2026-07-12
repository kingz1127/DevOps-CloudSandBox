package com.cloudsandbox.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Value("${AUTH_SERVICE_URL:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${CONTAINER_SIM_SERVICE_URL:http://localhost:8082}")
    private String containerSimServiceUrl;

    @Value("${MANIFEST_SERVICE_URL:http://localhost:8083}")
    private String manifestServiceUrl;

    @Value("${LOADBALANCER_SIM_SERVICE_URL:http://localhost:8084}")
    private String loadbalancerSimServiceUrl;

    @Value("${PROGRESS_SERVICE_URL:http://localhost:8085}")
    private String progressServiceUrl;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/v1/auth/**")
                        .uri(authServiceUrl))
                .route("container-sim-service", r -> r.path("/api/v1/containers/**")
                        .uri(containerSimServiceUrl))
                .route("manifest-service", r -> r.path("/api/v1/manifests/**")
                        .uri(manifestServiceUrl))
                .route("loadbalancer-sim-service", r -> r.path("/api/v1/loadbalancers/**")
                        .uri(loadbalancerSimServiceUrl))
                .route("progress-service", r -> r.path("/api/v1/progress/**")
                        .uri(progressServiceUrl))
                .build();
    }
}
