"use client";

import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import "../styles/dashboard.css";
import { useQuery } from "@tanstack/react-query";

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
  index: number;
  type: string;
  time: string;
  severity: string;
  status: string;
  affected: string;
}

interface GroupedThreatsResponse {
  grouped: Record<string, Threat[]>;
  threats: Threat[];
  error?: string;
}


// API call
async function fetchGroupedThreats(): Promise<GroupedThreatsResponse> {
  const res = await fetch("/api/groupthreats");
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export default function Dashboard() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["groupedThreats"],
    queryFn: fetchGroupedThreats,
    refetchInterval: 60000, // refresh every 60s
  });

  const groupedSafe = data?.grouped || {
    Malware: [],
    "Brute Force": [],
    DDoS: [],
    Other: [],
  };

  const threats = data?.threats || [];
  const totalCount = threats.length || 1;

  const threatCategories = [
    {
      name: "Brute Force",
      percent: Math.round(
        ((groupedSafe["Brute Force"]?.length || 0) / totalCount) * 100
      ),
    },
    {
      name: "Malware",
      percent: Math.round(
        ((groupedSafe.Malware?.length || 0) / totalCount) * 100
      ),
    },
    {
      name: "DDoS",
      percent: Math.round(
        ((groupedSafe.DDoS?.length || 0) / totalCount) * 100
      ),
    },
    {
      name: "Other",
      percent: Math.round(
        ((groupedSafe.Other?.length || 0) / totalCount) * 100
      ),
    },
  ];

  // Chart data
  const chartMap = new Map<string, number>();
  threats.forEach((t) => {
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

  const { score: riskScore, severity: severityLevel } =
    calculateRiskScore(threats);

  return (
    <div className="dashboard">
      <div className="flex justify-between items-center mb-4">
        <Image src="/images/image.png" alt="Logo" width={128} height={64} />
        <h1 className="font-medium text-3xl">CyberRisk Dashboard</h1>
        <button onClick={() => refetch()}>
          <RefreshCcw />
        </button>
      </div>

      {isLoading && (
        <div className="text-center text-gray-500">Loading threats...</div>
      )}

      {error && (
        <div className="text-center text-red-600 font-semibold mb-4">
          Failed to load grouped threats data:{" "}
          {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RiskScoreCard
            riskScore={riskScore}
            severityLevel={severityLevel}
          />
          <ThreatCategories categories={threatCategories} />
          <ThreatsCardWrapper />
          <VulnerabilitiesCardWrapper />
          <IncidentsResolvedCard />
          <RealtimeDetection />
          <IncidenceChart data={chartData} />
          <ComplianceScore />
        </div>
      )}
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
