package com.cloudsandbox.manifest.controller;

import com.cloudsandbox.manifest.service.YamlValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/manifests")
@RequiredArgsConstructor
public class ManifestController {

    private final YamlValidationService validationService;

    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody Map<String, String> request) {
        String yamlContent = request.get("yaml");
        List<String> errors = validationService.validateKubernetesManifest(yamlContent);

        if (errors.isEmpty()) {
            return ResponseEntity.ok(Map.of("status", "VALID", "message", "Manifest is enterprise-ready!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "INVALID", "errors", errors));
        }
    }
}