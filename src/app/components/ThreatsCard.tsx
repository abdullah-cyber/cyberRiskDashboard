import { TriangleAlert } from "lucide-react";
import { Card } from "./ui/card";

interface ThreatsCardProps {
  totalThreats: number; // last 24 hours
  newThreats: number; // previous 24 hours?
}

export function ThreatsCard({ totalThreats, newThreats }: ThreatsCardProps) {
  // Optional: Show a difference indicator
  const delta = totalThreats - newThreats;
  const isUp = delta >= 0;

  return (
    <Card
      title="Threats"
      icon={
        <div className="bg-orange-100 text-red-600 p-2 rounded-full">
          <TriangleAlert />
        </div>
      }
      extra={
        <p className="text-sm text-muted-foreground">
          <span
            className={`fourteen ${isUp ? "text-green-600" : "text-red-600"}`}
          >
            {isUp ? "+" : ""}
            {delta}
          </span>{" "}
          compared to previous 24h
        </p>
      }
    >
      <p className="font-medium text-4xl text-[#D82000]">{totalThreats}</p>
    </Card>
  );
}
