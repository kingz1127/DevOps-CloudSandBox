//package com.cloudsandbox.containersim.controller;
//
//import com.cloudsandbox.containersim.dto.request.CreateContainerRequest;
//import com.cloudsandbox.containersim.dto.response.ContainerResponse;
//import com.cloudsandbox.containersim.service.ContainerService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.Parameter;
//import io.swagger.v3.oas.annotations.responses.ApiResponse;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/containers")
//@RequiredArgsConstructor
//@Tag(name = "Container Simulator", description = "Simulates Docker-style container management logic")
//@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
//public class ContainerController {
//
//    private final ContainerService containerService;
//
//    @PostMapping
//    public ResponseEntity<ContainerResponse> runContainer(
//            @RequestHeader("X-User-Id") String userId,
//            @RequestBody CreateContainerRequest request) {
//        return ResponseEntity.ok(containerService.createContainer(userId, request));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<ContainerResponse>> listContainers(
//            @RequestHeader("X-User-Id") String userId) {
//        return ResponseEntity.ok(containerService.getContainersByUser(userId));
//    }
//
//    // ADD THIS: Matches http://localhost:8080/api/v1/containers/{id}/stop
//    @Operation(summary = "Stop a container")
//    @PostMapping("/{id}/stop")
//    public ResponseEntity<ContainerResponse> stopContainer(
//            @RequestHeader("X-User-Id") String userId,
//            @PathVariable String id) {
//        return ResponseEntity.ok(containerService.stopContainer(userId, id));
//    }
//
//    // ADD THIS: Matches http://localhost:8080/api/v1/containers/{id}
//    @Operation(summary = "Delete a container")
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteContainer(
//            @RequestHeader("X-User-Id") String userId,
//            @PathVariable String id) {
//        containerService.deleteContainer(userId, id);
//        return ResponseEntity.noContent().build();
//    }
//}



package com.cloudsandbox.containersim.controller;

import com.cloudsandbox.containersim.dto.request.CreateContainerRequest;
import com.cloudsandbox.containersim.dto.response.ContainerResponse;
import com.cloudsandbox.containersim.service.ContainerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
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

    @Operation(
            summary = "Run a new container",
            description = "Creates and starts a simulated container, assigning it a virtual ID and internal IP."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Container created and running",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ContainerResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid authentication")
    })
    @PostMapping
    public ResponseEntity<ContainerResponse> runContainer(
            @Parameter(description = "ID of the authenticated user", required = true)
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CreateContainerRequest request) {
        return ResponseEntity.ok(containerService.createContainer(userId, request));
    }


    @Operation(
            summary = "List all containers for the current user",
            description = "Returns every container (running or stopped) owned by the authenticated user."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of containers returned successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ContainerResponse.class))),
            @ApiResponse(responseCode = "401", description = "Missing or invalid authentication")
    })
    @GetMapping
    public ResponseEntity<List<ContainerResponse>> listContainers(
            @Parameter(description = "ID of the authenticated user", required = true)
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(containerService.getContainersByUser(userId));
    }

    @Operation(
            summary = "Stop a container",
            description = "Stops a running container without deleting it. The container remains listed with status STOPPED."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Container stopped successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ContainerResponse.class))),
            @ApiResponse(responseCode = "404", description = "Container not found"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid authentication")
    })
    @PostMapping("/{id}/stop")
    public ResponseEntity<ContainerResponse> stopContainer(
            @Parameter(description = "ID of the authenticated user", required = true)
            @RequestHeader("X-User-Id") String userId,
            @Parameter(description = "Container ID to stop", required = true)
            @PathVariable String id) {
        return ResponseEntity.ok(containerService.stopContainer(userId, id));
    }

    @Operation(
            summary = "Start a stopped container",
            description = "Resumes a previously stopped container, setting its status back to RUNNING."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Container started successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ContainerResponse.class))),
            @ApiResponse(responseCode = "404", description = "Container not found"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid authentication")
    })
    @PostMapping("/{id}/start")
    public ResponseEntity<ContainerResponse> startContainer(
            @Parameter(description = "ID of the authenticated user", required = true)
            @RequestHeader("X-User-Id") String userId,
            @Parameter(description = "Container ID to start", required = true)
            @PathVariable String id) {
        return ResponseEntity.ok(containerService.startContainer(userId, id));
    }

    @Operation(
            summary = "Delete a container",
            description = "Permanently removes a container from the user's container list."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Container deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Container not found"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid authentication")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContainer(
            @Parameter(description = "ID of the authenticated user", required = true)
            @RequestHeader("X-User-Id") String userId,
            @Parameter(description = "Container ID to delete", required = true)
            @PathVariable String id) {
        containerService.deleteContainer(userId, id);
        return ResponseEntity.noContent().build();
    }
}