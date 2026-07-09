import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { containerService } from '../../api/services/container.service';

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
    term.writeln('Simulated environment connected. Type "help" for commands.');
    term.write('\r\n$ ');

    let currentInput = '';

    term.onData(async (data) => {
      if (data === '\r') { // Enter
        term.writeln('');
        await handleCommand(currentInput.trim());
        currentInput = '';
        term.write('$ ');
      } else if (data === '\u007f') { // Backspace
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        currentInput += data;
        term.write(data);
      }
    });

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  const handleCommand = async (command: string) => {
    const parts = command.split(' ');
    const cmd = parts[0];

    if (cmd === 'help') {
      xtermRef.current?.writeln('Available Commands:');
      xtermRef.current?.writeln('  docker run --name [name] --image [image]  - Start a virtual container');
      xtermRef.current?.writeln('  docker ps                                - List running containers');
      xtermRef.current?.writeln('  clear                                    - Clear terminal');
    } else if (command.startsWith('docker run')) {
        const nameMatch = command.match(/--name\s+(\S+)/);
        const imageMatch = command.match(/--image\s+(\S+)/);
        
        if (!nameMatch || !imageMatch) {
            xtermRef.current?.writeln('Usage: docker run --name [name] --image [image]');
            return;
        }

        xtermRef.current?.writeln(`Simulating: Pulling ${imageMatch[1]} from virtual registry...`);
        try {
            const res = await containerService.run(nameMatch[1], imageMatch[1]);
            xtermRef.current?.writeln(`\x1b[1;32mSUCCESS:\x1b[0m Container ${res.containerId} started on IP ${res.internalIp}`);
        } catch (e) {
            xtermRef.current?.writeln('\x1b[1;31mERROR:\x1b[0m Failed to start virtual container.');
        }
    } else if (cmd === 'docker' && parts[1] === 'ps') {
        try {
            const containers = await containerService.getAll();
            xtermRef.current?.writeln('CONTAINER ID   IMAGE        STATUS    IP ADDRESS');
            containers.forEach(c => {
                xtermRef.current?.writeln(`${c.containerId}   ${c.imageName}   ${c.status}   ${c.internalIp}`);
            });
        } catch (e) {
            xtermRef.current?.writeln('Error fetching container list.');
        }
    } else if (cmd === 'clear') {
      xtermRef.current?.clear();
    } else if (command !== '') {
      xtermRef.current?.writeln(`bash: command not found: ${cmd}`);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Terminal Access</h1>
        <p className="text-slate-500">Interact with the Sandbox API via CLI.</p>
      </div>
      <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-800" ref={terminalRef} style={{ height: '500px' }} />
    </div>
  );
};

export default TerminalPage;