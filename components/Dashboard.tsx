import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Bus, Translation } from '../types';
import { Activity, Bus as BusIcon, Ticket, Zap } from 'lucide-react';

interface DashboardProps {
  data: Bus[];
  t: Translation;
}

const getServiceColor = (serviceName: string) => {
  const lower = serviceName.toLowerCase();
  if (lower.includes('ev')) return '#10b981'; // Emerald 500 - Green for EV
  if (lower.includes('deluxe')) return '#ef4444'; // Red 500 - Red for Deluxe
  if (lower.includes('ordinary')) return '#ec4899'; // Pink 500 - Pink for Ordinary
  if (lower.includes('express')) return '#f59e0b'; // Amber 500 - Amber for Express
  if (lower.includes('ac')) return '#8b5cf6'; // Violet 500 - Purple for AC
  return '#3b82f6'; // Blue 500 - Default
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow h-full min-h-[110px]">
    <div className="flex justify-between items-start w-full mb-3">
      <div className={`p-2.5 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data, t }) => {
  const stats = useMemo(() => {
    return {
      total: data.length,
      electric: data.filter(b => ['AC(EV)', 'Deluxe(EV)'].includes(b.serviceType)).length,
      vidiyalPayanam: data.filter(b => b.serviceType === 'Ordinary' || b.serviceType === 'Small Bus (Ordinary)').length,
      ac: data.filter(b => b.isAC).length,
    };
  }, [data]);

  const serviceTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(b => {
      counts[b.serviceType] = (counts[b.serviceType] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Row: Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title={t.trackedFleet} 
          value={stats.total} 
          icon={<BusIcon className="text-blue-600" size={22} />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title={t.electricFleet} 
          value={stats.electric} 
          icon={<Zap className="text-emerald-600" size={22} />} 
          color="bg-emerald-50" 
        />
        <StatCard 
          title={t.vidiyalPayanam} 
          value={stats.vidiyalPayanam} 
          icon={<Ticket className="text-pink-600" size={22} />} 
          color="bg-pink-50" 
        />
        <StatCard 
          title={t.acBuses} 
          value={stats.ac} 
          icon={<Activity className="text-purple-600" size={22} />} 
          color="bg-purple-50" 
        />
      </div>

      {/* Bottom Row: Service Type Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[450px]">
        <h3 className="text-lg font-bold text-slate-800 mb-6">{t.serviceTypeDist}</h3>
        <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getServiceColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;