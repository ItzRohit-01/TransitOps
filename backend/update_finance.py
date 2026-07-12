import re

filepath = r"c:\Users\Aadarsh\OneDrive\Desktop\logistic\TransitOps\Frontend\src\pages\FinanceCenter.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Imports
content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

content = content.replace(
    "import { DashboardLayout } from '../components/layout/DashboardLayout';",
    "import { DashboardLayout } from '../components/layout/DashboardLayout';\nimport { db, auth } from '../firebase';\nimport { collection, onSnapshot, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';"
)

state_old_pattern = r"export const FinanceCenter: React\.FC = \(\) => \{\n  // Loading state for report exports.*?const triggerExport = \(reportName: string\) => \{"

state_new = """export const FinanceCenter: React.FC = () => {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [successReport, setSuccessReport] = useState<string | null>(null);
  const [activities, setActivities] = useState<string[]>([]);
  const [financeKPIs, setFinanceKPIs] = useState<any>({
    totalRevenue: 4200000,
    totalExpenses: 2800000,
    netProfit: 1400000,
    fleetROI: 18,
    costPerKm: 1.12,
    fuel: 840000
  });

  const [vehiclesProfit, setVehiclesProfit] = useState<VehicleProfitability[]>([
    { id: 'V-105', name: 'Volvo VNL 640', revenue: 42000, cost: 26000, profit: 16000, roi: 61.5 },
    { id: 'V-118', name: 'Kenworth T680', revenue: 35000, cost: 23000, profit: 12000, roi: 52.1 },
    { id: 'V-202', name: 'Freightliner C-12', revenue: 58000, cost: 32000, profit: 26000, roi: 81.25 },
    { id: 'V-305', name: 'Peterbilt 579', revenue: 15000, cost: 18000, profit: -3000, roi: -16.6 },
    { id: 'V-109', name: 'Mack Anthem', revenue: 48000, cost: 29000, profit: 19000, roi: 65.5 }
  ]);

  const [routesPerformance, setRoutesPerformance] = useState<RoutePerformance[]>([
    { route: 'CHI ➜ DET', revenue: 124000, cost: 72000, profit: 52000, efficiency: '92.4%' },
    { route: 'AUS ➔ HOU', revenue: 84000, cost: 58000, profit: 26000, efficiency: '78.2%' },
    { route: 'DEN ➜ SLC', revenue: 98000, cost: 86000, profit: 12000, efficiency: '64.5%' }
  ]);

  const forecasts = [
    { type: 'Revenue Forecast', current: '$4.2M', nextMonth: '$4.6M', trend: '+9.5%' },
    { type: 'Expense Forecast', current: '$2.8M', nextMonth: '$2.9M', trend: '+3.5%' },
    { type: 'Profit Forecast', current: '$1.4M', nextMonth: '$1.7M', trend: '+21.4%' },
    { type: 'ROI Forecast', current: '18%', nextMonth: '19.2%', trend: '+6.6%' }
  ];

  const monthlyData = [
    { name: 'Jan', Revenue: 320000, Expenses: 220000, Profit: 100000 },
    { name: 'Feb', Revenue: 350000, Expenses: 240000, Profit: 110000 },
    { name: 'Mar', Revenue: 290000, Expenses: 200000, Profit: 90000 },
    { name: 'Apr', Revenue: 400000, Expenses: 260000, Profit: 140000 },
    { name: 'May', Revenue: 380000, Expenses: 250000, Profit: 130000 },
    { name: 'Jun', Revenue: 420000, Expenses: 280000, Profit: 140000 }
  ];

  useEffect(() => {
    const unsubExp = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      snapshot.forEach(docSnap => {
        if (docSnap.id === 'EXP-2026-07') {
          const d = docSnap.data();
          setFinanceKPIs({
             totalRevenue: d.totalRevenue || 0,
             totalExpenses: d.totalExpenses || 0,
             netProfit: d.netProfit || 0,
             fleetROI: d.fleetROI || 0,
             costPerKm: d.costPerKm || 0,
             fuel: d.fuel || 0
          });
        }
      });
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

    return () => { unsubExp(); unsubLogs(); };
  }, []);

  const triggerExport = async (reportName: string) => {"""

content = re.sub(state_old_pattern, state_new, content, flags=re.DOTALL)

# Update triggerExport to do real CSV logic and push auditLog
export_old_pattern = r"const triggerExport = async \(reportName: string\) => \{.*?\};\n\n  return \("

export_new = """const triggerExport = async (reportName: string) => {
    setExportingType(reportName);
    setSuccessReport(null);

    // CSV logic
    let csvData = '';
    if (reportName.includes('Vehicle')) {
      csvData = 'Vehicle ID,Name,Revenue,Cost,Profit,ROI\\n' + vehiclesProfit.map(v => `${v.id},${v.name},${v.revenue},${v.cost},${v.profit},${v.roi}%`).join('\\n');
    } else if (reportName.includes('Route')) {
      csvData = 'Route,Revenue,Cost,Profit,Efficiency\\n' + routesPerformance.map(r => `${r.route},${r.revenue},${r.cost},${r.profit},${r.efficiency}`).join('\\n');
    } else {
      csvData = 'Forecast Type,Current,Next Month,Trend\\n' + forecasts.map(f => `${f.type},${f.current},${f.nextMonth},${f.trend}`).join('\\n');
    }

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/ /g, '_')}_2026.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    try {
      await addDoc(collection(db, 'auditLogs'), {
        action: 'FINANCE_EXPORT',
        details: `Exported ${reportName} to CSV`,
        userEmail: auth.currentUser?.email || 'analyst@transitops.global',
        timestamp: new Date()
      });
    } catch(err) {}

    setTimeout(() => {
      setExportingType(null);
      setSuccessReport(`Successfully exported ${reportName} to CSV!`);
    }, 1500);
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return '$' + (val / 1000).toFixed(0) + 'k';
    return '$' + val;
  };

  return ("""

content = re.sub(export_old_pattern, export_new, content, flags=re.DOTALL)

# Replace the hardcoded top KPI values with formatting functions
content = content.replace(">$4.2M<", ">{formatCurrency(financeKPIs.totalRevenue)}<")
content = content.replace(">$2.8M<", ">{formatCurrency(financeKPIs.totalExpenses)}<")
content = content.replace(">$1.4M<", ">{formatCurrency(financeKPIs.netProfit)}<")
content = content.replace(">18%<", ">{financeKPIs.fleetROI}%<")
content = content.replace(">$1.12<", ">${financeKPIs.costPerKm}<")
content = content.replace(">$840k<", ">{formatCurrency(financeKPIs.fuel)}<")

# Add real map of array inside grids?
# Already mapped correctly in the file using vehiclesProfit.map(...) since I kept the same variables.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
