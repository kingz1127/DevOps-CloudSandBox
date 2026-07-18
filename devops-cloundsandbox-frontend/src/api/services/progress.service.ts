import apiClient from '../client';

export interface StudentProgress {
  id?: number;
  userId: string;
  moduleName: string;
  score: number;
  completed: boolean;
  completionDate: string;
  relatedContainerId?: string;
}

export const progressService = {
  getMyProgress: async (): Promise<StudentProgress[]> => {
    const response = await apiClient.get('/progress/me');
    return response.data;
  },

  submitProgress: async (moduleName: string, score: number, relatedContainerId?: string): Promise<StudentProgress> => {
    const response = await apiClient.post('/progress/submit', {
      moduleName,
      score,
      completed: score >= 70,
      completionDate: new Date().toISOString(),
      relatedContainerId
    });
    return response.data;
  },

  deleteByContainer: async (containerId: string): Promise<void> => {
    await apiClient.delete(`/progress/by-container/${containerId}`);
  }
};