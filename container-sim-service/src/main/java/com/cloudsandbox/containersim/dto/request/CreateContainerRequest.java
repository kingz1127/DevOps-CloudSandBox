package com.cloudsandbox.containersim.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateContainerRequest {
    @NotBlank(message = "Container name is required")
    private String name;
    @NotBlank(message = "Image name is required")
    private String image;
}