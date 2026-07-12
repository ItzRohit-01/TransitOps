import re

filepath = r"c:\Users\Aadarsh\OneDrive\Desktop\logistic\TransitOps\Frontend\src\pages\SafetyCenter.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

state_old_pattern = r"export const SafetyCenter: React\.FC = \(\) => \{.*?const handleResolveComplaint = \(complaintId: string\) => \{.*?setActivityFeed.*?  \};"

state_new = """export const SafetyCenter: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<string[]>([]);

  const [selectedCaseType, setSelectedCaseType] = useState<'incident' | 'complaint'>('incident');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  useEffect(() => {
    const unsubInc = onSnapshot(collection(db, 'incidents'), (snapshot) => {
      const list: Incident[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Incident, 'id'>) });
      });
      setIncidents(list);
      if (list.length > 0 && selectedCaseType === 'incident' && !selectedCaseId) {
        setSelectedCaseId(list[0].id);
      }
    });

    const unsubComp = onSnapshot(collection(db, 'complaints'), (snapshot) => {
      const list: Complaint[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Complaint, 'id'>) });
      });
      setComplaints(list);
      if (list.length > 0 && selectedCaseType === 'complaint' && !selectedCaseId) {
        setSelectedCaseId(list[0].id);
      }
    });

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDrivers(list);
    });

    const unsubLogs = onSnapshot(collection(db, 'auditLogs'), (snapshot) => {
      const logs: string[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (d.timestamp && (d.action?.includes('SAFETY') || d.action?.includes('COMPLAINT') || d.action?.includes('INCIDENT'))) {
           const timeStr = d.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
           logs.push(`${timeStr} - ${d.details}`);
        }
      });
      setActivityFeed(logs.slice(0, 15));
    });

    return () => { unsubInc(); unsubComp(); unsubDrivers(); unsubLogs(); };
  }, []);

  const licenses: ComplianceLicense[] = drivers.map(d => {
    let status: 'Expired' | 'Expiring Soon' | 'Compliant' | 'Missing Docs' = 'Compliant';
    if (!d.expiryDate) {
      status = 'Missing Docs';
    } else {
      const expDate = new Date(d.expiryDate);
      const now = new Date();
      if (expDate < now) status = 'Expired';
      else if ((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24) < 30) status = 'Expiring Soon';
    }
    return {
      driver: d.name,
      status,
      expiryDate: d.expiryDate || 'N/A',
      licenseClass: d.category || 'Class A'
    };
  });

  const driverRisks: DriverRisk[] = drivers.map(d => {
    const dIncidents = incidents.filter(i => i.driver === d.name);
    const dComplaints = complaints.filter(c => c.driver === d.name);
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (d.safetyScore < 75 || dIncidents.length > 2) riskLevel = 'High';
    else if (d.safetyScore < 90 || dIncidents.length > 0 || dComplaints.length > 0) riskLevel = 'Medium';
    
    return {
      name: d.name,
      safetyScore: d.safetyScore || 90,
      incidentsCount: dIncidents.length,
      complaintsCount: dComplaints.length,
      complianceStatus: d.status,
      riskLevel
    };
  });

  const selectedIncident = incidents.find(i => i.id === selectedCaseId);
  const selectedComplaint = complaints.find(c => c.id === selectedCaseId);

  // Actions
  const handleAssignInvestigation = async (caseId: string) => {
    await updateDoc(doc(db, 'incidents', caseId), { status: 'Investigating' });
    await addDoc(collection(db, 'auditLogs'), {
      action: 'SAFETY_INVESTIGATION',
      details: `Incident #${caseId} investigation assigned`,
      userEmail: auth.currentUser?.email || 'safety@transitops.global',
      timestamp: new Date()
    });
  };

  const handleUpdateStatus = async (caseId: string, nextStatus: Incident['status']) => {
    await updateDoc(doc(db, 'incidents', caseId), { status: nextStatus });
    await addDoc(collection(db, 'auditLogs'), {
      action: 'SAFETY_STATUS_UPDATE',
      details: `Incident #${caseId} status updated to ${nextStatus}`,
      userEmail: auth.currentUser?.email || 'safety@transitops.global',
      timestamp: new Date()
    });
  };

  const handleCloseCase = async (caseId: string) => {
    await updateDoc(doc(db, 'incidents', caseId), { status: 'Closed' });
    await addDoc(collection(db, 'auditLogs'), {
      action: 'SAFETY_CASE_CLOSE',
      details: `Incident #${caseId} marked as Closed`,
      userEmail: auth.currentUser?.email || 'safety@transitops.global',
      timestamp: new Date()
    });
  };

  const handleRespondComplaint = async (complaintId: string) => {
    await updateDoc(doc(db, 'complaints', complaintId), { status: 'Reviewed' });
    await addDoc(collection(db, 'auditLogs'), {
      action: 'COMPLAINT_REVIEW',
      details: `Complaint #${complaintId} marked as Reviewed`,
      userEmail: auth.currentUser?.email || 'safety@transitops.global',
      timestamp: new Date()
    });
  };

  const handleEscalateComplaint = async (complaintId: string) => {
    await updateDoc(doc(db, 'complaints', complaintId), { status: 'Escalated' });
    await addDoc(collection(db, 'auditLogs'), {
      action: 'COMPLAINT_ESCALATE',
      details: `Complaint #${complaintId} escalated to Safety Manager`,
      userEmail: auth.currentUser?.email || 'safety@transitops.global',
      timestamp: new Date()
    });
  };

  const handleResolveComplaint = async (complaintId: string) => {
    await updateDoc(doc(db, 'complaints', complaintId), { status: 'Resolved' });
    await addDoc(collection(db, 'auditLogs'), {
      action: 'COMPLAINT_RESOLVE',
      details: `Complaint #${complaintId} resolved`,
      userEmail: auth.currentUser?.email || 'safety@transitops.global',
      timestamp: new Date()
    });
  };"""

content = re.sub(state_old_pattern, state_new, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
