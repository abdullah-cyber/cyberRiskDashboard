"use client";

import { Card } from "./ui/card";
import { Lock } from "lucide-react";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  icon: ReactNode;
  extra: ReactNode;
  children: ReactNode;
}

export function ComplianceScore(): React.JSX.Element {
  return (
    <Card
      title="Compliance Score"
      icon={
        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
          <Lock className="w-5 h-5" />
        </div>
      }
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
