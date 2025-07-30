// REMOVE "use client";

import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import "../styles/dashboard.css";

import {
  RiskScoreCard,
  ThreatsCard,
  ThreatCategories,
  VulnerabilitiesCard,
  IncidentsResolvedCard,
} from "./components";
import { IncidenceChart } from "./components/IncidenceChart";
import { ComplianceScore } from "./components/compliance-score";
import RealtimeDetection  from "./components/RealtimeDetection"; // Correct named import
import ThreatsCardWrapper from "./components/ThreatsCardWrapper";

// Define types
interface Threat {
  type: string;
  time: string;
  severity: string;
  status: string;
  affected: string;
}

interface RawThreat {
  model: string;
  createdDateTime: string;
  severity: string;
  status: string;
  description: string;
}

// SSD version
async function fetchThreats(): Promise<{ threats: Threat[]; yesterdayCount: number }> {
  try {
    const res = await fetch(`${process.env.BASE_URL || ""}/api/threats`, { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to fetch");

    if (!Array.isArray(data.alerts)) return { threats: [], yesterdayCount: 0 };

    const normalized = (data.alerts as RawThreat[]).map((t): Threat => ({
      type: t.model || "Unknown",
      time: t.createdDateTime || new Date().toISOString(),
      severity: t.severity || "low",
      status: t.status || "Pending",
      affected: t.description || "Unknown endpoint",
    }));

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    const yesterdayCount = normalized.filter(threat => {
      const threatTime = new Date(threat.time);
      return threatTime >= startOfYesterday && threatTime < startOfToday;
    }).length;

    return { threats: normalized, yesterdayCount };
  } catch (error) {
    console.error("SSD Fetch error:", error);
    return { threats: [], yesterdayCount: 0 };
  }
}

// ✅ MAIN PAGE
export default async function Dashboard() {
  const threatCategories = [
    { name: "Brute Force", percent: 34 },
    { name: "Malware", percent: 12 },
    { name: "DDoS", percent: 25 },
    { name: "Phishing", percent: 4 },
  ];

  const { threats: threatLog, yesterdayCount } = await fetchThreats();

  const calculateRiskScore = (threats: Threat[]) => {
    if (threats.length === 0) return { score: 0, severity: "Low" };

    let total = 0;
    threats.forEach((t) => {
      switch (t.severity.toLowerCase()) {
        case "high":
          total += 10;
          break;
        case "medium":
          total += 5;
          break;
        case "low":
          total += 2;
          break;
        default:
          total += 1;
      }
    });

    const maxScore = threats.length * 10;
    const score = Math.min(Math.round((total / maxScore) * 100), 100);
    const severity = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

    return { score, severity };
  };

  const { score: riskScore, severity: severityLevel } = calculateRiskScore(threatLog);

  return (
    <div className="dashboard">
      <div className="flex justify-between items-center mb-4">
        <Image src="/images/image.png" alt="Logo" width={128} height={64} />
        <h1 className="font-medium text-3xl">CyberRisk Dashboard</h1>
        <RefreshCcw />
      </div>

      <div className="grid">
        <RiskScoreCard riskScore={riskScore} severityLevel="Low" />
        <ThreatsCardWrapper/>
        <ThreatCategories categories={threatCategories} />
        <VulnerabilitiesCard />
        <IncidentsResolvedCard />
        <RealtimeDetection />
        <IncidenceChart data={undefined} />
        <ComplianceScore />
      </div>
    </div>
  );
}
