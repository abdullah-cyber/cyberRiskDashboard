import { Card } from "./ui/card";
import { Lock } from "lucide-react";

export function ComplianceScore() {
  return (
    <Card
      title="Compliance Score"
      icon={<Lock />} // Replace with actual icon component
      extra={
        <p>
          <span className="fourteen">+3</span> from last month
        </p>
      }
    >
      <p className="font-medium text-4xl text-blue-600">85%</p>
    </Card>
  );
}
