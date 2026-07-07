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
        Yaml yaml = new Yaml();

        try {
            Map<String, Object> obj = yaml.load(yamlContent);

            // Rule 1: Must have apiVersion
            if (!obj.containsKey("apiVersion")) {
                errors.add("Missing field: apiVersion (e.g., apps/v1)");
            }

            // Rule 2: Must have kind
            if (!obj.containsKey("kind")) {
                errors.add("Missing field: kind (e.g., Deployment, Service)");
            }

            // Rule 3: Validate Metadata
            if (!obj.containsKey("metadata")) {
                errors.add("Missing section: metadata");
            }

            // Rule 4: Logic specific to 'Deployment'
            if ("Deployment".equals(obj.get("kind"))) {
                Map<String, Object> spec = (Map<String, Object>) obj.get("spec");
                if (spec == null || !spec.containsKey("replicas")) {
                    errors.add("Best Practice Warning: Deployment should define 'replicas'");
                }
            }

        } catch (Exception e) {
            errors.add("Invalid YAML syntax: " + e.getMessage());
        }

        return errors;
    }
}