import React, { useState, useEffect } from 'react';
import { 
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
  X
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { db, auth } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  orderBy, 
  limit, 
  addDoc 
} from 'firebase/firestore';

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
  acquisitionCost?: number;
}

interface AuditLog {
  action: string;
  details: string;
  userEmail: string;
  timestamp: any;
}

export const FleetManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedReg, setSelectedReg] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Vehicle Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReg, setNewReg] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Heavy Duty');
  const [newCapacity, setNewCapacity] = useState('');
  const [newOdo, setNewOdo] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newStatus, setNewStatus] = useState<'AVAILABLE' | 'ON TRIP' | 'IN SHOP' | 'RETIRED'>('AVAILABLE');
  const [newAssignment, setNewAssignment] = useState('Region West');
  const [newHealth, setNewHealth] = useState('95');
  const [newError, setNewError] = useState('');

  // Fetch Vehicles Real-Time
  useEffect(() => {
    const unsubscribeVehicles = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const list: Vehicle[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          reg: docSnap.id,
          name: data.vehicleName || '',
          subtitle: `${data.vehicleType || 'Heavy Duty'} • ${data.assignment || 'Unassigned'}`,
          capacity: `${(data.maxLoadCapacity || 0).toLocaleString()} lbs`,
          health: data.health || 100,
          status: data.status || 'AVAILABLE',
          odometer: `${(data.odometer || 0).toLocaleString()} km`,
          efficiency: '14.2 L/100km',
          assignment: data.assignment || 'Unassigned',
          nextSvc: `${(data.nextSvc || 3000).toLocaleString()} km`,
          image: data.image || '/white_delivery_truck.png',
          acquisitionCost: data.acquisitionCost || 85000
        });
      });
      setVehicles(list);
      if (list.length > 0 && !selectedReg) {
        setSelectedReg(list[0].reg);
      }
    });

    const unsubscribeAudits = onSnapshot(
      query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(4)),
      (snapshot) => {
        const list: AuditLog[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            action: data.action || '',
            details: data.details || '',
            userEmail: data.userEmail || '',
            timestamp: data.timestamp
          });
        });
        setAuditLogs(list);
      }
    );

    return () => {
      unsubscribeVehicles();
      unsubscribeAudits();
    };
  }, [selectedReg]);

  const selectedVehicle = vehicles.find(v => v.reg === selectedReg) || vehicles[0] || {
    reg: 'None',
    name: 'No Vehicles Selected',
    subtitle: 'N/A',
    capacity: '0 lbs',
    health: 100,
    status: 'AVAILABLE' as const,
    odometer: '0 km',
    efficiency: '0 L/100km',
    assignment: 'Unassigned',
    nextSvc: '0 km',
    image: '/white_delivery_truck.png'
  };

  // Fleet Status Donut Chart Data
  const availableCount = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const onTripCount = vehicles.filter(v => v.status === 'ON TRIP').length;
  const inShopCount = vehicles.filter(v => v.status === 'IN SHOP').length;
  const retiredCount = vehicles.filter(v => v.status === 'RETIRED').length;
  const totalVehiclesCount = vehicles.length;

  const fleetStatusData = [
    { name: 'Available', value: availableCount, color: '#10B981' },
    { name: 'On Trip', value: onTripCount, color: '#3B82F6' },
    { name: 'In Shop', value: inShopCount, color: '#F59E0B' }
  ];

  const activeVehiclesCount = vehicles.filter(v => v.status !== 'RETIRED').length;
  const utilizationPct = activeVehiclesCount > 0 
    ? Math.round((onTripCount / activeVehiclesCount) * 100) 
    : 0;

  // Filtered vehicles based on search query
  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.reg.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Fleet Distribution
  const totalV = vehicles.length || 1;
  const heavyDutyPct = Math.round((vehicles.filter(v => v.subtitle.toLowerCase().includes('heavy')).length / totalV) * 100);
  const mediumDutyPct = Math.round((vehicles.filter(v => v.subtitle.toLowerCase().includes('medium')).length / totalV) * 100);
  const vanPct = Math.round((vehicles.filter(v => v.subtitle.toLowerCase().includes('van')).length / totalV) * 100);
  const svcPct = 100 - (heavyDutyPct + mediumDutyPct + vanPct);

  // Add Vehicle Submit handler
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewError('');

    if (!newReg || !newName || !newCapacity || !newOdo) {
      setNewError('All required fields must be filled');
      return;
    }

    try {
      const docRef = doc(db, 'vehicles', newReg);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNewError('A vehicle with this registration number already exists');
        return;
      }

      await setDoc(docRef, {
        vehicleName: newName,
        vehicleType: newType,
        maxLoadCapacity: Number(newCapacity),
        odometer: Number(newOdo),
        acquisitionCost: Number(newCost || 85000),
        status: newStatus,
        health: Number(newHealth || 95),
        assignment: newAssignment,
        nextSvc: 3000,
        image: '/white_delivery_truck.png'
      });

      // Audit Log
      await addDoc(collection(db, 'auditLogs'), {
        action: 'CREATE_VEHICLE',
        details: `Created vehicle ${newReg} (${newName})`,
        userEmail: auth.currentUser?.email || 'manager@transitops.global',
        timestamp: new Date()
      });

      // Reset & Close
      setNewReg('');
      setNewName('');
      setNewCapacity('');
      setNewOdo('');
      setNewCost('');
      setShowAddModal(false);
    } catch (err: any) {
      setNewError(err.message || 'Failed to save vehicle');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Registration Number', 'Vehicle Name', 'Type', 'Capacity', 'Odometer', 'Acquisition Cost', 'Status', 'Assignment'];
    const rows = vehicles.map(v => [
      v.reg,
      v.name,
      v.subtitle.split('•')[0].trim(),
      v.capacity.replace(/,/g, ''),
      v.odometer.replace(/,/g, '').replace(' km', ''),
      v.acquisitionCost || 85000,
      v.status,
      v.assignment
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(',')].concat(rows.map(e => e.map(val => `"${val}"`).join(','))).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transitops_fleet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Export CSV
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4.5 py-2.5 bg-black hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>
        </section>

        {/* Top Mini Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Total Vehicles</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">{totalVehiclesCount}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Available</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">{availableCount}</span>
              <span className="bg-slate-50 p-1 rounded-full text-emerald-500 mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">On Trip</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">{onTripCount}</span>
              <span className="bg-slate-50 p-1 rounded-full text-blue-500 mb-1">
                <Activity className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">In Maintenance</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">{inShopCount}</span>
              <span className="bg-slate-50 p-1 rounded-full text-amber-500 mb-1">
                <Wrench className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Retired</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">{retiredCount}</span>
              <span className="bg-slate-50 p-1 rounded-full text-slate-400 mb-1">
                <Clock className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Fleet Util.</span>
              <span className="bg-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded shadow">{utilizationPct}%</span>
            </div>
            <span className="text-xl font-black font-outfit mt-2">{utilizationPct > 70 ? 'Optimal' : 'Low Duty'}</span>
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
                    <span className="text-2xl font-black text-slate-900 font-outfit">{totalVehiclesCount}</span>
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
                  <span className="text-slate-400 font-semibold">({availableCount})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>On Trip</span>
                  </div>
                  <span className="text-slate-900">({onTripCount})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>In Shop</span>
                  </div>
                  <span className="text-slate-400 font-semibold">({inShopCount})</span>
                </div>
              </div>
            </div>

            {/* Maintenance Intelligence */}
            <div className="bg-amber-950 text-[#F5E6C4] rounded-2xl p-5 relative overflow-hidden shadow-md flex-1">
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
                    <span>{heavyDutyPct || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full" style={{ width: `${heavyDutyPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-800 mb-1">
                    <span>🚛 Medium Trucks</span>
                    <span>{mediumDutyPct || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: `${mediumDutyPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-800 mb-1">
                    <span>🚐 Vans</span>
                    <span>{vanPct || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 rounded-full" style={{ width: `${vanPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-800 mb-1">
                    <span>🚘 Service Vehicles</span>
                    <span>{svcPct || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: `${svcPct}%` }}></div>
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

            {/* Live System Activity Feed */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">System Audit Feed</h3>
              <div className="space-y-4">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="bg-slate-100 text-slate-650 p-1.5 rounded-lg shrink-0 mt-0.5">
                      <Gauge className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {log.details}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                        {log.userEmail} • {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-xs text-slate-450 font-semibold text-center py-4">No recent activity logs recorded.</p>
                )}
              </div>
            </div>

          </div>

          {/* Column 3 (Right 3 cols) */}
          <div className="lg:col-span-3">
            
            {/* Selected Vehicle Panel */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center">
                <span className="bg-[#0B132B] text-white text-[10px] font-black px-2.5 py-1 rounded-md">
                  SELECTED: {selectedVehicle.reg}
                </span>
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

        {/* Add Vehicle Overlay Modal Dialog */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-inter">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h3 className="font-outfit font-black text-slate-900 text-lg">Add New Fleet Vehicle</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
                {newError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                    {newError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Registration Number (ID) *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. V-410" 
                      value={newReg}
                      onChange={(e) => setNewReg(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800 font-extrabold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Vehicle Display Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Kenworth T680" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Capacity Type *</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-950"
                    >
                      <option value="Heavy Duty">Heavy Duty</option>
                      <option value="Medium Duty">Medium Duty</option>
                      <option value="Van">Van</option>
                      <option value="Service Vehicle">Service Vehicle</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Max Capacity (lbs) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 26000" 
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Starting Odometer (km) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15000" 
                      value={newOdo}
                      onChange={(e) => setNewOdo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Acquisition Cost ($) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 95000" 
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Assignment Sector</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Region West" 
                      value={newAssignment}
                      onChange={(e) => setNewAssignment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Health (%)</label>
                    <input 
                      type="number" 
                      placeholder="95" 
                      value={newHealth}
                      onChange={(e) => setNewHealth(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Initial Status</label>
                  <div className="flex gap-4">
                    {['AVAILABLE', 'IN SHOP', 'RETIRED'].map(st => (
                      <label key={st} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status"
                          value={st}
                          checked={newStatus === st}
                          onChange={() => setNewStatus(st as any)}
                          className="text-slate-900 focus:ring-slate-950" 
                        />
                        <span className="text-[11px] font-bold text-slate-700">{st}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-black hover:bg-slate-900 text-white rounded-xl font-extrabold transition-all active:scale-95 shadow-md"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
