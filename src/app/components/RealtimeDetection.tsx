"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import ThreatTable from "./ThreatTable";
import ThreatModal from "./ThreatModal";
import { Threat } from "../types/threats";

// Fetch and map threat data
const fetchThreats = async (): Promise<Threat[]> => {
  const res = await fetch("/api/threats", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();
  const alerts = data.alerts || [];

  // Normalize and sort by time (latest first)
  return alerts
    .map((a: any) => ({
      ...a,
      time: new Date(a.time ?? a.createdDateTime ?? "").toISOString(),
    }))
    .sort(
      (a: Threat, b: Threat) =>
        new Date(b.time).getTime() - new Date(a.time).getTime(),
    );
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
    staleTime: 0, // ✅ Always fetch fresh
    refetchOnMount: true, // ✅ Force refetch when component mounts
    refetchInterval: 10000, // (optional) auto-refresh every 10s
  });

  const filteredThreats = useMemo(() => {
    return filter
      ? threatLog.filter(
          (t) => t.severity?.toLowerCase() === filter.toLowerCase(),
        )
      : threatLog;
  }, [filter, threatLog]);

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
          <option value="critical">Critical</option>
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
