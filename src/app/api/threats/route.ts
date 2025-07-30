export async function GET() {
  const API_KEY = process.env.TREND_API_KEY;

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API key missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch("https://api.xdr.trendmicro.com/v3.0/workbench/alerts", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const raw = await res.text(); // Grab raw text for debugging
    // console.log("🔍 Raw TrendMicro response:", raw);

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "TrendMicro API error", details: raw }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = JSON.parse(raw); // Safely parse now
    const alerts = (data.items || data.data || []).map((item: any) => {
      const indicators = Array.isArray(item.indicators) ? item.indicators : [];
      const filenameIndicator = indicators.find((ind: any) => ind.type === "filename");
      const fullpathIndicator = indicators.find((ind: any) => ind.type === "fullpath");
      const ipIndicator = indicators.find((ind: any) => ind.type === "ip");

      const affected =
        filenameIndicator?.value ||
        fullpathIndicator?.value ||
        ipIndicator?.value ||
        item.description ||
        "Unknown endpoint";

      return {
        type: item.model || item.type || "Unknown",
        time: item.createdDateTime || item.time || new Date().toISOString(),
        severity: item.severity || "low",
        status: item.status || item.investigationStatus || "Pending",
        affected,
      };
    });

    return new Response(JSON.stringify({ alerts }), {
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
