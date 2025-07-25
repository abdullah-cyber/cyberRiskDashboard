// pages/dashboard.tsx
'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
// import logo from "../public/images/image.png";
import { RefreshCcw } from "lucide-react";
import "../styles/dashboard.css";

import {
  RiskScoreCard,
  ThreatsCard,
  ThreatCategories,
  VulnerabilitiesCard,
  IncidentsResolvedCard,
  RealtimeDetection,
} from "./components";

import { IncidenceChart } from "./components/IncidenceChart";
import { ComplianceScore } from "./components/compliance-score";

export default function Dashboard() {
  const threatCategories = [
    { name: "Brute Force", percent: 34 },
    { name: "Malware", percent: 12 },
    { name: "DDoS", percent: 25 },
    { name: "Phishing", percent: 4 },
  ];

  const [threatLog, setThreatLog] = useState([
    {
    type: "Malware",
    method: "Drive-by download",
    time: "Just now",
    severity: "High",
    status: "Blocked",
    affected: 1
    },
  ]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newThreat = {
  //       type: ["Malware", "Phishing", "DDoS", "Brute Force"][
  //         Math.floor(Math.random() * 4)
  //       ],
  //       method: "Email attachment",
  //       time: "Just now",
  //       severity: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
  //       status: "Blocked",
  //       affected: Math.floor(Math.random() * 10 + 1),
  //     };
  //     setThreatLog((prev) => [newThreat, ...prev].slice(0, 5));
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

//   useEffect(() => {
//   const apiKey = process.env.NEXT_PUBLIC_DASHBOARD_API_KEY;

//   fetch("https://your-api.com/threats", {
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       // Save the result into threatLog
//       setThreatLog(data);
//     })
//     .catch((error) => {
//       console.error("Failed to fetch threats:", error);
//     });
// }, []);

// useEffect(() => {
//   const apiKey = process.env.NEXT_PUBLIC_DASHBOARD_API_KEY;

//   fetch("https://jsonplaceholder.typicode.com/posts")
//     .then((res) => res.json())
//     .then((data) => {
//       setThreatLog(
//         data.slice(0, 5).map((item: { id: any; }) => ({
//           type: "Phishing",
//           method: "Test API",
//           time: "Now",
//           severity: "Medium",
//           status: "Blocked",
//           affected: item.id,
//         }))
//       );
//     })
//     .catch((error) => {
//       console.error("Test fetch failed:", error);
//     });
// }, []);

// useEffect(() => {
//   const fetchThreats = async () => {
//     try {
//       const res = await fetch("/api/threats");
//       const data = await res.json();

//       if (Array.isArray(data)) {
//         setThreatLog(data);
//       } else if (Array.isArray(data?.threats)) {
//         setThreatLog(data.threats);
//       } else {
//         console.warn("Unexpected data format from /api/threats:", data);
//         setThreatLog([]); // Fallback to empty array
//       }
//     } catch (err) {
//       console.error("Failed to fetch threats:", err);
//       setThreatLog([]); // Fallback to empty array on error
//     }
//   };

//   fetchThreats();
// }, []);

useEffect(() => {
  const fetchThreats = async () => {
    try {
      const res = await fetch("/api/threats");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load threats");

      if (Array.isArray(data.threats)) {
        setThreatLog(data.threats);
      } else {
        console.warn("Unexpected format:", data);
        setThreatLog([]);
      }
    } catch (err: any) {
      console.error("Error:", err.message);
      setThreatLog([]);
    }
  };

  fetchThreats();
}, []);


  return (
    <div className="dashboard">
      <div className="flex justify-between items-center mb-4">
        <Image src= "/images/image.png" alt="Logo" width={128} height={64} />
        <h1 className="font-medium text-3xl">CyberRisk Dashboard</h1>
        <RefreshCcw />
      </div>

      <div className="grid">
        <RiskScoreCard />
        <ThreatsCard />
        <ThreatCategories categories={threatCategories} />
        <VulnerabilitiesCard />
        <IncidentsResolvedCard />
        <RealtimeDetection threatLog={threatLog} />
        <IncidenceChart data={undefined} />
        <ComplianceScore />
      </div>
    </div>
  );
}
