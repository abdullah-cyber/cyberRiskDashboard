'use client';
import { Chart } from "./charts/interaction";
import { Activity } from "lucide-react";
import { Card } from "./ui/card";

export function IncidenceChart({ data }) {
  return (
    <Card title="Interactions Over Time" icon={<Activity />}>
      <Chart />
    </Card>
  );
}
