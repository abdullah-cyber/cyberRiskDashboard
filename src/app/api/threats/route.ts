export async function GET() {
  const API_KEY = process.env.TREND_API_KEY;
  console.log("🔑 API_KEY:", API_KEY);

  try {
    const response = await fetch("https://api.xdr.trendmicro.com/v2.0/xdr/dmm/models", {
      headers: {
        Authorization: `Bearer YOUR_API_KEY ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch threats from external API" }),
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log("✅ TrendMicro API Response:", data); // Log the raw data

    // For now, mock transformation into threatLog format
    const threatLog = [
      {
        type: "Malware",
        method: "Drive-by download",
        time: "Just now",
        severity: "High",
        status: "Blocked",
        affected: 1,
      },
      {
        type: "DDoS",
        method: "Network flood",
        time: "5 mins ago",
        severity: "Medium",
        status: "Mitigated",
        affected: 3,
      },
    ];

    return new Response(JSON.stringify(threatLog), { status: 200 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
