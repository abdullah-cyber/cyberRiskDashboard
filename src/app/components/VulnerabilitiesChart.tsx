"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTenableVulnerabilities } from "../lib/vulnerabilities";

interface ChartData {
  name: string;
  count: number;
}
interface VulnerabilitiesChartProps {
  title?: string;
}

export default function VulnerabilitiesChart({
  title = "Latest 10 Vulnerabilities by Severity",
}: VulnerabilitiesChartProps) {
  const { data, isLoading, isError } = useTenableVulnerabilities();

  if (isLoading || isError || !data?.vulnerabilities) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <p className="text-gray-500">Loading or no data available...</p>
      </div>
    );
  }

  // Pick the latest 10 vulnerabilities
  const latestTen = data.vulnerabilities.slice(0, 10);

  // Count severities 0–3 only
  const severityCounts: ChartData[] = [0, 1, 2, 3].map((s) => ({
    name: s.toString(),
    count: latestTen.filter((v: any) => v.severity === s).length,
  }));

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={severityCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: "Severity", position: "insideBottom", dy: 5 }}
          />
          <YAxis
            allowDecimals={false}
            label={{
              value: "Count",
              angle: -90,
              position: "insideLeft",
              dx: 15,
            }}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
