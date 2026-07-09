package com.cloudsandbox.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Declarative route table. Each downstream service is reached via its
 * Eureka-registered logical name ("lb://<service-name>"), so the Gateway
 * never needs to know a physical host/port.
 *
 * NOTE: paths are forwarded AS-IS (no stripPrefix) because each controller
 * owns its full versioned path internally (e.g. @RequestMapping("/api/v1/auth")
 * on AuthController) rather than expecting the Gateway to strip a prefix.
 */
@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/v1/auth/**")
                        .uri("lb://auth-service"))
                .route("container-sim-service", r -> r.path("/api/v1/containers/**")
                        .uri("lb://container-sim-service"))
                .route("manifest-service", r -> r.path("/api/v1/manifests/**")
                        .uri("lb://manifest-service"))
                .route("loadbalancer-sim-service", r -> r.path("/api/v1/loadbalancers/**")
                        .uri("lb://loadbalancer-sim-service"))
                .route("progress-service", r -> r.path("/api/v1/progress/**")
                        .uri("lb://progress-service"))
                .build();
    }
}