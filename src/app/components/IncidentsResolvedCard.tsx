"use client";

import { CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  icon: ReactNode;
  extra: ReactNode;
  children: ReactNode;
}

export function IncidentsResolvedCard(): React.JSX.Element {
  return (
    <Card
      title="Incidents Resolved"
      icon={
        <div className="bg-green-100 text-green-600 p-2 rounded-full">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      }
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
