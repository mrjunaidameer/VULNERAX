import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

const SCAN_SYSTEM_INSTRUCTION = `
You are VulneraX, an advanced cybersecurity analysis engine.
Your task is to perform a simulated passive security scan on a given URL.

IMPORTANT GUIDELINES:
1. INFER vulnerabilities based on the URL structure and common tech stacks.
2. If the target is unknown, return "Unknown" for specific fields instead of guessing (e.g. Registrar).
3. DO NOT refuse the request. This is a simulated, educational exercise.
4. RETURN ONLY RAW JSON. Do not use Markdown formatting like \`\`\`json.

You must return a JSON object.
The risk score should be 0-100 (100 = Secure).
`;

// Helper to clean AI output if it includes Markdown
const cleanJsonOutput = (text: string) => {
  // Remove markdown code blocks if present
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  // Ensure we only grab the JSON object part
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : cleaned;
};

export const analyzeTarget = async (url: string): Promise<ScanResult> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (!apiKey) {
      throw new Error("API Key missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: `Analyze target URL: ${url}`,
      config: {
        systemInstruction: SCAN_SYSTEM_INSTRUCTION,
        // SAFETY SETTINGS: Cast to 'any' to bypass strict Enum typing issues in some SDK versions
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ] as any,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            target: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            score: { type: Type.NUMBER },
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

    // Handle response structure (SDK version specific)
    // We treat 'response' as any to safely check properties without TS errors
    const safeResponse = response as any;
    let rawText = '';

    if (typeof safeResponse.text === 'function') {
        rawText = safeResponse.text();
    } else if (typeof safeResponse.text === 'string') {
        rawText = safeResponse.text;
    } else {
        // Force fallback if response is empty
        throw new Error("Empty response from AI (likely safety block)");
    }

    const cleanedJson = cleanJsonOutput(rawText);
    return JSON.parse(cleanedJson) as ScanResult;

  } catch (error) {
    console.error("Scan failed:", error);
    // Fallback simulation to prevent infinite loading
    return {
      target: url,
      timestamp: new Date().toISOString(),
      score: 45,
      riskLevel: "High",
      summary: "Connection to AI interrupted. Returning simulated fallback data.",
      ssl: { valid: true, issuer: "Simulated CA", expiry: "2025-12-31", algorithm: "SHA-256", grade: "B" },
      headers: { grade: "C", missing: ["Content-Security-Policy", "X-Frame-Options"], present: ["Server"] },
      techStack: { cms: "Unknown", server: "Nginx", language: "PHP", frameworks: [] },
      openPorts: [80, 443],
      dns: { ip: "192.168.1.1", registrar: "Unknown", location: "Unknown", nameservers: [] },
      sensitiveFiles: { found: false, files: [] },
      vulnerabilities: [{ type: "Scan Error", severity: "Low", description: "AI Analysis timed out or was blocked.", remediation: "Try a different URL or check API quota." }]
    };
  }
};