"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "./ui/card";

interface Threat {
  severity: string;
}

interface Props {
  threats: Threat[];
}

export default function ThreatSeverityChart({ threats }: Props) {
  // Count by severity
  const counts: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  threats.forEach((t) => {
    const sev = t.severity?.toLowerCase();
    if (sev && counts.hasOwnProperty(sev)) counts[sev]++;
  });

  const data = Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const COLORS: Record<string, string> = {
    low: "#10b981", // green
    medium: "#f59e0b", // orange
    high: "#ef4444", // red
    critical: "#b91c1c", // dark red
  };

  return (
    <Card
      title="Threats by Severity"
      icon={
        <div className="bg-red-100 text-red-600 p-2 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" />
          </svg>
        </div>
      }
      extra={<span className="text-sm text-gray-500">Severity overview</span>}
    >
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              //   label
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name.toLowerCase()] || "#9ca3af"}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} threats`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
