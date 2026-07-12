import React, { useState } from 'react';
import { 
  Filter, 
  Download, 
  Plus, 
  Search, 
  Settings2, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Gauge, 
  ExternalLink 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Vehicle {
  reg: string;
  name: string;
  subtitle: string;
  capacity: string;
  health: number;
  status: 'ON TRIP' | 'AVAILABLE' | 'IN SHOP' | 'RETIRED';
  odometer: string;
  efficiency: string;
  assignment: string;
  nextSvc: string;
  image: string;
}

export const FleetManagement: React.FC = () => {
  // Mock Vehicle Data
  const vehicles: Vehicle[] = [
    {
      reg: 'V-102',
      name: 'Freightliner M2',
      subtitle: 'Heavy Duty • Mark Evans',
      capacity: '26,000 lbs',
      health: 92,
      status: 'ON TRIP',
      odometer: '248,310 km',
      efficiency: '14.2 L/100km',
      assignment: 'Region West',
      nextSvc: '3,400 km',
      image: '/white_delivery_truck.png'
    },
    {
      reg: 'V-089',
      name: 'Ford F-550',
      subtitle: 'Medium Duty • Sarah Chen',
      capacity: '19,500 lbs',
      health: 98,
      status: 'AVAILABLE',
      odometer: '112,450 km',
      efficiency: '16.5 L/100km',
      assignment: 'Region East',
      nextSvc: '7,800 km',
      image: '/white_delivery_truck.png'
    },
    {
      reg: 'V-211',
      name: 'Hino 268',
      subtitle: 'Heavy Duty • Unassigned',
      capacity: '25,950 lbs',
      health: 64,
      status: 'IN SHOP',
      odometer: '310,220 km',
      efficiency: '15.0 L/100km',
      assignment: 'Maintenance Bay 4',
      nextSvc: '0 km',
      image: '/white_delivery_truck.png'
    },
    {
      reg: 'V-304',
      name: 'Ram ProMaster',
      subtitle: 'Van • Jamie Lopez',
      capacity: '4,600 lbs',
      health: 88,
      status: 'ON TRIP',
      odometer: '142,402 km',
      efficiency: '10.8 L/100km',
      assignment: 'Region South',
      nextSvc: '1,200 km',
      image: '/white_delivery_truck.png'
    },
    {
      reg: 'V-012',
      name: 'Peterbilt 579',
      subtitle: 'Heavy Duty • Dave Wright',
      capacity: '80,000 lbs',
      health: 42,
      status: 'RETIRED',
      odometer: '894,330 km',
      efficiency: '22.4 L/100km',
      assignment: 'Retired',
      nextSvc: 'Retired',
      image: '/white_delivery_truck.png'
    }
  ];

  const [selectedReg, setSelectedReg] = useState<string>('V-102');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedVehicle = vehicles.find(v => v.reg === selectedReg) || vehicles[0];

  // Fleet Status Donut Chart Data
  const fleetStatusData = [
    { name: 'Available', value: 96, color: '#10B981' },
    { name: 'On Trip', value: 342, color: '#3B82F6' },
    { name: 'In Shop', value: 34, color: '#F59E0B' }
  ];

  // Filtered vehicles based on search query
  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.reg.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Title Header with Buttons */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Fleet Management</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Manage vehicle lifecycle, utilization, maintenance status, and fleet health.
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
              Add Vehicle
            </button>
          </div>
        </section>

        {/* Top Mini Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Total Vehicles */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Total Vehicles</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">482</span>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1">+12</span>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Available</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">96</span>
              <span className="bg-slate-50 p-1 rounded-full text-emerald-500 mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* On Trip */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">On Trip</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">342</span>
              <span className="bg-slate-50 p-1 rounded-full text-blue-500 mb-1">
                <Activity className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* In Maintenance */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">In Maintenance</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">34</span>
              <span className="bg-slate-50 p-1 rounded-full text-amber-500 mb-1">
                <Wrench className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Retired */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Retired</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">10</span>
              <span className="bg-slate-50 p-1 rounded-full text-slate-400 mb-1">
                <Clock className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Fleet Util */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Fleet Util.</span>
              <span className="bg-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded shadow">82.4%</span>
            </div>
            <span className="text-xl font-black font-outfit mt-2">Optimal</span>
          </div>
        </section>

        {/* Dynamic Multi-Column Body Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1 (Left 3 cols) */}
          <div className="lg:col-span-3 space-y-8 flex flex-col">
            
            {/* Fleet Status Overview Donut Chart */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-4">Fleet Status Overview</h3>
              <div className="flex flex-col items-center justify-center relative py-2">
                <div className="w-36 h-36 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fleetStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {fleetStatusData.map((entry, index) => (
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

              <div className="space-y-2.5 mt-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Available</span>
                  </div>
                  <span className="text-slate-400 font-semibold">(96)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>On Trip</span>
                  </div>
                  <span className="text-slate-900">(342)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>In Shop</span>
                  </div>
                  <span className="text-slate-400 font-semibold">(34)</span>
                </div>
              </div>
            </div>

            {/* Maintenance Intelligence */}
            <div className="bg-amber-950 text-[#F5E6C4] rounded-2xl p-5 relative overflow-hidden shadow-md flex-1">
              {/* Geometric pattern */}
              <div className="absolute top-2 right-2 opacity-15">
                <Settings2 className="w-24 h-24 stroke-1" />
              </div>

              <h3 className="font-outfit font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 text-amber-400 mb-5">
                <TrendingUp className="w-4 h-4" />
                Maintenance Intelligence
              </h3>

              <div className="space-y-5">
                <div className="border-l-2 border-amber-500 pl-3">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-amber-300">V-102 Predictive Alert</h4>
                  <p className="text-xs font-semibold leading-relaxed text-slate-100 mt-1">
                    Vehicle requires service within 320 km based on fuel efficiency degradation.
                  </p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-amber-300">Regional Cost Variance</h4>
                  <p className="text-xs font-semibold leading-relaxed text-slate-100 mt-1">
                    Maintenance cost increased 12% in Sector 7 due to parts scarcity.
                  </p>
                </div>
              </div>
            </div>

            {/* Fleet Distribution Progress Bars */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-4">Fleet Distribution</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-800 mb-1">
                    <span>🚚 Heavy Duty</span>
                    <span>42%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-800 mb-1">
                    <span>🚛 Medium Trucks</span>
                    <span>28%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-800 mb-1">
                    <span>🚐 Vans</span>
                    <span>18%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-800 mb-1">
                    <span>🚘 Service Vehicles</span>
                    <span>12%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 2 (Middle 6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Vehicle Registry */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Vehicle Registry</span>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search registry..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-[#F8F9FC] border border-slate-200 text-xs font-semibold rounded-lg w-44 placeholder-slate-400 focus:outline-none focus:border-slate-500"
                    />
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-150 rounded-lg">
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">REG #</th>
                      <th className="pb-3">VEHICLE DETAILS</th>
                      <th className="pb-3">CAPACITY</th>
                      <th className="pb-3">HEALTH</th>
                      <th className="pb-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredVehicles.map((vehicle) => {
                      const isSelected = selectedReg === vehicle.reg;
                      return (
                        <tr 
                          key={vehicle.reg}
                          onClick={() => setSelectedReg(vehicle.reg)}
                          className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                            isSelected ? 'bg-slate-50/80' : ''
                          }`}
                        >
                          <td className="py-4 font-black text-slate-900">{vehicle.reg}</td>
                          <td className="py-4">
                            <div>
                              <div className="font-extrabold text-slate-800 text-xs">{vehicle.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{vehicle.subtitle}</div>
                            </div>
                          </td>
                          <td className="py-4 text-slate-500">{vehicle.capacity}</td>
                          <td className="py-4 w-28">
                            <div className="flex items-center gap-2">
                              <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    vehicle.health >= 85 
                                      ? 'bg-emerald-500' 
                                      : vehicle.health >= 60 
                                      ? 'bg-amber-500' 
                                      : 'bg-rose-500'
                                  }`} 
                                  style={{ width: `${vehicle.health}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500">{vehicle.health}%</span>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block ${
                              vehicle.status === 'ON TRIP' 
                                ? 'bg-blue-50 text-blue-600'
                                : vehicle.status === 'AVAILABLE'
                                ? 'bg-emerald-50 text-emerald-600'
                                : vehicle.status === 'IN SHOP'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {vehicle.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredVehicles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 font-semibold">
                          No matching vehicles found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      V-102 Assigned to Trip #8902
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                      Mark Evans • 14 minutes ago
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-amber-50 text-amber-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      V-211 Moved to 'In Shop'
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                      Maintenance Bay 4 • 2 hours ago
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Gauge className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      V-089 Status Update: Available
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                      Post-trip Inspection • 4 hours ago
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-slate-100 text-slate-600 p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      New Odometer Log: V-304
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                      Current: 142,402 km • 6 hours ago
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 3 (Right 3 cols) */}
          <div className="lg:col-span-3">
            
            {/* Selected Vehicle Panel */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md">
                  SELECTED: {selectedVehicle.reg}
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Truck image container */}
              <div className="bg-white border border-slate-200/50 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center p-3 shadow-sm relative">
                <img 
                  src={selectedVehicle.image} 
                  alt={selectedVehicle.name}
                  className="w-full h-full object-contain transform hover:scale-105 transition-transform"
                />
              </div>

              {/* Vehicle specific data grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Odometer</span>
                  <span className="text-xs font-black text-slate-800 font-outfit mt-1 block">
                    {selectedVehicle.odometer}
                  </span>
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Efficiency</span>
                  <span className="text-xs font-black text-slate-800 font-outfit mt-1 block">
                    {selectedVehicle.efficiency}
                  </span>
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Assignment</span>
                  <span className="text-xs font-black text-slate-800 font-outfit mt-1 block truncate">
                    {selectedVehicle.assignment}
                  </span>
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Next Svc</span>
                  <span className="text-xs font-black text-slate-800 font-outfit mt-1 block">
                    {selectedVehicle.nextSvc}
                  </span>
                </div>
              </div>

              {/* Health Score Progress Bar */}
              <div className="bg-white border border-slate-250/50 rounded-xl p-4 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                  <span>HEALTH SCORE</span>
                  <span className="text-emerald-500 font-black text-sm">{selectedVehicle.health}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      selectedVehicle.health >= 85 
                        ? 'bg-emerald-500' 
                        : selectedVehicle.health >= 60 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                    }`} 
                    style={{ width: `${selectedVehicle.health}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-wider">
                  <span>Critical</span>
                  <span>Optimal</span>
                </div>
              </div>

            </div>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};
