import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Plus, 
  X,
  Search
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
  addDoc 
} from 'firebase/firestore';

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
  expiryDate?: string;
  contactNumber?: string;
}

export const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Driver Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLicense, setNewLicense] = useState('');
  const [newCategory, setNewCategory] = useState('Class A');
  const [newExpiry, setNewExpiry] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newScore, setNewScore] = useState('90');
  const [newStatus, setNewStatus] = useState<'AVAILABLE' | 'ON TRIP' | 'SUSPENDED'>('AVAILABLE');
  const [newError, setNewError] = useState('');

  // Fetch Drivers Real-Time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const list: Driver[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || '',
          licenseId: docSnap.id,
          category: data.category || 'Class A',
          safetyScore: data.safetyScore || 90,
          assignment: data.vehicle && data.vehicle !== 'None' ? `${data.vehicle} (Active)` : 'Unassigned',
          licenseDetail: `${data.category || 'Class A'} (Interstate)`,
          status: data.status === 'AVAILABLE' ? 'Available' :
                  data.status === 'ON TRIP' ? 'On Trip' :
                  data.status === 'SUSPENDED' ? 'Suspended' : 'Off Duty',
          vehicle: data.vehicle || 'None',
          image: data.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
          trends: [85, 88, 90, 89, 93, 91, data.safetyScore || 90],
          expiryDate: data.expiryDate || '',
          contactNumber: data.contactNumber || ''
        });
      });
      setDrivers(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].id);
      }
    });

    return unsubscribe;
  }, [selectedId]);

  const selectedDriver = drivers.find(d => d.id === selectedId) || drivers[0] || {
    id: 'None',
    name: 'No Drivers Selected',
    licenseId: 'N/A',
    category: 'N/A',
    safetyScore: 100,
    assignment: 'Unassigned',
    licenseDetail: 'N/A',
    status: 'Available' as const,
    vehicle: 'None',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    trends: [100]
  };

  // Workforce availability donut chart counts
  const availableCount = drivers.filter(d => d.status === 'Available').length;
  const onTripCount = drivers.filter(d => d.status === 'On Trip').length;
  const offDutyCount = drivers.filter(d => d.status === 'Off Duty').length;
  const suspendedCount = drivers.filter(d => d.status === 'Suspended').length;
  const totalDriversCount = drivers.length;

  const workforceData = [
    { name: 'Available', value: availableCount, color: '#10B981' },
    { name: 'On Trip', value: onTripCount, color: '#3B82F6' },
    { name: 'Off Duty', value: offDutyCount, color: '#94A3B8' },
    { name: 'Suspended', value: suspendedCount, color: '#EF4444' }
  ];

  // Expiring licenses within 30 days of July 2026
  const expiringLicensesCount = drivers.filter(d => {
    if (!d.expiryDate) return false;
    const expiry = new Date(d.expiryDate);
    const now = new Date('2026-07-12');
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  const avgSafetyScore = drivers.length > 0 
    ? Math.round(drivers.reduce((acc, curr) => acc + curr.safetyScore, 0) / drivers.length) 
    : 100;

  // Filter based on search query
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add Driver handler
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewError('');

    if (!newLicense || !newName || !newExpiry || !newContact) {
      setNewError('All required fields must be filled');
      return;
    }

    try {
      const docRef = doc(db, 'drivers', newLicense);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNewError('Driver with this license number already exists');
        return;
      }

      await setDoc(docRef, {
        name: newName,
        category: newCategory,
        expiryDate: newExpiry,
        contactNumber: newContact,
        safetyScore: Number(newScore || 90),
        status: newStatus,
        vehicle: 'None',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
      });

      // Audit Log
      await addDoc(collection(db, 'auditLogs'), {
        action: 'CREATE_DRIVER',
        details: `Registered driver ${newName} (${newLicense})`,
        userEmail: auth.currentUser?.email || 'manager@transitops.global',
        timestamp: new Date()
      });

      // Clear & Close
      setNewName('');
      setNewLicense('');
      setNewExpiry('');
      setNewContact('');
      setShowAddModal(false);
    } catch (err: any) {
      setNewError(err.message || 'Failed to save driver');
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['License ID', 'Name', 'Category', 'Expiry Date', 'Contact Number', 'Safety Score', 'Status', 'Vehicle'];
    const rows = drivers.map(d => [
      d.id,
      d.name,
      d.category,
      d.expiryDate || 'N/A',
      d.contactNumber || 'N/A',
      d.safetyScore,
      d.status,
      d.vehicle
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(',')].concat(rows.map(e => e.map(val => `"${val}"`).join(','))).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transitops_drivers.csv");
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Driver Management</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Manage driver profiles, availability, safety compliance, performance, and operational readiness.
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
              Add Driver
            </button>
          </div>
        </section>

        {/* Top Mini Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">Total Drivers</span>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">{totalDriversCount}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Available</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block">{availableCount}</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">On Trip</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit block">{onTripCount}</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Suspended</span>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">{suspendedCount}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Expiring Licenses</span>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-outfit">{expiringLicensesCount}</span>
              <span className="text-[9px] text-amber-500 font-extrabold">⏳ &lt;30 days</span>
            </div>
          </div>

          <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Avg. Safety Score</span>
              <span className="bg-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded shadow">{avgSafetyScore}%</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              🛡️ Safe Workforce
            </span>
          </div>
        </section>

        {/* Center Workforce, Predictions & Compliance Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Workforce Availability (Left 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Workforce Status</h3>
            </div>
            <div className="flex flex-col items-center justify-center relative py-2">
              <div className="w-36 h-36 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workforceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
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
                  <span className="text-2xl font-black text-slate-900 font-outfit">{totalDriversCount}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Available</span>
                <span className="text-emerald-600 font-bold">{availableCount}</span>
              </div>
              <div className="flex justify-between">
                <span>On Trip</span>
                <span className="text-blue-600 font-bold">{onTripCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Suspended</span>
                <span className="text-rose-600 font-bold">{suspendedCount}</span>
              </div>
            </div>
          </div>

          {/* Predictor Panel (Middle 4 cols) */}
          <div className="lg:col-span-4 bg-[#F8F9FC] border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-4">Driver Risk Alert</span>
              <div className="space-y-4">
                <div className="border border-rose-100 bg-rose-50/50 rounded-xl p-3 flex gap-2.5">
                  <span className="text-rose-500 shrink-0">⚠️</span>
                  <div>
                    <h4 className="text-slate-900 text-xs font-bold">Safety Score Under Threshold</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">David Miller shows score 42% due to speeding telemetry alerts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Alerts (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-4">Compliance Center</h3>
            <div className="space-y-3 text-xs">
              <div className="border border-slate-100 rounded-xl p-3 flex justify-between">
                <span>Total Active Licenses</span>
                <span className="font-bold text-slate-900">{drivers.filter(d => d.status !== 'Suspended').length}</span>
              </div>
              <div className="border border-slate-100 rounded-xl p-3 flex justify-between">
                <span>Suspended Logs</span>
                <span className="font-bold text-rose-500">{suspendedCount}</span>
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
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search drivers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-[#F8F9FC] border border-slate-200 text-xs font-semibold rounded-lg w-44 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

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
                  {filteredDrivers.map((driver) => {
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

          {/* Right Column (Driver Profile) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Driver Profile</span>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <img 
                    src={selectedDriver.image} 
                    alt={selectedDriver.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-md"
                  />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 font-outfit">{selectedDriver.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">License: {selectedDriver.licenseDetail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="text-xs font-black text-blue-600 mt-1 block">
                    {selectedDriver.status}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle</span>
                  <span className="text-xs font-black text-slate-950 mt-1 block">
                    {selectedDriver.vehicle}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Add Driver Overlay Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-inter">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h3 className="font-outfit font-black text-slate-900 text-lg">Add New Driver Profile</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1.5 hover:bg-slate-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDriver} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
                {newError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                    {newError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Driver Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Elena Rodriguez" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">License Number (ID) *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DL-34012" 
                      value={newLicense}
                      onChange={(e) => setNewLicense(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800 font-extrabold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">License Class *</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-950"
                    >
                      <option value="Class A">Class A</option>
                      <option value="Class B">Class B</option>
                      <option value="Class C">Class C</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">License Expiry Date *</label>
                    <input 
                      type="date" 
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-950 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Contact Number *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +1 (555) 019-2831" 
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Initial Safety Score (0-100)</label>
                    <input 
                      type="number" 
                      placeholder="90" 
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Workforce Status</label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-950"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="ON TRIP">On Trip</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-black hover:bg-slate-900 text-white rounded-xl font-extrabold shadow-md"
                  >
                    Save Profile
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
