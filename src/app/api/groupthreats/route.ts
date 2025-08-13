// app/api/groupthreats/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const categories = {
  Malware: ["malware","trojan","worm","spyware","ransomware","backdoor","infostealer","autoit","heuristic","keygen","keylogger"],
  BruteForce: ["failed login","login attempt","authentication attempt","password guess","bruteforce"],
  DDoS: ["ddos","denial of service"],
};

interface Threat {
  index: number;
  type: string;
  time: string;
  severity: string;
  status: string;
  affected: string;
}

export async function GET() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/threats`);
    const { alerts: allThreats }: { alerts: Threat[] } = await res.json();

    // Filter for last 24 hours
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threats = allThreats
      .filter(t => new Date(t.time) >= dayAgo)
      .map((t, idx) => ({ ...t, index: idx + 1 }));

    // Pre-classify
    const grouped: Record<string, number[]> = { Malware: [], BruteForce: [], DDoS: [], Other: [] };
    const ambiguous: Threat[] = [];

    threats.forEach(t => {
      const text = `${t.type} ${t.affected}`.toLowerCase();
      if (categories.Malware.some(k => text.includes(k))) grouped.Malware.push(t.index);
      else if (categories.BruteForce.some(k => text.includes(k))) grouped.BruteForce.push(t.index);
      else if (categories.DDoS.some(k => text.includes(k))) grouped.DDoS.push(t.index);
      else ambiguous.push(t);
    });

    // Gemini fallback
    if (ambiguous.length) {
      const threatList = ambiguous.map(
        t => `${t.index}. Type: ${t.type}, Status: ${t.status}, Severity: ${t.severity}, Affected: ${t.affected}`
      ).join("\n");

      const prompt = `
Classify each threat index into one category: Malware, BruteForce, DDoS, Other.
Case-insensitive. Output JSON only:

Input threats:
${threatList}

Output format:
{
  "Malware": [indexes],
  "BruteForce": [indexes],
  "DDoS": [indexes],
  "Other": [indexes]
}
`;
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const geminiRes = await model.generateContent(prompt);
        const output = geminiRes.response.text().trim();
        const geminiGrouped = JSON.parse(output);
        Object.keys(geminiGrouped).forEach(cat => {
          grouped[cat] = grouped[cat].concat(geminiGrouped[cat]);
        });
      } catch (e) {
        ambiguous.forEach(t => grouped.Other.push(t.index));
      }
    }

    // Percentages
    const total = threats.length;
    const percentages: Record<string, number> = {};
    Object.keys(grouped).forEach(cat => {
      percentages[cat] = Math.round((grouped[cat].length / total) * 100);
    });

    return new Response(JSON.stringify({ grouped, threats, percentages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Grouping error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
