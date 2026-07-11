import apiClient from '../client';

export interface StudentProgress {
  id?: number;
  userId: string;
  moduleName: string;
  score: number;
  completed: boolean;
  completionDate: string;
}

export const progressService = {
  // Hits Gateway 8080 -> routes to Progress Service 8085
  getMyProgress: async (): Promise<StudentProgress[]> => {
    const response = await apiClient.get('/progress/me');
    return response.data;
  },

  // Used internally when a student finishes an exercise
  submitProgress: async (moduleName: string, score: number): Promise<StudentProgress> => {
    const response = await apiClient.post('/progress/submit', {
      moduleName,
      score,
      completed: score >= 70,
      completionDate: new Date().toISOString()
    });
    return response.data;
  }
};