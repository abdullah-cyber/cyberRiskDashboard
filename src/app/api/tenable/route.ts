//route.ts
// // /src/app/api/tenable/route.ts
// import { NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   const accessKey = process.env.TENABLE_ACCESS_KEY;
//   const secretKey = process.env.TENABLE_SECRET_KEY;

//   const baseUrl = process.env.TENABLE_API_URL || "https://cloud.tenable.com";

//   if (!accessKey || !secretKey) {
//     return new Response(JSON.stringify({ error: "Tenable API keys missing" }), {
//       status: 401,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   try {
//    const res = await fetch(`${baseUrl}/workbenches/vulnerabilities`, {
//   headers: {
//     Accept: "application/json",
//     "X-ApiKeys": `accessKey=${accessKey}; secretKey=${secretKey}`,
//   },
// });

// const rawData = await res.json();

// if (!res.ok) {
//   return new Response(
//     JSON.stringify({ error: "Tenable API error", details: rawData }),
//     { status: res.status, headers: { "Content-Type": "application/json" } }
//   );
// }

// // console.log("🔍 RAW DATA FROM TENABLE:", rawData);

// return new Response(JSON.stringify(rawData), {
//   status: 200,
//   headers: { "Content-Type": "application/json" },
// });

//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: "Unexpected error", details: err instanceof Error ? err.message : String(err) }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const accessKey = process.env.TENABLE_ACCESS_KEY;
  const secretKey = process.env.TENABLE_SECRET_KEY;
  const baseUrl = process.env.TENABLE_API_URL || "https://cloud.tenable.com";

  if (!accessKey || !secretKey) {
    return new Response(JSON.stringify({ error: "Tenable API keys missing" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(`${baseUrl}/workbenches/vulnerabilities`, {
      headers: {
        Accept: "application/json",
        "X-ApiKeys": `accessKey=${accessKey}; secretKey=${secretKey}`,
      },
    });

    const rawData = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Tenable API error", details: rawData }),
        { status: res.status, headers: { "Content-Type": "application/json" } },
      );
    }

    // Log the raw data for debugging
    console.log("🔍 RAW DATA FROM TENABLE:", rawData);

    return new Response(JSON.stringify(rawData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Tenable API error:", err);
    return new Response(
      JSON.stringify({
        error: "Unexpected error",
        details: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
