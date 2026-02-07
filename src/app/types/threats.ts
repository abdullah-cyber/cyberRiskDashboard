export type Severity = "low" | "medium" | "high" | "unknown";

export type Threat = {
  type: string;
  time: string; // ISO string or empty if invalid
  severity: Severity;
  status: string;
  affected: string;
};
