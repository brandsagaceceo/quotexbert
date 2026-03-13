interface CostRow {
  item: string;
  low: string;
  high: string;
  notes?: string;
}

interface CostTableProps {
  title?: string;
  rows: CostRow[];
}

export default function CostTable({ title = "Cost Breakdown", rows }: CostTableProps) {
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-rose-600 to-orange-600 text-white">
              <th className="text-left px-4 py-3 font-semibold">Item</th>
              <th className="text-left px-4 py-3 font-semibold">Low Estimate</th>
              <th className="text-left px-4 py-3 font-semibold">High Estimate</th>
              {rows.some((r) => r.notes) && (
                <th className="text-left px-4 py-3 font-semibold">Notes</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 font-medium text-gray-900">{row.item}</td>
                <td className="px-4 py-3 text-green-700 font-medium">{row.low}</td>
                <td className="px-4 py-3 text-rose-700 font-medium">{row.high}</td>
                {rows.some((r) => r.notes) && (
                  <td className="px-4 py-3 text-gray-500">{row.notes || "—"}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
