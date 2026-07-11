// import React, { useEffect, useRef } from 'react';
// import { Terminal } from '@xterm/xterm';
// import { FitAddon } from '@xterm/addon-fit';
// import '@xterm/xterm/css/xterm.css';
// import { containerService } from '../../api/services/container.service';

// const TerminalPage = () => {
//   const terminalRef = useRef<HTMLDivElement>(null);
//   const xtermRef = useRef<Terminal | null>(null);

//   useEffect(() => {
//     if (!terminalRef.current) return;

//     const term = new Terminal({
//       cursorBlink: true,
//       theme: { background: '#0f172a', foreground: '#94a3b8' },
//       fontFamily: '"Fira Code", monospace',
//       fontSize: 14,
//     });

//     const fitAddon = new FitAddon();
//     term.loadAddon(fitAddon);
//     term.open(terminalRef.current);
//     fitAddon.fit();
//     xtermRef.current = term;

//     term.writeln('\x1b[1;34mDevOps CloudSandbox [Version 1.0.0]\x1b[0m');
//     term.writeln('Simulated environment connected. Type "help" for commands.');
//     term.write('\r\n$ ');

//     let currentInput = '';

//     term.onData(async (data) => {
//       if (data === '\r') { // Enter
//         term.writeln('');
//         await handleCommand(currentInput.trim());
//         currentInput = '';
//         term.write('$ ');
//       } else if (data === '\u007f') { // Backspace
//         if (currentInput.length > 0) {
//           currentInput = currentInput.slice(0, -1);
//           term.write('\b \b');
//         }
//       } else {
//         currentInput += data;
//         term.write(data);
//       }
//     });

//     // Handle window resize
//     const handleResize = () => {
//       fitAddon.fit();
//     };
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       term.dispose();
//     };
//   }, []);

//   const handleCommand = async (command: string) => {
//     const parts = command.split(' ');
//     const cmd = parts[0];

//     if (cmd === 'help') {
//       xtermRef.current?.writeln('Available Commands:');
//       xtermRef.current?.writeln('  docker run --name [name] --image [image]  - Start a virtual container');
//       xtermRef.current?.writeln('  docker ps                                - List running containers');
//       xtermRef.current?.writeln('  clear                                    - Clear terminal');
//     } else if (command.startsWith('docker run')) {
//         const nameMatch = command.match(/--name\s+(\S+)/);
//         const imageMatch = command.match(/--image\s+(\S+)/);
        
//         if (!nameMatch || !imageMatch) {
//             xtermRef.current?.writeln('Usage: docker run --name [name] --image [image]');
//             return;
//         }

//         xtermRef.current?.writeln(`Simulating: Pulling ${imageMatch[1]} from virtual registry...`);
//         try {
//             const res = await containerService.run(nameMatch[1], imageMatch[1]);
//             xtermRef.current?.writeln(`\x1b[1;32mSUCCESS:\x1b[0m Container ${res.containerId} started on IP ${res.internalIp}`);
//         } catch (e) {
//             xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m Failed to start virtual container.');
//         }
//     } else if (cmd === 'docker' && parts[1] === 'ps') {
//         try {
//             const containers = await containerService.getAll();
//             xtermRef.current?.writeln('CONTAINER ID   IMAGE        STATUS    IP ADDRESS');
//             containers.forEach(c => {
//                 xtermRef.current?.writeln(`${c.containerId}   ${c.imageName}   ${c.status}   ${c.internalIp}`);
//             });
//         } catch (e) {
//             xtermRef.current?.writeln('Error fetching container list.');
//         }
//     } else if (cmd === 'clear') {
//       xtermRef.current?.clear();
//     } else if (command !== '') {
//       xtermRef.current?.writeln(`bash: command not found: ${cmd}`);
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">Terminal Access</h1>
//         <p className="text-slate-500">Interact with the Sandbox API via CLI.</p>
//       </div>
//       <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-800" ref={terminalRef} style={{ height: '500px' }} />
//     </div>
//   );
// };

// export default TerminalPage;




import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { containerService } from '../../api/services/container.service';
import { progressService } from '../../api/services/progress.service'; // NEW: Import Progress Service

const TerminalPage = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);

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
        await handleCommand(currentInput.trim());
        currentInput = '';
        term.write('$ ');
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

  const handleCommand = async (command: string) => {
    // 1. Clean the input: remove leading/trailing spaces and special characters
    const cleanCommand = command.trim().replace(/\s+/g, ' '); 
    const parts = cleanCommand.split(' ');
    const cmd = parts[0].toLowerCase(); // Convert to lowercase for safety

    if (!cleanCommand) return; // Ignore empty lines

    if (cmd === 'help') {
      xtermRef.current?.writeln('Available Commands:');
      xtermRef.current?.writeln('  docker run --name [name] --image [image]  - Start a virtual container');
      xtermRef.current?.writeln('  docker ps                                - List running containers');
      xtermRef.current?.writeln('  docker stop [container_id]               - Stop a container');
      xtermRef.current?.writeln('  clear                                    - Clear terminal');
    } 
    
    // --- HANDLE ALL DOCKER COMMANDS ---
    else if (cmd === 'docker') {
        const action = parts[1];

        // DOCKER RUN
        if (action === 'run') {
            const nameMatch = cleanCommand.match(/--name\s+(\S+)/);
            const imageMatch = cleanCommand.match(/--image\s+(\S+)/);
            
            if (!nameMatch || !imageMatch) {
                xtermRef.current?.writeln('\x1b[1;31mUsage:\x1b[0m docker run --name [name] --image [image]');
                return;
            }

            const name = nameMatch[1];
            const image = imageMatch[1];

            xtermRef.current?.writeln(`\x1b[1;36mSimulating:\x1b[0m Pulling layer 7f8e9a2b from registry...`);
            xtermRef.current?.writeln(`\x1b[1;36mSimulating:\x1b[0m Verifying checksum...`);
            
            try {
                const res = await containerService.run(name, image);
                xtermRef.current?.writeln(`\x1b[1;32mSUCCESS:\x1b[0m Container ${res.containerId} is UP.`);
                xtermRef.current?.writeln(`Virtual IP: ${res.internalIp}`);
                
                // Track progress in the backend
                await progressService.submitProgress("Docker Lab: Deployment", 100);
            } catch (e) {
                xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m API Gateway connection failed.');
            }
        } 
        
        // DOCKER PS
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
            }
        }

        // DOCKER STOP
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
            } catch (e) {
                xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m ID not found.');
            }
        }

        else {
            xtermRef.current?.writeln(`docker: '${action}' is not a docker command.`);
        }
    } 

    else if (cmd === 'clear') {
      xtermRef.current?.clear();
    } 
    
    else {
      // If we reach here, it truly is not recognized
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
        {/* Terminal Header */}
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