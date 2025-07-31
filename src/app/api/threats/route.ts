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
  severity: string;
  status: string;
  affected: string;
};

export async function GET(req: NextRequest) {
  const API_KEY = process.env.TREND_API_KEY;

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API key missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  try {
    const res = await fetch("https://api.xdr.trendmicro.com/v3.0/workbench/alerts", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const raw = await res.text();
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "TrendMicro API error", details: raw }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = JSON.parse(raw);
    const items: TrendMicroRawItem[] = data.items || data.data || [];

    const alerts: Alert[] = items.map((item) => {
      const indicators = Array.isArray(item.indicators) ? item.indicators : [];
      const filename = indicators.find((ind) => ind.type === "filename");
      const fullpath = indicators.find((ind) => ind.type === "fullpath");
      const ip = indicators.find((ind) => ind.type === "ip");

      const affected =
        filename?.value || fullpath?.value || ip?.value || item.description || "Unknown endpoint";

      return {
        type: item.model || item.type || "Unknown",
        time: item.createdDateTime || item.time || new Date().toISOString(),
        severity: item.severity || "low",
        status: item.status || item.investigationStatus || "Pending",
        affected,
      };
    });

    const filtered = alerts.filter((alert) => {
      const alertTime = new Date(alert.time);
      return (!fromDate || alertTime >= fromDate) && (!toDate || alertTime <= toDate);
    });

    return new Response(JSON.stringify({ alerts: filtered }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");

    console.error("❌ API Error:", err);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
