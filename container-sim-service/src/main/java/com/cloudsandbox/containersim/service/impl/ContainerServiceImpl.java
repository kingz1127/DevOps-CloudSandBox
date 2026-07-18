package com.cloudsandbox.containersim.service.impl;

import com.cloudsandbox.containersim.dto.request.CreateContainerRequest;
import com.cloudsandbox.containersim.dto.response.ContainerResponse;
import com.cloudsandbox.containersim.entity.*;
import com.cloudsandbox.containersim.exception.InvalidImageException;
import com.cloudsandbox.containersim.repository.SimContainerRepository;
import com.cloudsandbox.containersim.service.ContainerService;
import com.cloudsandbox.containersim.service.image.ImageValidationResult;
import com.cloudsandbox.containersim.service.image.ImageValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContainerServiceImpl implements ContainerService {

    private final SimContainerRepository repository;
    private final ImageValidationService imageValidationService;

    @Override
    public ContainerResponse createContainer(String userId, CreateContainerRequest request) {
        ImageValidationResult validation = imageValidationService.validate(request.getImage());

        if (!validation.valid()) {
            throw new InvalidImageException(validation.message());
        }

        String mockContainerId = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        String mockIp = "172.17.0." + (new Random().nextInt(250) + 2);

        SimContainer container = SimContainer.builder()
                .userId(userId)
                .name(request.getName())
                .imageName(request.getImage())
                .containerId(mockContainerId)
                .internalIp(mockIp)
                .status(ContainerStatus.RUNNING)
                .build();

        return mapToResponse(repository.save(container));
    }

    @Override
    public List<ContainerResponse> getContainersByUser(String userId) {
        return repository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ContainerResponse stopContainer(String userId, String id) {
        SimContainer container = repository.findByContainerIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Container not found or access denied"));
        container.setStatus(ContainerStatus.STOPPED);
        return mapToResponse(repository.save(container));
    }

    @Override
    public ContainerResponse startContainer(String userId, String id) {
        SimContainer container = repository.findByContainerIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Container not found or access denied"));
        container.setStatus(ContainerStatus.RUNNING);
        return mapToResponse(repository.save(container));
    }

    @Override
    public void deleteContainer(String userId, String id) {
        SimContainer container = repository.findByContainerIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Container not found or access denied"));
        repository.delete(container);
    }

    private ContainerResponse mapToResponse(SimContainer entity) {
        ContainerResponse res = new ContainerResponse();
        res.setId(entity.getId());
        res.setName(entity.getName());
        res.setImageName(entity.getImageName());
        res.setContainerId(entity.getContainerId());
        res.setInternalIp(entity.getInternalIp());
        res.setStatus(entity.getStatus());
        res.setCreatedAt(entity.getCreatedAt());
        return res;
    }
}