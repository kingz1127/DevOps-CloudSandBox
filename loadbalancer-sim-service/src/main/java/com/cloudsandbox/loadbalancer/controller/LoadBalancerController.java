package com.cloudsandbox.loadbalancer.controller;

import com.cloudsandbox.loadbalancer.service.LBEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lb")
@RequiredArgsConstructor
public class LoadBalancerController {
    private final LBEngine lbEngine;

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, String>> simulate(@RequestBody List<String> ips) {
        String result = lbEngine.simulateRoundRobin(ips);
        return ResponseEntity.ok(Map.of("routingDecision", result));
    }
}