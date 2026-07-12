import React from 'react';
import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const Administration: React.FC = () => {

  const [users, setUsers] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
      setUsers(list);
    });

    return () => { unsubUsers(); };
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    const csvData = 'User Email,Display Name,Role,Created At\\n' + users.map(u => `${u.email},${u.displayName || 'Unknown'},${u.role},${u.createdAt ? new Date(u.createdAt.seconds ? u.createdAt.seconds * 1000 : u.createdAt).toLocaleDateString() : 'Unknown'}`).join('\\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Admin_Users_Export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    await addDoc(collection(db, 'auditLogs'), {
      action: 'ADMIN_EXPORT',
      details: `Exported User List to CSV`,
      userEmail: auth.currentUser?.email || 'manager@transitops.global',
      timestamp: new Date()
    });
    
    setTimeout(() => setIsExporting(false), 1000);
  };

  const filteredUsers = users.filter(u => 
    (u.displayName || '').toLowerCase().includes(filterQuery.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(filterQuery.toLowerCase()) || 
    (u.role || '').toLowerCase().includes(filterQuery.toLowerCase())
  );
  
  const totalUsers = users.length || 1240;
  const activeUsers = users.length || 1182; // Mocking active state since auth state isn't tracked globally
  const configuredRoles = [...new Set(users.map(u => u.role))].length || 12;
  const systemHealth = 99.9;

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Header Title */}
        <section>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Administration Center</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Manage users, permissions, system settings, organizational configuration, and platform governance.
          </p>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Total Users */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Total Users</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 font-outfit">{totalUsers}</span>
              <span className="text-[9px] text-emerald-500 font-bold">+12% 📈</span>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Active Users</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 font-outfit">{activeUsers}</span>
              <span className="text-[9px] text-emerald-500 font-bold">95.3%</span>
            </div>
          </div>

          {/* Roles */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Roles</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 font-outfit">{configuredRoles}</span>
              <span className="text-[9px] text-slate-400 font-bold">Configured</span>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Pending Approvals</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-amber-500 font-outfit">5</span>
              <span className="text-[9px] text-amber-500 font-bold">Pending</span>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">System Health</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-emerald-500 font-outfit">{systemHealth}%</span>
              <span className="text-[9px] text-emerald-500 font-bold">✔</span>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm border-l-4 border-l-rose-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Security Alerts</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-rose-500 font-outfit">2</span>
              <span className="text-[9px] text-rose-500 font-bold">Critical</span>
            </div>
          </div>
        </section>

        {/* User Management & AI Governance Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* User Management (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-outfit font-extrabold text-slate-900 text-sm">User Management</h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="Filter users..." value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} className="px-2.5 py-1 bg-white border border-slate-200 text-[10px] font-bold rounded-lg text-slate-700 shadow-xs outline-none focus:ring-1 focus:ring-indigo-500" />
                  <button onClick={handleExport} className="px-2.5 py-1 bg-[#F8F9FC] border border-slate-200 text-[10px] font-bold rounded-lg text-slate-650 shadow-xs">{isExporting ? 'Exporting...' : 'Export'}</button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">USER NAME</th>
                      <th className="pb-3">ROLE</th>
                      <th className="pb-3">DEPARTMENT</th>
                      <th className="pb-3">LAST LOGIN</th>
                      <th className="pb-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                      <tr key={i}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-[10px]">
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{user.displayName || 'Unknown User'}</div>
                              <div className="text-[10px] text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-black px-2 py-0.5 rounded">
                            {user.role || 'User'}
                          </span>
                        </td>
                        <td className="py-4">System Access</td>
                        <td className="py-4 text-slate-500">{user.createdAt ? new Date(user.createdAt.seconds ? user.createdAt.seconds * 1000 : user.createdAt).toLocaleDateString() : 'Unknown'}</td>
                        <td className="py-4 text-right">
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center py-4 text-slate-400">No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 text-center">
              <button className="text-xs font-bold text-slate-650 hover:underline">View All Users (1,240)</button>
            </div>
          </div>

          {/* AI Governance Insights (Right 4 cols) */}
          <div className="lg:col-span-4 bg-[#0F172A] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-outfit font-extrabold text-slate-200 text-sm">✨ AI Governance Insights</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-slate-300">
                <div className="p-3.5 bg-slate-900/60 border border-slate-800/40 rounded-xl">
                  <span className="text-[9px] font-black text-rose-400 block mb-1">CRITICAL DETECTION • 88% CONFIDENCE</span>
                  Unusual login activity detected from unauthorized region [IP: 182.xx.xx.xx]
                </div>
                <div className="p-3.5 bg-slate-900/60 border border-slate-800/40 rounded-xl">
                  <span className="text-[9px] font-black text-amber-400 block mb-1">POLICY CONFLICT</span>
                  Permission conflict identified between Dispatcher and Fleet Manager roles for User: J. Doe.
                </div>
                <div className="p-3.5 bg-slate-900/60 border border-slate-800/40 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 block mb-1">CLEAN-UP REQUIRED</span>
                  14 inactive accounts recommended for archival based on 90-day idle threshold.
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm">
              Launch Audit Protocol
            </button>
          </div>

        </section>

        {/* Lower Row (Roles, Performance, Security Center) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Role Profiles (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Fleet Manager Role */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-900">Fleet Manager</h4>
                <span className="text-[10px] text-slate-400 font-bold">42 Users</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                Full access to vehicle telemetry, driver scheduling, and maintenance logs.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-[10px] py-1.5 rounded-lg border border-slate-200/50">View Matrix</button>
                <button className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400">✎</button>
              </div>
            </div>

            {/* Dispatcher Role */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-900">Dispatcher</h4>
                <span className="text-[10px] text-slate-400 font-bold">158 Users</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                Access to real-time routing, active trip monitoring, and driver communications.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-[10px] py-1.5 rounded-lg border border-slate-200/50">View Matrix</button>
                <button className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400">✎</button>
              </div>
            </div>
          </div>

          {/* Performance & Security Center (Right 8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* System Performance */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">System Performance</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-slate-650">
                <div className="flex justify-between items-center">
                  <span>Server Status</span>
                  <span className="text-emerald-500 font-bold">● Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database Latency</span>
                  <span className="text-slate-800 font-bold">24ms</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Storage Capacity</span>
                    <span>65% Full</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>API Uptime (30d)</span>
                  <span className="text-emerald-500 font-bold">99.98%</span>
                </div>
              </div>
            </div>

            {/* Security Center */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between border-t-4 border-t-rose-500">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-outfit font-extrabold text-slate-900 text-sm">🛡️ Security Center</h3>
                  <span className="text-[10px] text-slate-400 font-bold">Failed Logins (24h): <strong className="text-rose-500">18</strong></span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                  <strong>Action Required:</strong> Enable Multi-Factor Authentication (2FA) for all users with Administrative roles to mitigate credential theft.
                </p>
              </div>
              <button className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-sm">
                Apply Now
              </button>
            </div>

          </div>

        </section>

        {/* Audit Logs & Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Audit Logs (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Audit Logs</h3>
              <button className="text-slate-400 hover:text-slate-655 font-extrabold">🔍</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">TIMESTAMP</th>
                    <th className="pb-3">USER</th>
                    <th className="pb-3">ACTION</th>
                    <th className="pb-3">MODULE</th>
                    <th className="pb-3 text-right">RESULT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                      <tr key={i}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-[10px]">
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{user.displayName || 'Unknown User'}</div>
                              <div className="text-[10px] text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-black px-2 py-0.5 rounded">
                            {user.role || 'User'}
                          </span>
                        </td>
                        <td className="py-4">System Access</td>
                        <td className="py-4 text-slate-500">{user.createdAt ? new Date(user.createdAt.seconds ? user.createdAt.seconds * 1000 : user.createdAt).toLocaleDateString() : 'Unknown'}</td>
                        <td className="py-4 text-right">
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center py-4 text-slate-400">No users found.</td></tr>
                    )}
                  </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 pt-4 text-center">
              <button className="text-xs font-bold text-slate-500 hover:text-slate-900">Download Detailed CSV Report</button>
            </div>
          </div>

          {/* Recent Activity (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Recent Activity</h3>
            <div className="space-y-4 text-xs font-semibold text-slate-650">
              <div>
                <p className="text-slate-800 font-bold">New User Invited</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Marcus Thome invited Julian Smith • 10m ago</p>
              </div>
              <div>
                <p className="text-slate-800 font-bold">System Configuration Updated</p>
                <p className="text-[10px] text-slate-400 mt-0.5">API rate limits increased • 2h ago</p>
              </div>
              <div>
                <p className="text-slate-800 font-bold text-rose-600">Security Alert Triggered</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Failed login attempts from IP: 182.168.1.45 • 4h ago</p>
              </div>
              <div>
                <p className="text-slate-800 font-bold">Backup Completed</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Database backup mirrored to AWS S3 • 6h ago</p>
              </div>
            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};
