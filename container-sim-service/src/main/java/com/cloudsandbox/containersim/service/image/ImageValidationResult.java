package com.cloudsandbox.containersim.service.image;

public record ImageValidationResult(boolean valid, String registry, String message) {
    public static ImageValidationResult valid(String registry, String image) {
        return new ImageValidationResult(true, registry, "Image '" + image + "' verified on " + registry);
    }
    public static ImageValidationResult invalid(String registry, String message) {
        return new ImageValidationResult(false, registry, message);
    }
}