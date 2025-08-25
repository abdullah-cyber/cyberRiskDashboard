// components/OverviewChart.tsx
"use client";

import { BarChart2 } from "lucide-react";
import { Card } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Threat {
  index: number;
  type: string;
  severity: string;
  status: string;
  affected: string;
}

interface OverviewChartProps {
  grouped: Record<string, Threat[]>;
}

export default function OverviewChart({ grouped }: OverviewChartProps) {
  const chartData = [
    {
      name: "Threats",
      Malware: grouped.Malware?.length || 0,
      BackDoor: grouped.BackDoor?.length || 0,
      DDoS: grouped.DDoS?.length || 0,
      Other: grouped.Other?.length || 0,
    },
  ];

  return (
    <Card
      title="Threat Overview"
      icon={
        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
          <BarChart2 className="w-5 h-5" />
        </div>
      }
      extra={<span className="text-sm text-gray-500">By category</span>}
    >
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Malware" stackId="a" fill="#f97316" />
            <Bar dataKey="BackDoor" stackId="a" fill="#10b981" />
            <Bar dataKey="DDoS" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Other" stackId="a" fill="#9ca3af" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
