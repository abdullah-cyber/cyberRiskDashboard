"use client";

import { BarChart2 } from "lucide-react";
import { Card } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OverviewChartProps {
  grouped: Record<string, any[]>;
}

export default function OverviewChart({ grouped }: OverviewChartProps) {
  const chartData = Object.entries(grouped).map(([name, arr]) => ({
    name,
    count: arr.length,
  }));

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
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
