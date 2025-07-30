import React, { JSX } from "react";
import { Bug } from "lucide-react";
import { Card } from "./ui/card";

export function VulnerabilitiesCard(): JSX.Element {
  return (
    <Card
      title="Vulnerabilities"
      icon={
        <div className="bg-orange-100 text-red-600 p-2 rounded-full">
          <Bug />
        </div>
      }
      extra={
        <p>
          <span className="fourteen">+14</span> from yesterday
        </p>
      }
    >
      <p className="font-medium text-4xl text-orange-600">42</p>
    </Card>
  );
}
