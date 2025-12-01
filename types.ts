export interface ScanResult {
  target: string;
  timestamp: string;
  score: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  ssl: {
    valid: boolean;
    issuer: string;
    expiry: string;
    algorithm: string;
    grade: string;
  };
  headers: {
    grade: string;
    missing: string[];
    present: string[];
  };
  techStack: {
    cms: string | null;
    server: string | null;
    language: string | null;
    frameworks: string[];
  };
  openPorts: number[];
  dns: {
    ip: string;
    registrar: string;
    location: string;
    nameservers: string[];
  };
  sensitiveFiles: {
    found: boolean;
    files: string[];
  };
  vulnerabilities: {
    type: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    remediation: string;
  }[];
}

export type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';
