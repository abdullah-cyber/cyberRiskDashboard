import { TriangleAlert } from "lucide-react";
import { Card } from "./ui/card";

interface ThreatsCardProps {
  totalThreats: number;
  yesterdayThreats: number;
}

export function ThreatsCard({ totalThreats, yesterdayThreats }: ThreatsCardProps) {
  return (
    <Card
      title="Threats"
      icon={
        <div className="bg-orange-100 text-red-600 p-2 rounded-full">
          <TriangleAlert />
        </div>
      }
      extra={
        <p>
          <span className="fourteen">+{yesterdayThreats}</span> from yesterday
        </p>
      }
    >
      <p className="font-medium text-4xl text-[#D82000]">{totalThreats}</p>
    </Card>
  );
}
