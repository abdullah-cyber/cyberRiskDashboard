import { Shield } from "lucide-react";
import { Card } from "./ui/card";

const severityColorMap = {
  High: {
    text: "text-red-600",
    bg: "bg-red-100",
    bar: "#D82000",
  },
  Medium: {
    text: "text-orange-500",
    bg: "bg-orange-100",
    bar: "#FFA500",
  },
  Low: {
    text: "text-green-600",
    bg: "bg-green-100",
    bar: "#32CD32",
  },
};

export function RiskScoreCard({ riskScore = 0, severityLevel = "Low" }) {
  const colors = severityColorMap[severityLevel] || severityColorMap.Low;

  return (
    <Card
      title="Risk Score"
      icon={
        <div className={`${colors.bg} ${colors.text} p-2 rounded-full`}>
          <Shield />
        </div>
      }
      extra={severityLevel}
    >
      <p className={`font-medium text-4xl ${colors.text}`}>
        {riskScore}/100
      </p>
      <div className="progress-wrapper mt-2">
        <div className="progress-bar bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="progress-fill h-full rounded-full transition-all duration-300"
            style={{
              width: `${riskScore}%`,
              backgroundColor: colors.bar,
            }}
          ></div>
        </div>
      </div>
    </Card>
  );
}
