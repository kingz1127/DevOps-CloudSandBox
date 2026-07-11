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
@Tag(name = "Container Simulator", description = "Simulates Docker-style container management logic")
@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
public class ContainerController {

    private final ContainerService containerService;

    @PostMapping
    public ResponseEntity<ContainerResponse> runContainer(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CreateContainerRequest request) {
        return ResponseEntity.ok(containerService.createContainer(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<ContainerResponse>> listContainers(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(containerService.getContainersByUser(userId));
    }

    // ADD THIS: Matches http://localhost:8080/api/v1/containers/{id}/stop
    @Operation(summary = "Stop a container")
    @PostMapping("/{id}/stop")
    public ResponseEntity<ContainerResponse> stopContainer(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String id) {
        return ResponseEntity.ok(containerService.stopContainer(userId, id));
    }

    // ADD THIS: Matches http://localhost:8080/api/v1/containers/{id}
    @Operation(summary = "Delete a container")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContainer(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String id) {
        containerService.deleteContainer(userId, id);
        return ResponseEntity.noContent().build();
    }
}