import React, { useState } from 'react';
import { 
  Filter, 
  Download, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  Compass, 
  BookOpen, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Driver {
  id: string;
  name: string;
  licenseId: string;
  category: string;
  safetyScore: number;
  assignment: string;
  licenseDetail: string;
  status: 'On Trip' | 'Available' | 'Off Duty' | 'Suspended';
  vehicle: string;
  image: string;
  trends: number[];
}

export const DriverManagement: React.FC = () => {
  // Mock Driver Data
  const drivers: Driver[] = [
    {
      id: 'D-9021',
      name: 'Alex Thompson',
      licenseId: 'TX-492-901',
      category: 'CLASS A',
      safetyScore: 98,
      assignment: 'V-102 (Houston Exp)',
      licenseDetail: 'Class A (Interstate)',
      status: 'On Trip',
      vehicle: 'V-102',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      trends: [60, 70, 65, 80, 85, 92, 98]
    },
    {
      id: 'D-8842',
      name: 'Sarah Jenkins',
      licenseId: 'CA-112-452',
      category: 'CLASS B',
      safetyScore: 92,
      assignment: 'N/A',
      licenseDetail: 'Class B (Interstate)',
      status: 'Available',
      vehicle: 'N/A',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      trends: [85, 88, 90, 89, 93, 91, 92]
    },
    {
      id: 'D-7710',
      name: 'Robert Blackwood',
      licenseId: 'NY-891-220',
      category: 'CLASS A',
      safetyScore: 76,
      assignment: 'V-405 (Maintenance)',
      licenseDetail: 'Class A (Intrastate)',
      status: 'Off Duty',
      vehicle: 'V-405',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      trends: [75, 78, 80, 74, 76, 75, 76]
    },
    {
      id: 'D-1104',
      name: 'James Miller',
      licenseId: 'IL-230-009',
      category: 'CLASS C',
      safetyScore: 42,
      assignment: 'None',
      licenseDetail: 'Class C (Intrastate)',
      status: 'Suspended',
      vehicle: 'None',
      image: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=150&auto=format&fit=crop',
      trends: [50, 48, 45, 43, 40, 41, 42]
    }
  ];

  const [selectedId, setSelectedId] = useState<string>('D-9021');

  const selectedDriver = drivers.find(d => d.id === selectedId) || drivers[0];

  // Workforce Availability Donut Chart Data
  const workforceData = [
    { name: 'Available', value: 128, color: '#10B981' },
    { name: 'On Trip', value: 256, color: '#3B82F6' },
    { name: 'Off Duty', value: 86, color: '#94A3B8' },
    { name: 'Suspended', value: 12, color: '#EF4444' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Title Header with Buttons */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Driver Management</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Manage driver profiles, availability, safety compliance, performance, and operational readiness.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95">
              <Filter className="w-4 h-4 text-slate-400" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95">
              <Download className="w-4 h-4 text-slate-400" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4.5 py-2.5 bg-black hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              Add Driver
            </button>
          </div>
        </section>

        {/* Top Mini Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Total Drivers */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Total Drivers</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">482</span>
              <span className="text-emerald-500 text-[10px] font-extrabold mb-1">
                📈 +12% MoM
              </span>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Available</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block">128</span>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>

          {/* On Trip */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">On Trip</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block">256</span>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Suspended */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Suspended</span>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">12</span>
              <span className="text-[9px] text-rose-500 font-extrabold">🚨 Requires Action</span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>

          {/* Expiring Licenses */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Expiring Licenses</span>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">8</span>
              <span className="text-[9px] text-amber-500 font-extrabold">⏳ Next 30 Days</span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* Avg. Safety Score */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Avg. Safety Score</span>
              <span className="bg-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded shadow">94%</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              🛡️ Fleet Excellence
            </span>
          </div>
        </section>

        {/* Center Workforce, Predictions & Compliance Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Workforce Availability (Left 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Workforce Availability</h3>
              <button className="text-slate-400 hover:text-slate-600 font-extrabold text-xs">•••</button>
            </div>
            <div className="flex flex-col items-center justify-center relative py-4">
              <div className="w-40 h-40 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workforceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {workforceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 font-outfit">482</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-[10px] font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Available (128)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>On Trip (256)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Off Duty (86)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Suspended (12)</span>
              </div>
            </div>
          </div>

          {/* AI Insights & Predictions (Middle 4 cols) */}
          <div className="lg:col-span-4 bg-[#1E293B] text-slate-100 rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="font-outfit font-extrabold text-slate-200 text-sm flex items-center gap-2 mb-5">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                AI Insights & Predictions
              </h3>

              <div className="space-y-4">
                {/* Insight 1 */}
                <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-800/20 rounded-xl p-3">
                  <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-lg mt-0.5">
                    <TrendingUpIcon className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    Driver <span className="text-white font-extrabold">Alex Thompson</span> maintained a 98% safety score over 120 trips, qualifying for the quarterly bonus.
                  </p>
                </div>

                {/* Insight 2 */}
                <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-800/20 rounded-xl p-3">
                  <div className="bg-amber-500/10 text-amber-400 p-1.5 rounded-lg mt-0.5">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    Driver <span className="text-white font-extrabold">John Doe's</span> Class A license expires in 14 days. Renewal paperwork is pending review.
                  </p>
                </div>

                {/* Insight 3 */}
                <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-800/20 rounded-xl p-3">
                  <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg mt-0.5">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    Driver <span className="text-white font-extrabold">Sarah Jenkins</span> has been flagged as the most fuel-efficient driver this month with 12% savings.
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full mt-5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm">
              View All Intelligence Reports
            </button>
          </div>

          {/* Compliance Center (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">Compliance Center</h3>
              <div className="space-y-4">
                {/* Event 1 */}
                <div className="border border-slate-100 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">CRITICAL</span>
                    <span className="text-slate-400 font-semibold">2h ago</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800">4 Expired Licenses</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">Operations halted for affected drivers.</p>
                </div>

                {/* Event 2 */}
                <div className="border border-slate-100 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">WARNING</span>
                    <span className="text-slate-400 font-semibold">5h ago</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800">Incident Reported: V-109</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">Hard braking event detected by telematics.</p>
                </div>

                {/* Event 3 */}
                <div className="border border-slate-100 rounded-xl p-3.5 space-y-1 bg-[#F8F9FC]/60">
                  <h4 className="text-xs font-black text-slate-800">Medical Review Pending</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">12 drivers require biennial checkups.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Lower Registry Table, Profile Trends & Activity Logs */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Driver Registry Table (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Driver Registry</h3>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-xs font-semibold">Showing 1-10 of 482</span>
                <div className="flex gap-1">
                  <button className="px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 font-bold rounded-lg text-slate-600 disabled:opacity-50" disabled>&lt;</button>
                  <button className="px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 font-bold rounded-lg text-slate-600">&gt;</button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">DRIVER NAME</th>
                    <th className="pb-3">LICENSE ID</th>
                    <th className="pb-3">CATEGORY</th>
                    <th className="pb-3">SAFETY SCORE</th>
                    <th className="pb-3 text-right">ASSIGNMENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {drivers.map((driver) => {
                    const isSelected = selectedId === driver.id;
                    return (
                      <tr 
                        key={driver.id}
                        onClick={() => setSelectedId(driver.id)}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-50/80' : ''
                        }`}
                      >
                        <td className="py-4 flex items-center gap-3">
                          <img 
                            src={driver.image} 
                            alt={driver.name} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-100"
                          />
                          <div>
                            <div className="font-black text-slate-900 text-xs">{driver.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">ID: {driver.id}</div>
                          </div>
                        </td>
                        <td className="py-4 font-mono font-bold text-slate-500 text-[11px]">{driver.licenseId}</td>
                        <td className="py-4">
                          <span className="text-[9px] font-black bg-slate-100 border border-slate-150 px-2 py-0.5 rounded text-slate-700">
                            {driver.category}
                          </span>
                        </td>
                        <td className="py-4 w-28">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-slate-150 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  driver.safetyScore >= 90 
                                    ? 'bg-emerald-500' 
                                    : driver.safetyScore >= 70 
                                    ? 'bg-amber-500' 
                                    : 'bg-rose-500'
                                  }`} 
                                style={{ width: `${driver.safetyScore}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-900">{driver.safetyScore}%</span>
                          </div>
                        </td>
                        <td className="py-4 text-right text-slate-500 text-xs font-semibold">{driver.assignment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column (Driver Profile & Activities, 4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Driver Profile */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Driver Profile</span>
                <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">View Detail</button>
              </div>

              {/* Driver identity */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <img 
                    src={selectedDriver.image} 
                    alt={selectedDriver.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 font-outfit">{selectedDriver.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">License: {selectedDriver.licenseDetail}</p>
                </div>
              </div>

              {/* Status & Vehicle row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="text-xs font-black text-blue-600 mt-1 block">
                    {selectedDriver.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle</span>
                  <span className="text-xs font-black text-slate-800 mt-1 block font-mono">
                    {selectedDriver.vehicle}
                  </span>
                </div>
              </div>

              {/* Performance Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                  <span>PERFORMANCE SCORE</span>
                  <span className="text-emerald-500 font-black text-sm">{selectedDriver.safetyScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${selectedDriver.safetyScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Trends bar chart */}
              <div className="pt-2">
                <div className="h-12 flex items-end gap-1.5 px-2">
                  {selectedDriver.trends.map((score, idx) => (
                    <div 
                      key={idx}
                      className={`flex-1 rounded-xs transition-all duration-300 ${
                        idx === selectedDriver.trends.length - 1 
                          ? 'bg-slate-950' 
                          : score >= 90 
                          ? 'bg-blue-500' 
                          : score >= 70 
                          ? 'bg-blue-300' 
                          : 'bg-blue-200'
                      }`}
                      style={{ height: `${score}%` }}
                    ></div>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase text-center block mt-3">
                  Trip safety score trends (Last 7 days)
                </span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">Recent Activity</h3>
              <div className="space-y-5">
                {/* Act 1 */}
                <div className="flex gap-3 items-start">
                  <div className="bg-slate-900 text-white p-1 rounded-lg shrink-0 mt-0.5">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-850">New Assignment</h5>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Alex Thompson assigned to Route Houston-Exp</p>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">12 min ago</span>
                  </div>
                </div>

                {/* Act 2 */}
                <div className="flex gap-3 items-start">
                  <div className="bg-emerald-50 text-emerald-600 p-1 rounded-lg shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-850">License Renewed</h5>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Marcus Miller successfully updated CA license</p>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">2 hours ago</span>
                  </div>
                </div>

                {/* Act 3 */}
                <div className="flex gap-3 items-start">
                  <div className="bg-amber-50 text-amber-600 p-1 rounded-lg shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-850">Compliance Alert</h5>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">John Doe's medical certificate expiring in 5 days</p>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">5 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};

// Internal icon proxy for unused compile errors
const TrendingUpIcon: React.FC<any> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);
