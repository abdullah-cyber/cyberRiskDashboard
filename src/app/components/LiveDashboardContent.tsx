"use client";

import { useThreatsLast24Hours } from "../lib/threats24hrs";
import { IncidenceChart } from "./IncidenceChart";

export default function LiveDashboardContent() {
  const { data, isLoading, error } = useThreatsLast24Hours();

  if (isLoading) return <div className="p-4">Loading threats...</div>;
  if (error || !data) return <div className="text-red-600">Failed to load threat data.</div>;

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3">
      <IncidenceChart data={data.chartData} />
    </div>
  );
}
