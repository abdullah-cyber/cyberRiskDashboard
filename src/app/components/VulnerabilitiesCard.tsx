"use client";
import React, { useState } from "react";
import { Bug } from "lucide-react";
import { Card } from "./ui/card";
import VulnerabilitiesModal from "./VulnerabilitiesModal";

interface VulnerabilitiesCardProps {
  total: number;
}

export function VulnerabilitiesCard({ total }: VulnerabilitiesCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        <Card
          title="Vulnerabilities"
          icon={
            <div className="bg-orange-100 text-red-600 p-2 rounded-full">
              <Bug />
            </div>
          }
          extra={<p className="text-sm text-muted-foreground">Fetched from Tenable</p>}
        >
          <p className="font-medium text-4xl text-yellow-700">{total}</p>
        </Card>
      </div>
      <VulnerabilitiesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
