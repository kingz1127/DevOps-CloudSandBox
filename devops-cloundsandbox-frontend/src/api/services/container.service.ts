import type { Container } from '../../types';
import apiClient from '../client';
// import { Container } from '../../types';

export const containerService = {
  // Matches GET /api/v1/containers
  getAll: async (): Promise<Container[]> => {
    const response = await apiClient.get('/containers');
    return response.data;
  },

  // Matches POST /api/v1/containers
  run: async (name: string, image: string): Promise<Container> => {
    const response = await apiClient.post('/containers', { name, image });
    return response.data;
  },

  // Matches POST /api/v1/containers/{id}/stop
  stop: async (id: string): Promise<void> => {
    await apiClient.post(`/containers/${id}/stop`);
  },

  start: async (id: string): Promise<Container> => {
  const response = await apiClient.post(`/containers/${id}/start`);
  return response.data;
},

  // Matches DELETE /api/v1/containers/{id}
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/containers/${id}`);
  }
};