import apiClient from '../client';

export interface ValidationResponse {
  status: 'VALID' | 'INVALID';
  message?: string;
  errors?: string[];
}

export const manifestService = {
  validate: async (yamlContent: string): Promise<ValidationResponse> => {
    // Hits Gateway 8080 -> routes to Manifest Service 8083
    const response = await apiClient.post('/manifests/validate', {
      yaml: yamlContent
    });
    return response.data;
  }
};