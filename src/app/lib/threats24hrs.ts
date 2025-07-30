import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Threat {
  type: string;
  time: string;
  severity: string;
  status: string;
  affected: string;
}

interface ThreatsResponse {
  alerts: Threat[];
}

interface ChartData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

interface ThreatStats {
  totalThreats: number;
  yesterdayThreats: number;
  alerts: Threat[];
  chartData: ChartData[]; // <-- Add this
}

export const useThreatsLast24Hours = () =>
  useQuery<ThreatStats>({
    queryKey: ["threats-24h"],
    queryFn: async () => {
      const res = await axios.get<ThreatsResponse>("/api/threats");
      const alerts = res.data?.alerts || [];

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      const last24h = alerts.filter((a) => {
        const t = new Date(a.time);
        return !isNaN(t.getTime()) && t >= twentyFourHoursAgo;
      });

      const prev24h = alerts.filter((a) => {
        const t = new Date(a.time);
        return !isNaN(t.getTime()) && t >= fortyEightHoursAgo && t < twentyFourHoursAgo;
      });

      // ✅ Transform to ChartData[]
      const chartDataMap = new Map<string, ChartData>();

      last24h.forEach((threat) => {
        const date = new Date(threat.time);
        const hour = `${date.getHours()}:00`;

        if (!chartDataMap.has(hour)) {
          chartDataMap.set(hour, {
            name: hour,
            uv: 0,
            pv: 0,
            amt: 0,
          });
        }

        const entry = chartDataMap.get(hour)!;
        entry.uv += 1; // You can change this logic
      });

      const chartData = Array.from(chartDataMap.values());

      return {
        totalThreats: last24h.length,
        yesterdayThreats: prev24h.length,
        alerts: last24h,
        chartData, // ✅ Return here
      };
    },
  });
