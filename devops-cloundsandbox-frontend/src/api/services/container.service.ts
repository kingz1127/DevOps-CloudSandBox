import type { Container } from '../../types';
import apiClient from '../client';

export const containerService = {

  getAll: async (): Promise<Container[]> => {
  // console.log('📤 Calling GET /containers');
  const response = await apiClient.get('/containers');
  // console.log('📥 Response from /containers:', response.data);
  return response.data;
},
  
  run: async (name: string, image: string): Promise<Container> => {
    const response = await apiClient.post('/containers', { name, image });
    return response.data;
  },

  validateImage: async (image: string): Promise<{ valid: boolean; registry: string; message: string }> => {
  const response = await apiClient.post('/containers/validate-image', { image });
  return response.data;
},

  stop: async (id: string): Promise<void> => {
    await apiClient.post(`/containers/${id}/stop`);
  },

  start: async (id: string): Promise<Container> => {
  const response = await apiClient.post(`/containers/${id}/start`);
  return response.data;
},

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/containers/${id}`);
  }
};