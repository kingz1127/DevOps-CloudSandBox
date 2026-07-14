package com.cloudsandbox.manifest.service;

import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.Yaml;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@Service
public class YamlValidationService {

    public List<String> validateKubernetesManifest(String yamlContent) {
        List<String> errors = new ArrayList<>();

        if (yamlContent == null || yamlContent.trim().isEmpty()) {
            errors.add("YAML content is empty.");
            return errors;
        }

        Yaml yaml = new Yaml();

        try {
            Object loaded = yaml.load(yamlContent);

            if (!(loaded instanceof Map)) {
                errors.add("Invalid manifest: expected a YAML object at the root (e.g. apiVersion, kind, metadata).");
                return errors;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> obj = (Map<String, Object>) loaded;

            if (yamlContent.contains("\n---")) {
                errors.add("Note: this validator only checks the first document. Multi-document manifests (separated by '---') will have later documents ignored.");
            }

            if (!obj.containsKey("apiVersion")) {
                errors.add("Missing field: apiVersion (e.g., apps/v1)");
            }

            if (!obj.containsKey("kind")) {
                errors.add("Missing field: kind (e.g., Deployment, Service)");
            }

            if (!obj.containsKey("metadata")) {
                errors.add("Missing section: metadata");
            }

            if ("Deployment".equals(obj.get("kind"))) {
                Object specObj = obj.get("spec");
                if (!(specObj instanceof Map)) {
                    errors.add("Missing section: spec (required for Deployment)");
                } else {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> spec = (Map<String, Object>) specObj;
                    if (!spec.containsKey("replicas")) {
                        errors.add("Best Practice Warning: Deployment should define 'replicas'");
                    }
                }
            }

        } catch (Exception e) {
            errors.add("Invalid YAML syntax: " + e.getMessage());
        }

        return errors;
    }
}