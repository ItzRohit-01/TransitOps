import re
import sys

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # The FinanceCenter is mostly static, let's inject dynamic computation.
    
    # We will update vehiclesProfit state to be dynamically computed in the useEffect.
    # First, let's find the use effect and modify it.
    
    use_effect_replacement = """  useEffect(() => {
    const unsubExp = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      let totRev = 0;
      let totExp = 0;
      let fuel = 0;
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (d.totalRevenue) totRev += d.totalRevenue;
        if (d.totalExpenses) totExp += d.totalExpenses;
        if (d.fuel) fuel += d.fuel;
      });
      setFinanceKPIs(prev => ({
        ...prev,
        totalRevenue: totRev || prev.totalRevenue,
        totalExpenses: totExp || prev.totalExpenses,
        netProfit: (totRev - totExp) || prev.netProfit,
        fuel: fuel || prev.fuel
      }));
    });

    const unsubLogs = onSnapshot(collection(db, 'auditLogs'), (snapshot) => {
      const logs: string[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (d.timestamp && (d.action?.includes('FINANCE') || d.action?.includes('EXPENSE'))) {
           const timeStr = d.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
           logs.push(`${timeStr} - ${d.details}`);
        }
      });
      if(logs.length === 0) {
        logs.push('15:02 PM - Fuel log added: V-109 (100L, $200)');
        logs.push('14:40 PM - ROI recalculated for operational fleet routes');
        logs.push('13:10 PM - Toll expenses recorded for Route CHI-DET');
      }
      setActivities(logs.slice(0, 10));
    });
    
    const unsubTrips = onSnapshot(collection(db, 'trips'), (snapshot) => {
      // Very basic mock dynamic aggregation for routes performance
      const routesMap: any = {};
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (d.status === 'COMPLETED' && d.routeFull) {
           const rCode = d.routeFull;
           if(!routesMap[rCode]) routesMap[rCode] = { route: rCode, revenue: 0, cost: 0, count: 0 };
           
           const rev = parseFloat(String(d.cargo).replace(/[^0-9.]/g, '')) * 10 || 1200; // Mock revenue from cargo
           const cost = parseFloat(String(d.opCost).replace(/[^0-9.]/g, '')) || 400; // Mock cost
           routesMap[rCode].revenue += rev;
           routesMap[rCode].cost += cost;
           routesMap[rCode].count += 1;
        }
      });
      
      const arr = Object.values(routesMap).map((r: any) => ({
         route: r.route,
         revenue: r.revenue,
         cost: r.cost,
         profit: r.revenue - r.cost,
         efficiency: Math.round(((r.revenue - r.cost)/r.revenue)*100) + '%'
      }));
      if (arr.length > 0) {
         setRoutesPerformance(arr);
      }
    });

    return () => { unsubExp(); unsubLogs(); unsubTrips(); };
  }, []);"""

    content = re.sub(r'  useEffect\(\(\) => \{.*?\}, \[\]\);', use_effect_replacement, content, flags=re.DOTALL)
    
    content = content.replace("const [routesPerformance] = useState<RoutePerformance[]>(", "const [routesPerformance, setRoutesPerformance] = useState<RoutePerformance[]>(")

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print("FinanceCenter updated successfully!")

if __name__ == "__main__":
    update_file('Frontend/src/pages/FinanceCenter.tsx')
