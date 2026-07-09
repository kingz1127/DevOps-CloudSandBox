package com.cloudsandbox.loadbalancer.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LBEngine {
    private final AtomicInteger counter = new AtomicInteger(0);

    public String simulateRoundRobin(List<String> targetIps) {
        if (targetIps == null || targetIps.isEmpty()) return "503 Service Unavailable";

        int index = counter.getAndIncrement() % targetIps.size();
        return "Traffic routed to node: " + targetIps.get(index);
    }
}