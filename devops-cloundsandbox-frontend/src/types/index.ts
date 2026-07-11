
export interface Container {
  id: string;
  name: string;
  imageName: string;
  containerId: string;
  internalIp: string;
  status: 'RUNNING' | 'STOPPED' | 'ERROR';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  cohortCode: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  username: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}