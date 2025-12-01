import React, { useState } from 'react';
import { Search, Shield } from 'lucide-react';

interface ScannerProps {
  onScan: (url: string) => void;
  isLoading: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    // Basic validation
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    onScan(formattedUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative z-20">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl rounded-lg group-hover:bg-cyber-cyan/30 transition-all duration-500"></div>
        <div className="relative flex items-center">
            <div className="absolute left-4 text-cyber-cyan pointer-events-none">
                <Shield className="animate-pulse" />
            </div>
            <input 
              type="text" 
              placeholder="Enter target URL (e.g., example.com)" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="w-full bg-black/80 border-2 border-cyber-blue/30 text-white pl-14 pr-32 py-4 rounded-lg focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,229,255,0.3)] font-mono text-lg placeholder-gray-600 transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 bg-cyber-blue/20 hover:bg-cyber-blue text-cyber-blue hover:text-white border border-cyber-blue/50 px-6 rounded transition-all font-display font-bold disabled:cursor-not-allowed flex items-center gap-2 group/btn"
            >
              {isLoading ? 'SCANNING...' : <>SCAN <Search size={18} className="group-hover/btn:translate-x-1 transition-transform" /></>}
            </button>
        </div>
      </form>
    </div>
  );
};

export default Scanner;
