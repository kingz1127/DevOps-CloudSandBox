package com.cloudsandbox.manifest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class ManifestServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ManifestServiceApplication.class, args);
    }
}