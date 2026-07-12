import React, { useState } from 'react';
import { 
  Filter, 
  Download, 
  Compass, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert, 
  X 
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Trip {
  id: string;
  driverName: string;
  driverSub: string;
  driverSafety: string;
  driverImage: string;
  vehicleName: string;
  vehicleSub: string;
  cargo: string;
  routeCode: string;
  routeFull: string;
  progress: number;
  status: 'DELAYED' | 'ON SCHEDULE';
  statusSub: string;
  eta: string;
  source: string;
  destination: string;
  fuelConsumed: string;
  opCost: string;
  timeline: {
    title: string;
    time: string;
    status: string;
    isAlert?: boolean;
  }[];
}

export const TripOperations: React.FC = () => {
  // Mock Trips Data
  const trips: Trip[] = [
    {
      id: 'TR-3021',
      driverName: 'Robert Jenkins',
      driverSub: 'Cert: HAZMAT / Class A',
      driverSafety: '4.9',
      driverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      vehicleName: 'Freightliner C-12',
      vehicleSub: 'Reg: TRANS-772 • EV Hybrid',
      cargo: '18,500 lbs',
      routeCode: 'CHI ➜ DET',
      routeFull: 'Chicago, IL ➜ Detroit, MI',
      progress: 85,
      status: 'DELAYED',
      statusSub: '20m delay',
      eta: '14:45 PM',
      source: 'Depot 4, Industrial Pkwy',
      destination: 'Terminal West, Dock 12',
      fuelConsumed: '42.4 L',
      opCost: '$1,142',
      timeline: [
        { title: 'Gate Out: Depot 4', time: '08:30 AM', status: 'Completed' },
        { title: 'Traffic Congestion: Highway 101', time: '10:15 AM', status: '15m Delay added', isAlert: true }
      ]
    },
    {
      id: 'TR-3025',
      driverName: 'Elena Rodriguez',
      driverSub: 'Cert: Standard / Class B',
      driverSafety: '4.8',
      driverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      vehicleName: 'Kenworth T680',
      vehicleSub: 'Reg: TRANS-991 • Diesel',
      cargo: '12,200 lbs',
      routeCode: 'AUS ➜ HOU',
      routeFull: 'Austin, TX ➜ Houston, TX',
      progress: 45,
      status: 'ON SCHEDULE',
      statusSub: 'On Schedule',
      eta: '16:30 PM',
      source: 'Austin Depot 2, Tech Blvd',
      destination: 'Houston Port, Gate B',
      fuelConsumed: '31.8 L',
      opCost: '$845',
      timeline: [
        { title: 'Gate Out: Austin Depot', time: '11:00 AM', status: 'Completed' },
        { title: 'In Transit: Highway I-10', time: '01:15 PM', status: 'On Schedule' }
      ]
    },
    {
      id: 'TR-3028',
      driverName: 'Marcus Thome',
      driverSub: 'Cert: Class A',
      driverSafety: '4.6',
      driverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      vehicleName: 'Peterbilt 579',
      vehicleSub: 'Reg: TRANS-105 • Diesel',
      cargo: '24,000 lbs',
      routeCode: 'DEN ➜ SLC',
      routeFull: 'Denver, CO ➜ Salt Lake City, UT',
      progress: 15,
      status: 'ON SCHEDULE',
      statusSub: 'On Schedule',
      eta: '19:15 PM',
      source: 'Denver Logistics, Hub 4',
      destination: 'Salt Lake Terminal, Dock A',
      fuelConsumed: '82.5 L',
      opCost: '$2,180',
      timeline: [
        { title: 'Gate Out: Denver Hub 4', time: '06:00 AM', status: 'Completed' },
        { title: 'Port Entry: SLC Gate A', time: '08:30 AM', status: 'Completed' },
        { title: 'Roadblock Warning: Route I-80', time: '09:45 AM', status: 'Reroute Suggested', isAlert: true }
      ]
    }
  ];

  const [selectedId, setSelectedId] = useState<string>('TR-3021');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const selectedTrip = trips.find(t => t.id === selectedId) || trips[0];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter relative pb-20">
        
        {/* Title Header with Buttons */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Trip Operations</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Monitor active trips, track deliveries, manage trip lifecycle, and optimize transportation efficiency.
            </p>
          </div>
          <div className="flex items-center gap-3 font-inter">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95">
              <Filter className="w-4 h-4 text-slate-400" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95">
              <Download className="w-4 h-4 text-slate-400" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4.5 py-2.5 bg-[#4F5B73] hover:bg-[#3E4A61] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-95">
              <Compass className="w-4 h-4" />
              Dispatch Trip
            </button>
            <button className="flex items-center gap-2 px-4.5 py-2.5 bg-black hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              Create Trip
            </button>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Total Trips */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Trips</span>
              <span className="text-emerald-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50">📈 ~12%</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-1">1,482</span>
            </div>
          </div>

          {/* Active Trips */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Trips</span>
              <span className="text-blue-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50">📈 ~5%</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-1">245</span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Pending</span>
              <span className="text-amber-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50">Steady</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-1">84</span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Completed</span>
              <span className="text-emerald-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50">📈 ~18%</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-1">1,153</span>
            </div>
          </div>

          {/* Delayed */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between border-l-4 border-l-rose-500">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Delayed</span>
              <span className="text-rose-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50">📉 ~4%</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-1">12</span>
            </div>
          </div>

          {/* Utilization */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Utilization</span>
              <span className="text-blue-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50">Optimal</span>
            </div>
            <div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block mb-1">94%</span>
            </div>
          </div>
        </section>

        {/* Pipeline & AI Operations Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Trip Lifecycle Pipeline (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Trip Lifecycle Pipeline</h3>
              <button className="text-slate-400 hover:text-slate-600 font-extrabold">•••</button>
            </div>

            <div className="relative flex items-center justify-between py-6 px-4">
              {/* Connector line */}
              <div className="absolute left-10 right-10 h-0.5 bg-slate-100 top-1/2 -translate-y-1/2 z-0"></div>

              {/* Step 1: Draft */}
              <div className="flex flex-col items-center gap-2.5 z-10">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm">
                  📄
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Draft</span>
                  <span className="text-xs font-black text-slate-800 mt-0.5 block">32</span>
                </div>
              </div>

              {/* Step 2: Dispatched */}
              <div className="flex flex-col items-center gap-2.5 z-10">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs shadow-sm">
                  ➤
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Dispatched</span>
                  <span className="text-xs font-black text-slate-800 mt-0.5 block">52</span>
                </div>
              </div>

              {/* Step 3: In Transit */}
              <div className="flex flex-col items-center gap-2.5 z-10">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  🚚
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 block uppercase">In Transit</span>
                  <span className="text-xs font-black text-blue-600 mt-0.5 block">188</span>
                </div>
              </div>

              {/* Step 4: Completed */}
              <div className="flex flex-col items-center gap-2.5 z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shadow-sm">
                  ✔
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Completed</span>
                  <span className="text-xs font-black text-slate-800 mt-0.5 block">1,153</span>
                </div>
              </div>

              {/* Step 5: Cancelled */}
              <div className="flex flex-col items-center gap-2.5 z-10">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shadow-sm">
                  🗙
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Cancelled</span>
                  <span className="text-xs font-black text-slate-800 mt-0.5 block">5</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Operations Insights (Right 4 cols) */}
          <div className="lg:col-span-4 bg-[#111827] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="font-outfit font-extrabold text-slate-200 text-sm flex items-center gap-2 mb-4">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                AI Operations Insights
              </h3>

              <div className="space-y-3.5">
                {/* Alert 1 */}
                <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-800/20 rounded-xl p-3.5">
                  <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-200">Route A efficiency optimization</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      Suggested shift to Highway bypass to save 12 mins.
                    </p>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-800/20 rounded-xl p-3.5">
                  <div className="bg-rose-500/10 text-rose-400 p-1.5 rounded-lg shrink-0 mt-0.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-200">Trip #3021 delay risk predicted</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      Heavy congestion at Sector 4. Likely 20 min delay.
                    </p>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-800/20 rounded-xl p-3.5">
                  <div className="bg-sky-500/10 text-sky-400 p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-200">Vehicle V-12 suitability</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      Load matches engine performance profile perfectly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Trips Command Center */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Trip Cards List (Left 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Active Trips Command Center</h3>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">245 Live</span>
            </div>

            <div className="space-y-3">
              {trips.map((trip) => {
                const isSelected = selectedId === trip.id;
                return (
                  <div 
                    key={trip.id}
                    onClick={() => {
                      setSelectedId(trip.id);
                      setDrawerOpen(true);
                    }}
                    className={`border rounded-xl p-4 cursor-pointer hover:bg-slate-50 transition-colors space-y-3 ${
                      isSelected ? 'border-slate-900 bg-slate-50/60 shadow-sm' : 'border-slate-150'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">Trip #{trip.id}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{trip.driverName} • {trip.vehicleName}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        trip.status === 'DELAYED' 
                          ? 'bg-rose-50 text-rose-500 border border-rose-100' 
                          : 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                      }`}>
                        {trip.statusSub.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                        <span>{trip.routeFull}</span>
                        <span>{trip.progress}% Complete</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            trip.status === 'DELAYED' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} 
                          style={{ width: `${trip.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-[10px] font-bold text-slate-400">
                      <span>⏱ ETA: {trip.eta}</span>
                      <button className="text-blue-600 hover:underline flex items-center gap-0.5">
                        View Details
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regional Route Map (Right 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-4 flex justify-between items-center border-b border-slate-100 bg-[#F8F9FC]/60">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Routing Map</span>
              <div className="flex gap-1">
                <button className="px-2.5 py-1 bg-white border border-slate-200 text-[10px] font-bold rounded-lg text-slate-700 shadow-sm">Map View</button>
                <button className="px-2.5 py-1 bg-white border border-slate-200 text-[10px] font-bold rounded-lg text-slate-700 shadow-sm">Satellite</button>
              </div>
            </div>

            <div className="relative bg-[#E8ECEF] min-h-[300px] flex-1 overflow-hidden">
              {/* Detailed Routing Map SVG representation */}
              <svg className="w-full h-full opacity-90 absolute inset-0 z-0" viewBox="0 0 600 300" fill="none">
                {/* Lakes */}
                <path d="M 400 0 C 440 80 480 120 580 90 L 600 0 Z" fill="#BED9FD" />
                
                {/* States Grid */}
                <path d="M 0 120 L 600 120" stroke="#FFFFFF" strokeWidth="3" />
                <path d="M 180 0 L 180 300" stroke="#FFFFFF" strokeWidth="3" />
                <path d="M 380 0 L 380 300" stroke="#FFFFFF" strokeWidth="4" />
                
                {/* Dotted Route path CHI to DET */}
                <path d="M 150 160 C 230 180 340 220 480 150" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 10" />
                <path d="M 150 160 C 230 180 340 220 480 150" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5" />

                {/* Cities */}
                <circle cx="150" cy="160" r="5" fill="#3B82F6" />
                <circle cx="150" cy="160" r="10" stroke="#3B82F6" strokeWidth="2" opacity="0.3" />
                <text x="120" y="145" fill="#1E293B" fontSize="10" fontWeight="900" fontFamily="Outfit">Chicago, IL</text>

                <circle cx="480" cy="150" r="5" fill="#3B82F6" />
                <circle cx="480" cy="150" r="10" stroke="#3B82F6" strokeWidth="2" opacity="0.3" />
                <text x="475" y="135" fill="#1E293B" fontSize="10" fontWeight="900" fontFamily="Outfit">Detroit, MI</text>

                {/* Vehicle plotting on route */}
                <circle cx="340" cy="195" r="7" fill="#EF4444" className="animate-pulse" />
                <circle cx="340" cy="195" r="14" stroke="#EF4444" strokeWidth="2" opacity="0.4" className="animate-ping" />
              </svg>

              {/* Map floating labels */}
              <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200/50 shadow rounded-lg px-2.5 py-1 z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span className="text-[9px] font-bold text-slate-800">Route Chicago-Detroit</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section (Trip Log & Selection Drawer) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Comprehensive Trip Log (Left 8 cols / or wider if drawer closed) */}
          <div className={`${drawerOpen ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm transition-all duration-300`}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Comprehensive Trip Log</h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick find..."
                  className="pl-8 pr-3 py-1.5 bg-[#F8F9FC] border border-slate-200 text-xs font-semibold rounded-lg w-40 focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">TRIP ID</th>
                    <th className="pb-3">DRIVER</th>
                    <th className="pb-3">VEHICLE</th>
                    <th className="pb-3">ROUTE</th>
                    <th className="pb-3 text-right">CARGO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {trips.map((trip) => {
                    const isSelected = selectedId === trip.id;
                    return (
                      <tr 
                        key={trip.id}
                        onClick={() => {
                          setSelectedId(trip.id);
                          setDrawerOpen(true);
                        }}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-50/80' : ''
                        }`}
                      >
                        <td className="py-4 font-black text-slate-900">#{trip.id}</td>
                        <td className="py-4 flex items-center gap-2">
                          <img 
                            src={trip.driverImage} 
                            alt={trip.driverName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          {trip.driverName}
                        </td>
                        <td className="py-4 text-slate-800">{trip.vehicleName}</td>
                        <td className="py-4 font-bold text-slate-500">{trip.routeCode}</td>
                        <td className="py-4 text-right text-slate-500">{trip.cargo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic Trip Detail Side Drawer/Panel (Right 4 cols) */}
          {drawerOpen && (
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col font-inter relative">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trip Detail</span>
                  <h3 className="font-outfit font-extrabold text-slate-900 text-base mt-0.5">#{selectedTrip.id}</h3>
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 space-y-6">
                
                {/* Source & Destination Nodes */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 relative">
                  {/* Vertical dotted line */}
                  <div className="absolute left-6.5 top-9 bottom-9 w-0.5 bg-slate-200 border-l border-dashed z-0"></div>

                  <div className="flex gap-3 z-10 relative">
                    <span className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow-sm flex items-center justify-center mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </span>
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase block tracking-wider">Source</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">{selectedTrip.source}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 z-10 relative">
                    <span className="w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-sm flex items-center justify-center mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                    </span>
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase block tracking-wider">Destination</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">{selectedTrip.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Operational Metrics */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Metrics</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5">
                      <span className="text-[9px] font-bold text-slate-400 block tracking-wide">⛽ Fuel Consumed</span>
                      <span className="text-sm font-black text-slate-850 font-outfit mt-1 block">{selectedTrip.fuelConsumed}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5">
                      <span className="text-[9px] font-bold text-slate-400 block tracking-wide">💵 Op. Cost</span>
                      <span className="text-sm font-black text-slate-850 font-outfit mt-1 block">{selectedTrip.opCost}</span>
                    </div>
                  </div>
                </div>

                {/* Driver & Vehicle */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Driver & Vehicle</span>
                  
                  {/* Driver Card */}
                  <div className="border border-slate-150 rounded-xl p-3.5 flex items-center gap-3 bg-white hover:bg-slate-50/50 transition-colors">
                    <img 
                      src={selectedTrip.driverImage} 
                      alt={selectedTrip.driverName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{selectedTrip.driverName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Verified Driver • {selectedTrip.driverSafety} ★</p>
                    </div>
                  </div>

                  {/* Vehicle Card */}
                  <div className="border border-slate-150 rounded-xl p-3.5 flex items-center gap-3 bg-white">
                    <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-650">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{selectedTrip.vehicleName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{selectedTrip.vehicleSub}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Timeline */}
                <div className="space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trip Timeline</span>
                  
                  <div className="space-y-4 pl-3 relative border-l border-slate-150">
                    {selectedTrip.timeline.map((step, idx) => (
                      <div key={idx} className="relative pl-4">
                        {/* Dot indicator */}
                        <span className={`absolute -left-[18.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow ${
                          step.isAlert ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                        }`} />
                        <div>
                          <h5 className="text-[11px] font-black text-slate-800">{step.title}</h5>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                            {step.time} • <span className={step.isAlert ? 'text-rose-500' : 'text-emerald-500'}>{step.status}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-3">
                  <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs text-center">
                    Report Issue
                  </button>
                  <button className="bg-black hover:bg-slate-900 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md text-center">
                    Live Tracking
                  </button>
                </div>

              </div>
            </div>
          )}

        </section>

        {/* Floating Bottom Alert Warning Banner */}
        <section className="fixed bottom-0 left-64 right-0 bg-red-950 border-t border-red-900/60 p-4 z-35 flex items-center justify-between text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-rose-500 text-white p-1 rounded-lg shrink-0 animate-bounce">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs font-black block text-rose-300">Critical Operational Alerts (3)</span>
              <span className="text-[10px] text-slate-300 font-semibold block mt-0.5">High-priority disruptions requiring immediate manager oversight.</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="bg-slate-900/80 border border-slate-800 text-[9px] font-black px-2.5 py-1 rounded">
              Delay: Trip #3021 (+20m)
            </span>
            <span className="bg-slate-900/80 border border-slate-800 text-[9px] font-black px-2.5 py-1 rounded">
              Capacity: Austin Hub (88%)
            </span>
            <button className="bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] px-3.5 py-1 rounded shadow-sm transition-all active:scale-95">
              Resolve All
            </button>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};
