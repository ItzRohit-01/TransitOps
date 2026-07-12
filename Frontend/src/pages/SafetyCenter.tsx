import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';

interface Incident {
  id: string;
  driver: string;
  vehicle: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  notes: string;
}

interface Complaint {
  id: string;
  driver: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  date: string;
  status: 'Reviewed' | 'Pending' | 'Escalated' | 'Resolved';
  description: string;
}

interface ComplianceLicense {
  driver: string;
  status: 'Expired' | 'Expiring Soon' | 'Missing Docs' | 'Compliant';
  expiryDate: string;
  licenseClass: string;
}

interface DriverRisk {
  name: string;
  safetyScore: number;
  incidentsCount: number;
  complaintsCount: number;
  complianceStatus: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export const SafetyCenter: React.FC = () => {
  // Incident state
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 'INC-7021', driver: 'Robert Jenkins', vehicle: 'V-202', type: 'Speeding Violation', severity: 'Medium', date: '2026-07-12', status: 'Investigating', notes: 'Speed limit exceeded by 15 mph in I-94 corridor corridor zone. Warning sent.' },
    { id: 'INC-7022', driver: 'John Doe', vehicle: 'V-118', type: 'Hard Braking Event', severity: 'Low', date: '2026-07-12', status: 'Open', notes: 'G-force sensor triggered decelerating warning. Driver logs under review.' },
    { id: 'INC-7023', driver: 'Elena Rodriguez', vehicle: 'V-109', type: 'Critical Engine Heat Alert', severity: 'High', date: '2026-07-11', status: 'Resolved', notes: 'Cooling fluid low, route halted. Vehicle serviced in shop.' },
    { id: 'INC-7024', driver: 'David Miller', vehicle: 'V-305', type: 'Unlicensed Driving Attempt', severity: 'Critical', date: '2026-07-10', status: 'Closed', notes: 'Attempted dispatcher scheduling while suspended. Logged in audit feed.' }
  ]);

  // Complaint state
  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: 'CMP-1025', driver: 'Sarah Jenkins', category: 'Dispatcher Scheduling Conflict', priority: 'Medium', date: '2026-07-12', status: 'Pending', description: 'Assigned route exceeds maximum legal daily log hours. Review needed.' },
    { id: 'CMP-1026', driver: 'Robert Jenkins', category: 'Cabin AC System Failure', priority: 'High', date: '2026-07-11', status: 'Escalated', description: 'AC unit blowing hot air in transit. Safety issue due to high temperatures.' }
  ]);

  // Licenses list
  const licenses: ComplianceLicense[] = [
    { driver: 'John Doe', status: 'Expired', expiryDate: '2026-06-01', licenseClass: 'Class A' },
    { driver: 'Sarah Jenkins', status: 'Expiring Soon', expiryDate: '2026-09-01', licenseClass: 'Class B' },
    { driver: 'David Miller', status: 'Missing Docs', expiryDate: '2027-02-14', licenseClass: 'Class A' },
    { driver: 'Marcus Chen', status: 'Compliant', expiryDate: '2026-10-15', licenseClass: 'Class A' }
  ];

  // Driver risks list
  const driverRisks: DriverRisk[] = [
    { name: 'Robert Jenkins', safetyScore: 98, incidentsCount: 1, complaintsCount: 1, complianceStatus: 'Valid', riskLevel: 'Low' },
    { name: 'David Miller', safetyScore: 42, incidentsCount: 4, complaintsCount: 0, complianceStatus: 'Suspended', riskLevel: 'High' },
    { name: 'John Doe', safetyScore: 68, incidentsCount: 2, complaintsCount: 0, complianceStatus: 'Expired License', riskLevel: 'High' },
    { name: 'Sarah Jenkins', safetyScore: 91, incidentsCount: 0, complaintsCount: 1, complianceStatus: 'Valid', riskLevel: 'Medium' },
    { name: 'Marcus Chen', safetyScore: 97, incidentsCount: 0, complaintsCount: 0, complianceStatus: 'Valid', riskLevel: 'Low' }
  ];

  // Selected Detail Item State
  // Type: 'incident' | 'complaint'
  const [selectedCaseType, setSelectedCaseType] = useState<'incident' | 'complaint'>('incident');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('INC-7021');

  // Timeline Activity Feed
  const [activityFeed, setActivityFeed] = useState<string[]>([
    '14:22 PM - Incident #INC-7021 Investigating (Driver: Robert Jenkins)',
    '13:50 PM - License Renewal Alert generated for Sarah Jenkins',
    '11:04 AM - Complaint #CMP-1025 received: Scheduling conflict',
    'Yesterday - Driver David Miller Suspended for audit conflict'
  ]);

  // Selected Detail object helper
  const selectedIncident = incidents.find(i => i.id === selectedCaseId);
  const selectedComplaint = complaints.find(c => c.id === selectedCaseId);

  // Actions
  const handleAssignInvestigation = (caseId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === caseId) {
        return { ...inc, status: 'Investigating' };
      }
      return inc;
    }));
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [`${timeStr} - Case #${caseId} investigation assigned`, ...prev]);
  };

  const handleUpdateStatus = (caseId: string, nextStatus: Incident['status']) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === caseId) {
        return { ...inc, status: nextStatus };
      }
      return inc;
    }));
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [`${timeStr} - Case #${caseId} status updated to ${nextStatus}`, ...prev]);
  };

  const handleCloseCase = (caseId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === caseId) {
        return { ...inc, status: 'Closed' };
      }
      return inc;
    }));
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [`${timeStr} - Case #${caseId} marked as Closed`, ...prev]);
  };

  const handleRespondComplaint = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return { ...c, status: 'Reviewed' };
      }
      return c;
    }));
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [`${timeStr} - Complaint #${complaintId} marked as Reviewed`, ...prev]);
  };

  const handleEscalateComplaint = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return { ...c, status: 'Escalated' };
      }
      return c;
    }));
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [`${timeStr} - Complaint #${complaintId} Escalate to Safety Manager`, ...prev]);
  };

  const handleResolveComplaint = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return { ...c, status: 'Resolved' };
      }
      return c;
    }));
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [`${timeStr} - Complaint #${complaintId} marked as Resolved`, ...prev]);
  };

  // Recharts Analytics datasets
  const monthlyIncidentsData = [
    { month: 'Jan', Speeding: 4, Braking: 8, Safety: 1 },
    { month: 'Feb', Speeding: 3, Braking: 5, Safety: 2 },
    { month: 'Mar', Speeding: 6, Braking: 9, Safety: 0 },
    { month: 'Apr', Speeding: 2, Braking: 4, Safety: 1 },
    { month: 'May', Speeding: 5, Braking: 7, Safety: 3 },
    { month: 'Jun', Speeding: 3, Braking: 6, Safety: 1 }
  ];

  const safetyScoreTrend = [
    { week: 'Wk 1', score: 90 },
    { week: 'Wk 2', score: 92 },
    { week: 'Wk 3', score: 91 },
    { week: 'Wk 4', score: 94 },
    { week: 'Wk 5', score: 92 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 font-inter">
        
        {/* Title Header with Subtitle */}
        <section>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">Safety Command Center</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Monitor compliance protocols, driver risk indices, licenses, and resolve critical road safety incidents.
          </p>
        </section>

        {/* Stats row KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Open Incidents */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Open Incidents</span>
            <span className="text-3xl font-black text-rose-500 font-outfit">{incidents.filter(i => i.status !== 'Closed').length}</span>
          </div>

          {/* Pending Complaints */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Pending Complaints</span>
            <span className="text-3xl font-black text-amber-500 font-outfit">{complaints.filter(c => c.status !== 'Resolved').length}</span>
          </div>

          {/* Expiring Licenses */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Expiring Licenses</span>
            <span className="text-3xl font-black text-slate-900 font-outfit">8</span>
          </div>

          {/* Suspended Drivers */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm border-l-4 border-l-rose-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Suspended Drivers</span>
            <span className="text-3xl font-black text-rose-500 font-outfit">4</span>
          </div>

          {/* Compliance Score */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Compliance Rate</span>
            <span className="text-3xl font-black text-emerald-500 font-outfit">96.4%</span>
          </div>

          {/* Avg Safety Score */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Avg Safety Score</span>
            <span className="text-3xl font-black text-slate-900 font-outfit">92</span>
          </div>
        </section>

        {/* Incident Management Table & Case Details Panel */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Incident Table (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">Incident Management Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">INCIDENT ID</th>
                    <th className="pb-3">DRIVER</th>
                    <th className="pb-3">VEHICLE</th>
                    <th className="pb-3">TYPE</th>
                    <th className="pb-3">SEVERITY</th>
                    <th className="pb-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {incidents.map((inc) => (
                    <tr 
                      key={inc.id} 
                      onClick={() => {
                        setSelectedCaseType('incident');
                        setSelectedCaseId(inc.id);
                      }}
                      className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                        selectedCaseType === 'incident' && selectedCaseId === inc.id ? 'bg-slate-50' : ''
                      }`}
                    >
                      <td className="py-4 font-black text-slate-900">#{inc.id}</td>
                      <td className="py-4 text-slate-800 font-bold">{inc.driver}</td>
                      <td className="py-4 text-slate-500">{inc.vehicle}</td>
                      <td className="py-4 text-slate-850 font-bold">{inc.type}</td>
                      <td className="py-4">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                          inc.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                          inc.severity === 'High' ? 'bg-amber-100 text-amber-700' :
                          inc.severity === 'Medium' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {inc.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                          inc.status === 'Investigating' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          inc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          inc.status === 'Closed' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-550/10 text-slate-800'
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incident/Complaint Case Details Panel (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[360px]">
            {selectedCaseType === 'incident' && selectedIncident ? (
              <div className="space-y-4 font-inter text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Active Case View</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">Incident #{selectedIncident.id}</h4>
                </div>

                <div className="space-y-2.5 text-slate-700 font-semibold border-b border-slate-100 pb-4">
                  <div className="flex justify-between">
                    <span>Driver</span>
                    <span className="text-slate-900 font-black">{selectedIncident.driver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle</span>
                    <span className="text-slate-900 font-black">{selectedIncident.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{selectedIncident.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Severity</span>
                    <span className="text-rose-600 font-black">{selectedIncident.severity}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Description Notes</span>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    {selectedIncident.notes}
                  </p>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2 text-center font-bold">
                  {selectedIncident.status === 'Open' && (
                    <button onClick={() => handleAssignInvestigation(selectedIncident.id)} className="col-span-2 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-lg shadow-sm">
                      Assign Investigation
                    </button>
                  )}
                  {selectedIncident.status === 'Investigating' && (
                    <>
                      <button onClick={() => handleUpdateStatus(selectedIncident.id, 'Resolved')} className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm">
                        Resolve Case
                      </button>
                      <button onClick={() => handleCloseCase(selectedIncident.id)} className="py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg">
                        Close Case
                      </button>
                    </>
                  )}
                  {selectedIncident.status === 'Resolved' && (
                    <button onClick={() => handleCloseCase(selectedIncident.id)} className="col-span-2 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-lg shadow-sm">
                      Close Case
                    </button>
                  )}
                  {selectedIncident.status === 'Closed' && (
                    <span className="col-span-2 py-1.5 bg-slate-100 text-slate-400 rounded-lg block font-bold text-[10px]">CASE CLOSED</span>
                  )}
                </div>
              </div>
            ) : selectedCaseType === 'complaint' && selectedComplaint ? (
              <div className="space-y-4 font-inter text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Active Case View</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">Complaint #{selectedComplaint.id}</h4>
                </div>

                <div className="space-y-2.5 text-slate-700 font-semibold border-b border-slate-100 pb-4">
                  <div className="flex justify-between">
                    <span>Driver</span>
                    <span className="text-slate-900 font-black">{selectedComplaint.driver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="text-slate-900 font-bold">{selectedComplaint.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submitted</span>
                    <span>{selectedComplaint.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority</span>
                    <span className="text-rose-600 font-black">{selectedComplaint.priority}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Description Notes</span>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2 font-bold">
                  {selectedComplaint.status === 'Pending' && (
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <button onClick={() => handleRespondComplaint(selectedComplaint.id)} className="py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-lg shadow-sm">
                        Review
                      </button>
                      <button onClick={() => handleEscalateComplaint(selectedComplaint.id)} className="py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg">
                        Escalate
                      </button>
                    </div>
                  )}
                  {selectedComplaint.status === 'Reviewed' && (
                    <button onClick={() => handleResolveComplaint(selectedComplaint.id)} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm text-center">
                      Resolve
                    </button>
                  )}
                  {selectedComplaint.status === 'Escalated' && (
                    <button onClick={() => handleResolveComplaint(selectedComplaint.id)} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm text-center">
                      Resolve Escalation
                    </button>
                  )}
                  {selectedComplaint.status === 'Resolved' && (
                    <span className="w-full py-1.5 bg-slate-100 text-slate-400 rounded-lg block font-bold text-[10px] text-center">COMPLAINT RESOLVED</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs font-bold text-center py-10">Select an incident or complaint case row for options.</div>
            )}
          </div>

        </section>

        {/* Complaint Center */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Complaint Center</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage and resolve driver-submitted safety concerns or scheduling issues</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">COMPLAINT ID</th>
                  <th className="pb-3">DRIVER</th>
                  <th className="pb-3">CATEGORY</th>
                  <th className="pb-3">PRIORITY</th>
                  <th className="pb-3">SUBMITTED DATE</th>
                  <th className="pb-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {complaints.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => {
                      setSelectedCaseType('complaint');
                      setSelectedCaseId(c.id);
                    }}
                    className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                      selectedCaseType === 'complaint' && selectedCaseId === c.id ? 'bg-slate-50' : ''
                    }`}
                  >
                    <td className="py-4 font-black text-slate-900">#{c.id}</td>
                    <td className="py-4 text-slate-800 font-bold">{c.driver}</td>
                    <td className="py-4 text-slate-500">{c.category}</td>
                    <td className="py-4">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                        c.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                        c.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-4 text-slate-450">{c.date}</td>
                    <td className="py-4 text-right">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        c.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                        c.status === 'Escalated' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* License Compliance & Driver Risk Rankings */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Driver Risk Rankings (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm mb-5">Driver Risk rankings & safety metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">DRIVER</th>
                    <th className="pb-3 text-center">SAFETY SCORE</th>
                    <th className="pb-3 text-center">INCIDENTS</th>
                    <th className="pb-3 text-center">COMPLAINTS</th>
                    <th className="pb-3">COMPLIANCE STATE</th>
                    <th className="pb-3 text-right">RISK LEVEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {driverRisks.map((d, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40">
                      <td className="py-4 font-black text-slate-900">{d.name}</td>
                      <td className="py-4 text-center font-bold">
                        <span className={d.safetyScore < 70 ? 'text-rose-500' : 'text-slate-800'}>{d.safetyScore}</span>
                      </td>
                      <td className="py-4 text-center">{d.incidentsCount}</td>
                      <td className="py-4 text-center">{d.complaintsCount}</td>
                      <td className="py-4 text-slate-500 font-bold">{d.complianceStatus}</td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-black px-2.5 py-0.5 rounded ${
                          d.riskLevel === 'High' ? 'bg-rose-50 text-rose-600' :
                          d.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {d.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* License Compliance (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">License Compliance Center</h3>
            <div className="space-y-3.5 text-xs font-semibold">
              {licenses.map((lic, idx) => (
                <div key={idx} className={`border rounded-xl p-3 flex gap-2.5 items-start ${
                  lic.status === 'Expired' ? 'border-rose-100 bg-rose-50/50' :
                  lic.status === 'Expiring Soon' ? 'border-amber-100 bg-amber-50/50' : 'border-slate-100 bg-slate-50/30'
                }`}>
                  <span className="text-base">📄</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-slate-900 font-bold">{lic.driver}</h4>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                        lic.status === 'Expired' ? 'bg-rose-100 text-rose-700' :
                        lic.status === 'Expiring Soon' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>{lic.status}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1 font-medium">{lic.licenseClass} • Expiry: {lic.expiryDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Safety Analytics Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Monthly Incidents */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-4">Monthly Safety Incidents</span>
            <div className="h-64 font-inter text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyIncidentsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Speeding" fill="#EF4444" stackId="a" />
                  <Bar dataKey="Braking" fill="#F59E0B" stackId="a" />
                  <Bar dataKey="Safety" fill="#1E293B" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Safety Score Trends */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-4">Safety Score Trends</span>
            <div className="h-64 font-inter text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safetyScoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="week" tickLine={false} />
                  <YAxis domain={[80, 100]} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </section>

        {/* Alert Center & Timeline Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Alert Center (Left 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Compliance Alert Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="border border-rose-100 bg-rose-50/50 rounded-xl p-3 flex gap-2.5">
                <span className="text-rose-500 shrink-0 text-base">⚠️</span>
                <div>
                  <h4 className="text-slate-900 font-bold">Unlicensed Driving Warning</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Attempted route assignment blocked for John Doe (Expired Class A license).</p>
                </div>
              </div>

              <div className="border border-rose-100 bg-rose-50/50 rounded-xl p-3 flex gap-2.5">
                <span className="text-rose-500 shrink-0 text-base">⚠️</span>
                <div>
                  <h4 className="text-slate-900 font-bold">High Risk Profile Alert</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">David Miller is currently high risk. Safety index is under audit.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Compliance Activity Log</h3>
            <div className="space-y-4 text-[10px] font-bold text-slate-500 pl-3 relative border-l border-slate-200/60">
              {activityFeed.map((log, idx) => (
                <div key={idx} className="relative pl-3">
                  <span className="absolute -left-[16px] top-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
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
