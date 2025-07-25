import { CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";

export function IncidentsResolvedCard() {
  return (
    <Card
      title="Incidents Resolved"
      icon={<div  className="bg-green-100 text-green-600 p-2 rounded-full"><CheckCircle2 /></div>}
      extra={
        <p>
          <span className="fourteen">+5</span> from yesterday
        </p>
      }
    >
      <p className="font-medium text-4xl text-green-600">15</p>
    </Card>
  );
}
