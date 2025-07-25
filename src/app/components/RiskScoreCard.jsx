import { Shield } from "lucide-react";
import { Card } from "./ui/card";

export function RiskScoreCard() {
  return (
    <Card title="Risk Score" icon={<div className="bg-orange-100 text-red-600 p-2 rounded-full"><Shield /></div>} extra="Medium">
      <p className="font-medium text-4xl text-[#D82000]">72/100</p>
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "34%" }}></div>
        </div>
      </div>
    </Card>
  );
}
