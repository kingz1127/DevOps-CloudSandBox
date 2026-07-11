import apiClient from '../client';

export interface LoadBalancer {
  id: string;
  name: string;
  publicIp: string;
  algorithm: string;
  targetContainerIps: string[];
}

export const lbService = {
  // Pass the list of IPs from your containers to the backend simulation engine
  hitTraffic: async (ips: string[]) => {
    // This now matches your Java @PostMapping("/simulate")
    // URL: http://localhost:8080/api/v1/loadbalancers/simulate
    // Body: ["172.17.0.2", "172.17.0.3", ...]
    const res = await apiClient.post('/loadbalancers/simulate', ips);
    return res.data; // Returns { "routingDecision": "..." }
  },

  // Note: These will only work if you have a Repository + @GetMapping in your Java code
  getLBs: async (): Promise<LoadBalancer[]> => {
    const res = await apiClient.get('/loadbalancers');
    return res.data;
  }
};