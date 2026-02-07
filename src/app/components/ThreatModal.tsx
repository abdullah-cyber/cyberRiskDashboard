import { X } from "lucide-react";
import React from "react";
import { Threat } from "../types/threats";

// Define the structure of a threat object

// Define props for the component
interface ThreatModalProps {
  threat: Threat;
  onClose: () => void;
}

export default function ThreatModal({ threat, onClose }: ThreatModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Threat Details</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Model:</strong> {threat.type}
          </p>
          <p>
            <strong>Time:</strong>
            {threat.time === "Unknown"
              ? "Unknown"
              : new Date(threat.time).toLocaleString()}
          </p>

          <p>
            <strong>Severity:</strong> {threat.severity}
          </p>
          <p>
            <strong>Status:</strong> {threat.status}
          </p>
          <p>
            <strong>Summary:</strong> {threat.affected}
          </p>
        </div>
      </div>
    </div>
  );
}
