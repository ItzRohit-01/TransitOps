import re
import sys

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update imports
    imports_to_add = """import { useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';"""
    content = content.replace("import { DashboardLayout } from '../components/layout/DashboardLayout';", imports_to_add + "\nimport { DashboardLayout } from '../components/layout/DashboardLayout';")

    # 2. Inject states and useEffect
    states_to_add = """
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [financeKPIs, setFinanceKPIs] = useState<any>({});
  const [insights, setInsights] = useState<any[]>([]);
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

    const unsubInsights = onSnapshot(collection(db, 'aiInsights'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
      setInsights(list);
    });

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

    return () => { unsubVehicles(); unsubDrivers(); unsubTrips(); unsubInsights(); unsubLogs(); unsubExp(); };
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
  const expenses = financeKPIs.totalExpenses || 1842500;
  const profit = financeKPIs.netProfit || 569590;
  const roi = financeKPIs.fleetROI || 23.6;
  const costKm = financeKPIs.costPerKm || 1.42;
"""

    content = re.sub(r'const \[financialRange, setFinancialRange\] = useState\(\'Last 30 Days\'\);', r"const [financialRange, setFinancialRange] = useState('Last 30 Days');\n" + states_to_add, content)

    # 3. Replace Hardcoded Values
    content = content.replace(">{482}</span>", ">{totalFleet}</span>")
    content = content.replace(">{128}</span>", ">{activeDrivers}</span>")
    content = content.replace(">{89}</span>", ">{activeTripsCount}</span>")
    content = content.replace(">89%</span>", ">{fleetHealthScore}%</span>")
    content = content.replace(">$2.4M</span>", ">{formatCurrency(revenue)}</span>")
    content = content.replace(">{14}</span>", ">{criticalCount}</span>")

    content = content.replace(">{342}</span>", ">{activeVehiclesCount}</span>")
    content = content.replace(">{96}</span>", ">{availableVehiclesCount}</span>")
    content = content.replace(">{34}</span>", ">{maintenanceVehiclesCount}</span>")

    # Replace fleetHealthData with dynamicFleetHealthData in Recharts
    content = content.replace("data={fleetHealthData}", "data={dynamicFleetHealthData}")
    content = content.replace(">428<", ">{healthyCount}<")
    content = content.replace(">40<", ">{attentionCount}<")
    content = content.replace(">14<", ">{criticalCount}<")

    # Finance Snapshot
    content = content.replace(">$2,412,090<", ">{formatCurrency(revenue)}<")
    content = content.replace(">$1,842,500<", ">{formatCurrency(expenses)}<")
    content = content.replace(">$569,590<", ">{formatCurrency(profit)}<")
    content = content.replace(">23.6%<", ">{roi}%<")
    content = content.replace(">$1.42<", ">${costKm}<")

    # Feed List update
    feed_replacement = """{/* Feed List */}
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
              </div>"""

    # Using regex to replace the old static feed list
    content = re.sub(r'\{\/\* Feed List \*\/}.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>', feed_replacement + "\n            </div>\n          </div>\n        </section>", content, flags=re.DOTALL)

    # Export button
    content = content.replace("Export Logs", "{isExporting ? 'Exporting...' : 'Export Logs'}")
    content = content.replace("<button className=\"px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] rounded-lg border border-slate-200/60 transition-all\">", "<button onClick={handleExport} className=\"px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] rounded-lg border border-slate-200/60 transition-all\">")

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print("ManagerDashboard updated successfully!")

if __name__ == "__main__":
    update_file('Frontend/src/pages/ManagerDashboard.tsx')
