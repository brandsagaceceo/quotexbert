import type { FC } from "react";

interface CostRow {
  type: string;
  low: string;
  high: string;
}

interface CostTableProps {
  rows: CostRow[];
  title?: string;
  caption?: string;
}

const CostTable: FC<CostTableProps> = ({
  rows,
  title = "Renovation Cost Ranges",
  caption,
}) => (
  <section className="py-8">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
    {caption && (
      <p className="text-slate-600 mb-4 text-sm">{caption}</p>
    )}
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">
              Renovation Type
            </th>
            <th className="px-6 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">
              Low Estimate
            </th>
            <th className="px-6 py-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">
              High Estimate
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, idx) => (
            <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">{row.type}</td>
              <td className="px-6 py-4 text-emerald-700 font-semibold">{row.low}</td>
              <td className="px-6 py-4 text-rose-700 font-semibold">{row.high}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-xs text-slate-500 mt-3">
      * Prices are estimates based on Toronto and GTA market rates as of 2026. Actual costs depend on scope, finishes, and contractor availability.
    </p>
  </section>
);

export default CostTable;
