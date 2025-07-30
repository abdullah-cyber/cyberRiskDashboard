"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import ThreatTable from "./ThreatTable";
import ThreatModal from "./ThreatModal";

// Define the shape of a threat item
export interface Threat {
  type: string;
  time: string;
  severity: "low" | "medium" | "high" | string;
  status: string;
  affected: string;
}

const fetchThreats = async (): Promise<Threat[]> => {
  const res = await fetch("/api/threats", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();

  return (data.alerts || []).map((t: any) => ({
    type: t.type || "Unknown",
    time: t.createdDateTime || new Date().toISOString(),
    severity: t.severity?.toLowerCase?.() || "low",
    status: t.status || "Pending",
    affected: t.affected || "Unknown endpoint",
  }));
};

export default function RealtimeDetection() {
  const [filter, setFilter] = useState<string>("");
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

  const {
    data: threatLog = [],
    isLoading,
    error,
  } = useQuery<Threat[]>({
    queryKey: ["threats"],
    queryFn: fetchThreats,
    staleTime: 10000,
  });

  const filteredThreats = filter
    ? threatLog.filter((t) => t.severity.toLowerCase() === filter.toLowerCase())
    : threatLog;

  return (
    <div className="realtime p-4 flex flex-col h-full rounded-2xl shadow-md bg-white">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Search className="text-orange-500 w-5 h-5" />
          <h4 className="text-lg font-semibold text-gray-800">
            Realtime Threat Detection
          </h4>
        </div>

        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <ThreatTable
        threats={filteredThreats}
        isLoading={isLoading}
        error={error}
        onRowClick={setSelectedThreat}
      />

      {selectedThreat && (
        <ThreatModal
          threat={selectedThreat}
          onClose={() => setSelectedThreat(null)}
        />
      )}
    </div>
  );
}
