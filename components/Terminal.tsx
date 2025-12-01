import React, { useEffect, useState, useRef } from 'react';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel w-full h-64 rounded-lg overflow-hidden flex flex-col border border-cyber-cyan/30">
      <div className="bg-cyber-dark/80 px-4 py-2 flex items-center gap-2 border-b border-cyber-cyan/20">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 font-mono text-xs text-cyber-cyan opacity-70">root@vulnerax-scanner:~#</span>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-1 bg-black/40"
      >
        {logs.map((log, i) => (
          <div key={i} className="text-green-400">
            <span className="text-cyber-blue mr-2">➜</span>
            {log}
          </div>
        ))}
        <div className="animate-pulse text-cyber-cyan">_</div>
      </div>
    </div>
  );
};

export default Terminal;
