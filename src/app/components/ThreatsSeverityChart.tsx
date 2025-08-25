"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Threat {
  index: number;
  type: string;
  time: string;
  severity: string;
  status: string;
  affected: string;
}

interface Props {
  threats: Threat[];
}

export default function ThreatSeverityChart({ threats }: Props) {
  // Count by severity
  const counts = { low: 0, medium: 0, high: 0, critical: 0 };

  threats.forEach((t) => {
    const sev = t.severity?.toLowerCase?.();
    if (sev === "low") counts.low++;
    else if (sev === "medium") counts.medium++;
    else if (sev === "high") counts.high++;
    else if (sev === "critical") counts.critical++;
  });

  const data = [
    { name: "Low", value: counts.low },
    { name: "Medium", value: counts.medium },
    { name: "High", value: counts.high },
    { name: "Critical", value: counts.critical },
  ];

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">Threats by Severity</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
