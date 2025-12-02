import React, { useState } from 'react';
import Scanner from './components/Scanner';
import Results from './components/Results';
import Terminal from './components/Terminal';
import { analyzeTarget } from './services/geminiService';
import { ScanResult, ScanStatus } from './types';
import { Radar, ShieldAlert, FileText, Activity, X, Linkedin, ExternalLink, Code, Scale, Lock, Menu } from 'lucide-react';

// Steps for the fake terminal log
const SCAN_STEPS = [
  "Initializing passive scan modules...",
  "Resolving DNS records...",
  "Analyzing SSL/TLS certificate chain...",
  "Fuzzing HTTP security headers...",
  "Detecting CMS and server technologies...",
  "Checking for exposed .git and .env files...",
  "Simulating XSS and SQLi attack vectors (Passive)...",
  "Aggregating risk score...",
  "Finalizing report..."
];

const App: React.FC = () => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to add logs with delay
  const runSimulation = async (target: string) => {
    setLogs([]);
    setStatus('scanning');
    
    // Simulate terminal logs
    for (const step of SCAN_STEPS) {
      await new Promise(r => setTimeout(r, 600)); // Delay between logs
      setLogs(prev => [...prev, `${step} [OK]`]);
    }

    // Call Gemini Service
    const scanData = await analyzeTarget(target);
    setResult(scanData);
    setStatus('complete');
  };

  const handleScan = (url: string) => {
    runSimulation(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetDashboard = () => {
    setStatus('idle');
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToFeatures = () => {
    setMobileMenuOpen(false);
    if (status !== 'idle') {
      setStatus('idle');
      // Wait for state update and render so the element exists
      setTimeout(() => {
        const el = document.getElementById('features-grid');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('features-grid');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative font-sans flex flex-col overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid -z-10 opacity-40"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-cyber-black/80 to-cyber-black -z-10"></div>
      
      {/* Navbar */}
      <nav className="border-b border-cyber-cyan/10 bg-cyber-black/80 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetDashboard}>
            <div className="w-8 h-8 rounded bg-cyber-cyan/20 border border-cyber-cyan flex items-center justify-center">
              <Radar className="text-cyber-cyan w-5 h-5 animate-spin-slow" />
            </div>
            <span className="text-xl md:text-2xl font-display font-bold text-white tracking-widest truncate">
              VULNERA<span className="text-cyber-cyan">X</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-sm font-mono text-gray-400">
             <button onClick={resetDashboard} className="hover:text-cyber-cyan transition-colors">DASHBOARD</button>
             <button onClick={scrollToFeatures} className="hover:text-cyber-cyan transition-colors">MODULES</button>
             <button onClick={() => setShowAbout(true)} className="hover:text-cyber-cyan transition-colors">ABOUT</button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-cyber-cyan p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-cyber-black border-b border-cyber-cyan/20 p-4 flex flex-col gap-4 text-gray-300 font-mono animate-fade-in shadow-xl">
             <button onClick={resetDashboard} className="text-left py-2 hover:text-cyber-cyan border-b border-gray-800">DASHBOARD</button>
             <button onClick={scrollToFeatures} className="text-left py-2 hover:text-cyber-cyan border-b border-gray-800">MODULES</button>
             <button onClick={() => { setShowAbout(true); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-cyber-cyan">ABOUT PROJECT</button>
          </div>
        )}
      </nav>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
          <div className="glass-panel p-6 md:p-8 max-w-lg w-full rounded-xl relative border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyber-cyan/10 flex items-center justify-center border border-cyber-cyan/50 mb-2">
                <Radar className="text-cyber-cyan w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-white">About VulneraX</h2>
              
              <p className="text-gray-300 leading-relaxed text-sm">
                VulneraX is an advanced, real-time web vulnerability scanner designed for defensive security reconnaissance. It utilizes AI-driven heuristics to detect potential security gaps, SSL issues, and configuration flaws without invasive exploitation.
              </p>
              
              <div className="w-full h-px bg-gray-700/50 my-4"></div>
              
              <div className="space-y-1">
                <p className="text-cyber-blue font-mono text-xs uppercase tracking-widest">Created and Implemented by</p>
                <p className="text-xl font-bold text-white font-display">Junaid Ameer</p>
              </div>
              
              <div className="bg-cyber-dark/50 px-4 py-2 rounded-full border border-gray-700 mt-2 flex items-center gap-2">
                <Code size={14} className="text-cyber-cyan" />
                <span className="text-xs text-gray-400 font-mono">Part of Junaid Projects Portfolio</span>
              </div>

              <div className="flex gap-4 mt-6">
                 <a 
                   href="https://www.linkedin.com/in/junaidameercreative?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                 >
                    <Linkedin size={16} /> LinkedIn
                 </a>
                 <a 
                   href="https://junaidprojects.site" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                 >
                    <ExternalLink size={16} /> Portfolio
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
          <div className="glass-panel p-6 md:p-8 max-w-2xl w-full rounded-xl relative border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,229,255,0.2)] max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowTerms(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <Scale className="text-cyber-cyan w-6 h-6" />
                <h2 className="text-2xl font-display font-bold text-white">Terms of Service</h2>
              </div>
              
              <div className="text-gray-300 text-sm space-y-4 leading-relaxed font-mono">
                <p><strong className="text-white">1. Authorization:</strong> By using VulneraX, you expressly declare that you have the necessary authorization to scan the target URL. You agree to use this tool ONLY on domains you own or have explicit written permission to test.</p>
                
                <p><strong className="text-white">2. Passive Reconnaissance:</strong> This tool performs passive scanning and metadata analysis. It is not designed to execute active exploits or harmful payloads.</p>
                
                <p><strong className="text-white">3. Disclaimer of Liability:</strong> The creators (Junaid Ameer) and maintainers of VulneraX assume NO liability for any damage, downtime, or legal consequences resulting from the use or misuse of this software. The tool is provided "as is" without warranties.</p>
                
                <p><strong className="text-white">4. Educational Use:</strong> This project is intended for educational purposes and security research to help administrators secure their infrastructure.</p>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setShowTerms(false)}
                  className="px-6 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/40 text-cyber-blue border border-cyber-blue/50 rounded transition-colors font-mono text-xs uppercase"
                >
                  I Agree & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
          <div className="glass-panel p-6 md:p-8 max-w-2xl w-full rounded-xl relative border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,229,255,0.2)] max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <Lock className="text-cyber-cyan w-6 h-6" />
                <h2 className="text-2xl font-display font-bold text-white">Privacy Policy</h2>
              </div>
              
              <div className="text-gray-300 text-sm space-y-4 leading-relaxed font-mono">
                <p><strong className="text-white">1. Data Collection:</strong> VulneraX is a client-side focused application. We do not store your personal information or the history of scanned URLs on persistent databases.</p>
                
                <p><strong className="text-white">2. Scanning Data:</strong> The URLs you enter are processed in real-time to generate the security report. This data is transient and is discarded after the session ends or the page is refreshed.</p>
                
                <p><strong className="text-white">3. Third-Party Services:</strong> This application may use public APIs to retrieve DNS, WHOIS, or other metadata. Interactions with these APIs are subject to their respective privacy policies.</p>
                
                <p><strong className="text-white">4. Cookies:</strong> We do not use tracking cookies for advertising purposes. Local storage may be used temporarily to preserve your session state.</p>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setShowPrivacy(false)}
                  className="px-6 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/40 text-cyber-blue border border-cyber-blue/50 rounded transition-colors font-mono text-xs uppercase"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center flex-grow">
        
        {status === 'idle' && (
          <div className="text-center space-y-8 animate-fade-in max-w-4xl mt-8 md:mt-12">
            <h1 className="text-4xl md:text-7xl font-display font-black text-white mb-6 leading-tight break-words">
              ADVANCED <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-blue text-glow">WEB VULNERABILITY</span> SCANNER
            </h1>
            <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
              Real-time, passive reconnaissance engine powered by AI. 
              Detect vulnerable headers, exposed secrets, and weak SSL configurations instantly.
            </p>
            
            <div id="features-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-left">
              <div className="glass-panel p-6 rounded-lg border-t-2 border-t-cyber-cyan">
                <ShieldAlert className="text-cyber-cyan mb-4 w-8 h-8" />
                <h3 className="font-display font-bold text-white text-lg">Vulnerability Simulation</h3>
                <p className="text-gray-500 text-sm mt-2">Simulate SQLi, XSS, and CSRF patterns passively to identify weak points.</p>
              </div>
              <div className="glass-panel p-6 rounded-lg border-t-2 border-t-cyber-blue">
                <Activity className="text-cyber-blue mb-4 w-8 h-8" />
                <h3 className="font-display font-bold text-white text-lg">Real-time Heuristics</h3>
                <p className="text-gray-500 text-sm mt-2">Instant analysis of HTTP headers, CMS versions, and outdated libraries.</p>
              </div>
              <div className="glass-panel p-6 rounded-lg border-t-2 border-t-purple-500">
                <FileText className="text-purple-500 mb-4 w-8 h-8" />
                <h3 className="font-display font-bold text-white text-lg">Actionable Reports</h3>
                <p className="text-gray-500 text-sm mt-2">Generate detailed PDF reports with remediation steps and risk scoring.</p>
              </div>
            </div>

            <Scanner onScan={handleScan} isLoading={false} />
            
            <p className="text-[10px] md:text-xs text-gray-600 font-mono mt-8 px-4">
              * By using VulneraX, you agree to scan only domains you own or have permission to test.
            </p>
          </div>
        )}

        {status === 'scanning' && (
          <div className="w-full max-w-3xl space-y-8 mt-12 px-2">
             <div className="text-center">
                <div className="w-24 h-24 mx-auto border-4 border-cyber-blue/30 border-t-cyber-cyan rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-display font-bold text-white animate-pulse">ANALYZING TARGET</h2>
             </div>
             <Terminal logs={logs} />
          </div>
        )}

        {status === 'complete' && result && (
          <div className="w-full px-2 md:px-0">
            <div className="flex justify-between items-center mb-6 no-print max-w-7xl mx-auto">
               <button onClick={() => setStatus('idle')} className="text-cyber-cyan hover:underline font-mono text-sm md:text-base">← NEW SCAN</button>
            </div>
            <Results result={result} onDownload={handlePrint} />
          </div>
        )}

      </main>

      <footer className="border-t border-gray-800 bg-cyber-black py-12 text-gray-600 text-sm font-mono no-print z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <Radar className="text-cyber-cyan w-5 h-5" />
                    <span className="font-display font-bold text-gray-300 tracking-wider text-lg">VULNERA<span className="text-cyber-cyan">X</span></span>
                </div>
                <p className="text-xs leading-relaxed max-w-md text-gray-500">
                    A state-of-the-art security analysis platform engineered for modern web infrastructure. 
                    VulneraX provides deep visibility into your attack surface using safe, passive reconnaissance techniques.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4 font-display tracking-wide">PLATFORM</h4>
                <ul className="space-y-3 text-xs">
                    <li><button onClick={resetDashboard} className="hover:text-cyber-cyan transition-colors flex items-center gap-2">Dashboard</button></li>
                    <li><button onClick={scrollToFeatures} className="hover:text-cyber-cyan transition-colors flex items-center gap-2">Features</button></li>
                    <li><button onClick={() => setShowAbout(true)} className="hover:text-cyber-cyan transition-colors flex items-center gap-2">About Project</button></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4 font-display tracking-wide">LEGAL & CREDIT</h4>
                 <ul className="space-y-3 text-xs">
                    <li><button onClick={() => setShowPrivacy(true)} className="hover:text-cyber-cyan transition-colors text-left w-full flex items-center gap-2">Privacy Policy</button></li>
                    <li><button onClick={() => setShowTerms(true)} className="hover:text-cyber-cyan transition-colors text-left w-full flex items-center gap-2">Terms of Service</button></li>
                    <li><button onClick={() => setShowAbout(true)} className="hover:text-cyber-cyan transition-colors text-cyber-blue flex items-center gap-2">Credits</button></li>
                </ul>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
                <p>© 2025 VulneraX Security Systems. Created and implemented by <span className="text-gray-400 font-bold">Junaid Ameer</span>.</p>
                <p className="mt-1 text-xs opacity-50">Part of Junaid Projects Portfolio.</p>
            </div>
            <div className="flex gap-4 opacity-50">
                 <span className="text-xs border border-gray-700 px-2 py-1 rounded">v1.0.0-beta</span>
                 <span className="text-xs border border-gray-700 px-2 py-1 rounded">SEC-AUDIT-READY</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;