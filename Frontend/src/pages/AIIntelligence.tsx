import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const AIIntelligence: React.FC = () => {
  // Predictive Financial Forecast chart data
  const forecastData = [
    { name: 'Mon', Revenue: 2.8, Expenses: 1.8 },
    { name: 'Tue', Revenue: 3.4, Expenses: 2.1 },
    { name: 'Wed', Revenue: 3.0, Expenses: 1.9 },
    { name: 'Thu', Revenue: 4.1, Expenses: 2.3 },
    { name: 'Fri (Exp)', Revenue: 4.5, Expenses: 2.4 },
    { name: 'Sat (Est)', Revenue: 3.6, Expenses: 2.0 },
    { name: 'Sun (Est)', Revenue: 3.2, Expenses: 1.7 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Title & Subtitle */}
        <section>
          <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <span>✨ INTELLIGENT OPERATIONS</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">AI Intelligence Center</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Monitor predictive insights, operational risks, optimization opportunities, and fleet intelligence generated across the organization.
          </p>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Active AI Insights */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Active AI Insights</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 font-outfit">124</span>
              <span className="text-[9px] text-emerald-500 font-bold">~12% 📈</span>
            </div>
          </div>

          {/* Optimization Opps */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Optimization Opps</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 font-outfit">32</span>
              <span className="text-[9px] text-indigo-500 font-bold">Priority</span>
            </div>
          </div>

          {/* Risk Alerts */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Risk Alerts</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-rose-500 font-outfit">08</span>
              <span className="text-[9px] text-rose-500 font-bold">-2 📉</span>
            </div>
          </div>

          {/* Predicted Maintenance */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Predicted Maintenance</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 font-outfit">15</span>
              <span className="text-[9px] text-slate-400 font-bold">📋</span>
            </div>
          </div>

          {/* Potential Savings */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Potential Savings</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 font-outfit">$42.8k</span>
              <span className="text-[9px] text-emerald-500 font-bold">Monthly</span>
            </div>
          </div>

          {/* AI Confidence */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">AI Confidence</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 font-outfit">98.2%</span>
              <span className="text-[9px] text-blue-500 font-bold">Verified</span>
            </div>
          </div>
        </section>

        {/* Neural Network Prediction & Intelligence Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Neural Net Prediction (Left 8 cols) */}
          <div className="lg:col-span-8 bg-[#111827] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-outfit font-extrabold text-slate-200 text-sm">Fuel Usage Prediction</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">
                    Proprietary neural networks analyze sensor data from 450 vehicles to predict system failures before they occur.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-slate-900">
                  <span className="text-lg font-black text-slate-200 leading-none">92</span>
                  <span className="text-[7px] text-slate-400 font-bold tracking-wider mt-0.5 uppercase">Excellent</span>
                </div>
              </div>

              {/* Multi-stat grid */}
              <div className="grid grid-cols-4 gap-4 bg-slate-900/60 border border-slate-800/40 rounded-xl p-4 mb-6 text-center text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block">Operational Efficiency</span>
                  <span className="font-extrabold text-slate-200 mt-1 block">88.4%</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block">Predicted Monthly ROI</span>
                  <span className="font-extrabold text-emerald-400 mt-1 block">+$12.5k</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block">Risk Level Assessment</span>
                  <span className="font-extrabold text-emerald-400 mt-1 block">● Low</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block">Next Forecast Update</span>
                  <span className="font-extrabold text-slate-200 mt-1 block">14m 20s</span>
                </div>
              </div>

              {/* Sub-cards */}
              <div className="space-y-3">
                <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-3.5 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <h4 className="font-black text-slate-200">Vehicle V-12: Engine Cooling Anomaly</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Requires service within 320 km</p>
                  </div>
                  <span className="text-amber-500 font-black">94% Confidence</span>
                </div>

                <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-3.5 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <h4 className="font-black text-slate-200">Truck-18: Front Tire Replacement</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Predicted in 14 days based on wear analysis</p>
                  </div>
                  <span className="text-emerald-500 font-black">88% Confidence</span>
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence Feed & Risk Detection Center (Right 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Feed */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Intelligence Feed</h3>
                  <button className="text-slate-400 hover:text-slate-650">•••</button>
                </div>
                <div className="space-y-3.5 text-[11px] font-semibold text-slate-600">
                  <div>
                    <p className="text-slate-800 font-bold">New maintenance prediction generated</p>
                    <span className="text-[10px] text-slate-400">V-12 cooling anomaly • 2 mins ago</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">Route optimization successful</p>
                    <span className="text-[10px] text-slate-400">Saved 12.4 gallons on Route 888 • 1h ago</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">Anomalous expense detected</p>
                    <span className="text-[10px] text-slate-400">Unusual fuel purchase at Station #42 • 3h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Detection */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Risk Detection Center</h3>
              <div className="grid grid-cols-2 gap-3 text-center text-xs font-black">
                <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3">
                  <span className="text-[9px] text-rose-400 block font-bold mb-1">COMPLIANCE</span>
                  Critical
                </div>
                <div className="bg-amber-50 border border-amber-100 text-amber-600 rounded-xl p-3">
                  <span className="text-[9px] text-amber-400 block font-bold mb-1">SAFETY</span>
                  Elevated
                </div>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl p-3">
                  <span className="text-[9px] text-emerald-400 block font-bold mb-1">OPERATIONAL</span>
                  Stable
                </div>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl p-3">
                  <span className="text-[9px] text-emerald-400 block font-bold mb-1">FINANCIAL</span>
                  Secure
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* AI Recommendations Feed & Operational Intelligence */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recommendations Feed (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">AI Recommendations Feed</h3>
              <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">3 High Priority</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="border border-slate-150 rounded-2xl p-4.5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black px-2 py-0.5 bg-rose-50 text-rose-600 rounded border border-rose-100">HIGH</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Reassign Vehicle V-12</h4>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed mt-1">
                    Immediate reassignment to local routes recommended to mitigate cooling risk until service.
                  </p>
                </div>
                <button className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-2 rounded-xl transition-all">
                  Apply Now
                </button>
              </div>

              {/* Card 2 */}
              <div className="border border-slate-150 rounded-2xl p-4.5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">MEDIUM</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Schedule Maintenance for Truck-18</h4>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed mt-1">
                    Auto-schedule tire replacement at central hub during next scheduled downtime.
                  </p>
                </div>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition-all border border-slate-200">
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Operational Intelligence (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Operational Intelligence</h3>
            <div className="space-y-4 text-xs font-semibold text-slate-650">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-800">Underutilized Assets</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">12 vehicles at South Hub idle &gt; 48h</p>
                </div>
                <span className="text-sm font-black text-slate-900 font-outfit">12</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-800">Overutilized Vehicles</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">8 long-haul trucks exceeding usage norms</p>
                </div>
                <span className="text-sm font-black text-slate-900 font-outfit">8</span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800">Dispatch Bottlenecks</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Loading zone C average delay</p>
                </div>
                <span className="text-xs font-black text-[#EF4444]">+15m</span>
              </div>
            </div>
          </div>

        </section>

        {/* Lower Row (Financial Forecast & Utilization & Route Intelligence) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Financial Forecast (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Predictive Financial Forecast</h3>
              <div className="flex gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-950"></span>Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#6C7A89]"></span>Expenses</span>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="Revenue" fill="#0F172A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#6C7A89" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Utilization (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Fleet Utilization</h3>
            
            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Peak Utilization (8AM - 11AM)</span>
                  <span className="font-extrabold text-slate-900">86%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-950 rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Mid-Day Utilization (12PM - 3PM)</span>
                  <span className="font-extrabold text-slate-900">72%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-950 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Evening Shift (5PM - 9PM)</span>
                  <span className="font-extrabold text-slate-900">84%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-950 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-bold leading-relaxed pt-2">
                * AI Forecast: Utilization expected to increase 8% next week due to seasonal demand shifts.
              </p>
            </div>
          </div>

        </section>

        {/* Route Optimization & Driver Risk */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Route Optimization (Left 6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Route Optimization Intelligence</h3>
            
            <div className="space-y-4">
              <div className="border border-slate-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800">Route 88B - Urban Delivery</h4>
                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded">Best Performing</span>
                </div>
                <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                  <span>Fuel Savings: <span className="text-emerald-600 font-extrabold">18.4%</span></span>
                  <span>Time Saved: <span className="text-slate-800 font-extrabold">22m / trip</span></span>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800">Route 42A - Intercity Freight</h4>
                  <span className="bg-rose-50 text-rose-600 text-[8px] font-black px-2 py-0.5 rounded">Highest Delay</span>
                </div>
                <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                  <span>Fuel Variance: <span className="text-rose-500 font-extrabold">+9.2%</span></span>
                  <span>Avg Delay: <span className="text-slate-850 font-extrabold">45m / trip</span></span>
                </div>
                <p className="text-[10px] text-slate-450 font-semibold bg-slate-50 p-2 rounded">
                  AI Insight: Severe congestion at Junction 9 predicted to continue. AI recommends rerouting via Expressway 4.
                </p>
              </div>
            </div>
          </div>

          {/* Driver Risk Analytics (Right 6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Driver Intelligence & Risk</h3>
            
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-550 border-b border-slate-100 pb-2">
                <span>Driver</span>
                <div className="flex gap-16">
                  <span>Efficiency</span>
                  <span>Predicted Risk</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop" className="w-6 h-6 rounded-full object-cover" />
                  <span>Marcus Chen</span>
                </div>
                <div className="flex gap-16">
                  <span className="font-bold text-slate-850">98 / 100</span>
                  <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Low (2%)</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&auto=format&fit=crop" className="w-6 h-6 rounded-full object-cover" />
                  <span>Sarah Jenkins</span>
                </div>
                <div className="flex gap-16">
                  <span className="font-bold text-slate-850">92 / 100</span>
                  <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Low (5%)</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop" className="w-6 h-6 rounded-full object-cover" />
                  <span>David Miller</span>
                </div>
                <div className="flex gap-16">
                  <span className="font-bold text-slate-850">76 / 100</span>
                  <span className="text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">Medium (18%)</span>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-3 mt-3">
                <span className="text-xs">⚠️</span>
                <p className="text-[10px] text-indigo-900 font-semibold leading-relaxed">
                  <strong>Fatigue Prediction Warning:</strong> David Miller's driving patterns indicate increasing lane deviation frequency. Fatigue protocol recommended for next shift.
                </p>
              </div>
            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};
