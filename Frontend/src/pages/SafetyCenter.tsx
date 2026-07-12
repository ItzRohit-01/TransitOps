import React from 'react';
import { 
  Search,
  Filter
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const SafetyCenter: React.FC = () => {
  const safetyHealthData = [
    { name: 'Compliant', value: 85, color: '#10B981' },
    { name: 'Attn.', value: 10, color: '#F59E0B' },
    { name: 'High-Risk', value: 3, color: '#EF4444' },
    { name: 'Suspended', value: 2, color: '#1E293B' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Title Header with Subtitle */}
        <section>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Fleet Safety Oversight</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Monitor driver compliance, manage incidents, resolve complaints, and improve fleet safety with real-time AI-powered analytics.
          </p>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Open Incidents */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Open Incidents</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-rose-500 tracking-tight font-outfit">12</span>
              <span className="text-slate-300 font-bold mb-1">🛈</span>
            </div>
          </div>

          {/* Pending Complaints */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Pending Complaints</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-amber-500 tracking-tight font-outfit">5</span>
              <span className="text-slate-300 font-bold mb-1">💬</span>
            </div>
          </div>

          {/* Expiring Licenses */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Expiring Licenses</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">8</span>
              <span className="text-slate-300 font-bold mb-1">📄</span>
            </div>
          </div>

          {/* Suspended Drivers */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Suspended Drivers</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">4</span>
              <span className="text-slate-300 font-bold mb-1">🚫</span>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Compliance Score</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-emerald-500 tracking-tight font-outfit">96.4%</span>
              <span className="text-emerald-500 font-bold mb-1">✔</span>
            </div>
          </div>

          {/* Avg Safety Score */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Avg Safety Score</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">92%</span>
              <span className="text-slate-300 font-bold mb-1">📈</span>
            </div>
          </div>
        </section>

        {/* Safety Health & Recent Incident Management */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Safety Health Overview (Left 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Safety Health Overview</h3>
                <button className="text-slate-400 hover:text-slate-600 font-extrabold">•••</button>
              </div>

              <div className="flex flex-col items-center justify-center relative py-4">
                <div className="w-40 h-40 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={safetyHealthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {safetyHealthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 font-outfit">96%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Healthy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 mt-4 text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Compliant (85%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                <span>Attn. (10%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                <span>High-Risk (3%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span>
                <span>Suspended (2%)</span>
              </div>
            </div>
          </div>

          {/* Recent Incident Management (Right 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Recent Incident Management</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Active investigations and safety violations</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400">
                    <Filter className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400">
                    <Search className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Registry Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">INCIDENT ID</th>
                      <th className="pb-3">DRIVER</th>
                      <th className="pb-3">VEHICLE</th>
                      <th className="pb-3">TYPE</th>
                      <th className="pb-3 text-right">SEVERITY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    <tr>
                      <td className="py-4 font-black text-slate-900">#INC-4021</td>
                      <td className="py-4 flex items-center gap-2.5">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&auto=format&fit=crop" 
                          alt="Sarah Jenkins"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        Sarah Jenkins
                      </td>
                      <td className="py-4">V-102</td>
                      <td className="py-4 text-slate-800">Speeding</td>
                      <td className="py-4 text-right">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100">
                          MEDIUM
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 font-black text-slate-900">#INC-3988</td>
                      <td className="py-4 flex items-center gap-2.5">
                        <img 
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=60&auto=format&fit=crop" 
                          alt="Robert Jenkins"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        Robert Jenkins
                      </td>
                      <td className="py-4">V-205</td>
                      <td className="py-4 text-slate-800">Hard Braking</td>
                      <td className="py-4 text-right">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                          HIGH
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 font-black text-slate-900">#INC-3975</td>
                      <td className="py-4 flex items-center gap-2.5">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop" 
                          alt="Michael Chen"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        Michael Chen
                      </td>
                      <td className="py-4">V-118</td>
                      <td className="py-4 text-slate-800">Route Deviance</td>
                      <td className="py-4 text-right">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                          LOW
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs font-bold text-slate-400">
              <span>Showing 3 of 12 active incidents</span>
              <button className="text-slate-800 hover:text-slate-950 font-extrabold">View All Incidents</button>
            </div>
          </div>

        </section>

        {/* Lower Row (AI Safety Insights, Pending Complaints, Risk Score Trends) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* AI Safety Insights (Left 4 cols) */}
          <div className="lg:col-span-4 bg-[#1E293B] text-slate-100 rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="font-outfit font-extrabold text-slate-200 text-sm flex items-center gap-2 mb-4">
                <SparklesIcon className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                AI Safety Insights
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <span className="text-xs mt-0.5">📈</span>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    Driver Alex risk score increased by 12% following late-night shifts.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-xs mt-0.5">⚠️</span>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    Driver John's license expires in 7 days. Action required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Complaints (Middle 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-4">Pending Complaints</h3>
              
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 relative">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs">
                      👤
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">#CP-802: Behavior</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Robert Jenkins • Priority: High</p>
                    </div>
                  </div>
                  <span className="bg-rose-50 text-rose-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-rose-100">
                    OPEN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Score Trends (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Risk Score Trends</h3>
            
            <div className="space-y-4">
              {/* High Risk */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>High Risk Drivers</span>
                  <span className="text-rose-500 font-extrabold">3.2% ▲</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              {/* Medium Risk */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>Medium Risk Drivers</span>
                  <span className="text-amber-500 font-extrabold">9.8% ↔</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>

              {/* Low Risk */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>Low Risk Drivers</span>
                  <span className="text-emerald-500 font-extrabold">87.0% ▼</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};

// Local Sparkles Icon Proxy
const SparklesIcon: React.FC<any> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
  </svg>
);
