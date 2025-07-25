import { Search } from "lucide-react";
import { Card } from "./ui/card";

export function RealtimeDetection({ threatLog }) {
  return (
    <div className="realtime span-rows relative">
      <div className="dropdown-card">
        <select
          className="dropdown"
          onChange={(e) => console.log("Selected:", e.target.value)}
        >
          <option value="">Select filter</option>
          <option value="malware">Malware</option>
          <option value="phishing">Phishing</option>
          <option value="ddos">DDoS</option>
          <option value="brute-force">Brute Force</option>
        </select>
      </div>

      <Card title="Realtime Threat Detection" icon={<Search />}>
        <table>
          <thead>
            <tr>
              <th className="th-type">Type</th>
              <th className="th-method">Method</th>
              <th className="th-time">Time</th>
              <th className="th-severity">Severity</th>
              <th className="th-status">Status</th>
              <th className="th-affected">Affected</th>
            </tr>
          </thead>
          <tbody>
            {threatLog.map((t, i) => (
              <tr key={i}>
                <td>{t.type}</td>
                <td>{t.time}</td>
                <td className={t.severity.toLowerCase()}>{t.severity}</td>
                <td className="status-cell">{t.status}</td>
                <td className="affected-cell">{t.affected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
