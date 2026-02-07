"use client";
import { Dialog } from "@headlessui/react";
import { useTenableVulnerabilities } from "../lib/vulnerabilities";

type Vulnerability = {
  plugin_name: string;
  severity: string;
  count: number;
  [key: string]: any;
};

function severityColor(severity: unknown) {
  if (typeof severity !== "string") {
    return "bg-gray-300 text-gray-700";
  }
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-gradient-to-r from-red-700 to-red-500 text-white";
    case "high":
      return "bg-gradient-to-r from-orange-600 to-orange-400 text-white";
    case "medium":
      return "bg-gradient-to-r from-yellow-400 to-yellow-200 text-gray-900";
    case "low":
      return "bg-gradient-to-r from-blue-400 to-blue-200 text-white";
    default:
      return "bg-gray-300 text-gray-700";
  }
}

function rowBorder(severity: string) {
  if (typeof severity !== "string") {
    return "bg-gray-300 text-gray-300";
  }
  switch (severity?.toLowerCase()) {
    case "critical":
      return "border-l-4 border-red-600";
    case "high":
      return "border-l-4 border-orange-500";
    case "medium":
      return "border-l-4 border-yellow-400";
    case "low":
      return "border-l-4 border-blue-400";
    default:
      return "border-l-4 border-gray-300";
  }
}

export default function VulnerabilitiesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useTenableVulnerabilities();
  const top10: Vulnerability[] = data?.vulnerabilities?.slice(0, 10) || [];

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-gradient-to-br from-red-100 via-white to-blue-100 bg-opacity-80 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white/90 backdrop-blur-lg p-8 rounded-2xl max-w-3xl w-full shadow-2xl border border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors text-2xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>
          <Dialog.Title className="text-2xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Top 10 Latest Vulnerabilities
          </Dialog.Title>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></span>
              <span className="ml-4 text-gray-500">Loading...</span>
            </div>
          ) : isError ? (
            <div className="text-center text-red-600 py-8 font-semibold">
              Error loading vulnerabilities.
            </div>
          ) : top10.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No vulnerabilities found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-inner">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <th className="p-3 font-semibold text-gray-700">Name</th>
                    <th className="p-3 font-semibold text-gray-700">
                      Severity
                    </th>
                    <th className="p-3 font-semibold text-gray-700">Count</th>
                    <th className="p-3 font-semibold text-gray-700">State</th>
                  </tr>
                </thead>
                <tbody>
                  {top10.map((vuln, i) => (
                    <tr
                      key={vuln.plugin_name + i}
                      className={`hover:bg-red-50 transition-colors ${rowBorder(vuln.severity)}`}
                    >
                      <td className="p-3 border-t border-gray-100 font-medium text-gray-800">
                        {vuln.plugin_name}
                      </td>
                      <td className="p-3 border-t border-gray-100">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow ${severityColor(vuln.severity)}`}
                        >
                          {vuln.severity}
                        </span>
                      </td>
                      <td className="p-3 border-t border-gray-100 text-center">
                        <span className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-semibold text-gray-700 shadow">
                          {vuln.count}
                        </span>
                      </td>
                      <td className="p-3 border-t border-gray-100 text-center">
                        <span className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-semibold text-gray-700 shadow">
                          {vuln.vulnerability_state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
