import React, { useMemo, useState } from 'react';
import { Bus, Translation } from '../types';
import { ArrowUpDown, Building2 } from 'lucide-react';

interface DepotBreakdownProps {
  data: Bus[];
  t: Translation;
}

const DepotBreakdown: React.FC<DepotBreakdownProps> = ({ data, t }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'total', direction: 'desc' });

  const depotPivot = useMemo(() => {
    const types = new Set<string>();
    const depotMap: Record<string, { total: number; counts: Record<string, number> }> = {};
    const columnTotals: Record<string, number> = {};

    data.forEach((bus) => {
      types.add(bus.serviceType);
      
      // Depot Rows
      if (!depotMap[bus.depot]) {
        depotMap[bus.depot] = { total: 0, counts: {} };
      }
      depotMap[bus.depot].counts[bus.serviceType] = (depotMap[bus.depot].counts[bus.serviceType] || 0) + 1;
      depotMap[bus.depot].total += 1;

      // Column Totals
      columnTotals[bus.serviceType] = (columnTotals[bus.serviceType] || 0) + 1;
    });

    const sortedTypes = Array.from(types).sort();
    const rawData = Object.keys(depotMap).map(depot => ({
      name: depot,
      counts: depotMap[depot].counts,
      total: depotMap[depot].total
    }));

    return {
      serviceTypes: sortedTypes,
      tableData: rawData,
      columnTotals,
      grandTotal: data.length
    };
  }, [data]);

  const sortedTableData = useMemo(() => {
    const sorted = [...depotPivot.tableData].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      if (sortConfig.key === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortConfig.key === 'total') {
        aValue = a.total;
        bValue = b.total;
      } else {
        aValue = a.counts[sortConfig.key] || 0;
        bValue = b.counts[sortConfig.key] || 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [depotPivot.tableData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{t.depotFleetBreakdown}</h3>
            <p className="text-sm text-slate-500 mt-1">{t.breakdownSubtitle}</p>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 self-start sm:self-center">
            <Building2 size={24} />
          </div>
        </div>
        
        <div className="overflow-x-auto border border-slate-200 rounded-xl relative">
          <table className="w-full text-left text-sm text-slate-600 border-collapse min-w-max">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th 
                  className="px-3 py-2 border-b border-slate-200 min-w-[140px] bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors select-none group sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    {t.depotName}
                    <ArrowUpDown size={14} className={`text-slate-400 ${sortConfig.key === 'name' ? 'text-blue-600' : 'opacity-0 group-hover:opacity-100'}`} />
                  </div>
                </th>
                {depotPivot.serviceTypes.map(type => (
                  <th 
                    key={type} 
                    className="px-2 py-2 border-b border-slate-200 text-right whitespace-nowrap bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors select-none group min-w-[80px]"
                    onClick={() => handleSort(type)}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {type}
                      <ArrowUpDown size={14} className={`text-slate-400 ${sortConfig.key === type ? 'text-blue-600' : 'opacity-0 group-hover:opacity-100'}`} />
                    </div>
                  </th>
                ))}
                <th 
                  className="px-2 py-2 border-b border-slate-200 text-right font-bold bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors select-none group min-w-[80px] sticky right-0 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center justify-end gap-1">
                    {t.total}
                    <ArrowUpDown size={14} className={`text-slate-400 ${sortConfig.key === 'total' ? 'text-blue-600' : 'opacity-0 group-hover:opacity-100'}`} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTableData.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2 font-medium text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-0">{row.name}</td>
                  {depotPivot.serviceTypes.map(type => (
                    <td key={type} className="px-2 py-2 text-right border-l border-slate-50 bg-inherit">
                      {row.counts[type] ? (
                        <span className="text-slate-700 font-medium">{row.counts[type]}</span>
                      ) : (
                        <span className="text-slate-200">-</span>
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-2 text-right font-bold text-slate-900 bg-slate-50/50 sticky right-0 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-0">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-200">
              <tr>
                <td className="px-3 py-2 sticky left-0 bg-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">{t.grandTotal}</td>
                {depotPivot.serviceTypes.map(type => (
                  <td key={type} className="px-2 py-2 text-right border-l border-slate-200/50">
                    {depotPivot.columnTotals[type] || 0}
                  </td>
                ))}
                <td className="px-2 py-2 text-right text-blue-700 sticky right-0 bg-slate-100 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                  {depotPivot.grandTotal}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepotBreakdown;