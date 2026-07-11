package com.cloudsandbox.loadbalancer.controller;

import com.cloudsandbox.loadbalancer.service.LBEngine;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/loadbalancers")
@RequiredArgsConstructor
@Tag(name = "5. Load Balancer Simulator", description = "Simulates North-South traffic distribution using Round Robin algorithms")
public class LoadBalancerController {

    private final LBEngine lbEngine;

    @Operation(
            summary = "Simulate Traffic Routing",
            description = "Takes a list of container IPs and returns the next IP that should receive traffic based on the Round-Robin state."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Successfully calculated routing decision",
            content = @Content(schema = @Schema(example = "{\"routingDecision\": \"Traffic routed to node: 172.17.0.4\"}"))
    )
    @ApiResponse(responseCode = "401", description = "Unauthorized - Valid JWT required")
    @PostMapping("/simulate")
    public ResponseEntity<Map<String, String>> simulate(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "List of active virtual container IPs",
                    required = true,
                    content = @Content(schema = @Schema(example = "[\"172.17.0.2\", \"172.17.0.3\", \"172.17.0.4\"]"))
            )
            @RequestBody List<String> ips) {

        String result = lbEngine.simulateRoundRobin(ips);
        return ResponseEntity.ok(Map.of("routingDecision", result));
    }
}