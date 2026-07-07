package com.cloudsandbox.containersim.exception;

import com.cloudsandbox.containersim.entity.ContainerStatus;

public class InvalidStateTransitionException extends RuntimeException {
    public InvalidStateTransitionException(ContainerStatus from, ContainerStatus to) {
        super("Cannot transition container from " + from + " to " + to);
    }
}