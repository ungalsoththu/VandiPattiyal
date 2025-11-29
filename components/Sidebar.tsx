
import React from 'react';
import { LayoutDashboard, Bus, X, Building2, Calendar, FileText, Briefcase } from 'lucide-react';
import { Page, Translation } from '../types';
import { LAST_UPDATED } from '../constants';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  t: Translation;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, setIsOpen, t }) => {
  const navItems = [
    { id: Page.DASHBOARD, label: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { id: Page.FLEET_SEARCH, label: t.fleetSearch, icon: <Bus size={20} /> },
    { id: Page.DEPOT_BREAKDOWN, label: t.depotBreakdown, icon: <Building2 size={20} /> },
  ];

  const educationItems = [
    { id: Page.PTSC, label: t.ptsc, icon: <FileText size={20} /> },
    { id: Page.GCC, label: t.gcc, icon: <Briefcase size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full shadow-xl
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg text-slate-900">
              <Bus size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">{t.appTitle}</h1>
              <p className="text-xs text-slate-400">{t.appSubtitle}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${currentPage === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Models</p>
          </div>

          {educationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${currentPage === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">{t.lastUpdatedLabel}</span>
            </div>
            <div className="text-sm font-bold text-slate-200 pl-7">
              {LAST_UPDATED}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
