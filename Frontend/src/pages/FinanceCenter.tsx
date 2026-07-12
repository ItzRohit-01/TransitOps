import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface VehicleProfitability {
  id: string;
  name: string;
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
}

interface RoutePerformance {
  route: string;
  revenue: number;
  cost: number;
  profit: number;
  efficiency: string;
}

export const FinanceCenter: React.FC = () => {
  // Loading state for report exports
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [successReport, setSuccessReport] = useState<string | null>(null);

  // Activity feed timeline
  const [activities, setActivities] = useState<string[]>([
    '15:02 PM - Fuel log added: V-109 (100L, $200)',
    '14:40 PM - ROI recalculated for operational fleet routes',
    '13:10 PM - Toll expenses recorded for Route CHI-DET',
    '11:45 AM - Financial Report exported: Q2 Profit Margin Analysis'
  ]);

  // Vehicle Profitability Table Data
  const vehiclesProfit: VehicleProfitability[] = [
    { id: 'V-105', name: 'Volvo VNL 640', revenue: 42000, cost: 26000, profit: 16000, roi: 61.5 },
    { id: 'V-118', name: 'Kenworth T680', revenue: 35000, cost: 23000, profit: 12000, roi: 52.1 },
    { id: 'V-202', name: 'Freightliner C-12', revenue: 58000, cost: 32000, profit: 26000, roi: 81.25 }, // Highest ROI
    { id: 'V-305', name: 'Peterbilt 579', revenue: 15000, cost: 18000, profit: -3000, roi: -16.6 }, // Lowest ROI
    { id: 'V-109', name: 'Mack Anthem', revenue: 48000, cost: 29000, profit: 19000, roi: 65.5 }
  ];

  // Route Performance Data
  const routesPerformance: RoutePerformance[] = [
    { route: 'CHI ➜ DET', revenue: 124000, cost: 72000, profit: 52000, efficiency: '92.4%' }, // Top Performing
    { route: 'AUS ➔ HOU', revenue: 84000, cost: 58000, profit: 26000, efficiency: '78.2%' },
    { route: 'DEN ➜ SLC', revenue: 98000, cost: 86000, profit: 12000, efficiency: '64.5%' } // Lowest Performance
  ];

  // Forecast Predictive values
  const forecasts = [
    { type: 'Revenue Forecast', current: '$4.2M', nextMonth: '$4.6M', trend: '+9.5%' },
    { type: 'Expense Forecast', current: '$2.8M', nextMonth: '$2.9M', trend: '+3.5%' },
    { type: 'Profit Forecast', current: '$1.4M', nextMonth: '$1.7M', trend: '+21.4%' },
    { type: 'ROI Forecast', current: '18%', nextMonth: '19.2%', trend: '+6.6%' }
  ];

  // Monthly financial overview charts data
  const monthlyData = [
    { name: 'Jan', Revenue: 320000, Expenses: 220000, Profit: 100000 },
    { name: 'Feb', Revenue: 350000, Expenses: 240000, Profit: 110000 },
    { name: 'Mar', Revenue: 290000, Expenses: 200000, Profit: 90000 },
    { name: 'Apr', Revenue: 400000, Expenses: 260000, Profit: 140000 },
    { name: 'May', Revenue: 380000, Expenses: 250000, Profit: 130000 },
    { name: 'Jun', Revenue: 420000, Expenses: 280000, Profit: 140000 }
  ];

  // Dynamic Trigger for Export
  const triggerExport = (reportName: string) => {
    setExportingType(reportName);
    setSuccessReport(null);
    setTimeout(() => {
      setExportingType(null);
      setSuccessReport(`Successfully exported ${reportName} to CSV!`);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setActivities(prev => [`${timeStr} - Report generated: ${reportName}`, ...prev]);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Title Header with Subtitle */}
        <section>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Financial Intelligence Center</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Monitor revenue margins, expense breakdowns, vehicle profitability, and operational ROI forecasts across the global fleet.
          </p>
        </section>

        {/* Stats Row KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Total Revenue</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">$4.2M</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-1">📈 +12% MoM</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Total Expenses</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">$2.8M</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-1">📈 +4% MoM</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm border-l-4 border-l-emerald-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Net Profit</span>
            <span className="text-3xl font-black text-emerald-500 font-outfit">$1.4M</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-1">📈 +18% MoM</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Fleet ROI</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">18%</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-1">📈 +2.1% YTD</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Cost / KM</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">$1.12</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-1">📉 -0.05 efficiency</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Fuel Spend</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">$840k</span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-1">📉 -1.5% consumption</span>
          </div>
        </section>

        {/* Dynamic exports status alerts */}
        {exportingType && (
          <div className="bg-slate-900 border border-slate-800 text-white text-xs font-semibold p-4 rounded-xl flex items-center gap-2.5 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block animate-ping" />
            <span>Generating {exportingType} data stream. Please wait...</span>
          </div>
        )}

        {successReport && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-xl flex items-center gap-2.5 animate-fadeIn">
            <span className="text-emerald-500 font-extrabold">✓</span>
            <span>{successReport}</span>
          </div>
        )}

        {/* Revenue, Expenses, and Profitability Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Revenue and Expense overview chart */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-4">Revenue & Expenses Overview</span>
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#0B132B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Trends line chart */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-4">Profitability & Margin Trends</span>
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Profit" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </section>

        {/* Vehicle Profitability Table & Route Performance */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Vehicle Profitability Table (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">Vehicle Profitability & ROI Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">VEHICLE</th>
                    <th className="pb-3 text-right">REVENUE</th>
                    <th className="pb-3 text-right">OPERATING COST</th>
                    <th className="pb-3 text-right">NET PROFIT</th>
                    <th className="pb-3 text-right">ROI (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {vehiclesProfit.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50">
                      <td className="py-4 font-black text-slate-900">
                        {v.name} <span className="text-[9px] text-slate-400 font-bold block">{v.id}</span>
                      </td>
                      <td className="py-4 text-right">${v.revenue.toLocaleString()}</td>
                      <td className="py-4 text-right text-slate-550">${v.cost.toLocaleString()}</td>
                      <td className="py-4 text-right font-bold text-slate-800">${v.profit.toLocaleString()}</td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                          v.roi > 75 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          v.roi < 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-650'
                        }`}>
                          {v.roi}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Route Performance and Top Highlights (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Route Performance</h3>
            <div className="space-y-4 text-xs font-semibold text-slate-700">
              {routesPerformance.map((route, idx) => (
                <div key={idx} className="border border-slate-100 bg-slate-50/30 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-950">{route.route}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      idx === 0 ? 'bg-emerald-50 text-emerald-600' :
                      idx === 2 ? 'bg-rose-50 text-rose-600' : 'bg-slate-150 text-slate-600'
                    }`}>
                      Efficiency: {route.efficiency}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Revenue: ${route.revenue.toLocaleString()}</span>
                    <span>Cost: ${route.cost.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Fuel & Maintenance & Predictive Forecast Center */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Predictive Forecasting Center (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">Predictive Forecasting Center (Next Month)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              {forecasts.map((f, idx) => (
                <div key={idx} className="border border-slate-100 bg-slate-50/50 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">{f.type}</span>
                    <span className="text-sm font-black text-slate-900 font-outfit mt-1 block">{f.current} ➔ {f.nextMonth}</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600">{f.trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Center (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Financial Risk Alerts</h3>
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="border border-rose-100 bg-rose-50/50 rounded-xl p-3 flex gap-2.5">
                <span className="text-rose-500 shrink-0">⚠️</span>
                <div>
                  <h4 className="text-slate-900 font-bold">Rising Fuel Costs</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Average fuel costs rose 3.5% this week in I-94 region corridor corridor.</p>
                </div>
              </div>

              <div className="border border-rose-100 bg-rose-50/50 rounded-xl p-3 flex gap-2.5">
                <span className="text-rose-500 shrink-0">⚠️</span>
                <div>
                  <h4 className="text-slate-900 font-bold">Negative ROI Vehicle</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Vehicle V-305 shows -16.6% ROI. Maintenance spend exceeds bounds.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Reports Center & Activity Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Reports Export Actions (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Reports Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
              <button 
                onClick={() => triggerExport('Cost Analysis Reports')}
                className="border border-slate-200 hover:bg-slate-50 py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-between px-4"
              >
                <span>📊 Cost Analysis Reports</span>
                <span>➔</span>
              </button>

              <button 
                onClick={() => triggerExport('ROI Metrics Report')}
                className="border border-slate-200 hover:bg-slate-50 py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-between px-4"
              >
                <span>📈 ROI Metrics Report</span>
                <span>➔</span>
              </button>

              <button 
                onClick={() => triggerExport('Q2 Financial Forecast')}
                className="border border-slate-200 hover:bg-slate-50 py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-between px-4"
              >
                <span>🔮 Predictive Forecast</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          {/* Activity Feed (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Activity timeline</h3>
            <div className="space-y-4 text-[10px] font-bold text-slate-500 pl-3 relative border-l border-slate-200/60">
              {activities.map((log, idx) => (
                <div key={idx} className="relative pl-3">
                  <span className="absolute -left-[16px] top-1 w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};
