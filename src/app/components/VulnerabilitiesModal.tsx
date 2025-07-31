"use client";
import { Dialog } from "@headlessui/react";
import { useTenableVulnerabilities } from "../lib/vulnerabilities";

export default function VulnerabilitiesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useTenableVulnerabilities();

  const top10 = data?.vulnerabilities?.slice(0, 10) || [];

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Top 10 Latest Vulnerabilities
          </Dialog.Title>

          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error loading vulnerabilities.</p>
          ) : (
            <table className="w-full text-sm text-left border">
              <thead>
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Severity</th>
                  <th className="p-2 border">Count</th>
                </tr>
              </thead>
              <tbody>
                {top10.map((vuln, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{vuln.plugin_name}</td>
                    <td className="p-2 border text-red-600 font-semibold">{vuln.severity}</td>
                    <td className="p-2 border">{vuln.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
