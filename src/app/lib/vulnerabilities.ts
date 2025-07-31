import { useQuery } from "@tanstack/react-query";

type Vulnerability = {
  plugin_name: string;
  severity: string; // ✅ likely to be string, not number
  count: number;
};

type VulnerabilitiesResponse = {
  vulnerabilities: Vulnerability[];
};

export function useTenableVulnerabilities() {
  return useQuery<VulnerabilitiesResponse>({
    queryKey: ["tenable-vulnerabilities"],
    queryFn: async () => {
      const res = await fetch("/api/tenable");

      if (!res.ok) {
        throw new Error("Failed to fetch vulnerabilities");
      }

      const json = await res.json();

      // ✅ Ensure you're returning an object with the `vulnerabilities` key
      return {
        vulnerabilities: json.vulnerabilities ?? [], // fallback to empty array
      };
    },
    refetchInterval: 5 * 60 * 1000, // every 5 minutes
  });
}
