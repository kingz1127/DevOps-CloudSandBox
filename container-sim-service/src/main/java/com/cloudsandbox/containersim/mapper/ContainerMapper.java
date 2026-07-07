package com.cloudsandbox.containersim.mapper;

import com.cloudsandbox.containersim.dto.response.ContainerEventResponse;
import com.cloudsandbox.containersim.dto.response.ContainerLogResponse;
import com.cloudsandbox.containersim.dto.response.ContainerResponse;
import com.cloudsandbox.containersim.entity.ContainerEvent;
import com.cloudsandbox.containersim.entity.ContainerLog;
import com.cloudsandbox.containersim.entity.SimContainer;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ContainerMapper {
    ContainerResponse toResponse(SimContainer container);
    ContainerEventResponse toResponse(ContainerEvent event);
    ContainerLogResponse toResponse(ContainerLog log);
}