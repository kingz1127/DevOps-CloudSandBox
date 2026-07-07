package com.cloudsandbox.containersim.dto.response;

import com.cloudsandbox.containersim.entity.ContainerStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ContainerResponse {
    private String id;
    private String name;
    private String imageName;
    private String containerId;
    private String internalIp;
    private ContainerStatus status;
    private LocalDateTime createdAt;
}