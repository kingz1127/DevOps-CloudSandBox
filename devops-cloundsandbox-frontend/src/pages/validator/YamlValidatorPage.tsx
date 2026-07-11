import React, { useState } from 'react';
import { manifestService, type ValidationResponse } from '../../api/services/manifest.service';
import { FileCode, CheckCircle2, AlertCircle, Send, Clipboard } from 'lucide-react';

const YamlValidatorPage = () => {
  const [yaml, setYaml] = useState('');
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    if (!yaml.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      // If the YAML is perfect, backend returns 200
      const response = await manifestService.validate(yaml);
      setResult(response);
    } catch (err: any) {
      // If the YAML has errors, backend returns 400
      // We need to look inside err.response.data
      if (err.response && err.response.status === 400) {
        setResult(err.response.data); // This contains the { status: "INVALID", errors: [...] }
      } else {
        // This handles actual network crashes
        setResult({ 
          status: 'INVALID', 
          errors: ['The validation service is currently offline. Please check Docker.'] 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    setYaml(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Kubernetes Manifest Validator</h1>
        <p className="text-slate-500">Test your YAML files against enterprise infrastructure standards.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2 border-b flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileCode size={14} /> YAML Manifest
              </span>
              <button 
                onClick={loadSample}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={yaml}
              onChange={(e) => setYaml(e.target.value)}
              placeholder="Paste your Kubernetes YAML here..."
              className="w-full h-96 p-4 font-mono text-sm outline-none resize-none bg-[#0d1117] text-slate-300"
              spellCheck="false"
            />
          </div>

          <button
            onClick={handleValidate}
            disabled={isLoading || !yaml}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : <><Send size={18} /> Validate Configuration</>}
          </button>
        </div>

        {/* Results Side */}
        <div className="space-y-6">
          <div className="bg-slate-100 rounded-xl p-6 border-2 border-dashed border-slate-300">
            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Clipboard size={18} /> Instructions
            </h3>
            <ul className="text-sm text-slate-600 space-y-3 list-disc pl-4">
              <li>Ensure your YAML includes <b>apiVersion</b> and <b>kind</b>.</li>
              <li>Use 2-space indentation.</li>
              <li>The simulator checks for production-ready fields like <b>replicas</b>.</li>
            </ul>
          </div>

          {result && (
            <div className={`p-6 rounded-xl border animate-in fade-in slide-in-from-bottom-4 duration-300 ${
              result.status === 'VALID' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {result.status === 'VALID' 
                  ? <CheckCircle2 className="text-green-600" size={24} /> 
                  : <AlertCircle className="text-red-600" size={24} />
                }
                <h3 className="font-bold text-lg uppercase tracking-tight">
                  {result.status === 'VALID' ? 'Valid Manifest' : 'Validation Failed'}
                </h3>
              </div>
              
              {result.status === 'VALID' ? (
                <p className="text-sm">{result.message}</p>
              ) : (
                <ul className="space-y-2">
                  {result.errors?.map((err, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="font-bold">•</span> {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YamlValidatorPage;
