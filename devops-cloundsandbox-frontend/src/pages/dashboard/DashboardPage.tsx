import React, { useEffect, useState } from 'react';
import { containerService } from '../../api/services/container.service';
// import { Container } from '../../types';
import { Server, Activity, Globe, Cpu, Power, Trash2, RefreshCw } from 'lucide-react';
import type { Container } from '../../types';

const DashboardPage = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContainers = async () => {
    setLoading(true);
    try {
      const data = await containerService.getAll();
      setContainers(data);
    } catch (error) {
      console.error("Error loading containers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  // ... existing fetchContainers ...

  const handleStop = async (id: string) => {
    try {
      await containerService.stop(id);
      fetchContainers(); 
    } catch (error) {
      alert("Failed to stop container. Check console.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this container?")) {
      try {
        await containerService.delete(id);
        setContainers(containers.filter(c => c.id !== id)); // Optimistic update
      } catch (error) {
        alert("Failed to delete container.");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Infrastructure</h1>
          <p className="text-slate-500">View and manage your virtual container fleet.</p>
        </div>
        <button 
          onClick={fetchContainers}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 text-green-600 mb-2">
            <Activity size={20} />
            <span className="text-sm font-bold uppercase">Status</span>
          </div>
          <div className="text-2xl font-bold">{containers.filter(c => c.status === 'RUNNING').length} Running</div>
        </div>
        <div className="bg-white border p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-2">
            <Cpu size={20} />
            <span className="text-sm font-bold uppercase">Resources</span>
          </div>
          <div className="text-2xl font-bold">{containers.length} Containers</div>
        </div>
        <div className="bg-white border p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 text-purple-600 mb-2">
            <Globe size={20} />
            <span className="text-sm font-bold uppercase">Networking</span>
          </div>
          <div className="text-2xl font-bold">Isolated Bridge</div>
        </div>
      </div>

      {/* Container Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {containers.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 transition-all shadow-sm">
            <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Server size={18} className="text-slate-400" />
                <span className="font-mono text-sm font-bold">{c.name}</span>
              </div>
              <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${
                c.status === 'RUNNING' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'RUNNING' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                {c.status}
              </div>
            </div>
            
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase">Image</span>
                <span className="font-medium text-slate-900">{c.imageName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase">IP Address</span>
                <span className="font-mono text-blue-600 font-bold">{c.internalIp}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase">Container ID</span>
                <span className="font-mono text-slate-400">{c.containerId}</span>
              </div>

              <div className="pt-4 flex space-x-2">
                <button 
  onClick={() => handleStop(c.id)}
  disabled={c.status === 'STOPPED'}
  className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50 disabled:bg-slate-400"
>
  <Power size={14} />
  <span>{c.status === 'STOPPED' ? 'Offline' : 'Stop'}</span>
</button>

<button 
  onClick={() => handleDelete(c.id)}
  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
>
  <Trash2 size={16} />
</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {containers.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">No active containers. Head to the terminal to start one.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;