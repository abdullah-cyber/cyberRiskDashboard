import { Card } from "./ui/card";

export function ThreatCategories({ categories }) {
  return (
    <Card title="Threat Categories">
      <div className="categories-grid">
        {categories.map((item, i) => (
          <div key={i} className="category-row">
            <span className="label">{item.name}</span>
            <div className="bar-wrapper">
              <div
                className="bar-fill"
                style={{ width: item.percent + "%" }}
              ></div>
            </div>
            <span className="percent">{item.percent}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
