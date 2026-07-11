import React from 'react';
import { Book, Code, Network, Award } from 'lucide-react';

const Guide = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">How CloudSandbox Works</h1>
        <p className="text-slate-600 text-lg mb-12">Understand the underlying architecture of your learning environment.</p>

        <div className="space-y-12">
          <GuideSection 
            number="01"
            title="The Simulator Engine"
            icon={<Code className="text-blue-600" />}
            content="When you type commands in the terminal, they are routed through an API Gateway to our Container-Sim microservice. This service manages a virtual state-machine in PostgreSQL that assigns virtual IPs and IDs, mimicking real Docker behavior."
          />

          <GuideSection 
            number="02"
            title="Microservices Networking"
            icon={<Network className="text-purple-600" />}
            content="The system uses Netflix Eureka for service discovery. All 8 microservices (Auth, Config, Progress, etc.) communicate over an isolated Docker network, ensuring enterprise-level reliability."
          />

          <GuideSection 
            number="03"
            title="Tracking Your Progress"
            icon={<Award className="text-amber-600" />}
            content="Successful commands and valid YAML manifests trigger the Progress microservice. Your scores are calculated based on best practices and stored in your Academic Report Card."
          />
        </div>

        <div className="mt-16 bg-blue-600 rounded-3xl p-10 text-white shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Common CLI Commands</h2>
          <div className="bg-slate-950 rounded-xl p-6 font-mono text-sm space-y-2">
            <p><span className="text-green-500">$</span> docker run --name [name] --image [image]</p>
            <p className="text-slate-500"># Mocks pulling an image and starting a virtual container</p>
            <br />
            <p><span className="text-green-500">$</span> docker ps</p>
            <p className="text-slate-500"># Lists all virtual containers owned by you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuideSection = ({ number, title, icon, content }: any) => (
  <div className="flex gap-6 items-start">
    <div className="text-4xl font-black text-slate-200">{number}</div>
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed">{content}</p>
    </div>
  </div>
);

export default Guide;