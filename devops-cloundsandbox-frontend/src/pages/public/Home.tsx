import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap, Database, Terminal as TermIcon } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter">
            Master DevOps <br />
            <span className="text-blue-500">Without the Data Cost.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            A localized enterprise infrastructure simulator. Practice Docker, Kubernetes, 
            and Load Balancing in a high-performance, data-free environment.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/register" className="bg-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition shadow-xl shadow-blue-600/20">
              Launch Your Sandbox
            </Link>
            <Link to="/guide" className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition">
              View Documentation
            </Link>
          </div>
        </div>
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Cpu className="text-blue-500" size={32} />}
              title="Stateful Simulation"
              desc="Our Java logic engine mimics Docker container lifecycles including startup delays and resource allocation."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-green-500" size={32} />}
              title="Manifest Validation"
              desc="Real-time YAML parsing against K8s enterprise standards. Learn proper configuration before going to prod."
            />
            <FeatureCard 
              icon={<Zap className="text-yellow-500" size={32} />}
              title="Zero Data Overhead"
              desc="Designed for students. No massive image pulls. All logic is handled by microservices running on your local Docker."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all group">
    <div className="mb-6 p-4 bg-slate-950 rounded-2xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default Home;