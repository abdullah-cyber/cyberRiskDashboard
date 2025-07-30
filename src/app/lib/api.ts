export interface Threat {
  type: string;
  time: string;
  severity: string;
  status: string;
  affected: string;
}

export async function fetchThreats(): Promise<Threat[]> {
  try {
    const res = await fetch("/api/threats");
    const data = await res.json();
    if (!Array.isArray(data.alerts)) return [];

    return data.alerts;
  } catch (err) {
    console.error("Client-side fetch error:", err);
    return [];
  }
}
