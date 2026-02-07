import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";

export interface Threat {
  type: string;
  time: string; // ISO string
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
  newThreats: number;
  alerts: Threat[];
  chartData: ChartData[];
}

export const useThreatsLast24Hours = () => {
  const accumulatedRef = useRef<Threat[]>([]);

  return useQuery<ThreatStats>({
    queryKey: ["threats-24h"],
    queryFn: async () => {
      const res = await axios.get<ThreatsResponse>("/api/threats");
      const newAlertsRaw = res.data.alerts || [];

      // ✅ Normalize all time strings to ISO format
      const newAlerts: Threat[] = newAlertsRaw.map((a) => ({
        ...a,
        time: new Date(a.time).toISOString(),
      }));

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // ✅ Avoid duplicates
      const previousKeys = new Set(
        accumulatedRef.current.map((a) => `${a.time}-${a.affected}-${a.type}`),
      );
      const uniqueNew = newAlerts.filter(
        (a) => !previousKeys.has(`${a.time}-${a.affected}-${a.type}`),
      );

      const combined = [...accumulatedRef.current, ...uniqueNew];

      // ✅ Keep only unique alerts based on composite key
      const map = new Map<string, Threat>();
      for (const alert of combined) {
        const key = `${alert.time}-${alert.affected}-${alert.type}`;
        map.set(key, alert);
      }

      const filtered = Array.from(map.values()).filter((a) => {
        const t = new Date(a.time);
        return t >= twentyFourHoursAgo && t <= now;
      });

      accumulatedRef.current = filtered;

      // ✅ Sort latest first
      const sorted = [...filtered].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
      );

      // ✅ Group threats by hour for chart
      const chartDataMap = new Map<string, ChartData>();
      sorted.forEach((threat) => {
        const date = new Date(threat.time);
        const hour = `${date.getHours().toString().padStart(2, "0")}:00`;
        if (!chartDataMap.has(hour)) {
          chartDataMap.set(hour, { name: hour, uv: 0, pv: 0, amt: 0 });
        }
        chartDataMap.get(hour)!.uv += 1;
      });

      const chartData = Array.from(chartDataMap.values()).sort(
        (a, b) => parseInt(a.name) - parseInt(b.name),
      );

      return {
        totalThreats: filtered.length,
        newThreats: uniqueNew.length,
        alerts: sorted,
        chartData,
      };
    },
    refetchInterval: 10000, // every 10s
  });
};
