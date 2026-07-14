package com.cloudsandbox.containersim.service;

import com.cloudsandbox.containersim.dto.request.CreateContainerRequest;
import com.cloudsandbox.containersim.dto.response.ContainerResponse;
import java.util.List;

public interface ContainerService {
    ContainerResponse createContainer(String userId, CreateContainerRequest request);
    List<ContainerResponse> getContainersByUser(String userId);
    ContainerResponse stopContainer(String userId, String id);
    void deleteContainer(String userId, String id);
    ContainerResponse startContainer(String userId, String id);
}