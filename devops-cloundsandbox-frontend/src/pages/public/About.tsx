import React from 'react';
import { Shield, Users, Target, Rocket, Layers, Database } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Concept Header */}
      <section className="bg-slate-950 py-20 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Bridging the DevOps Digital Divide</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            CloudSandbox was born out of a simple observation: learning enterprise-grade infrastructure 
            tools like Kubernetes and Docker shouldn't require expensive high-speed data or 
            costly cloud subscriptions.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <Target size={28} />
              <h2 className="text-2xl font-bold uppercase tracking-tight">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              Our mission is to provide a localized, high-fidelity simulation environment that mimics 
              real-world cloud infrastructure. We focus on teaching the <b>logic</b> and <b>configuration</b> 
              of DevOps, allowing students to build muscle memory with the CLI without the overhead 
              of pulling gigabytes of container images.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4 text-purple-600">
              <Rocket size={28} />
              <h2 className="text-2xl font-bold uppercase tracking-tight">The Vision</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              We envision a world where technical education is accessible to anyone with a laptop. 
              By moving the "Cloud" to a localized microservice cluster, we eliminate the barrier of 
              internet dependency in DevOps training.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Excellence Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Built on Enterprise Standards</h2>
            <p className="text-slate-500 mt-2">CloudSandbox uses the same architecture used by Fortune 500 companies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TechFeature 
              icon={<Layers className="text-blue-500" />}
              title="8-Service Mesh"
              description="A fully decoupled architecture using Spring Cloud, Eureka Discovery, and an API Gateway for high availability."
            />
            <TechFeature 
              icon={<Database className="text-emerald-500" />}
              description="Isolated PostgreSQL instances ensure data integrity and teach students the importance of persistent storage."
              title="Polyglot Persistence"
            />
            <TechFeature 
              icon={<Shield className="text-purple-500" />}
              title="Stateless Security"
              description="JWT-based authentication ensures that all CLI commands are verified at the Edge before hitting the simulator."
            />
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-blue-600 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="mb-8 text-blue-100 italic">No credit card. No data overhead. Just DevOps.</p>
          <a href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition shadow-lg">
            Create Free Account
          </a>
        </div>
      </section>
    </div>
  );
};

const TechFeature = ({ icon, title, description }: any) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center md:text-left">
    <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
    <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </div>
);

export default About;