import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

const SCAN_SYSTEM_INSTRUCTION = `
You are VulneraX, an advanced cybersecurity analysis engine.
Your task is to perform a simulated passive security scan on a given URL.

IMPORTANT: Since you cannot actively probe the server's network stack in real-time:
1. Infer potential vulnerabilities based on the URL structure, query parameters, and common technology stacks associated with that type of site.
2. DO NOT HALLUCINATE specific infrastructure details (like "GoDaddy", "Hostinger", "AWS") unless you are 100% certain based on the URL. If unknown, return "Unknown" or "Hidden".
3. DO NOT guess the CMS (like "WordPress") unless the URL path suggests it (e.g., /wp-admin).
4. Focus on educating the user about potential risks (missing headers, SSL best practices) rather than inventing fake registrar data.

If the target is a well-known site (e.g., google.com), return accurate real-world data if known.
If the target is unknown (like a personal portfolio), return "Unknown" for Registrar/Server, but provide a generic security assessment based on standard web best practices.

You must return a JSON object.
Strictly adhere to the schema.
The risk score should be 0-100, where 100 is perfectly secure and 0 is highly vulnerable.
Common Open Ports to check: 80, 443, 8080, 21, 22, 3306.
Common Sensitive Files: .git/HEAD, .env, wp-config.php.
Common Vulnerabilities: XSS, SQLi, CSRF, Missing CSP, Weak SSL.

Do NOT act as a malicious tool. This is for educational and defensive assessment only.
`;

export const analyzeTarget = async (url: string): Promise<ScanResult> => {
  try {
    // Securely load the key from the environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (!apiKey) {
      console.error("CRITICAL ERROR: API Key is missing or empty.");
      throw new Error("API Key missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: `Analyze target URL: ${url}`,
      config: {
        systemInstruction: SCAN_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            target: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            score: { type: Type.NUMBER, description: "Security score 0-100" },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            summary: { type: Type.STRING },
            ssl: {
              type: Type.OBJECT,
              properties: {
                valid: { type: Type.BOOLEAN },
                issuer: { type: Type.STRING },
                expiry: { type: Type.STRING },
                algorithm: { type: Type.STRING },
                grade: { type: Type.STRING }
              }
            },
            headers: {
              type: Type.OBJECT,
              properties: {
                grade: { type: Type.STRING },
                missing: { type: Type.ARRAY, items: { type: Type.STRING } },
                present: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            techStack: {
              type: Type.OBJECT,
              properties: {
                cms: { type: Type.STRING, nullable: true },
                server: { type: Type.STRING, nullable: true },
                language: { type: Type.STRING, nullable: true },
                frameworks: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            openPorts: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            dns: {
              type: Type.OBJECT,
              properties: {
                ip: { type: Type.STRING },
                registrar: { type: Type.STRING },
                location: { type: Type.STRING },
                nameservers: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            sensitiveFiles: {
              type: Type.OBJECT,
              properties: {
                found: { type: Type.BOOLEAN },
                files: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                  description: { type: Type.STRING },
                  remediation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text; // Note: response.text is a property in newer SDKs
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ScanResult;

  } catch (error) {
    console.error("Scan failed:", error);
    // Fallback simulation
    return {
      target: url,
      timestamp: new Date().toISOString(),
      score: 45,
      riskLevel: "High",
      summary: "Simulated Report: Connection to AI Intelligence failed. Returning default fallback data for demonstration.",
      ssl: { valid: true, issuer: "Simulated CA", expiry: "2025-12-31", algorithm: "SHA-256", grade: "B" },
      headers: { grade: "C", missing: ["Content-Security-Policy", "X-Frame-Options"], present: ["Server"] },
      techStack: { cms: "Unknown", server: "Nginx", language: "PHP", frameworks: [] },
      openPorts: [80, 443],
      dns: { ip: "192.168.1.1", registrar: "Unknown", location: "Unknown", nameservers: [] },
      sensitiveFiles: { found: false, files: [] },
      vulnerabilities: [{ type: "API Error", severity: "Low", description: "Could not reach AI analysis engine.", remediation: "Check API Key configuration." }]
    };
  }
};