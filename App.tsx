
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FleetList from './components/FleetList';
import DepotBreakdown from './components/DepotBreakdown';
import ContractInfo from './components/ContractInfo';
import { Page, Bus } from './types';
import { CSV_FILE_URL, parseFleetData, TRANSLATIONS } from './constants';
import { Menu, Loader2, AlertTriangle, Languages } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  
  // Data State
  const [data, setData] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(CSV_FILE_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch fleet data: ${response.statusText}`);
        }
        const csvText = await response.text();
        const parsedData = parseFleetData(csvText);
        setData(parsedData);
      } catch (err) {
        console.error("Error loading fleet data:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={24} className="text-blue-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800">{t.loading}</h3>
            <p className="text-sm text-slate-500 mt-1">{t.fetching}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Data Load Error</h3>
          <p className="text-slate-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        t={t}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-slate-800">
              {currentPage === Page.DASHBOARD && t.dashboard}
              {currentPage === Page.FLEET_SEARCH && t.fleetSearch}
              {currentPage === Page.DEPOT_BREAKDOWN && t.depotBreakdown}
              {currentPage === Page.PTSC && t.ptsc}
              {currentPage === Page.GCC && t.gcc}
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden sm:block text-slate-600 font-semibold tracking-wide">
              {t.slogan}
            </div>
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <button 
              onClick={() => setLanguage(prev => prev === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-sm font-medium"
            >
              <Languages size={16} />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {currentPage === Page.DASHBOARD && <Dashboard data={data} t={t} />}
            {currentPage === Page.FLEET_SEARCH && <FleetList data={data} t={t} />}
            {currentPage === Page.DEPOT_BREAKDOWN && <DepotBreakdown data={data} t={t} />}
            {currentPage === Page.PTSC && <ContractInfo type="PTSC" language={language} t={t} />}
            {currentPage === Page.GCC && <ContractInfo type="GCC" language={language} t={t} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
