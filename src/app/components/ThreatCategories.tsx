import { Card } from "./ui/card";
import { ShieldAlert } from "lucide-react"; // Example icon — you can change it

interface ThreatCategory {
  name: string;
  percent: number;
}

interface ThreatCategoriesProps {
  categories: ThreatCategory[];
}

export function ThreatCategories({ categories }: ThreatCategoriesProps) {
  return (
    <Card
      title="Threat Categories"
      icon={
        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
          <ShieldAlert className="w-5 h-5" />
        </div>
      }
      extra={<span className="text-sm text-gray-500">Last 24h</span>}
    >
      <div className="categories-grid space-y-3">
        {categories.map((item, i) => (
          <div key={i} className="category-row flex items-center gap-2">
            <span className="label w-24 text-sm font-medium">{item.name}</span>
            <div className="bar-wrapper flex-1 h-2 bg-gray-200 rounded">
              <div
                className="bar-fill h-2 bg-blue-500 rounded"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className="percent w-10 text-right text-sm">{item.percent}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
