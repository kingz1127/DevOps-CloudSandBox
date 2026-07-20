
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { progressService, type StudentProgress } from '../../api/services/progress.service';
import { Award, CheckCircle, BookOpen, BarChart3, Trophy, Wrench } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

const isLifecycleAction = (moduleName: string) =>
  /Stop|Start|Remove|Delete/i.test(moduleName);

const ProgressPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressService.getMyProgress();
        setHistory(data);
        
        if (data.length === 0) {
          toast.info('📚 No progress yet. Complete a module to start tracking!', {
            position: "top-right",
            autoClose: 4000,
          });
        }
      } catch (err) {
        console.error("Failed to load progress", err);
        toast.error('Failed to load your progress. Please refresh the page.', {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  // Only "real" learning modules count toward stats — not routine lifecycle actions
  const countedHistory = history.filter(p => !isLifecycleAction(p.moduleName));

  const totalCompleted = countedHistory.filter(p => p.completed).length;
  const averageScore = countedHistory.length > 0
    ? Math.round(countedHistory.reduce((acc, curr) => acc + curr.score, 0) / countedHistory.length)
    : 0;

  // Check for milestone achievements
  useEffect(() => {
    if (totalCompleted > 0 && totalCompleted % 5 === 0) {
      toast.success(`🏆 Achievement unlocked! ${totalCompleted} modules completed!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  }, [totalCompleted]);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Academic Report Card</h1>
        <p className="text-slate-500">Student: <span className="font-semibold text-blue-600">{user?.firstName} {user?.lastName}</span> | Cohort: {user?.cohortCode}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MetricCard title="Overall Score" value={`${averageScore}%`} icon={<BarChart3 className="text-blue-500" />} />
        <MetricCard title="Modules Done" value={totalCompleted} icon={<CheckCircle className="text-green-500" />} />
        <MetricCard title="Rank" value={totalCompleted >= 10 ? "DevOps Pro" : totalCompleted >= 5 ? "DevOps Intermediate" : "DevOps Novice"} icon={<Trophy className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BookOpen size={18} /> Detailed Module History
              </h3>
              <p className="text-xs text-slate-400 mt-1">Lifecycle actions (stop/start/delete) are logged but don't count toward your score.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.length > 0 ? history.map((item) => {
                    const lifecycle = isLifecycleAction(item.moduleName);
                    return (
                      <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${lifecycle ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4 font-medium text-slate-900">{item.moduleName}</td>
                        <td className="px-6 py-4">
                          {lifecycle ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                              <Wrench size={10} /> Action
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                              Module
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            item.completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.completed ? 'PASSED' : 'FAILED'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{item.score}%</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {new Date(item.completionDate).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">
                        No modules completed yet. Start an exercise to build your progress.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award className="text-yellow-400" /> Digital Badges
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Badge icon="🐳" label="Docker Pilot" active={countedHistory.some(h => h.moduleName.includes("Docker"))} />
              <Badge icon="☸️" label="K8s Captain" active={countedHistory.some(h => h.moduleName.includes("Kubernetes"))} />
              <Badge icon="📄" label="YAML Master" active={countedHistory.some(h => h.moduleName.includes("YAML"))} />
              <Badge icon="🛡️" label="Security Pro" active={false} />
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-1">Final Project Goal</h4>
              <p className="text-blue-100 text-xs mb-4">Complete all sandbox challenges to graduate.</p>
              <div className="w-full bg-blue-800 rounded-full h-2 mb-2">
                <div className="bg-white h-2 rounded-full" style={{ width: `${Math.min((totalCompleted / 4) * 100, 100)}%` }}></div>
              </div>
              <span className="text-[10px] font-bold uppercase">{Math.min(totalCompleted, 4)}/4 Modules</span>
            </div>
            <Award className="absolute -right-4 -bottom-4 text-blue-500 opacity-50" size={100} />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
  </div>
);

const Badge = ({ icon, label, active }: any) => (
  <div className={`flex flex-col items-center p-3 rounded-xl border ${
    active ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-30 grayscale'
  }`}>
    <span className="text-3xl mb-1">{icon}</span>
    <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">{label}</span>
  </div>
);

export default ProgressPage;