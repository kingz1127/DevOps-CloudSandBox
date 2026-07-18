package com.cloudsandbox.containersim.service.image;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageValidationService {

    private final List<ImageValidator> validators;

    public ImageValidationResult validate(String image) {
        if (image == null || image.isBlank()) {
            return ImageValidationResult.invalid("unknown", "Image name cannot be empty");
        }

        return validators.stream()
                .filter(v -> v.supports(image))
                .findFirst()
                .map(v -> v.validate(image))
                .orElseGet(() -> ImageValidationResult.invalid("unknown",
                        "This registry isn't supported yet — only Docker Hub images are currently verified"));
    }
}