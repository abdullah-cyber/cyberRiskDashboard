"use client";

import { ThreatsCard } from "./ThreatsCard";
import { useThreatsLast24Hours } from "../lib/threats24hrs";

export default function ThreatsCardWrapper() {
  const { data, isLoading, error } = useThreatsLast24Hours();

  console.log("🧩 ThreatsCardWrapper", { isLoading, error, data });

  if (isLoading) return <div>Loading threats...</div>;
  if (error || !data) return <div>Error loading threat data</div>;

  return (
    <ThreatsCard
      totalThreats={data.totalThreats}
      newThreats={data.newThreats}
    />
  );
}
