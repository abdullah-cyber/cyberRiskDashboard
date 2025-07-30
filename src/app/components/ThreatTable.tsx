import React, { JSX } from "react";
import { Threat } from "../types/threats";


type ThreatTableProps = {
  threats: Threat[];
  isLoading: boolean;
  error: Error | null; // <-- updated!
  onRowClick: (threat: Threat) => void;
};

export default function ThreatTable({
  threats,
  isLoading,
  error,
  onRowClick,
}: ThreatTableProps): JSX.Element {
  return (
    <div className="overflow-y-auto overflow-x-hidden flex-1">
      <table className="w-full text-sm text-left border-collapse table-fixed">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="py-2 px-4 font-medium border-b">Model</th>
            <th className="py-2 px-4 font-medium border-b">Time</th>
            <th className="py-2 px-4 font-medium border-b">Severity</th>
            <th className="py-2 px-4 font-medium border-b">Status</th>
            <th className="py-2 px-4 font-medium border-b">Summary</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-red-500">
                Error loading threats
              </td>
            </tr>
          ) : threats.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">
                No threats found.
              </td>
            </tr>
          ) : (
            threats.map((t, i) => (
              <tr
                key={i}
                onClick={() => onRowClick(t)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-2 px-4 truncate">{t.type}</td>
                <td className="py-2 px-4 truncate">
                  {new Date(t.time).toISOString().replace("T", " ").slice(0, 19)}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${
                      t.severity === "high"
                        ? "bg-red-500"
                        : t.severity === "medium"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  >
                    {t.severity}
                  </span>
                </td>
                <td className="py-2 px-4">{t.status}</td>
                <td className="py-2 px-4 truncate">{t.affected}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
