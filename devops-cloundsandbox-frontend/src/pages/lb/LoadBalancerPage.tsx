import React, { useState, useEffect } from 'react';
import { lbService, type LoadBalancer } from '../../api/services/lb.service';
import { containerService } from '../../api/services/container.service';
import { type Container } from '../../types';
import { Network, ArrowRight, Server, Zap, Loader2, AlertCircle } from 'lucide-react';

const LoadBalancerPage = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [activeTraffic, setActiveTraffic] = useState<boolean>(false);
  const [lastRoute, setLastRoute] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch real containers on mount
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const data = await containerService.getAll();
        setContainers(data);
      } catch (err) {
        console.error("Failed to fetch containers for LB", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, []);

const sendTraffic = async () => {
  const runningContainers = containers.filter(c => c.status === 'RUNNING');
  if (runningContainers.length === 0) return;

  setActiveTraffic(true);

  const realIps = runningContainers.map(c => c.internalIp);

  try {
    const result = await lbService.hitTraffic(realIps);
    setLastRoute(result.routingDecision);
    setTimeout(() => setActiveTraffic(false), 800);
  } catch (e) {
    setActiveTraffic(false);
    console.error("LB Simulation failed", e);
  }
};

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Network className="text-blue-600" /> Ingress & Load Balancing
        </h1>
        <p className="text-slate-500">Real-time traffic distribution across your simulated cluster.</p>
      </header>

      {containers.filter(c => c.status === 'RUNNING').length === 0 ? (
  <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-center gap-4 text-amber-800">
    <AlertCircle />
    <div>
      <p className="font-bold">No Running Backend Nodes</p>
      <p className="text-sm">Go to the Terminal and run some containers (e.g. <code>docker run</code>) to start balancing traffic. Stopped containers won't receive traffic.</p>
    </div>
  </div>
) : (
        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold">CloudSandbox LoadBalancer (v1)</h3>
                  <div className="flex gap-2 mt-1">
                    <code className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">ALGORITHM: ROUND_ROBIN</code>
                    <code className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">NODES: {containers.length}</code>
                  </div>
                </div>
                <button 
                  onClick={sendTraffic}
                  disabled={activeTraffic || containers.filter(c => c.status === 'RUNNING').length === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-all disabled:opacity-50"
                >
                  <Zap size={16} className={activeTraffic ? "animate-pulse" : ""} />
                  {activeTraffic ? "Routing..." : "Send Test Request"}
                </button>
             </div>

             {/* VISUALIZER ENGINE */}
             <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-10 relative">
                
                {/* Public Gateway */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl z-20 border border-slate-700">
                    <GlobeIcon />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">PUBLIC_IP: 1.2.3.4</span>
                </div>

                {/* The Animated Traffic Ball */}
                {activeTraffic && (
                  <div className="absolute left-[15%] top-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-ping-move z-30" />
                )}

                <ArrowRight className="text-slate-200 hidden md:block" size={40} />

                {/* DYNAMIC Target Containers from Backend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-[300px]">
                  {containers.map(container => (
                    <div 
                      key={container.id} 
                      className={`p-4 border rounded-xl flex items-center gap-3 transition-all duration-500 ${
                        lastRoute.includes(container.internalIp) 
                          ? 'bg-blue-50 border-blue-500 scale-105 shadow-md' 
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${lastRoute.includes(container.internalIp) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Server size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-900">{container.internalIp}</div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold">{container.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* TRAFFIC LOGS */}
          <div className="bg-slate-950 rounded-2xl p-6 text-white shadow-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Ingress Logs</h4>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="text-[9px] font-bold text-green-500">LISTENING</div>
                </div>
              </div>
              <div className="font-mono text-[11px] space-y-1.5 max-h-40 overflow-y-auto">
                  <p className="text-slate-500">[{new Date().toLocaleTimeString()}] Initializing Round-Robin Engine...</p>
                  <p className="text-slate-500">[{new Date().toLocaleTimeString()}] Attached to {containers.length} backend containers.</p>
                  {lastRoute && (
                      <p className="animate-in fade-in slide-in-from-left-1 text-blue-100">
                        <span className="text-blue-400">INBOUND</span> 1.2.3.4:80 <span className="text-slate-600">→</span> <span className="text-green-400">PASSED</span> <span className="text-slate-600">→</span> <span className="text-yellow-400">{lastRoute}</span>
                      </p>
                  )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GlobeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
)

export default LoadBalancerPage;