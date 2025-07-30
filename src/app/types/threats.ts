export interface Threat {
  type: string;
  time: string; // ✅ only string!
  severity: "low" | "medium" | "high";
  status: string;
  affected: string;
}
