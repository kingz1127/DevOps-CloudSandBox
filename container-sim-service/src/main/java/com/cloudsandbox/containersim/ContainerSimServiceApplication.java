package com.cloudsandbox.containersim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class ContainerSimServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ContainerSimServiceApplication.class, args);
    }
}
