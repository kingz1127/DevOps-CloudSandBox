package com.cloudsandbox.containersim.dto.response;

import java.time.LocalDateTime;

public record ContainerLogResponse(
        Long id,
        Long containerId,
        String logLine,
        LocalDateTime loggedAt
) {}