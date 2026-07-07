package com.cloudsandbox.containersim.exception;

public class ContainerNotFoundException extends RuntimeException {
    public ContainerNotFoundException(Long id) {
        super("Container not found: " + id);
    }
}