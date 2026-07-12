import re
import os

filepath = r"c:\Users\Aadarsh\OneDrive\Desktop\logistic\TransitOps\Frontend\src\pages\DispatcherDashboard.tsx"

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

# 2. Interfaces update
interfaces_old = """interface MockVehicle {
  id: string;
  name: string;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
  details: string;
}

interface MockDriver {
  id: string;
  name: string;
  status: 'Available' | 'On Trip' | 'Suspended';
  licenseStatus: 'Valid' | 'Expired';
  licenseExpiry: string;
  details: string;
}

interface MockTrip {
  id: string;
  route: string;
  source: string;
  destination: string;
  cargo: string;
  distance: string;
  eta: string;
  status: 'Draft' | 'Ready' | 'Dispatched' | 'In Transit' | 'Completed';
  driver?: string;
  vehicle?: string;
  progress: number;
}"""

interfaces_new = """interface MockVehicle {
  id: string;
  name: string;
  status: string;
  details: string;
}

interface MockDriver {
  id: string;
  name: string;
  status: string;
  licenseStatus: 'Valid' | 'Expired';
  licenseExpiry: string;
  details: string;
}

interface MockTrip {
  id: string;
  route: string;
  source: string;
  destination: string;
  cargo: string;
  distance: string;
  eta: string;
  status: string;
  statusSub: string;
  driver?: string;
  driverId?: string;
  vehicle?: string;
  vehicleId?: string;
  progress: number;
}"""
content = content.replace(interfaces_old, interfaces_new)

# 3. Component Start & State
state_old_pattern = r"export const DispatcherDashboard: React\.FC = \(\) => \{\n  // Master Lists for Assignment Center.*?\]\);\n\n  // Handle move Kanban trip state"

state_new = """export const DispatcherDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<MockVehicle[]>([]);
  const [drivers, setDrivers] = useState<MockDriver[]>([]);
  const [trips, setTrips] = useState<MockTrip[]>([]);

  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const [activeDetailsId, setActiveDetailsId] = useState<string>('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [activityFeed, setActivityFeed] = useState<string[]>([]);

  useEffect(() => {
    const unsubTrips = onSnapshot(collection(db, 'trips'), (snapshot) => {
      const list: MockTrip[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          route: d.routeCode || 'N/A',
          source: d.source || 'N/A',
          destination: d.destination || 'N/A',
          cargo: d.cargo || 'N/A',
          distance: d.distance || '---',
          eta: d.eta || 'N/A',
          status: d.status || 'DRAFT',
          statusSub: d.statusSub || 'Draft',
          driver: d.driverName,
          driverId: d.driverId,
          vehicle: d.vehicleName,
          vehicleId: d.vehicleId,
          progress: d.progress || 0
        });
      });
      setTrips(list);
      if (list.length > 0 && !activeDetailsId) {
        setActiveDetailsId(list[0].id);
      }
      
      const draftTrips = list.filter(t => t.status === 'DRAFT' && !t.driver);
      if (draftTrips.length > 0 && !selectedTripId) setSelectedTripId(draftTrips[0].id);
    });

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const list: MockDriver[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        // check expiry
        const isExpired = d.expiryDate && new Date(d.expiryDate) < new Date();
        list.push({
          id: docSnap.id,
          name: d.name || 'Unknown',
          status: d.status || 'Available',
          licenseStatus: isExpired ? 'Expired' : 'Valid',
          licenseExpiry: d.expiryDate || 'N/A',
          details: d.category || 'Class A'
        });
      });
      setDrivers(list);
      const availDrivers = list.filter(d => d.status.toUpperCase() === 'AVAILABLE' || d.status.toUpperCase() === 'AVAILABLE');
      if (availDrivers.length > 0 && !selectedDriverId) setSelectedDriverId(availDrivers[0].id);
    });

    const unsubVehicles = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const list: MockVehicle[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          name: d.model || 'Unknown',
          status: d.status || 'Available',
          details: d.type || 'Diesel'
        });
      });
      setVehicles(list);
      const availVehicles = list.filter(v => v.status.toUpperCase() === 'AVAILABLE' || v.status.toUpperCase() === 'AVAILABLE');
      if (availVehicles.length > 0 && !selectedVehicleId) setSelectedVehicleId(availVehicles[0].id);
    });

    const unsubLogs = onSnapshot(collection(db, 'auditLogs'), (snapshot) => {
      const logs: string[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (d.timestamp) {
           const timeStr = d.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
           logs.push(`${timeStr} - ${d.details}`);
        }
      });
      setActivityFeed(logs.slice(0, 10)); // Top 10
    });

    return () => { unsubTrips(); unsubDrivers(); unsubVehicles(); unsubLogs(); };
  }, []);

  const moveTrip = async (tripId: string, nextStatus: string) => {
    try {
      let statusSub = 'Updated';
      let progress = 0;
      
      const targetTrip = trips.find(t => t.id === tripId);
      if (!targetTrip) return;

      if (nextStatus === 'ON SCHEDULE') { statusSub = 'In Transit'; progress = 10; }
      if (nextStatus === 'COMPLETED') { statusSub = 'Completed'; progress = 100; }
      if (nextStatus === 'CANCELLED') { statusSub = 'Cancelled'; progress = 0; }
      if (nextStatus === 'DRAFT') { statusSub = 'Ready'; progress = 5; }
      
      await updateDoc(doc(db, 'trips', tripId), { status: nextStatus, statusSub, progress });
      
      if (nextStatus === 'COMPLETED' || nextStatus === 'CANCELLED') {
        if (targetTrip.driverId) await updateDoc(doc(db, 'drivers', targetTrip.driverId), { status: 'AVAILABLE' });
        if (targetTrip.vehicleId) await updateDoc(doc(db, 'vehicles', targetTrip.vehicleId), { status: 'AVAILABLE' });
      }

      await addDoc(collection(db, 'auditLogs'), {
        action: 'KANBAN_MOVE',
        details: `Trip #${tripId} moved to ${nextStatus}`,
        userEmail: auth.currentUser?.email || 'dispatcher@transitops.global',
        timestamp: new Date()
      });
    } catch(err) {
       console.error(err);
    }
  };"""

content = re.sub(state_old_pattern, state_new, content, flags=re.DOTALL)

# Assign and Dispatch method
assign_old_pattern = r"const handleAssignAndDispatch = \(e: React\.FormEvent\) => \{.*?setActiveDetailsId\(selectedTripId\);\n  \};"

assign_new = """const handleAssignAndDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMsg(null);

    const targetTrip = trips.find(t => t.id === selectedTripId);
    const targetVehicle = vehicles.find(v => v.id === selectedVehicleId);
    const targetDriver = drivers.find(d => d.id === selectedDriverId);

    if (!targetTrip || !targetVehicle || !targetDriver) {
      setValidationError('Please ensure you select a valid Trip, Vehicle, and Driver.');
      return;
    }

    if (targetVehicle.status.toUpperCase() === 'IN SHOP' || targetVehicle.status.toUpperCase() === 'MAINTENANCE') {
      setValidationError(`Vehicle ${targetVehicle.name} is currently In Shop for maintenance.`);
      return;
    }

    if (targetVehicle.status.toUpperCase() === 'RETIRED') {
      setValidationError(`Vehicle ${targetVehicle.name} is Retired and cannot be dispatched.`);
      return;
    }

    if (targetDriver.status.toUpperCase() === 'SUSPENDED') {
      setValidationError(`Driver ${targetDriver.name} is currently Suspended.`);
      return;
    }

    if (targetDriver.licenseStatus === 'Expired') {
      setValidationError(`Driver ${targetDriver.name} has an Expired license.`);
      return;
    }

    if (targetVehicle.status.toUpperCase() === 'ON TRIP') {
      setValidationError(`Vehicle ${targetVehicle.name} is already On Trip.`);
      return;
    }

    if (targetDriver.status.toUpperCase() === 'ON TRIP') {
      setValidationError(`Driver ${targetDriver.name} is already On Trip.`);
      return;
    }

    try {
      await updateDoc(doc(db, 'trips', selectedTripId), {
        status: 'ON SCHEDULE',
        statusSub: 'Dispatched',
        progress: 10,
        driverName: targetDriver.name,
        driverId: targetDriver.id,
        vehicleName: targetVehicle.name,
        vehicleId: targetVehicle.id
      });

      await updateDoc(doc(db, 'vehicles', selectedVehicleId), { status: 'ON TRIP' });
      await updateDoc(doc(db, 'drivers', selectedDriverId), { status: 'ON TRIP' });

      await addDoc(collection(db, 'auditLogs'), {
        action: 'DISPATCH_TRIP',
        details: `Trip #${selectedTripId} dispatched to ${targetDriver.name} in ${targetVehicle.id}`,
        userEmail: auth.currentUser?.email || 'dispatcher@transitops.global',
        timestamp: new Date()
      });

      setSuccessMsg(`Successfully dispatched Trip #${selectedTripId}!`);
      setActiveDetailsId(selectedTripId);
    } catch(err) {
      setValidationError('Failed to dispatch trip.');
    }
  };"""
content = re.sub(assign_old_pattern, assign_new, content, flags=re.DOTALL)

# Status mappings for metrics
content = content.replace("v.status === 'Available'", "v.status.toUpperCase() === 'AVAILABLE'")
content = content.replace("d.status === 'Available'", "d.status.toUpperCase() === 'AVAILABLE'")
content = content.replace("t.status === 'In Transit'", "t.status === 'ON SCHEDULE'")
content = content.replace("t.status === 'Dispatched' || t.status === 'Ready'", "t.status === 'DRAFT'")
content = content.replace("t.id === 'TR-3021'", "t.status === 'DELAYED'")

# Kanban rendering maps
# Column 1: Draft -> (t.status === 'DRAFT' && !t.driver)
content = content.replace("t.status === 'Draft'", "t.status === 'DRAFT' && !t.driver")
content = content.replace("moveTrip(t.id, 'Ready')", "moveTrip(t.id, 'DRAFT')")

# Column 2: Ready -> (t.status === 'DRAFT' && t.driver)
content = content.replace("t.status === 'Ready'", "t.status === 'DRAFT' && t.driver")
content = content.replace("moveTrip(t.id, 'Dispatched')", "moveTrip(t.id, 'ON SCHEDULE')")

# Column 3: Dispatched -> (t.status === 'ON SCHEDULE' && t.progress < 50)
content = content.replace("t.status === 'Dispatched'", "t.status === 'ON SCHEDULE' && t.progress < 50")
content = content.replace("moveTrip(t.id, 'In Transit')", "updateDoc(doc(db, 'trips', t.id), { progress: 50 })")

# Column 4: In Transit -> (t.status === 'ON SCHEDULE' && t.progress >= 50)
content = content.replace("t.status === 'In Transit'", "(t.status === 'ON SCHEDULE' && t.progress >= 50) || t.status === 'DELAYED'")
content = content.replace("moveTrip(t.id, 'Completed')", "moveTrip(t.id, 'COMPLETED')")

# Column 5: Completed -> t.status === 'COMPLETED'
content = content.replace("t.status === 'Completed'", "t.status === 'COMPLETED'")

# Live operations board status badge
content = content.replace("trip.status === 'In Transit'", "(trip.status === 'ON SCHEDULE' || trip.status === 'DELAYED')")
content = content.replace("trip.status === 'Completed'", "trip.status === 'COMPLETED'")

# Ensure fallback for selectedPanelTrip
content = content.replace(
    "const selectedPanelTrip = trips.find(t => t.id === activeDetailsId) || trips[0];",
    "const selectedPanelTrip = trips.find(t => t.id === activeDetailsId) || trips[0] || null;"
)

# And protect its rendering (selectedPanelTrip might be null)
content = content.replace("{/* Trip stats */}", "{selectedPanelTrip && (\n              <>\n              {/* Trip stats */}")
content = content.replace("{/* Activity Feed (Right 4 cols) */}", "</>\n            )}\n            </div>\n          </div>\n\n          {/* Activity Feed (Right 4 cols) */}")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
