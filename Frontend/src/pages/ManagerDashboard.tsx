import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  Maximize2 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const ManagerDashboard: React.FC = () => {
  const [financialRange, setFinancialRange] = useState('Last 30 Days');

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [financeKPIs, setFinanceKPIs] = useState<any>({});
  
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const unsubVehicles = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
      setVehicles(list);
    });

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
      setDrivers(list);
    });

    const unsubTrips = onSnapshot(collection(db, 'trips'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
      setTrips(list);
    });

    // unused

      

    const unsubLogs = onSnapshot(collection(db, 'auditLogs'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
      // Sort by timestamp desc
      list.sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : new Date(a.timestamp).getTime();
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : new Date(b.timestamp).getTime();
        return timeB - timeA;
      });
      setAuditLogs(list);
    });
    
    const unsubExp = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      snapshot.forEach(docSnap => {
        if (docSnap.id === 'EXP-2026-07') {
          setFinanceKPIs(docSnap.data());
        }
      });
    });

    return () => { unsubVehicles(); unsubDrivers(); unsubTrips(); unsubLogs(); unsubExp(); };
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    const csvData = 'Category,Value\\nTotal Fleet,' + vehicles.length + '\\nActive Drivers,' + drivers.filter(d => d.status === 'ON TRIP').length + '\\nActive Trips,' + trips.filter(t => t.status === 'ON SCHEDULE').length;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manager_Dashboard_Export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    await addDoc(collection(db, 'auditLogs'), {
      action: 'DASHBOARD_EXPORT',
      details: `Exported Manager Dashboard Summary`,
      userEmail: auth.currentUser?.email || 'manager@transitops.global',
      timestamp: new Date()
    });
    
    setTimeout(() => setIsExporting(false), 1000);
  };

  // Computations
  const totalFleet = vehicles.length || 482;
  const activeDrivers = drivers.filter(d => d.status === 'ON TRIP' || d.status === 'AVAILABLE').length || 128;
  const activeTripsCount = trips.filter(t => t.status === 'ON SCHEDULE' || t.status === 'DELAYED').length || 89;
  
  const healthyCount = vehicles.filter(v => v.health >= 80).length || 428;
  const attentionCount = vehicles.filter(v => v.health >= 50 && v.health < 80).length || 40;
  const criticalCount = vehicles.filter(v => v.health < 50).length || 14;
  const fleetHealthScore = vehicles.length > 0 ? Math.round((healthyCount / vehicles.length) * 100) : 89;

  const activeVehiclesCount = vehicles.filter(v => v.status === 'ON TRIP').length || 342;
  const availableVehiclesCount = vehicles.filter(v => v.status === 'AVAILABLE').length || 96;
  const maintenanceVehiclesCount = vehicles.filter(v => v.status === 'IN SHOP').length || 34;

  const dynamicFleetHealthData = [
    { name: 'Healthy', value: healthyCount, color: '#10B981' },
    { name: 'Attention Required', value: attentionCount, color: '#F59E0B' },
    { name: 'Critical', value: criticalCount, color: '#EF4444' }
  ];

  const formatCurrency = (val: number) => {
    if (!val) return '$0';
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return '$' + (val / 1000).toFixed(0) + 'k';
    return '$' + val;
  };

  const revenue = financeKPIs.totalRevenue || 2412090;


  // Recharts Fleet Health Data
  const fleetHealthData = [
    { name: 'Healthy', value: 428, color: '#10B981' },
    { name: 'Attention Required', value: 40, color: '#F59E0B' },
    { name: 'Critical', value: 14, color: '#EF4444' }
  ];

  // Recharts Financial Data (mini sparklines data)
  const revenueData = [
    { value: 10 }, { value: 15 }, { value: 8 }, { value: 12 }, { value: 20 }, { value: 18 }, { value: 25 }
  ];
  const costData = [
    { value: 25 }, { value: 22 }, { value: 19 }, { value: 21 }, { value: 15 }, { value: 17 }, { value: 10 }
  ];
  const profitData = [
    { value: 5 }, { value: 10 }, { value: 12 }, { value: 15 }, { value: 20 }, { value: 18 }, { value: 24 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Global Operational Status */}
        <section className="bg-slate-950 text-white rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          {/* Subtle glowing lights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2 font-outfit">
            Global Operational Status
          </span>
          <h2 className="text-3xl font-black tracking-tight mb-8 font-outfit">
            Real-time Command Hub
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-semibold mb-1">Total Fleet</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight font-outfit">{totalFleet}</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center">
                  +2.4%
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-semibold mb-1">Active Drivers</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight font-outfit">{activeDrivers}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-semibold mb-1">Active Trips</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight font-outfit">{activeTripsCount}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-semibold mb-1">Fleet Health</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-emerald-400 font-outfit">{fleetHealthScore}%</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-semibold mb-1">Monthly Revenue</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight font-outfit">{formatCurrency(revenue)}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-semibold mb-1">Critical Alerts</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-rose-500 font-outfit">{criticalCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Active Vehicles */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Vehicles</span>
              <span className="bg-sky-50 text-sky-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">+ 12%</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-2">{activeVehiclesCount}</span>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available</span>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Optimal</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-2">{availableVehiclesCount}</span>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Maintenance</span>
              <span className="bg-amber-50 text-amber-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Planned</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-2">{maintenanceVehiclesCount}</span>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical Alerts</span>
              <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Action Req</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-2">{criticalCount}</span>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full animate-pulse" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>

          {/* Utilization */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Utilization</span>
              <span className="bg-purple-50 text-purple-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">+ 5.1%</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-2">82.4%</span>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '82.4%' }}></div>
              </div>
            </div>
          </div>

          {/* Operational ROI */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operational ROI</span>
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Target: 24%</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-2">21.8%</span>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Health, Fleet Distribution & Active Fleet Clusters Map */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Fleet Health & Distribution */}
          <div className="lg:col-span-4 space-y-8 flex flex-col justify-between">
            {/* Fleet Health Circular Pie Chart */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-outfit font-extrabold text-slate-900 text-base">Fleet Health</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center relative py-4">
                <div className="w-44 h-44 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dynamicFleetHealthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {fleetHealthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 font-outfit">{fleetHealthScore}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status: Great</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Healthy</span>
                  </div>
                  <span className="font-bold text-slate-900">{healthyCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Attention Required</span>
                  </div>
                  <span className="font-bold text-slate-900">{attentionCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>Critical</span>
                  </div>
                  <span className="font-bold text-slate-900">{criticalCount}</span>
                </div>
              </div>
            </div>

            {/* Fleet Distribution Progress Bars */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex-1">
              <h3 className="font-outfit font-extrabold text-slate-900 text-base mb-6">Fleet Distribution</h3>

              <div className="space-y-4">
                {/* Heavy Trucks */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span className="flex items-center gap-2">🚚 Heavy Trucks</span>
                    <span>182 <span className="text-slate-400 font-medium text-[10px]">(94%)</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                {/* Medium Trucks */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span className="flex items-center gap-2">🚛 Medium Trucks</span>
                    <span>119 <span className="text-slate-400 font-medium text-[10px]">(78%)</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                {/* Vans */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span className="flex items-center gap-2">🚐 Vans</span>
                    <span>144 <span className="text-slate-400 font-medium text-[10px]">(86%)</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 rounded-full" style={{ width: '86%' }}></div>
                  </div>
                </div>

                {/* Service Vehicles */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                    <span className="flex items-center gap-2">🚘 Service Vehicles</span>
                    <span>44 <span className="text-slate-400 font-medium text-[10px]">(82%)</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-650 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Active Fleet Clusters (Map Visualizer) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 pb-2 flex justify-between items-center">
              <div>
                <h3 className="font-outfit font-extrabold text-slate-900 text-base">Active Fleet Clusters</h3>
                <span className="text-xs font-semibold text-slate-400">Live tracking across North America regions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Live Ops
                </span>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Map Frame Visual Placeholder */}
            <div className="relative flex-1 bg-slate-50 min-h-[360px] border-y border-slate-100 overflow-hidden flex items-center justify-center">
              {/* Detailed Stylized Custom Map */}
              <div className="absolute inset-0 z-0 bg-[#E8ECEF] opacity-90">
                {/* SVG Mock Map Grid with Streets & water */}
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" fill="none">
                  {/* Lake Michigan Water Body */}
                  <path d="M 620 0 L 800 0 L 800 400 L 740 400 Q 720 280 670 210 T 620 0" fill="#BED9FD" />
                  
                  {/* Roads Grid */}
                  <path d="M0 80 L800 80" stroke="#FFFFFF" strokeWidth="6" />
                  <path d="M0 160 L800 160" stroke="#FFFFFF" strokeWidth="4" />
                  <path d="M0 240 L800 240" stroke="#FFFFFF" strokeWidth="6" />
                  <path d="M0 320 L800 320" stroke="#FFFFFF" strokeWidth="4" />
                  
                  <path d="M120 0 L120 400" stroke="#FFFFFF" strokeWidth="5" />
                  <path d="M280 0 L280 400" stroke="#FFFFFF" strokeWidth="4" />
                  <path d="M440 0 L440 400" stroke="#FFFFFF" strokeWidth="6" />
                  <path d="M580 0 L580 400" stroke="#FFFFFF" strokeWidth="5" />

                  {/* Diagonal Highway I-90 */}
                  <path d="M0 0 L620 310" stroke="#F1C40F" strokeWidth="8" opacity="0.6" />
                  <path d="M0 0 L620 310" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5 3" opacity="0.8" />
                  
                  {/* Chicago River Loop representation */}
                  <path d="M 440 0 C 420 180 380 220 360 220 L 0 220" stroke="#A9C7EF" strokeWidth="12" strokeLinecap="round" />
                  
                  {/* Parks and Greens */}
                  <rect x="180" y="20" width="80" height="40" rx="6" fill="#D2EBD4" />
                  <rect x="30" y="270" width="70" height="40" rx="6" fill="#D2EBD4" />
                  <rect x="490" y="100" width="60" height="100" rx="8" fill="#D2EBD4" />

                  {/* Locations label */}
                  <text x="320" y="150" fill="#94A3B8" fontSize="24" fontWeight="800" fontFamily="Outfit" opacity="0.4">CHICAGO</text>
                </svg>
              </div>

              {/* Dynamic Plotted Markers on Map */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-md animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-600/30 rounded-full scale-150 absolute bottom-0 blur-xs"></span>
              </div>

              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
                <span className="bg-black/85 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                  Optimal Cluster
                </span>
              </div>

              <div className="absolute bottom-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-lg animate-pulse"></span>
                <span className="bg-rose-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                  Weather Alert
                </span>
              </div>

              <div className="absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-md"></span>
              </div>

              {/* Region Capacity Overlay Card (Top Right) */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-xl p-4 shadow-lg min-w-[150px] z-10">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Region Capacity
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                    <span>Midwest</span>
                    <span className="text-emerald-500">83%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                    <span>Northeast</span>
                    <span className="text-amber-500">45%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                    <span>Pacific</span>
                    <span className="text-emerald-500">91%</span>
                  </div>
                </div>
              </div>

              {/* Home Depot icon marker */}
              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 bg-white/95 border border-slate-200/50 shadow rounded-lg px-2 py-1">
                <MapPin className="w-3 h-3 text-sky-500" />
                <span className="text-[9px] font-bold text-slate-700">The Home Depot</span>
              </div>
            </div>

            {/* Map Status Footer */}
            <div className="grid grid-cols-3 p-4 bg-[#F8F9FC] border-t border-slate-100">
              <div className="text-center border-r border-slate-200/80">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Optimized Routes
                </span>
                <span className="text-sm font-black text-slate-900 font-outfit mt-0.5 block">
                  412
                </span>
              </div>
              <div className="text-center border-r border-slate-200/80">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Traffic Delays
                </span>
                <span className="text-sm font-black text-slate-900 font-outfit mt-0.5 block">
                  12
                </span>
              </div>
              <div className="text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Weather Alerts
                </span>
                <span className="text-sm font-black text-slate-900 font-outfit mt-0.5 block">
                  3
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Lower Section (Active Trip Command, Operational Feed) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Trip Command Table (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-outfit font-extrabold text-slate-900 text-base">Active Trip Command</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleExport} className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] rounded-lg border border-slate-200/60 transition-all">
                    {isExporting ? 'Exporting...' : 'Export Logs'}
                  </button>
                  <button onClick={handleExport} className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] rounded-lg border border-slate-200/60 transition-all">
                    View All Trips
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">ID</th>
                      <th className="pb-3 font-semibold">Driver</th>
                      <th className="pb-3 font-semibold">Vehicle</th>
                      <th className="pb-3 font-semibold">ETA</th>
                      <th className="pb-3 font-semibold">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {/* Row 1 */}
                    <tr>
                      <td className="py-4 font-extrabold text-slate-900">#TR-8821</td>
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-indigo-600">
                          JD
                        </div>
                        John Dorsey
                      </td>
                      <td className="py-4">Volvo VNL 860</td>
                      <td className="py-4 text-slate-500">14:20 <span className="text-emerald-500 font-bold text-[10px]">(On Time)</span></td>
                      <td className="py-4 w-40">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">85%</span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr>
                      <td className="py-4 font-extrabold text-slate-900">#TR-8824</td>
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-indigo-600">
                          AS
                        </div>
                        Amara Smith
                      </td>
                      <td className="py-4">Freightliner Cascadia</td>
                      <td className="py-4 text-slate-500">15:45 <span className="text-amber-500 font-bold text-[10px]">(Delayed)</span></td>
                      <td className="py-4 w-40">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">42%</span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr>
                      <td className="py-4 font-extrabold text-slate-900">#TR-8829</td>
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-indigo-600">
                          ML
                        </div>
                        Mike Lowrey
                      </td>
                      <td className="py-4">Ford Transit 350</td>
                      <td className="py-4 text-slate-500">16:10 <span className="text-emerald-500 font-bold text-[10px]">(On Time)</span></td>
                      <td className="py-4 w-40">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">12%</span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr>
                      <td className="py-4 font-extrabold text-slate-900">#TR-8832</td>
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-indigo-600">
                          RK
                        </div>
                        Rosa Kim
                      </td>
                      <td className="py-4">Kenworth T680</td>
                      <td className="py-4 text-slate-500">17:30 <span className="text-slate-400 font-bold text-[10px]">(Scheduled)</span></td>
                      <td className="py-4 w-40">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-200 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">0%</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Operational Feed (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-outfit font-extrabold text-slate-900 text-base">Operational Feed</h3>
                <button className="p-1 text-slate-400 hover:text-slate-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
                </button>
              </div>

              {/* Feed List */}
              <div className="space-y-5">
                {auditLogs.length > 0 ? auditLogs.slice(0, 4).map((log, i) => {
                  let Icon = Sparkles;
                  let colorClass = 'bg-slate-100 text-slate-600';
                  if (log.action?.includes('CREATE')) { Icon = CheckCircle2; colorClass = 'bg-emerald-50 text-emerald-600'; }
                  if (log.action?.includes('ERROR') || log.action?.includes('FAIL')) { Icon = AlertCircle; colorClass = 'bg-rose-50 text-rose-600'; }
                  if (log.action?.includes('UPDATE') || log.action?.includes('DISPATCH')) { Icon = Clock; colorClass = 'bg-sky-50 text-sky-600'; }

                  const timeStr = log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';

                  return (
                    <div key={i} className="flex gap-3 items-start">
                      <div className={`${colorClass} p-1.5 rounded-lg shrink-0 mt-0.5`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {log.details}
                        </p>
                        <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                          {timeStr} • {log.userEmail}
                        </span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center text-xs text-slate-400 py-4 font-semibold">No recent activity found.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* AI Insights Engine */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-outfit font-extrabold text-slate-900 text-base">AI Insights Engine</h3>
              <span className="text-xs font-semibold text-slate-400">Predictive analysis and fleet optimization</span>
            </div>
            <span className="bg-indigo-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded tracking-wide uppercase">
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Maintenance Predictive */}
            <div className="border border-slate-100 bg-[#FBFBFF] rounded-xl p-5 flex flex-col justify-between min-h-[170px]">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  Maintenance Predictive
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">Vehicle V-12 Maintenance</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-indigo-600 font-black text-xs">92% Confidence</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Brake wear critical in approx 420km.
                </p>
              </div>
              <button className="mt-4 w-full bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 font-bold text-[10px] py-2 rounded-lg transition-all shadow-sm">
                Schedule Service
              </button>
            </div>

            {/* Fuel Efficiency */}
            <div className="border border-slate-100 bg-[#FBFBFF] rounded-xl p-5 flex flex-col justify-between min-h-[170px]">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  Fuel Efficiency Alert
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">Idle Time Reduction</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-600 font-black text-xs">-$12,400 Saved</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Route 8-14 reduced idle time by 12%.
                </p>
              </div>
              <button className="mt-4 w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[10px] py-2 rounded-lg transition-all shadow-sm">
                View Report
              </button>
            </div>

            {/* Route Optimization */}
            <div className="border border-slate-100 bg-[#FBFBFF] rounded-xl p-5 flex flex-col justify-between min-h-[170px]">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  Route Optimization
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">Dynamic Traffic Avoidance</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-indigo-600 font-black text-xs">482h / Month</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Rerouting suggestion active for NE sector.
                </p>
              </div>
              <button className="mt-4 w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[10px] py-2 rounded-lg transition-all shadow-sm">
                Apply Globally
              </button>
            </div>

            {/* Top Performance */}
            <div className="border border-slate-100 bg-[#FBFBFF] rounded-xl p-5 flex flex-col justify-between min-h-[170px]">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  Top Performance
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">Driver: Rosa Kim</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-600 font-black text-xs">99/100 Safety</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Exceptional fuel economy & zero incidents.
                </p>
              </div>
              <button className="mt-4 w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[10px] py-2 rounded-lg transition-all shadow-sm">
                View Profile
              </button>
            </div>
          </div>
        </section>

        {/* Financial Snapshot */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-outfit font-extrabold text-slate-900 text-base">Financial Snapshot</h3>
            <select
              value={financialRange}
              onChange={(e) => setFinancialRange(e.target.value)}
              className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Total Revenue */}
            <div className="flex flex-col justify-between border-r border-slate-100 pr-4 last:border-0 last:pr-0">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Revenue
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit mt-1 block">
                  $2,412,090
                </span>
              </div>
              {/* Mini sparkline visualization */}
              <div className="h-10 w-full mt-4 flex items-end gap-1">
                {revenueData.map((d, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-slate-900 rounded-xs" 
                    style={{ height: `${d.value * 4}%`, minHeight: '4px' }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Operational Cost */}
            <div className="flex flex-col justify-between border-r border-slate-100 pr-4 last:border-0 last:pr-0">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Operational Cost
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit mt-1 block">
                  $1,842,500
                </span>
              </div>
              {/* Mini sparkline visualization */}
              <div className="h-10 w-full mt-4 flex items-end gap-1">
                {costData.map((d, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-rose-200 rounded-xs" 
                    style={{ height: `${d.value * 3}%`, minHeight: '4px' }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Net Profit */}
            <div className="flex flex-col justify-between border-r border-slate-100 pr-4 last:border-0 last:pr-0">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Net Profit
                </span>
                <span className="text-2xl font-black text-emerald-600 tracking-tight font-outfit mt-1 block">
                  $569,590
                </span>
              </div>
              {/* Mini sparkline visualization */}
              <div className="h-10 w-full mt-4 flex items-end gap-1">
                {profitData.map((d, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-emerald-500 rounded-xs" 
                    style={{ height: `${d.value * 4}%`, minHeight: '4px' }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Margin ROI */}
            <div className="flex flex-col justify-between border-r border-slate-100 pr-4 last:border-0 last:pr-0">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Margin ROI
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit mt-1 block">
                  23.6%
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 mt-4">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                <span>+2.4% vs last period</span>
              </div>
            </div>

            {/* Cost per KM */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cost per KM
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight font-outfit mt-1 block">
                  $1.42
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 mt-4">
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                <span>-$0.08 optimization</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};
