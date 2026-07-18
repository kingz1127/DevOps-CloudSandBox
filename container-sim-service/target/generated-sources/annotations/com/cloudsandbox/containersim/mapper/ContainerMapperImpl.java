package com.cloudsandbox.containersim.mapper;

import com.cloudsandbox.containersim.dto.response.ContainerEventResponse;
import com.cloudsandbox.containersim.dto.response.ContainerLogResponse;
import com.cloudsandbox.containersim.dto.response.ContainerResponse;
import com.cloudsandbox.containersim.entity.ContainerEvent;
import com.cloudsandbox.containersim.entity.ContainerLog;
import com.cloudsandbox.containersim.entity.SimContainer;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-17T15:47:15+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.18 (Eclipse Adoptium)"
)
@Component
public class ContainerMapperImpl implements ContainerMapper {

    @Override
    public ContainerResponse toResponse(SimContainer container) {
        if ( container == null ) {
            return null;
        }

        ContainerResponse containerResponse = new ContainerResponse();

        containerResponse.setId( container.getId() );
        containerResponse.setName( container.getName() );
        containerResponse.setImageName( container.getImageName() );
        containerResponse.setContainerId( container.getContainerId() );
        containerResponse.setInternalIp( container.getInternalIp() );
        containerResponse.setStatus( container.getStatus() );
        containerResponse.setCreatedAt( container.getCreatedAt() );

        return containerResponse;
    }

    @Override
    public ContainerEventResponse toResponse(ContainerEvent event) {
        if ( event == null ) {
            return null;
        }

        Long id = null;
        Long containerId = null;
        String eventType = null;
        LocalDateTime eventTimestamp = null;
        String details = null;

        id = event.getId();
        containerId = event.getContainerId();
        eventType = event.getEventType();
        eventTimestamp = event.getEventTimestamp();
        details = event.getDetails();

        ContainerEventResponse containerEventResponse = new ContainerEventResponse( id, containerId, eventType, eventTimestamp, details );

        return containerEventResponse;
    }

    @Override
    public ContainerLogResponse toResponse(ContainerLog log) {
        if ( log == null ) {
            return null;
        }

        Long id = null;
        Long containerId = null;
        String logLine = null;
        LocalDateTime loggedAt = null;

        id = log.getId();
        containerId = log.getContainerId();
        logLine = log.getLogLine();
        loggedAt = log.getLoggedAt();

        ContainerLogResponse containerLogResponse = new ContainerLogResponse( id, containerId, logLine, loggedAt );

        return containerLogResponse;
    }
}
