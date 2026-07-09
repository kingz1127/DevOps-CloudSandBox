export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface Container {
  id: string;
  name: string;
  imageName: string;
  containerId: string;
  internalIp: string;
  status: 'RUNNING' | 'STOPPED' | 'ERROR';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}