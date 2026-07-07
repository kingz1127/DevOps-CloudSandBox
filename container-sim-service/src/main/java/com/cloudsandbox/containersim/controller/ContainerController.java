package com.cloudsandbox.containersim.controller;

import com.cloudsandbox.containersim.dto.request.CreateContainerRequest;
import com.cloudsandbox.containersim.dto.response.ContainerResponse;
import com.cloudsandbox.containersim.service.ContainerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/containers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Container Simulator", description = "Simulates Docker-style container management logic")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class ContainerController {

    private final ContainerService containerService;

    @Operation(summary = "Simulate 'docker run'", description = "Mocks a container startup, assigns a virtual IP and a status.")
    @ApiResponse(responseCode = "200", description = "Simulated container is now running")
    @PostMapping
    public ResponseEntity<ContainerResponse> runContainer(
            @Parameter(description = "User ID forwarded by the API Gateway")
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CreateContainerRequest request) {
        return ResponseEntity.ok(containerService.createContainer(userId, request));
    }

    @Operation(summary = "Simulate 'docker ps'", description = "Lists all simulated containers currently in the 'RUNNING' state for the user.")
    @GetMapping
    public ResponseEntity<List<ContainerResponse>> listContainers(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(containerService.getContainersByUser(userId));
    }
}