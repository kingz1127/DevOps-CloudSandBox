package com.cloudsandbox.containersim.dto.response;

import java.time.LocalDateTime;

public record ContainerEventResponse(
        Long id,
        Long containerId,
        String eventType,
        LocalDateTime eventTimestamp,
        String details
) {}