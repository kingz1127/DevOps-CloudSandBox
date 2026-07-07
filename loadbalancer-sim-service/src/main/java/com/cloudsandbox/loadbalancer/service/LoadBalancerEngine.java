package com.cloudsandbox.loadbalancer.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LoadBalancerEngine {
    private final AtomicInteger counter = new AtomicInteger(0);

    // Simulation of Round Robin Algorithm
    public String simulateRoundRobin(List<String> targetIps) {
        if (targetIps.isEmpty()) return "Error: No backend targets found";

        int index = counter.getAndIncrement() % targetIps.size();
        return "Traffic routed to: " + targetIps.get(index);
    }
}