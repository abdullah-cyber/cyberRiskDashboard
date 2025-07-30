"use client";

import { Activity } from "lucide-react";
import { Chart } from "./charts/interaction";
import { Card } from "./ui/card";

interface IncidenceChartProps {
  data?: any; // Replace `any` with a specific type if you have chart data structure
}

export function IncidenceChart({ data }: IncidenceChartProps) {
  return (
    <Card
      title="Interactions Over Time"
      icon={
        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
          <Activity className="w-5 h-5" />
        </div>
      }
      extra={null}
    >
      <Chart data={data} />
    </Card>
  );
}
