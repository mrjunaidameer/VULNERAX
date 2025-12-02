import React from 'react';
import { ScanResult } from '../types';
import RiskGauge from './RiskGauge';
import { 
  ShieldCheck, 
  Globe, 
  Server, 
  AlertTriangle, 
  Lock, 
  FileWarning, 
  Network, 
  Download, 
  Share2,
  Check
} from 'lucide-react';

interface ResultsProps {
  result: ScanResult;
  onDownload: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onDownload }) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `VulneraX Security Report: ${result.target}`,
      text: `I just scanned ${result.target} with VulneraX and it got a security score of ${result.score}/100. Check it out!`,
      url: window.location.href
    };

    // Try native share (Mobile/Tablet)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard (Desktop)
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-20">
      {/* Header Summary */}
      <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-cyber-cyan relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="flex-1 z-10 w-full text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 break-all">{result.target}</h2>
          <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider
              ${result.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 
                result.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                result.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                'bg-green-500/20 text-green-400 border border-green-500/50'}`}>
              RISK: {result.riskLevel.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50 text-xs font-mono">
              {result.timestamp.split('T')[0]}
            </span>
          </div>
          <p className="text-gray-300 max-w-2xl text-sm leading-relaxed mx-auto md:mx-0">{result.summary}</p>
        </div>
        
        <div className="flex flex-col items-center z-10 w-full md:w-auto">
            <RiskGauge score={result.score} />
            <div className="flex gap-4 mt-4 no-print w-full md:w-auto justify-center">
                 <button 
                  onClick={onDownload}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50 rounded-lg transition-all text-sm font-mono flex-1 md:flex-initial">
                    <Download size={16} /> Report
                 </button>
                 <button 
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 rounded-lg transition-all text-sm font-mono flex-1 md:flex-initial">
                    {copied ? <Check size={16} /> : <Share2 size={16} />} 
                    {copied ? 'Copied!' : 'Share'}
                 </button>
            </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* SSL Card */}
        <div className="glass-panel p-6 rounded-xl hover:border-cyber-cyan/40 transition-colors group">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display text-white flex items-center gap-2">
                    <Lock className="text-cyber-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" /> SSL/TLS
                </h3>
                <span className={`text-2xl font-bold font-mono ${result.ssl.grade === 'A' ? 'text-green-400' : 'text-yellow-400'}`}>{result.ssl.grade}</span>
            </div>
            <div className="space-y-3 text-sm font-mono text-gray-300">
                <div className="flex justify-between border-b border-gray-700/50 pb-2">
                    <span className="text-gray-500">Issuer</span>
                    <span className="truncate max-w-[150px]">{result.ssl.issuer}</span>
                </div>
                 <div className="flex justify-between border-b border-gray-700/50 pb-2">
                    <span className="text-gray-500">Expiry</span>
                    <span>{result.ssl.expiry}</span>
                </div>
                 <div className="flex justify-between border-b border-gray-700/50 pb-2">
                    <span className="text-gray-500">Algorithm</span>
                    <span>{result.ssl.algorithm}</span>
                </div>
                 <div className="flex justify-between pt-2">
                    <span className="text-gray-500">Status</span>
                    <span className={result.ssl.valid ? 'text-green-400' : 'text-red-400'}>{result.ssl.valid ? 'Valid' : 'Invalid'}</span>
                </div>
            </div>
        </div>

        {/* Headers Card */}
        <div className="glass-panel p-6 rounded-xl hover:border-cyber-cyan/40 transition-colors group">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display text-white flex items-center gap-2">
                    <ShieldCheck className="text-cyber-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" /> Headers
                </h3>
                <span className={`text-2xl font-bold font-mono ${['A','B'].includes(result.headers.grade) ? 'text-green-400' : 'text-red-400'}`}>{result.headers.grade}</span>
            </div>
            <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Missing Security Headers</p>
                <div className="flex flex-wrap gap-2">
                    {result.headers.missing.length > 0 ? (
                        result.headers.missing.map((h, i) => (
                            <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs border border-red-500/30 rounded font-mono">{h}</span>
                        ))
                    ) : (
                        <span className="text-green-400 text-sm italic">All standard headers present</span>
                    )}
                </div>
            </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-panel p-6 rounded-xl hover:border-cyber-cyan/40 transition-colors group">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display text-white flex items-center gap-2">
                    <Server className="text-cyber-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" /> Tech Stack
                </h3>
            </div>
             <div className="space-y-3 text-sm font-mono text-gray-300">
                <div className="flex justify-between border-b border-gray-700/50 pb-2">
                    <span className="text-gray-500">CMS</span>
                    <span className="text-cyber-blue">{result.techStack.cms || 'N/A'}</span>
                </div>
                 <div className="flex justify-between border-b border-gray-700/50 pb-2">
                    <span className="text-gray-500">Server</span>
                    <span>{result.techStack.server || 'Unknown'}</span>
                </div>
                 <div className="flex justify-between border-b border-gray-700/50 pb-2">
                    <span className="text-gray-500">Lang</span>
                    <span>{result.techStack.language || 'Unknown'}</span>
                </div>
                 <div className="pt-2">
                    <span className="text-gray-500 block mb-2">Frameworks</span>
                    <div className="flex flex-wrap gap-1">
                        {result.techStack.frameworks.map((f, i) => (
                             <span key={i} className="px-2 py-0.5 bg-cyber-blue/10 text-cyber-blue text-[10px] border border-cyber-blue/30 rounded">{f}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* DNS & Network */}
        <div className="glass-panel p-6 rounded-xl hover:border-cyber-cyan/40 transition-colors group">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display text-white flex items-center gap-2">
                    <Globe className="text-cyber-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" /> DNS Info
                </h3>
            </div>
             <div className="space-y-3 text-sm font-mono text-gray-300">
                <div className="flex justify-between">
                    <span className="text-gray-500">IP Address</span>
                    <span className="text-cyber-blue">{result.dns.ip}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500">Registrar</span>
                    <span className="truncate max-w-[120px]">{result.dns.registrar}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span>{result.dns.location}</span>
                </div>
            </div>
        </div>

        {/* Open Ports */}
        <div className="glass-panel p-6 rounded-xl hover:border-cyber-cyan/40 transition-colors group">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display text-white flex items-center gap-2">
                    <Network className="text-cyber-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" /> Open Ports
                </h3>
            </div>
            <div className="flex flex-wrap gap-3">
                {result.openPorts.map((port) => (
                    <div key={port} className="flex flex-col items-center justify-center w-12 h-12 bg-gray-800/50 rounded border border-cyber-blue/20">
                        <span className="text-cyber-blue font-bold font-mono">{port}</span>
                        <span className="text-[9px] text-gray-500 uppercase">TCP</span>
                    </div>
                ))}
            </div>
        </div>

         {/* Sensitive Files */}
         <div className="glass-panel p-6 rounded-xl hover:border-cyber-cyan/40 transition-colors group">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display text-white flex items-center gap-2">
                    <FileWarning className="text-cyber-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" /> Sensitive Files
                </h3>
            </div>
            {result.sensitiveFiles.found ? (
                 <ul className="space-y-2">
                    {result.sensitiveFiles.files.map((file, i) => (
                        <li key={i} className="text-xs font-mono text-red-400 bg-red-900/10 px-2 py-1 rounded border border-red-500/20 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                            {file}
                        </li>
                    ))}
                 </ul>
            ) : (
                <div className="text-gray-500 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div> No exposed files detected.
                </div>
            )}
        </div>

      </div>

      {/* Vulnerabilities Section */}
      <div className="glass-panel p-6 rounded-xl border border-red-500/20">
        <h3 className="text-2xl font-display text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="text-red-500" /> Detected Vulnerabilities
        </h3>
        <div className="space-y-4">
            {result.vulnerabilities.map((vuln, index) => (
                <div key={index} className="bg-black/40 border border-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-4">
                    <div className="min-w-[120px]">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                             ${vuln.severity === 'Critical' ? 'bg-red-600 text-white' : 
                               vuln.severity === 'High' ? 'bg-orange-500 text-white' :
                               vuln.severity === 'Medium' ? 'bg-yellow-500 text-black' :
                               'bg-blue-500 text-white'}`}>
                            {vuln.severity}
                        </span>
                        <div className="mt-2 text-cyber-cyan font-mono text-xs break-words">{vuln.type}</div>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-300 text-sm mb-2 font-mono">{vuln.description}</p>
                        <div className="bg-gray-900/50 p-2 rounded border-l-2 border-green-500">
                             <p className="text-xs text-green-400 font-mono"><span className="font-bold text-gray-500">FIX:</span> {vuln.remediation}</p>
                        </div>
                    </div>
                </div>
            ))}
            {result.vulnerabilities.length === 0 && (
                <p className="text-gray-500 italic">No significant vulnerabilities detected by passive scan.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Results;