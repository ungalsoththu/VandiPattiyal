
import React, { useState, useMemo, useEffect } from 'react';
import { Bus, FilterState, Translation } from '../types';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface FleetListProps {
  data: Bus[];
  t: Translation;
}

const FleetList: React.FC<FleetListProps> = ({ data, t }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    depot: '',
    serviceType: '',
  });

  const [sortConfig, setSortConfig] = useState<{ key: keyof Bus; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Reset to first page when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig, itemsPerPage]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(bus => 
        bus.registrationNumber.toLowerCase().includes(q) ||
        bus.fleetNumber.toLowerCase().includes(q) ||
        bus.make.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filters.depot) result = result.filter(bus => bus.depot === filters.depot);
    if (filters.serviceType) result = result.filter(bus => bus.serviceType === filters.serviceType);

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const valA: any = a[sortConfig.key];
        const valB: any = b[sortConfig.key];

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueDepots = useMemo(() => Array.from(new Set(data.map(b => b.depot))).sort(), [data]);
  const uniqueServices = useMemo(() => Array.from(new Set(data.map(b => b.serviceType))).sort(), [data]);

  const handleSort = (key: keyof Bus) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', depot: '', serviceType: '' });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <select 
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
            value={filters.depot}
            onChange={(e) => setFilters(prev => ({ ...prev, depot: e.target.value }))}
          >
            <option value="">{t.allDepots}</option>
            {uniqueDepots.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
            value={filters.serviceType}
            onChange={(e) => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
          >
            <option value="">{t.allServices}</option>
            {uniqueServices.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {(filters.search || filters.depot || filters.serviceType) && (
            <button 
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('fleetNumber')}>
                  <div className="flex items-center gap-1">
                    {t.fleetNumber}
                    <ArrowUpDown size={14} className="text-slate-400" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('registrationNumber')}>
                  <div className="flex items-center gap-1">
                    {t.regNumber}
                    <ArrowUpDown size={14} className="text-slate-400" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('depot')}>
                  <div className="flex items-center gap-1">
                    {t.depot}
                    <ArrowUpDown size={14} className="text-slate-400" />
                  </div>
                </th>
                <th className="p-4">{t.makeModel}</th>
                <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('serviceType')}>
                  <div className="flex items-center gap-1">
                    {t.service}
                    <ArrowUpDown size={14} className="text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((bus) => (
                  <tr key={bus.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 font-mono font-medium text-slate-900">{bus.fleetNumber}</td>
                    <td className="p-4 font-bold text-slate-800">{bus.registrationNumber}</td>
                    <td className="p-4">{bus.depot}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{bus.make}</span>
                        <span className="text-xs text-slate-400">{bus.model}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${bus.isAC 
                          ? 'bg-purple-50 text-purple-700 border-purple-100' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'}
                      `}>
                        {bus.serviceType}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="bg-white border-t border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span>{t.showing} <span className="font-bold text-slate-900">{paginatedData.length}</span> {t.of} <span className="font-bold text-slate-900">{filteredData.length}</span> {t.vehicles}</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="ml-4 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
            >
              <option value={25}>25 {t.rowsPerPage}</option>
              <option value={50}>50 {t.rowsPerPage}</option>
              <option value={100}>100 {t.rowsPerPage}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={t.previous}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-medium px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={t.next}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetList;
