
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { containerService } from '../../api/services/container.service';
import { progressService } from '../../api/services/progress.service';
import { manifestService } from '../../api/services/manifest.service';

const TerminalPage = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);

  // Multi-line YAML capture mode (for `kubectl apply -f -`)
  const applyModeRef = useRef<boolean>(false);
  const yamlBufferRef = useRef<string[]>([]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: { background: '#0f172a', foreground: '#94a3b8' },
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;

    term.writeln('\x1b[1;34mDevOps CloudSandbox [Version 1.0.0]\x1b[0m');
    term.writeln('Container Engine initialized. Type "help" for commands.');
    term.write('\r\n$ ');

    let currentInput = '';

    term.onData(async (data) => {
      if (data === '\r') {
        term.writeln('');

        if (applyModeRef.current) {
          await handleApplyLine(currentInput);
        } else {
          await handleCommand(currentInput.trim());
        }

        currentInput = '';
        term.write(applyModeRef.current ? '> ' : '$ ');
      } else if (data === '\u007f') {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        currentInput += data;
        term.write(data);
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  // Handles a single line while in `kubectl apply -f -` capture mode
  const handleApplyLine = async (line: string) => {
    const term = xtermRef.current;
    if (!term) return;

    if (line.trim() === 'EOF') {
      applyModeRef.current = false;
      const yamlContent = yamlBufferRef.current.join('\n');
      yamlBufferRef.current = [];

      term.writeln('\x1b[1;36mApplying manifest...\x1b[0m');

      try {
        const validation = await manifestService.validate(yamlContent);

        if (validation.status !== 'VALID') {
          term.writeln('\x1b[1;31merror: manifest validation failed\x1b[0m');
          validation.errors?.forEach(e => term.writeln(`  \x1b[1;31m- ${e}\x1b[0m`));
          toast.error('Manifest validation failed. Check terminal for details.', {
            position: "top-right",
            autoClose: 4000,
          });
          return;
        }

        // Extract a name and image from the YAML for the simulated deployment
        const nameMatch = yamlContent.match(/name:\s*([\w-]+)/);
        const imageMatch = yamlContent.match(/image:\s*([\w\-:.\/]+)/);
        const name = nameMatch ? nameMatch[1] : `deployment-${Date.now()}`;
        const image = imageMatch ? imageMatch[1] : 'nginx:latest';

        const res = await containerService.run(name, image);
        term.writeln(`\x1b[1;32mdeployment.apps/${name} created\x1b[0m`);
        term.writeln(`pod/${res.containerId} \x1b[1;32mRunning\x1b[0m  IP: ${res.internalIp}`);
        await progressService.submitProgress('Kubernetes Lab: Apply Manifest', 100, res.containerId);

        toast.success(`✅ Deployment "${name}" applied successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (e) {
        term.writeln('\x1b[1;31merror: could not apply manifest (service unreachable)\x1b[0m');
        toast.error('Failed to apply manifest. Service unreachable.', {
          position: "top-right",
          autoClose: 4000,
        });
      }
      return;
    }

    yamlBufferRef.current.push(line);
    term.writeln(line);
  };

  const handleCommand = async (command: string) => {
    const cleanCommand = command.trim().replace(/\s+/g, ' ');
    const parts = cleanCommand.split(' ');
    const cmd = parts[0].toLowerCase();

    if (!cleanCommand) return;

    if (cmd === 'help') {
      xtermRef.current?.writeln('Docker Commands:');
      xtermRef.current?.writeln('  docker run --name [name] --image [image]  - Start a virtual container');
      xtermRef.current?.writeln('  docker ps                                - List running containers');
      xtermRef.current?.writeln('  docker stop [container_id]               - Stop a container');
      xtermRef.current?.writeln('  docker start [container_id]              - Resume a stopped container');
      xtermRef.current?.writeln('  docker rm [container_id]                 - Delete a container');
      xtermRef.current?.writeln('');
      xtermRef.current?.writeln('Kubernetes Commands:');
      xtermRef.current?.writeln('  kubectl get pods                         - List pods');
      xtermRef.current?.writeln('  kubectl describe pod [id]                - Show pod details');
      xtermRef.current?.writeln('  kubectl delete pod [id]                  - Delete a pod');
      xtermRef.current?.writeln('  kubectl apply -f -                       - Paste YAML, end with EOF');
      xtermRef.current?.writeln('');
      xtermRef.current?.writeln('  clear                                    - Clear terminal');
    }

    // --- DOCKER COMMANDS ---
    else if (cmd === 'docker') {
      const action = parts[1];

      if (action === 'run') {
        const nameMatch = cleanCommand.match(/--name\s+(\S+)/);
        const imageMatch = cleanCommand.match(/--image\s+(\S+)/);

        if (!nameMatch || !imageMatch) {
          xtermRef.current?.writeln('\x1b[1;31mUsage:\x1b[0m docker run --name [name] --image [image]');
          return;
        }

        const name = nameMatch[1];
        const image = imageMatch[1];

        xtermRef.current?.writeln(`\x1b[1;36mVerifying:\x1b[0m checking '${image}' against registry...`);

        try {
          const validation = await containerService.validateImage(image);

          if (!validation.valid) {
            xtermRef.current?.writeln(`\x1b[1;31mError:\x1b[0m ${validation.message}`);
            toast.error(`Image validation failed: ${validation.message}`, {
              position: "top-right",
              autoClose: 4000,
            });
            return;
          }

          xtermRef.current?.writeln(`\x1b[1;32mVerified:\x1b[0m ${validation.message}`);
          xtermRef.current?.writeln(`\x1b[1;36mSimulating:\x1b[0m Pulling layer 7f8e9a2b from registry...`);
          xtermRef.current?.writeln(`\x1b[1;36mSimulating:\x1b[0m Verifying checksum...`);

          const res = await containerService.run(name, image);
          xtermRef.current?.writeln(`\x1b[1;32mSUCCESS:\x1b[0m Container ${res.containerId} is UP.`);
          xtermRef.current?.writeln(`Virtual IP: ${res.internalIp}`);
          await progressService.submitProgress('Docker Lab: Deployment', 100, res.containerId);

          toast.success(`🐳 Container "${name}" started successfully!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        } catch (e) {
          xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m API Gateway connection failed.');
          toast.error('Failed to start container. API Gateway unreachable.', {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }

      else if (action === 'ps') {
        try {
          const containers = await containerService.getAll();
          xtermRef.current?.writeln('\x1b[1;37mCONTAINER ID   IMAGE        STATUS    IP ADDRESS\x1b[0m');
          containers.forEach(c => {
            const id = c.containerId.padEnd(12);
            const img = c.imageName.padEnd(10);
            const status = c.status.padEnd(8);
            xtermRef.current?.writeln(`${id}   ${img}   ${status}   ${c.internalIp}`);
          });
        } catch (e) {
          xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m Could not reach Container Sim Service.');
          toast.error('Failed to list containers. Service unreachable.', {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }

      else if (action === 'stop') {
        const targetId = parts[2];
        if (!targetId) {
          xtermRef.current?.writeln('Usage: docker stop [container_id]');
          return;
        }
        try {
          await containerService.stop(targetId);
          xtermRef.current?.writeln(`Container ${targetId} stopping...`);
          xtermRef.current?.writeln(`\x1b[1;32mOK:\x1b[0m Container stopped.`);
          await progressService.submitProgress('Docker Lab: Stop Container', 100);
          
          toast.info(`⏹️ Container ${targetId} stopped.`, {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (e) {
          xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m ID not found.');
          toast.error(`Container ${targetId} not found.`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }

      else if (action === 'start') {
        const targetId = parts[2];
        if (!targetId) {
          xtermRef.current?.writeln('Usage: docker start [container_id]');
          return;
        }
        try {
          await containerService.start(targetId);
          xtermRef.current?.writeln(`Container ${targetId} starting...`);
          xtermRef.current?.writeln(`\x1b[1;32mOK:\x1b[0m Container running.`);
          await progressService.submitProgress('Docker Lab: Start Container', 100);
          
          toast.success(`▶️ Container ${targetId} started.`, {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (e) {
          xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m ID not found.');
          toast.error(`Container ${targetId} not found.`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }

      // NEW: docker rm
      else if (action === 'rm') {
        const targetId = parts[2];
        if (!targetId) {
          xtermRef.current?.writeln('Usage: docker rm [container_id]');
          return;
        }
        try {
          await containerService.delete(targetId);
          await progressService.deleteByContainer(targetId);
          xtermRef.current?.writeln(`\x1b[1;32mOK:\x1b[0m Container ${targetId} removed.`);
          
          toast.success(`🗑️ Container ${targetId} removed.`, {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (e) {
          xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m Could not remove container. ID not found.');
          toast.error(`Container ${targetId} not found.`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }

      else {
        xtermRef.current?.writeln(`docker: '${action}' is not a docker command.`);
      }
    }

    // --- KUBECTL COMMANDS ---
    else if (cmd === 'kubectl') {
      const action = parts[1];
      const target = parts[2];

      if (action === 'get' && target === 'pods') {
        try {
          const containers = await containerService.getAll();
          xtermRef.current?.writeln('\x1b[1;37mNAME              READY   STATUS      IP\x1b[0m');
          containers.forEach(c => {
            const name = c.containerId.padEnd(16);
            const ready = c.status === 'RUNNING' ? '1/1' : '0/1';
            const status = c.status.padEnd(10);
            xtermRef.current?.writeln(`${name}  ${ready}     ${status}  ${c.internalIp}`);
          });
        } catch (e) {
          xtermRef.current?.writeln('\x1b[1;31merror:\x1b[0m could not reach cluster.');
          toast.error('Failed to get pods. Cluster unreachable.', {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }

      else if (action === 'describe' && target === 'pod') {
        const podId = parts[3];
        if (!podId) {
          xtermRef.current?.writeln('Usage: kubectl describe pod [id]');
          return;
        }
        try {
          const containers = await containerService.getAll();
          const pod = containers.find(c => c.containerId === podId);
          if (!pod) {
            xtermRef.current?.writeln(`\x1b[1;31mError from server (NotFound):\x1b[0m pods "${podId}" not found`);
            toast.error(`Pod "${podId}" not found.`, {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
          xtermRef.current?.writeln(`Name:         ${pod.containerId}`);
          xtermRef.current?.writeln(`Namespace:    default`);
          xtermRef.current?.writeln(`Status:       ${pod.status}`);
          xtermRef.current?.writeln(`IP:           ${pod.internalIp}`);
          xtermRef.current?.writeln(`Image:        ${pod.imageName}`);
        } catch (e) {
          xtermRef.current?.writeln('\x1b[1;31merror:\x1b[0m could not reach cluster.');
          toast.error('Failed to describe pod. Cluster unreachable.', {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }

      else if (action === 'delete' && target === 'pod') {
        const podId = parts[3];
        if (!podId) {
          xtermRef.current?.writeln('Usage: kubectl delete pod [id]');
          return;
        }
        try {
          await containerService.delete(podId);
          await progressService.deleteByContainer(podId);
          xtermRef.current?.writeln(`pod "${podId}" \x1b[1;32mdeleted\x1b[0m`);
          
          toast.success(`🗑️ Pod "${podId}" deleted.`, {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (e) {
          xtermRef.current?.writeln(`\x1b[1;31mError from server (NotFound):\x1b[0m pods "${podId}" not found`);
          toast.error(`Pod "${podId}" not found.`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }

      else if (action === 'apply' && parts[2] === '-f' && parts[3] === '-') {
        applyModeRef.current = true;
        yamlBufferRef.current = [];
        xtermRef.current?.writeln('\x1b[1;36mPaste your YAML manifest, then type EOF on its own line:\x1b[0m');
      }

      else {
        xtermRef.current?.writeln(`kubectl: '${action}' is not a recognized command.`);
      }
    }

    else if (cmd === 'clear') {
      xtermRef.current?.clear();
    }

    else {
      xtermRef.current?.writeln(`bash: command not found: ${cmd}`);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Virtual Terminal</h1>
          <p className="text-slate-500 text-sm">Control your private infrastructure via CLI.</p>
        </div>
        <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          STATUS: CONNECTED TO GATEWAY
        </div>
      </div>
      <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0f172a] p-2">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-slate-500 font-mono ml-4 uppercase tracking-widest">Sandbox-Shell-v1</span>
        </div>
        <div ref={terminalRef} style={{ height: '450px' }} />
      </div>
    </div>
  );
};

export default TerminalPage;