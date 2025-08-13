import { NextRequest } from "next/server";

type Indicator = {
  type: string;
  value: string;
};

type TrendMicroRawItem = {
  model?: string;
  type?: string;
  createdDateTime?: string;
  time?: string;
  severity?: string;
  status?: string;
  investigationStatus?: string;
  description?: string;
  indicators?: Indicator[];
};

type Alert = {
  type: string;
  time: string;
  severity: "low" | "medium" | "high";
  status: string;
  affected: string;
};

// 🔒 GLOBAL IN-MEMORY STORE (resets when server restarts)
let threatStore: Alert[] = [];

const PAGE_SIZE = 100;
const MAX_PAGES = 20; // To avoid infinite loops (20 x 100 = 2000 alerts max)

export async function GET(req: NextRequest) {
  const API_KEY = process.env.TREND_API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API key missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  let allItems: TrendMicroRawItem[] = [];
  let offset = 0;

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const res = await fetch(
        `https://api.xdr.trendmicro.com/v3.0/workbench/alerts?limit=${PAGE_SIZE}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      const raw = await res.text();
      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: "TrendMicro API error", details: raw }),
          {
            status: res.status,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const data = JSON.parse(raw);
      const items: TrendMicroRawItem[] = data.items || data.data || [];

      allItems = allItems.concat(items);
      if (items.length < PAGE_SIZE) break; // no more pages

      offset += PAGE_SIZE;
    }

    const newAlerts = allItems
      .map((item): Alert | null => {
        const rawTime = item.createdDateTime || item.time;
        const parsedTime = rawTime ? new Date(rawTime) : null;
        if (!parsedTime || isNaN(parsedTime.getTime())) return null;

        const rawSeverity = (item.severity || "").toLowerCase();
        const severity: "low" | "medium" | "high" =
          rawSeverity === "high"
            ? "high"
            : rawSeverity === "medium"
              ? "medium"
              : "low";

        const indicators = Array.isArray(item.indicators)
          ? item.indicators
          : [];
        const filename = indicators.find((ind) => ind.type === "filename");
        const fullpath = indicators.find((ind) => ind.type === "fullpath");
        const ip = indicators.find((ind) => ind.type === "ip");

        const affected =
          filename?.value ||
          fullpath?.value ||
          ip?.value ||
          item.description ||
          "Unknown endpoint";

        return {
          type: item.model || item.type || "Unknown",
          time: parsedTime.toISOString(),
          severity,
          status: item.status || item.investigationStatus || "Pending",
          affected,
        };
      })
      .filter((a): a is Alert => a !== null);

    // Combine with old cache
    const combined = [...threatStore, ...newAlerts];

    // Deduplicate by (time + affected + type)
    const uniqueMap = new Map<string, Alert>();
    for (const alert of combined) {
      const key = `${alert.time}-${alert.affected}-${alert.type}`;
      uniqueMap.set(key, alert); // latest wins
    }
    const deduped = Array.from(uniqueMap.values());
    threatStore = deduped;

    return new Response(JSON.stringify({ alerts: deduped }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching TrendMicro threats:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
