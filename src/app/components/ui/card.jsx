export function Card({ title, icon, children, extra }) {
  return (
    <div className="flex justify-between flex-col border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between gap-2">
        <h2 className=" font-lg font-semibold">{title}</h2>
        {icon}
      </div>
      {children}
      <span className=" self-start text-neutral-300 text-sm">{extra}</span>
    </div>
  );
}
