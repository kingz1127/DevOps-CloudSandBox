package com.cloudsandbox.containersim.service.image;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class DockerHubImageValidator implements ImageValidator {

    private static final String REGISTRY_NAME = "Docker Hub";
    private final RestClient restClient = RestClient.create("https://hub.docker.com");

    @Override
    public boolean supports(String image) {
        String firstSegment = image.contains("/") ? image.split("/")[0] : "";
        // If the first path segment looks like a domain (has a dot or a port colon),
        // it's a different registry (e.g. ghcr.io/... or myregistry.com:5000/...)
        return !(firstSegment.contains(".") || firstSegment.contains(":"));
    }

    @Override
    public ImageValidationResult validate(String image) {
        ParsedImage parsed = parse(image);

        try {
            restClient.get()
                    .uri("/v2/repositories/{namespace}/{repo}/tags/{tag}", parsed.namespace(), parsed.repo(), parsed.tag())
                    .retrieve()
                    .toBodilessEntity();

            return ImageValidationResult.valid(REGISTRY_NAME, image);

        } catch (HttpClientErrorException.NotFound e) {
            return ImageValidationResult.invalid(REGISTRY_NAME,
                    "Image '" + parsed.namespace() + "/" + parsed.repo() + ":" + parsed.tag() + "' not found on Docker Hub");
        } catch (Exception e) {
            return ImageValidationResult.invalid(REGISTRY_NAME,
                    "Could not verify image against Docker Hub right now — try again shortly");
        }
    }

    private ParsedImage parse(String image) {
        String namespace;
        String repoAndTag;

        if (image.contains("/")) {
            String[] parts = image.split("/", 2);
            namespace = parts[0];
            repoAndTag = parts[1];
        } else {
            namespace = "library"; // Docker Hub's namespace for official images (nginx, postgres, etc.)
            repoAndTag = image;
        }

        String repo;
        String tag;
        if (repoAndTag.contains(":")) {
            String[] tagParts = repoAndTag.split(":", 2);
            repo = tagParts[0];
            tag = tagParts[1];
        } else {
            repo = repoAndTag;
            tag = "latest";
        }

        return new ParsedImage(namespace, repo, tag);
    }

    private record ParsedImage(String namespace, String repo, String tag) {}
}