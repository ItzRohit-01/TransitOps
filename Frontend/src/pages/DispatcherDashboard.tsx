import React, { useState } from 'react';
import { 
  Check, 
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface MockVehicle {
  id: string;
  name: string;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
  details: string;
}

interface MockDriver {
  id: string;
  name: string;
  status: 'Available' | 'On Trip' | 'Suspended';
  licenseStatus: 'Valid' | 'Expired';
  licenseExpiry: string;
  details: string;
}

interface MockTrip {
  id: string;
  route: string;
  source: string;
  destination: string;
  cargo: string;
  distance: string;
  eta: string;
  status: 'Draft' | 'Ready' | 'Dispatched' | 'In Transit' | 'Completed';
  driver?: string;
  vehicle?: string;
  progress: number;
}

export const DispatcherDashboard: React.FC = () => {
  // Master Lists for Assignment Center
  const [vehicles, setVehicles] = useState<MockVehicle[]>([
    { id: 'V-105', name: 'Volvo VNL 640', status: 'Available', details: 'Reg: TRANS-105 • Diesel' },
    { id: 'V-118', name: 'Kenworth T680', status: 'Available', details: 'Reg: TRANS-991 • Diesel' },
    { id: 'V-202', name: 'Freightliner C-12', status: 'Available', details: 'Reg: TRANS-772 • EV Hybrid' },
    { id: 'V-305', name: 'Peterbilt 579', status: 'In Shop', details: 'Maintenance Pending' },
    { id: 'V-902', name: 'Ford Transit', status: 'Retired', details: 'Decommissioned' },
    { id: 'V-109', name: 'Mack Anthem', status: 'On Trip', details: 'Active Route CHI-DET' }
  ]);

  const [drivers, setDrivers] = useState<MockDriver[]>([
    { id: 'D-9021', name: 'Marcus Chen', status: 'Available', licenseStatus: 'Valid', licenseExpiry: '2026-10-15', details: 'Class A' },
    { id: 'D-8042', name: 'Sarah Jenkins', status: 'Available', licenseStatus: 'Valid', licenseExpiry: '2026-09-01', details: 'Class B' },
    { id: 'D-7721', name: 'Robert Jenkins', status: 'Available', licenseStatus: 'Valid', licenseExpiry: '2026-12-10', details: 'Class A' },
    { id: 'D-5510', name: 'David Miller', status: 'Suspended', licenseStatus: 'Valid', licenseExpiry: '2027-02-14', details: 'Suspended' },
    { id: 'D-1102', name: 'John Doe', status: 'Available', licenseStatus: 'Expired', licenseExpiry: '2026-06-01', details: 'Expired Class A' },
    { id: 'D-6421', name: 'Elena Rodriguez', status: 'On Trip', licenseStatus: 'Valid', licenseExpiry: '2026-11-20', details: 'Active Route' }
  ]);

  // Initial Trip pool
  const [trips, setTrips] = useState<MockTrip[]>([
    { id: 'TR-3021', route: 'CHI ➜ DET', source: 'Chicago Depot 4', destination: 'Detroit Terminal West', cargo: '18,500 lbs', distance: '480 km', eta: '14:45 PM', status: 'In Transit', driver: 'Robert Jenkins', vehicle: 'Freightliner C-12', progress: 85 },
    { id: 'TR-3025', route: 'AUS ➔ HOU', source: 'Austin Depot 2', destination: 'Houston Port Gate B', cargo: '12,200 lbs', distance: '260 km', eta: '16:30 PM', status: 'Dispatched', driver: 'Elena Rodriguez', vehicle: 'Mack Anthem', progress: 45 },
    { id: 'TR-2908', route: 'DEN ➜ SLC', source: 'Denver Hub 4', destination: 'Salt Lake Dock A', cargo: '24,000 lbs', distance: '820 km', eta: '19:15 PM', status: 'Draft', progress: 0 }
  ]);

  // Dynamic selector values for Assignment form
  const [selectedTripId, setSelectedTripId] = useState<string>('TR-2908');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('V-105');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('D-9021');

  // Selected Trip details panel ID
  const [activeDetailsId, setActiveDetailsId] = useState<string>('TR-3021');

  // Validation/Alert messages state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Activity Log
  const [activityFeed, setActivityFeed] = useState<string[]>([
    '14:22 PM - Trip #TR-3021 Dispatched (Driver: Robert Jenkins)',
    '14:15 PM - Driver Elena Rodriguez assigned to Vehicle V-109',
    '13:50 PM - New Draft Trip #TR-2908 created in pipeline'
  ]);

  // Handle move Kanban trip state
  const moveTrip = (tripId: string, nextStatus: MockTrip['status']) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          status: nextStatus,
          progress: nextStatus === 'Completed' ? 100 : nextStatus === 'In Transit' ? 50 : nextStatus === 'Dispatched' ? 10 : t.progress
        };
      }
      return t;
    }));
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [`${timeStr} - Trip #${tripId} state updated to ${nextStatus}`, ...prev]);
  };

  // Assign & Dispatch Logic (Enforcing Business Rules)
  const handleAssignAndDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMsg(null);

    const targetTrip = trips.find(t => t.id === selectedTripId);
    const targetVehicle = vehicles.find(v => v.id === selectedVehicleId);
    const targetDriver = drivers.find(d => d.id === selectedDriverId);

    if (!targetTrip || !targetVehicle || !targetDriver) {
      setValidationError('Please ensure you select a valid Trip, Vehicle, and Driver.');
      return;
    }

    // Rule 1: Vehicle In Shop
    if (targetVehicle.status === 'In Shop') {
      setValidationError(`Vehicle ${targetVehicle.name} is currently In Shop for maintenance.`);
      return;
    }

    // Rule 2: Vehicle Retired
    if (targetVehicle.status === 'Retired') {
      setValidationError(`Vehicle ${targetVehicle.name} is Retired and cannot be dispatched.`);
      return;
    }

    // Rule 3: Driver Suspended
    if (targetDriver.status === 'Suspended') {
      setValidationError(`Driver ${targetDriver.name} is currently Suspended.`);
      return;
    }

    // Rule 4: Driver License Expired
    if (targetDriver.licenseStatus === 'Expired') {
      setValidationError(`Driver ${targetDriver.name} has an Expired license.`);
      return;
    }

    // Rule 5: Vehicle already On Trip
    if (targetVehicle.status === 'On Trip') {
      setValidationError(`Vehicle ${targetVehicle.name} is already On Trip.`);
      return;
    }

    // Rule 6: Driver already On Trip
    if (targetDriver.status === 'On Trip') {
      setValidationError(`Driver ${targetDriver.name} is already On Trip.`);
      return;
    }

    // All rules pass ➔ Dispatch
    setTrips(prev => prev.map(t => {
      if (t.id === selectedTripId) {
        return {
          ...t,
          status: 'Dispatched',
          vehicle: targetVehicle.name,
          driver: targetDriver.name,
          progress: 10
        };
      }
      return t;
    }));

    // Update statuses to "On Trip"
    setVehicles(prev => prev.map(v => v.id === selectedVehicleId ? { ...v, status: 'On Trip' } : v));
    setDrivers(prev => prev.map(d => d.id === selectedDriverId ? { ...d, status: 'On Trip' } : d));

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [
      `${timeStr} - Trip #${selectedTripId} successfully assigned to ${targetDriver.name} (Vehicle: ${targetVehicle.name})`,
      ...prev
    ]);

    setSuccessMsg(`Successfully dispatched Trip #${selectedTripId}!`);
    setActiveDetailsId(selectedTripId);
  };

  // Helper count logic for utilization cards
  const availableVehiclesCount = vehicles.filter(v => v.status === 'Available').length;
  const availableDriversCount = drivers.filter(d => d.status === 'Available').length;
  const activeTripsCount = trips.filter(t => t.status === 'In Transit').length;
  const pendingTripsCount = trips.filter(t => t.status === 'Dispatched' || t.status === 'Ready').length;
  const delayedTripsCount = trips.filter(t => t.id === 'TR-3021').length; // static delayed trip CHI-DET

  const selectedPanelTrip = trips.find(t => t.id === activeDetailsId) || trips[0];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Top Header Summary */}
        <section className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Dispatcher Command Center</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Plan routes, assign drivers and vehicles, track telemetry dispatches, and enforce business fleet policies.
            </p>
          </div>
        </section>

        {/* Stats KPIs row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Available Vehicles */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Available Vehicles</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">{availableVehiclesCount}</span>
          </div>

          {/* Available Drivers */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Available Drivers</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">{availableDriversCount}</span>
          </div>

          {/* Active Trips */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Active Trips</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">{activeTripsCount}</span>
          </div>

          {/* Pending Trips */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Pending Trips</span>
            <span className="text-3xl font-black text-slate-950 font-outfit">{pendingTripsCount}</span>
          </div>

          {/* Delayed Trips */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm border-l-4 border-l-rose-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Delayed Trips</span>
            <span className="text-3xl font-black text-rose-500 font-outfit">{delayedTripsCount}</span>
          </div>

          {/* Fleet Utilization */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Fleet Util.</span>
            <span className="text-3xl font-black text-emerald-500 font-outfit">94%</span>
          </div>
        </section>

        {/* Trip Assignment Center (Interactive form and business validation rules) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form assignment (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Trip Assignment Center</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Assign resources to unassigned trips and dispatch instantly</p>
            </div>

            {/* Error alerts */}
            {validationError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-4 rounded-xl flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span><strong>Validation Conflict:</strong> {validationError}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-xl flex items-center gap-2.5 animate-fadeIn">
                <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAssignAndDispatch} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold">
              {/* Select Unassigned Trip */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400">Select Trip</label>
                <select 
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-800 font-semibold text-slate-800"
                >
                  {trips.filter(t => !t.driver).map(t => (
                    <option key={t.id} value={t.id}>{t.id} ({t.route})</option>
                  ))}
                </select>
              </div>

              {/* Select Vehicle */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400">Assign Vehicle</label>
                <select 
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-800 font-semibold text-slate-800"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.id} - {v.name} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Driver */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400">Assign Driver</label>
                <select 
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-800 font-semibold text-slate-800"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} - {d.name} ({d.status === 'Available' && d.licenseStatus === 'Expired' ? 'Expired' : d.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button 
                  type="submit" 
                  className="bg-black hover:bg-slate-900 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  ⚡ Assign & Dispatch Trip
                </button>
              </div>
            </form>
          </div>

          {/* Business Policy Guidelines (Right 4 cols) */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-outfit font-extrabold text-slate-900 text-xs uppercase tracking-wide">Dispatcher Business Rules</h4>
            <ul className="text-xs font-semibold text-slate-600 space-y-3 pl-3 list-disc">
              <li>Vehicles marked as <strong className="text-slate-800">In Shop</strong> or <strong className="text-slate-800">Retired</strong> cannot be scheduled.</li>
              <li>Drivers flagged as <strong className="text-rose-500">Suspended</strong> are restricted from active routing.</li>
              <li>Drivers with <strong className="text-rose-500">Expired Licenses</strong> are blocked from logging in.</li>
              <li>Vehicles and drivers currently <strong className="text-indigo-600">On Trip</strong> are locked until completion.</li>
            </ul>
          </div>

        </section>

        {/* Dispatch Kanban Board */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Visual Dispatch Board</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Track and progress trips through operational lifecycle columns</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Column 1: Draft */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">Draft</span>
              {trips.filter(t => t.status === 'Draft').map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-slate-400 font-bold">{t.route}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); moveTrip(t.id, 'Ready'); }} className="w-full text-center py-1 bg-slate-900 hover:bg-slate-950 text-white rounded text-[9px] font-bold">
                    ➤ Ready
                  </button>
                </div>
              ))}
            </div>

            {/* Column 2: Ready */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">Ready</span>
              {trips.filter(t => t.status === 'Ready').map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-slate-400 font-bold">{t.route}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); moveTrip(t.id, 'Dispatched'); }} className="w-full text-center py-1 bg-slate-900 hover:bg-slate-950 text-white rounded text-[9px] font-bold">
                    ➤ Dispatch
                  </button>
                </div>
              ))}
            </div>

            {/* Column 3: Dispatched */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">Dispatched</span>
              {trips.filter(t => t.status === 'Dispatched').map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-slate-400 font-bold">{t.route}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); moveTrip(t.id, 'In Transit'); }} className="w-full text-center py-1 bg-[#4F5B73] hover:bg-[#3E4A61] text-white rounded text-[9px] font-bold">
                    ➤ In Transit
                  </button>
                </div>
              ))}
            </div>

            {/* Column 4: In Transit */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">In Transit</span>
              {trips.filter(t => t.status === 'In Transit').map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-slate-400 font-bold">{t.route}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden my-1">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${t.progress}%` }}></div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); moveTrip(t.id, 'Completed'); }} className="w-full text-center py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold">
                    ➤ Complete
                  </button>
                </div>
              ))}
            </div>

            {/* Column 5: Completed */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">Completed</span>
              {trips.filter(t => t.status === 'Completed').map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-emerald-500 font-bold">Completed</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block">{t.route}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Live Operations Board & Resource Utilization */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Live Operations Board Table (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">Live Operations Board</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">TRIP ID</th>
                    <th className="pb-3">ROUTE</th>
                    <th className="pb-3">DRIVER</th>
                    <th className="pb-3">VEHICLE</th>
                    <th className="pb-3">PROGRESS</th>
                    <th className="pb-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {trips.map((trip) => (
                    <tr 
                      key={trip.id} 
                      onClick={() => setActiveDetailsId(trip.id)}
                      className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                        activeDetailsId === trip.id ? 'bg-slate-50' : ''
                      }`}
                    >
                      <td className="py-4 font-black text-slate-900">#{trip.id}</td>
                      <td className="py-4 text-slate-550 font-bold">{trip.route}</td>
                      <td className="py-4 flex items-center gap-2">
                        {trip.driver ? (
                          <>
                            <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">👤</span>
                            {trip.driver}
                          </>
                        ) : 'Unassigned'}
                      </td>
                      <td className="py-4 text-slate-800">{trip.vehicle || 'Unassigned'}</td>
                      <td className="py-4 w-28">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-950 rounded-full" style={{ width: `${trip.progress}%` }}></div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">{trip.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                          trip.status === 'In Transit' ? 'bg-amber-50 text-amber-500' :
                          trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {trip.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resource Utilization summary bars (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Resource Availability</h3>
            
            {/* Vehicles status bar */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicles</span>
              <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span>Available</span>
                  <span className="font-extrabold">3 / 6</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>

            {/* Drivers status bar */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drivers</span>
              <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span>Available</span>
                  <span className="font-extrabold">3 / 6</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Operations Map & Alert Center & Timeline log */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Operations Map SVG representation (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-4 border-b border-slate-100 bg-[#F8F9FC]/60">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Regional Live Routing Map</span>
            </div>
            <div className="relative bg-[#E8ECEF] min-h-[300px] flex-1 overflow-hidden">
              <svg className="w-full h-full opacity-90 absolute inset-0 z-0" viewBox="0 0 600 300" fill="none">
                <path d="M 400 0 C 440 80 480 120 580 90 L 600 0 Z" fill="#BED9FD" />
                <path d="M 0 120 L 600 120" stroke="#FFFFFF" strokeWidth="3" />
                <path d="M 180 0 L 180 300" stroke="#FFFFFF" strokeWidth="3" />
                
                {/* Active routes */}
                <path d="M 150 160 C 230 180 340 220 480 150" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 8" />
                <circle cx="150" cy="160" r="5" fill="#3B82F6" />
                <circle cx="480" cy="150" r="5" fill="#3B82F6" />

                {/* Delayed vehicle */}
                <circle cx="340" cy="195" r="7" fill="#EF4444" className="animate-pulse" />
                <circle cx="340" cy="195" r="14" stroke="#EF4444" strokeWidth="2" opacity="0.4" className="animate-ping" />
              </svg>

              <div className="absolute bottom-4 left-4 bg-white border border-slate-200/50 shadow rounded-lg px-2.5 py-1 z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span className="text-[9px] font-bold text-slate-800">Dispatch Map Grid</span>
              </div>
            </div>
          </div>

          {/* Alert Center (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Alert Center</h3>
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="border border-rose-100 bg-rose-50/50 rounded-xl p-3 flex gap-2.5">
                <span className="text-rose-500 shrink-0">⚠️</span>
                <div>
                  <h4 className="text-slate-900 font-bold">Delayed Trip: #TR-3021</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Delayed by 20m due to traffic congestion.</p>
                </div>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-3 flex gap-2.5">
                <span className="text-slate-400 shrink-0">ℹ️</span>
                <div>
                  <h4 className="text-slate-900 font-bold">Driver License Expired</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Driver John Doe has expired license. Blocked.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Bottom Trip details panel & Timeline feed */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Trip Details panel (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Trip Details Panel</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Selected trip overview and timeline logs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Trip stats */}
              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span>Trip ID</span>
                  <span className="text-slate-900 font-black">#{selectedPanelTrip.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Driver</span>
                  <span className="text-slate-900 font-black">{selectedPanelTrip.driver || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Vehicle</span>
                  <span className="text-slate-900 font-black">{selectedPanelTrip.vehicle || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Route Code</span>
                  <span className="text-slate-900 font-black">{selectedPanelTrip.route}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cargo Weight</span>
                  <span className="text-slate-900 font-black">{selectedPanelTrip.cargo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance</span>
                  <span className="text-slate-900 font-black">{selectedPanelTrip.distance || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>ETA</span>
                  <span className="text-slate-900 font-black">{selectedPanelTrip.eta || '---'}</span>
                </div>
              </div>

              {/* Progress and status */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Trip Progress</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-950 rounded-full" style={{ width: `${selectedPanelTrip.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-black text-slate-800">{selectedPanelTrip.progress}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Trip Timeline events</span>
                  <div className="space-y-2.5 pl-3 relative border-l border-slate-150 text-[10px] font-bold text-slate-500">
                    <div className="relative pl-3">
                      <span className="absolute -left-[16px] top-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Trip Created & Logged</span>
                    </div>
                    {selectedPanelTrip.driver && (
                      <div className="relative pl-3">
                        <span className="absolute -left-[16px] top-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Driver {selectedPanelTrip.driver} Assigned</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Activity Feed</h3>
            <div className="space-y-4 text-[10px] font-bold text-slate-500 pl-3 relative border-l border-slate-200/60">
              {activityFeed.map((log, idx) => (
                <div key={idx} className="relative pl-3">
                  <span className="absolute -left-[16px] top-1 w-1.5 h-1.5 rounded-full bg-slate-950" />
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
