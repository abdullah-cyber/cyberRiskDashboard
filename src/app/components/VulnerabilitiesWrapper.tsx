"use client";

import { useTenableVulnerabilities } from "../lib/vulnerabilities";
import { VulnerabilitiesCard } from "./VulnerabilitiesCard";

export function VulnerabilitiesCardWrapper() {
  const { data, isLoading, isError } = useTenableVulnerabilities();

  if (isLoading || isError || !data?.vulnerabilities) {
    return <VulnerabilitiesCard total={0} />;
  }

  return <VulnerabilitiesCard total={data.total_vulnerability_count} />;
}
