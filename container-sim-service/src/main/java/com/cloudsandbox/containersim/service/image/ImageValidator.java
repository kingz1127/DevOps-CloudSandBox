package com.cloudsandbox.containersim.service.image;

public interface ImageValidator {
    boolean supports(String image);
    ImageValidationResult validate(String image);
}