import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Threat {
  type: string;
  time: string; // ISO timestamp
  severity: string;
  status: string;
  affected: string;
}

interface ThreatsResponse {
  alerts: Threat[];
}

interface ThreatStats {
  totalThreats: number;
  yesterdayThreats: number;
  alerts: Threat[];
}

export const useThreatsLast24Hours = () =>
  useQuery<ThreatStats>({
    queryKey: ["threats-24h"],
    queryFn: async () => {
      console.log("📡 Fetching from /api/threats...");

      const res = await axios.get<ThreatsResponse>("/api/threats");
      const alerts = res.data.alerts;

      console.log("📦 Total alerts returned:", alerts.length);

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      const last24h = alerts.filter((a) => {
        const t = new Date(a.time);
        return t >= twentyFourHoursAgo;
      });

      const prev24h = alerts.filter((a) => {
        const t = new Date(a.time);
        return t >= fortyEightHoursAgo && t < twentyFourHoursAgo;
      });

      console.log("✅ Filtered: Last 24h =", last24h.length, " | Yesterday =", prev24h.length);

      return {
        totalThreats: last24h.length,
        yesterdayThreats: prev24h.length,
        alerts: last24h,
      };
    },
  });
