import { Threat } from "../types/threats";

type RawThreat = {
  type?: string;
  createdDateTime?: string;
  severity?: string;
  status?: string;
  affected?: string;
};

export async function fetchThreats(): Promise<Threat[]> {
  try {
    const res = await fetch("/api/threats", { cache: "no-store" });
    const data = await res.json();

    const alerts = Array.isArray(data.alerts) ? data.alerts : [];

    return alerts
      .filter(
        (t: RawThreat) =>
          !!t.createdDateTime && !isNaN(Date.parse(t.createdDateTime)),
      )
      .map((t: RawThreat) => ({
        type: t.type || "Unknown",
        time: t.createdDateTime!, // already filtered for valid
        severity: toSeverity(t.severity),
        status: t.status || "Pending",
        affected: t.affected || "Unknown endpoint",
      }));
  } catch (err) {
    console.error("Client fetch error:", err);
    return [];
  }
}

function toSeverity(input?: string): "low" | "medium" | "high" {
  const s = input?.toLowerCase?.();
  if (s === "low" || s === "medium" || s === "high") return s;
  return "low"; // default
}
