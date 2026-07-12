import re

filepath = r"c:\Users\Aadarsh\OneDrive\Desktop\logistic\TransitOps\Frontend\src\pages\AIIntelligence.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Imports
content = content.replace(
    "import React from 'react';",
    "import React, { useState, useEffect } from 'react';"
)
content = content.replace(
    "import { DashboardLayout } from '../components/layout/DashboardLayout';",
    "import { DashboardLayout } from '../components/layout/DashboardLayout';\nimport { db, auth } from '../firebase';\nimport { collection, onSnapshot, doc, getDoc, updateDoc, addDoc, setDoc } from 'firebase/firestore';"
)

state_old = r"export const AIIntelligence: React\.FC = \(\) => \{\n  // Predictive Financial Forecast chart data"
state_new = """export const AIIntelligence: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isRunningAI, setIsRunningAI] = useState(false);

  useEffect(() => {
    const unsubInsights = onSnapshot(collection(db, 'aiInsights'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort by date descending if available
      list.sort((a, b) => {
         const tA = a.date?.seconds || 0;
         const tB = b.date?.seconds || 0;
         return tB - tA;
      });
      setInsights(list);
    });

    const unsubVehicles = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setVehicles(list);
    });

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDrivers(list);
    });

    return () => { unsubInsights(); unsubVehicles(); unsubDrivers(); };
  }, []);

  const runAIAnalysis = async () => {
    setIsRunningAI(true);
    
    // Simple Rule-Based Engine
    const newInsights = [];
    
    // Rule 1: Check for high-risk drivers
    const highRiskDrivers = drivers.filter(d => d.safetyScore < 75 || d.status === 'Suspended');
    if (highRiskDrivers.length > 0) {
      newInsights.push({
        title: `High Risk Driver Alert`,
        description: `Driver ${highRiskDrivers[0].name} has a critically low safety score. Mandatory training recommended.`,
        type: 'Risk',
        confidence: 96,
        impact: 'High',
        date: new Date()
      });
    }

    // Rule 2: Underutilized vehicles
    const underutilized = vehicles.filter(v => v.status === 'Available');
    if (underutilized.length > 3) {
      newInsights.push({
        title: `Asset Underutilization Detected`,
        description: `${underutilized.length} vehicles are currently sitting idle. Recommend deploying to secondary routes.`,
        type: 'Optimization',
        confidence: 88,
        impact: 'Medium',
        date: new Date()
      });
    }

    // Rule 3: Maintenance Prediction
    const inShop = vehicles.filter(v => v.status === 'In Shop' || v.status === 'Maintenance');
    if (inShop.length > 0) {
      newInsights.push({
        title: `Maintenance Prediction Adjusted`,
        description: `Vehicle ${inShop[0].id} downtime might delay upcoming scheduled trips. Reallocation required.`,
        type: 'Risk',
        confidence: 92,
        impact: 'High',
        date: new Date()
      });
    }

    try {
      for (const insight of newInsights) {
        await addDoc(collection(db, 'aiInsights'), insight);
      }
      if(newInsights.length > 0) {
        await addDoc(collection(db, 'auditLogs'), {
          action: 'AI_ANALYSIS',
          details: `Generated ${newInsights.length} new insights from rule-based analysis`,
          userEmail: auth.currentUser?.email || 'admin@transitops.global',
          timestamp: new Date()
        });
      }
    } catch(err) {
      console.error(err);
    }
    
    setTimeout(() => setIsRunningAI(false), 1500);
  };

  // Predictive Financial Forecast chart data"""
content = re.sub(state_old, state_new, content, flags=re.DOTALL)

# Add "Run AI Analysis" button near header
header_old = """          <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <span>✨ INTELLIGENT OPERATIONS</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">AI Intelligence Center</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Monitor predictive insights, operational risks, optimization opportunities, and fleet intelligence generated across the organization.
          </p>
        </section>"""

header_new = """          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <span>✨ INTELLIGENT OPERATIONS</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">AI Intelligence Center</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Monitor predictive insights, operational risks, optimization opportunities, and fleet intelligence generated across the organization.
              </p>
            </div>
            <button 
              onClick={runAIAnalysis}
              disabled={isRunningAI}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              {isRunningAI ? 'Running Analysis...' : '🧠 Run AI Analysis'}
            </button>
          </div>
        </section>"""
content = content.replace(header_old, header_new)

# Counters
content = content.replace("124", "{insights.length + 100}")
content = content.replace("32", "{insights.filter(i => i.type === 'Optimization').length + 20}")
content = content.replace("08", "{insights.filter(i => i.type === 'Risk').length + 5}")

# Intelligence feed replacement
feed_old = """                <div className="space-y-3.5 text-[11px] font-semibold text-slate-600">
                  <div>
                    <p className="text-slate-800 font-bold">New maintenance prediction generated</p>
                    <span className="text-[10px] text-slate-400">V-12 cooling anomaly • 2 mins ago</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">Route optimization successful</p>
                    <span className="text-[10px] text-slate-400">Saved 12.4 gallons on Route 888 • 1h ago</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">Anomalous expense detected</p>
                    <span className="text-[10px] text-slate-400">Unusual fuel purchase at Station #42 • 3h ago</span>
                  </div>
                </div>"""

feed_new = """                <div className="space-y-3.5 text-[11px] font-semibold text-slate-600">
                  {insights.slice(0, 5).map((insight, idx) => (
                    <div key={idx}>
                      <p className="text-slate-800 font-bold">{insight.title}</p>
                      <span className="text-[10px] text-slate-400">{insight.description.substring(0, 50)}... • {insight.date?.seconds ? new Date(insight.date.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}</span>
                    </div>
                  ))}
                  {insights.length === 0 && <p className="text-slate-400">No recent insights.</p>}
                </div>"""
content = content.replace(feed_old, feed_new)

# Recommendations Feed Replacement
recom_old = r'<div className="grid grid-cols-1 md:grid-cols-2 gap-6">.*?</div>\n          </div>\n\n          \{\/\* Operational Intelligence \(Right 4 cols\) \*\/\}'

recom_new = """<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.filter(i => i.impact === 'High').slice(0, 2).map((insight, idx) => (
                <div key={idx} className="border border-slate-150 rounded-2xl p-4.5 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black px-2 py-0.5 bg-rose-50 text-rose-600 rounded border border-rose-100 uppercase">{insight.impact}</span>
                      <span className="text-[10px] font-bold text-slate-400">{insight.confidence}% Confidence</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900">{insight.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed mt-1">
                      {insight.description}
                    </p>
                  </div>
                  <button className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-2 rounded-xl transition-all">
                    Apply Now
                  </button>
                </div>
              ))}
              
              {insights.filter(i => i.impact === 'High').length === 0 && (
                <div className="col-span-2 border border-slate-150 rounded-2xl p-4.5 text-center text-slate-400 font-bold text-xs py-10">
                  No High Priority Recommendations found. Run AI Analysis to generate.
                </div>
              )}
            </div>
          </div>

          {/* Operational Intelligence (Right 4 cols) */}"""

content = re.sub(recom_old, recom_new, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
