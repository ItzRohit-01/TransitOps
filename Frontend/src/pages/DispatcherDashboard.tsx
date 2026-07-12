import React, { useState, useEffect } from 'react';
import { 
  Check, 
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

interface MockVehicle {
  id: string;
  name: string;
  status: string;
  details: string;
}

interface MockDriver {
  id: string;
  name: string;
  status: string;
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
  status: string;
  statusSub: string;
  driver?: string;
  driverId?: string;
  vehicle?: string;
  vehicleId?: string;
  progress: number;
}

export const DispatcherDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<MockVehicle[]>([]);
  const [drivers, setDrivers] = useState<MockDriver[]>([]);
  const [trips, setTrips] = useState<MockTrip[]>([]);

  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const [activeDetailsId, setActiveDetailsId] = useState<string>('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [activityFeed, setActivityFeed] = useState<string[]>([]);

  useEffect(() => {
    const unsubTrips = onSnapshot(collection(db, 'trips'), (snapshot) => {
      const list: MockTrip[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          route: d.routeCode || 'N/A',
          source: d.source || 'N/A',
          destination: d.destination || 'N/A',
          cargo: d.cargo || 'N/A',
          distance: d.distance || '---',
          eta: d.eta || 'N/A',
          status: d.status || 'DRAFT',
          statusSub: d.statusSub || 'Draft',
          driver: d.driverName,
          driverId: d.driverId,
          vehicle: d.vehicleName,
          vehicleId: d.vehicleId,
          progress: d.progress || 0
        });
      });
      setTrips(list);
      if (list.length > 0 && !activeDetailsId) {
        setActiveDetailsId(list[0].id);
      }
      
      const draftTrips = list.filter(t => t.status === 'DRAFT' && !t.driver);
      if (draftTrips.length > 0 && !selectedTripId) setSelectedTripId(draftTrips[0].id);
    });

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const list: MockDriver[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        // check expiry
        const isExpired = d.expiryDate && new Date(d.expiryDate) < new Date();
        list.push({
          id: docSnap.id,
          name: d.name || 'Unknown',
          status: d.status || 'Available',
          licenseStatus: isExpired ? 'Expired' : 'Valid',
          licenseExpiry: d.expiryDate || 'N/A',
          details: d.category || 'Class A'
        });
      });
      setDrivers(list);
      const availDrivers = list.filter(d => d.status.toUpperCase() === 'AVAILABLE' || d.status.toUpperCase() === 'AVAILABLE');
      if (availDrivers.length > 0 && !selectedDriverId) setSelectedDriverId(availDrivers[0].id);
    });

    const unsubVehicles = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const list: MockVehicle[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          name: d.model || 'Unknown',
          status: d.status || 'Available',
          details: d.type || 'Diesel'
        });
      });
      setVehicles(list);
      const availVehicles = list.filter(v => v.status.toUpperCase() === 'AVAILABLE' || v.status.toUpperCase() === 'AVAILABLE');
      if (availVehicles.length > 0 && !selectedVehicleId) setSelectedVehicleId(availVehicles[0].id);
    });

    const unsubLogs = onSnapshot(collection(db, 'auditLogs'), (snapshot) => {
      const logs: string[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (d.timestamp) {
           const timeStr = d.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
           logs.push(`${timeStr} - ${d.details}`);
        }
      });
      setActivityFeed(logs.slice(0, 10)); // Top 10
    });

    return () => { unsubTrips(); unsubDrivers(); unsubVehicles(); unsubLogs(); };
  }, []);

  const moveTrip = async (tripId: string, nextStatus: string) => {
    try {
      let statusSub = 'Updated';
      let progress = 0;
      
      const targetTrip = trips.find(t => t.id === tripId);
      if (!targetTrip) return;

      if (nextStatus === 'ON SCHEDULE') { statusSub = 'In Transit'; progress = 10; }
      if (nextStatus === 'COMPLETED') { statusSub = 'Completed'; progress = 100; }
      if (nextStatus === 'CANCELLED') { statusSub = 'Cancelled'; progress = 0; }
      if (nextStatus === 'DRAFT') { statusSub = 'Ready'; progress = 5; }
      
      await updateDoc(doc(db, 'trips', tripId), { status: nextStatus, statusSub, progress });
      
      if (nextStatus === 'COMPLETED' || nextStatus === 'CANCELLED') {
        if (targetTrip.driverId) await updateDoc(doc(db, 'drivers', targetTrip.driverId), { status: 'AVAILABLE' });
        if (targetTrip.vehicleId) await updateDoc(doc(db, 'vehicles', targetTrip.vehicleId), { status: 'AVAILABLE' });
      }

      await addDoc(collection(db, 'auditLogs'), {
        action: 'KANBAN_MOVE',
        details: `Trip #${tripId} moved to ${nextStatus}`,
        userEmail: auth.currentUser?.email || 'dispatcher@transitops.global',
        timestamp: new Date()
      });
    } catch(err) {
       console.error(err);
    }
  };


  // Assign & Dispatch Logic (Enforcing Business Rules)
  const handleAssignAndDispatch = async (e: React.FormEvent) => {
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

    if (targetVehicle.status.toUpperCase() === 'IN SHOP' || targetVehicle.status.toUpperCase() === 'MAINTENANCE') {
      setValidationError(`Vehicle ${targetVehicle.name} is currently In Shop for maintenance.`);
      return;
    }

    if (targetVehicle.status.toUpperCase() === 'RETIRED') {
      setValidationError(`Vehicle ${targetVehicle.name} is Retired and cannot be dispatched.`);
      return;
    }

    if (targetDriver.status.toUpperCase() === 'SUSPENDED') {
      setValidationError(`Driver ${targetDriver.name} is currently Suspended.`);
      return;
    }

    if (targetDriver.licenseStatus === 'Expired') {
      setValidationError(`Driver ${targetDriver.name} has an Expired license.`);
      return;
    }

    if (targetVehicle.status.toUpperCase() === 'ON TRIP') {
      setValidationError(`Vehicle ${targetVehicle.name} is already On Trip.`);
      return;
    }

    if (targetDriver.status.toUpperCase() === 'ON TRIP') {
      setValidationError(`Driver ${targetDriver.name} is already On Trip.`);
      return;
    }

    try {
      await updateDoc(doc(db, 'trips', selectedTripId), {
        status: 'ON SCHEDULE',
        statusSub: 'Dispatched',
        progress: 10,
        driverName: targetDriver.name,
        driverId: targetDriver.id,
        vehicleName: targetVehicle.name,
        vehicleId: targetVehicle.id
      });

      await updateDoc(doc(db, 'vehicles', selectedVehicleId), { status: 'ON TRIP' });
      await updateDoc(doc(db, 'drivers', selectedDriverId), { status: 'ON TRIP' });

      await addDoc(collection(db, 'auditLogs'), {
        action: 'DISPATCH_TRIP',
        details: `Trip #${selectedTripId} dispatched to ${targetDriver.name} in ${targetVehicle.id}`,
        userEmail: auth.currentUser?.email || 'dispatcher@transitops.global',
        timestamp: new Date()
      });

      setSuccessMsg(`Successfully dispatched Trip #${selectedTripId}!`);
      setActiveDetailsId(selectedTripId);
    } catch(err) {
      setValidationError('Failed to dispatch trip.');
    }
  };

  // Helper count logic for utilization cards
  const availableVehiclesCount = vehicles.filter(v => v.status.toUpperCase() === 'AVAILABLE').length;
  const availableDriversCount = drivers.filter(d => d.status.toUpperCase() === 'AVAILABLE').length;
  const activeTripsCount = trips.filter(t => t.status === 'ON SCHEDULE').length;
  const pendingTripsCount = trips.filter(t => t.status === 'DRAFT').length;
  const delayedTripsCount = trips.filter(t => t.status === 'DELAYED').length; // static delayed trip CHI-DET

  const selectedPanelTrip = trips.find(t => t.id === activeDetailsId) || trips[0] || null;

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
                      {d.id} - {d.name} ({d.status.toUpperCase() === 'AVAILABLE' && d.licenseStatus === 'Expired' ? 'Expired' : d.status})
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
              {trips.filter(t => t.status === 'DRAFT' && !t.driver).map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-slate-400 font-bold">{t.route}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); moveTrip(t.id, 'DRAFT'); }} className="w-full text-center py-1 bg-slate-900 hover:bg-slate-950 text-white rounded text-[9px] font-bold">
                    ➤ Ready
                  </button>
                </div>
              ))}
            </div>

            {/* Column 2: Ready */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">Ready</span>
              {trips.filter(t => t.status === 'DRAFT' && t.driver).map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-slate-400 font-bold">{t.route}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); moveTrip(t.id, 'ON SCHEDULE'); }} className="w-full text-center py-1 bg-slate-900 hover:bg-slate-950 text-white rounded text-[9px] font-bold">
                    ➤ Dispatch
                  </button>
                </div>
              ))}
            </div>

            {/* Column 3: Dispatched */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">Dispatched</span>
              {trips.filter(t => t.status === 'ON SCHEDULE' && t.progress < 50).map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-slate-400 font-bold">{t.route}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); updateDoc(doc(db, 'trips', t.id), { progress: 50 }); }} className="w-full text-center py-1 bg-[#4F5B73] hover:bg-[#3E4A61] text-white rounded text-[9px] font-bold">
                    ➤ In Transit
                  </button>
                </div>
              ))}
            </div>

            {/* Column 4: In Transit */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">In Transit</span>
              {trips.filter(t => t.status === 'ON SCHEDULE').map(t => (
                <div key={t.id} onClick={() => setActiveDetailsId(t.id)} className="bg-white border border-slate-150 rounded-lg p-3 cursor-pointer shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-slate-900">#{t.id}</span>
                    <span className="text-slate-400 font-bold">{t.route}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden my-1">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${t.progress}%` }}></div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); moveTrip(t.id, 'COMPLETED'); }} className="w-full text-center py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold">
                    ➤ Complete
                  </button>
                </div>
              ))}
            </div>

            {/* Column 5: Completed */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[180px] space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block pb-1 border-b border-slate-200/60">Completed</span>
              {trips.filter(t => t.status === 'COMPLETED').map(t => (
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
                          (trip.status === 'ON SCHEDULE' || trip.status === 'DELAYED') ? 'bg-amber-50 text-amber-500' :
                          trip.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500'
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
              {selectedPanelTrip && (
              <>
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
              </>
              )}
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
