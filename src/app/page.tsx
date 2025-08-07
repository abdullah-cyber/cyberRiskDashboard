import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import "../styles/dashboard.css";
import type { SeverityLevel } from "./components/RiskScoreCard";
import { VulnerabilitiesCardWrapper } from "./components/VulnerabilitiesWrapper";
import {
  RiskScoreCard,
  ThreatCategories,
  IncidentsResolvedCard,
} from "./components";
import { IncidenceChart } from "./components/IncidenceChart";
import { ComplianceScore } from "./components/compliance-score";
import RealtimeDetection from "./components/RealtimeDetection";
import ThreatsCardWrapper from "./components/ThreatsCardWrapper";

// Types
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

// Fetch threats from API
async function fetchThreats(): Promise<{
  threats: Threat[];
  yesterdayCount: number;
  chartData: { name: string; uv: number; pv: number; amt: number }[];
  error?: string;
}> {
  try {
    const res = await fetch(`${process.env.BASE_URL || ""}/api/threats`, {
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch");

    if (!Array.isArray(data.alerts)) {
      return { threats: [], yesterdayCount: 0, chartData: [] };
    }

    const rawThreats = data.alerts as RawThreat[];

    const normalized: Threat[] = rawThreats.map((t) => {
      const validTime =
        t.createdDateTime && !isNaN(Date.parse(t.createdDateTime))
          ? t.createdDateTime
          : null;

      return {
        type: t.model || "Unknown",
        time: validTime ?? "", // keep empty string if invalid
        severity: t.severity || "low",
        status: t.status || "Pending",
        affected: t.description || "Unknown endpoint",
      };
    });

    // Only count valid timestamps for "yesterday" count
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    const yesterdayCount = normalized.filter((threat) => {
      const threatTime = new Date(threat.time);
      return (
        !isNaN(threatTime.getTime()) &&
        threatTime >= startOfYesterday &&
        threatTime < startOfToday
      );
    }).length;

    const chartMap = new Map<string, number>();
    normalized.forEach((t) => {
      const d = new Date(t.time);
      if (!isNaN(d.getTime())) {
        const hour = d.getHours();
        const label = `${hour}:00`;
        chartMap.set(label, (chartMap.get(label) || 0) + 1);
      }
    });

    const chartData = Array.from(chartMap.entries()).map(([name, count]) => ({
      name,
      uv: count,
      pv: 0,
      amt: 0,
    }));

    return {
      threats: normalized,
      yesterdayCount,
      chartData,
    };
  } catch (error: any) {
    console.error("SSD Fetch error:", error);
    return {
      threats: [],
      yesterdayCount: 0,
      chartData: [],
      error: error.message || "Unknown error",
    };
  }
}

// Main dashboard page
export default async function Dashboard() {
  const threatCategories = [
    { name: "Brute Force", percent: 34 },
    { name: "Malware", percent: 12 },
    { name: "DDoS", percent: 25 },
    { name: "Phishing", percent: 4 },
  ];

  const {
    threats: threatLog,
    yesterdayCount,
    chartData,
    error,
  } = await fetchThreats();
  const { score: riskScore, severity: severityLevel } =
    calculateRiskScore(threatLog);

  return (
    <div className="dashboard">
      <div className="flex justify-between items-center mb-4">
        <Image src="/images/image.png" alt="Logo" width={128} height={64} />
        <h1 className="font-medium text-3xl">CyberRisk Dashboard</h1>
        <RefreshCcw />
      </div>

      {error && (
        <div className="text-center text-red-600 font-semibold mb-4">
          Failed to load threats data: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RiskScoreCard riskScore={riskScore} severityLevel={severityLevel} />
        <ThreatsCardWrapper />
        <ThreatCategories categories={threatCategories} />
        <VulnerabilitiesCardWrapper />
        <IncidentsResolvedCard />
        <RealtimeDetection />
        <IncidenceChart data={chartData} />
        <ComplianceScore />
      </div>
    </div>
  );
}

// Risk score logic
function calculateRiskScore(threatLog: Threat[]): {
  score: number;
  severity: SeverityLevel;
} {
  if (threatLog.length === 0) return { score: 0, severity: "Low" };

  let total = 0;
  threatLog.forEach((t) => {
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

  const maxScore = threatLog.length * 10;
  const score = Math.min(Math.round((total / maxScore) * 100), 100);
  const severity: SeverityLevel =
    score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

  return { score, severity };
}
