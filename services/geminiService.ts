import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

const SCAN_SYSTEM_INSTRUCTION = `
You are VulneraX, an advanced cybersecurity analysis engine.
Your task is to perform a simulated passive security scan on a given URL.
Since you cannot physically access the live server in real-time for all metrics, you must use your knowledge base to ESTIMATE the likely security posture, technology stack, and potential vulnerabilities of the provided target.

If the target is a well-known site (e.g., google.com), return accurate real-world data.
If the target is generic or unknown, generate a REALISTIC SIMULATION of a security report for that type of website.

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
    // FIX: Using Vite syntax (import.meta.env) instead of Node syntax (process.env)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    // Debugging line: Check the console to see if the key is loaded
    if (!apiKey) {
      console.error("CRITICAL ERROR: API Key is missing or empty.");
      throw new Error("API Key missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Updated to a more standard model name if 2.5 is unavailable, or keep 1.5-flash
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

    const text = response.text; // Note: response.text() is usually a function in newer SDKs
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