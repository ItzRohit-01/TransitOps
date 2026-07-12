import re
import os

filepath = r"c:\Users\Aadarsh\OneDrive\Desktop\logistic\TransitOps\Frontend\src\pages\TripOperations.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

content = content.replace(
    "import { DashboardLayout } from '../components/layout/DashboardLayout';",
    "import { DashboardLayout } from '../components/layout/DashboardLayout';\nimport { db, auth } from '../firebase';\nimport { collection, onSnapshot, doc, getDoc, updateDoc, addDoc, setDoc } from 'firebase/firestore';"
)

# 2. Trip Interface Update
interface_old = """interface Trip {
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
}"""

interface_new = """interface Trip {
  id: string;
  driverName: string;
  driverId?: string;
  driverSub: string;
  driverSafety: string;
  driverImage: string;
  vehicleName: string;
  vehicleId?: string;
  vehicleSub: string;
  cargo: string;
  routeCode: string;
  routeFull: string;
  progress: number;
  status: 'DRAFT' | 'ON SCHEDULE' | 'DELAYED' | 'CANCELLED' | 'COMPLETED';
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
}"""

content = content.replace(interface_old, interface_new)

# 3. Component Start & State
state_old_pattern = r"export const TripOperations: React\.FC = \(\) => \{\n  // Mock Trips Data.*?const selectedTrip = trips\.find\(t => t\.id === selectedId\) \|\| trips\[0\];"

state_new = """export const TripOperations: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [newDriverId, setNewDriverId] = useState('');
  const [newVehicleId, setNewVehicleId] = useState('');
  const [newCargo, setNewCargo] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newError, setNewError] = useState('');

  useEffect(() => {
    const unsubTrips = onSnapshot(collection(db, 'trips'), (snapshot) => {
      const list: Trip[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          driverName: d.driverName || 'Unknown Driver',
          driverId: d.driverId || '',
          driverSub: d.driverSub || 'Cert: Standard',
          driverSafety: d.driverSafety || '4.5',
          driverImage: d.driverImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
          vehicleName: d.vehicleName || 'Unknown Vehicle',
          vehicleId: d.vehicleId || '',
          vehicleSub: d.vehicleSub || 'Diesel',
          cargo: d.cargo || 'N/A',
          routeCode: d.routeCode || 'RTE',
          routeFull: d.routeFull || 'Unknown Route',
          progress: d.progress || 0,
          status: d.status || 'ON SCHEDULE',
          statusSub: d.statusSub || 'On Schedule',
          eta: d.eta || 'N/A',
          source: d.source || 'N/A',
          destination: d.destination || 'N/A',
          fuelConsumed: d.fuelConsumed || '0 L',
          opCost: d.opCost || '$0',
          timeline: d.timeline || []
        });
      });
      setTrips(list);
      if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
    });

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDrivers(list);
    });

    const unsubVehicles = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setVehicles(list);
    });

    return () => { unsubTrips(); unsubDrivers(); unsubVehicles(); };
  }, [selectedId]);

  const selectedTrip = trips.find(t => t.id === selectedId) || trips[0] || null;

  const totalTrips = trips.length;
  const activeTripsCount = trips.filter(t => t.status === 'ON SCHEDULE' || t.status === 'DELAYED').length;
  const pendingTripsCount = trips.filter(t => t.status === 'DRAFT').length;
  const completedTripsCount = trips.filter(t => t.status === 'COMPLETED').length;
  const delayedTripsCount = trips.filter(t => t.status === 'DELAYED').length;
  const cancelledTripsCount = trips.filter(t => t.status === 'CANCELLED').length;
  const utilization = vehicles.length > 0 ? Math.round((activeTripsCount / vehicles.length) * 100) : 0;

  const filteredTrips = trips.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.routeFull.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewError('');

    if (!newDriverId || !newVehicleId || !newCargo || !newSource || !newDestination) {
      setNewError('All fields are required');
      return;
    }

    const selDriver = drivers.find(d => d.id === newDriverId);
    const selVehicle = vehicles.find(v => v.id === newVehicleId);

    if (!selDriver || !selVehicle) {
      setNewError('Invalid driver or vehicle selected');
      return;
    }
    
    // Validate capacity
    const cargoWeight = parseFloat(newCargo.replace(/[^0-9.]/g, ''));
    if (selVehicle.capacity && cargoWeight > parseFloat(selVehicle.capacity.replace(/[^0-9.]/g, ''))) {
      setNewError(`Cargo weight exceeds vehicle capacity (${selVehicle.capacity})`);
      return;
    }

    try {
      const tripId = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newTripData = {
        driverName: selDriver.name,
        driverId: selDriver.id,
        driverSub: `Cert: ${selDriver.category}`,
        driverSafety: String(selDriver.safetyScore || '4.5'),
        driverImage: selDriver.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        vehicleName: selDriver.vehicle !== 'None' ? selDriver.vehicle : (selVehicle.model || 'Truck'),
        vehicleId: selVehicle.id,
        vehicleSub: `Reg: ${selVehicle.id} • ${selVehicle.type || 'Diesel'}`,
        cargo: newCargo,
        routeCode: `${newSource.substring(0,3).toUpperCase()} ➜ ${newDestination.substring(0,3).toUpperCase()}`,
        routeFull: `${newSource} ➜ ${newDestination}`,
        progress: 0,
        status: 'DRAFT',
        statusSub: 'Awaiting Dispatch',
        eta: 'TBD',
        source: newSource,
        destination: newDestination,
        fuelConsumed: '0 L',
        opCost: '$0',
        timeline: [
          { title: 'Trip Created', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'Completed' }
        ]
      };

      await setDoc(doc(db, 'trips', tripId), newTripData);

      await addDoc(collection(db, 'auditLogs'), {
        action: 'CREATE_TRIP',
        details: `Created trip ${tripId} from ${newSource} to ${newDestination}`,
        userEmail: auth.currentUser?.email || 'manager@transitops.global',
        timestamp: new Date()
      });

      setNewDriverId('');
      setNewVehicleId('');
      setNewCargo('');
      setNewSource('');
      setNewDestination('');
      setShowDispatchModal(false);
    } catch (err: any) {
      setNewError(err.message || 'Failed to create trip');
    }
  };

  const handleUpdateStatus = async (tripId: string, newStatus: string, driverId?: string, vehicleId?: string) => {
    try {
      const tripRef = doc(db, 'trips', tripId);
      let statusSub = 'Updated';
      let progress = 0;
      
      if (newStatus === 'ON SCHEDULE') { statusSub = 'In Transit'; progress = 10; }
      if (newStatus === 'COMPLETED') { statusSub = 'Completed'; progress = 100; }
      if (newStatus === 'CANCELLED') { statusSub = 'Cancelled'; progress = 0; }
      
      await updateDoc(tripRef, { status: newStatus, statusSub, progress });

      if (newStatus === 'ON SCHEDULE' && driverId && vehicleId) {
        await updateDoc(doc(db, 'drivers', driverId), { status: 'ON TRIP' });
        await updateDoc(doc(db, 'vehicles', vehicleId), { status: 'ON TRIP' });
      }
      
      if ((newStatus === 'COMPLETED' || newStatus === 'CANCELLED') && driverId && vehicleId) {
        await updateDoc(doc(db, 'drivers', driverId), { status: 'AVAILABLE' });
        await updateDoc(doc(db, 'vehicles', vehicleId), { status: 'AVAILABLE' });
      }

      await addDoc(collection(db, 'auditLogs'), {
        action: 'UPDATE_TRIP_STATUS',
        details: `Updated trip ${tripId} status to ${newStatus}`,
        userEmail: auth.currentUser?.email || 'manager@transitops.global',
        timestamp: new Date()
      });

    } catch (err) {
      console.error(err);
      alert('Failed to update trip status');
    }
  };
"""

content = re.sub(state_old_pattern, state_new, content, flags=re.DOTALL)

# Now, we need to map the hardcoded stats to dynamic stats
content = content.replace(">1,482<", ">{totalTrips}<")
content = content.replace(">245<", ">{activeTripsCount}<")
content = content.replace(">84<", ">{pendingTripsCount}<")
content = content.replace(">1,153<", ">{completedTripsCount}<")
content = content.replace(">12<", ">{delayedTripsCount}<")
content = content.replace(">94%<", ">{utilization}%<")

content = content.replace('<span className="text-xs font-black text-slate-800 mt-0.5 block">32</span>', '<span className="text-xs font-black text-slate-800 mt-0.5 block">{pendingTripsCount}</span>')
content = content.replace('<span className="text-xs font-black text-slate-800 mt-0.5 block">52</span>', '<span className="text-xs font-black text-slate-800 mt-0.5 block">{activeTripsCount}</span>')
content = content.replace('<span className="text-xs font-black text-blue-600 mt-0.5 block">188</span>', '<span className="text-xs font-black text-blue-600 mt-0.5 block">{activeTripsCount}</span>')
content = content.replace('<span className="text-xs font-black text-slate-800 mt-0.5 block">1,153</span>', '<span className="text-xs font-black text-slate-800 mt-0.5 block">{completedTripsCount}</span>')
content = content.replace('<span className="text-xs font-black text-slate-800 mt-0.5 block">5</span>', '<span className="text-xs font-black text-slate-800 mt-0.5 block">{cancelledTripsCount}</span>')

content = content.replace("245 Live", "{activeTripsCount} Live")

content = content.replace(
    'placeholder="Quick find..."',
    'placeholder="Quick find..."\n                  value={searchQuery}\n                  onChange={(e) => setSearchQuery(e.target.value)}'
)

# Use filteredTrips for loops
content = content.replace("trips.map((trip)", "filteredTrips.map((trip)")

# "Create Trip" button
content = content.replace(
    '<button className="flex items-center gap-2 px-4.5 py-2.5 bg-black hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95">',
    '<button onClick={() => setShowDispatchModal(true)} className="flex items-center gap-2 px-4.5 py-2.5 bg-black hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95">'
)

# Add Action buttons to trip details when drawer open
details_buttons_old = """                <div className="grid grid-cols-2 gap-4 pt-3">
                  <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs text-center">
                    Report Issue
                  </button>
                  <button className="bg-black hover:bg-slate-900 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md text-center">
                    Live Tracking
                  </button>
                </div>"""

details_buttons_new = """                <div className="flex flex-col gap-3 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs text-center">
                      Live Tracking
                    </button>
                    {selectedTrip.status === 'DRAFT' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedTrip.id, 'ON SCHEDULE', selectedTrip.driverId, selectedTrip.vehicleId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md text-center">
                        Dispatch Now
                      </button>
                    )}
                    {selectedTrip.status === 'ON SCHEDULE' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedTrip.id, 'COMPLETED', selectedTrip.driverId, selectedTrip.vehicleId)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md text-center">
                        Mark Completed
                      </button>
                    )}
                    {selectedTrip.status === 'DELAYED' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedTrip.id, 'COMPLETED', selectedTrip.driverId, selectedTrip.vehicleId)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md text-center">
                        Mark Completed
                      </button>
                    )}
                  </div>
                  {(selectedTrip.status === 'DRAFT' || selectedTrip.status === 'ON SCHEDULE' || selectedTrip.status === 'DELAYED') && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedTrip.id, 'CANCELLED', selectedTrip.driverId, selectedTrip.vehicleId)}
                      className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-xs text-center">
                      Cancel Trip
                    </button>
                  )}
                </div>"""

content = content.replace(details_buttons_old, details_buttons_new)

modal_html = """
        {/* Create/Dispatch Trip Modal */}
        {showDispatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-inter">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-900 font-outfit text-lg">Create New Trip</h3>
                </div>
                <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <form id="add-trip-form" onSubmit={handleCreateTrip} className="space-y-4">
                  {newError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-rose-600">{newError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Driver</label>
                      <select 
                        required
                        value={newDriverId}
                        onChange={(e) => setNewDriverId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">-- Available Drivers --</option>
                        {drivers.filter(d => d.status === 'AVAILABLE' || d.status === 'Available').map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Vehicle</label>
                      <select 
                        required
                        value={newVehicleId}
                        onChange={(e) => setNewVehicleId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">-- Available Vehicles --</option>
                        {vehicles.filter(v => v.status === 'AVAILABLE' || v.status === 'Available').map(v => (
                          <option key={v.id} value={v.id}>{v.id} - {v.model}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Cargo Weight / Desc.</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g., 18,500 lbs (Electronics)"
                      value={newCargo}
                      onChange={(e) => setNewCargo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Source Depot</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g., Chicago, IL"
                        value={newSource}
                        onChange={(e) => setNewSource(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Destination</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g., Detroit, MI"
                        value={newDestination}
                        onChange={(e) => setNewDestination(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 font-bold text-xs text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="add-trip-form"
                  className="px-6 py-2 font-black text-xs text-white bg-black hover:bg-slate-900 shadow-md rounded-xl transition-all"
                >
                  Create Trip
                </button>
              </div>
            </div>
          </div>
        )}
"""

content = content.replace("      </div>\n    </DashboardLayout>", f"{modal_html}      </div>\n    </DashboardLayout>")

# selectedTrip can be null if trips is empty, we must handle it to avoid crashes in drawer
drawer_old = "{drawerOpen && ("
drawer_new = "{drawerOpen && selectedTrip && ("
content = content.replace(drawer_old, drawer_new)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
