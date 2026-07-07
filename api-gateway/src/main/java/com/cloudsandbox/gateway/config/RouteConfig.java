package com.cloudsandbox.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Declarative route table. Each downstream service is reached via its
 * Eureka-registered logical name ("lb://<service-name>"), so the Gateway
 * never needs to know a physical host/port.
 */
@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://auth-service"))
                .route("container-sim-service", r -> r.path("/api/containers/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://container-sim-service"))
                .route("manifest-service", r -> r.path("/api/manifests/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://manifest-service"))
                .route("loadbalancer-sim-service", r -> r.path("/api/loadbalancers/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://loadbalancer-sim-service"))
                .route("progress-service", r -> r.path("/api/progress/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://progress-service"))
                .build();
    }
}
