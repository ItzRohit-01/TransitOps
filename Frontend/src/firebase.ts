import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp
} from 'firebase/firestore';

// Standard development fallback Firebase configuration
// If the user hooks it up to their console, they can replace these keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyApiKeyTransitOps2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "transitops-aadarsh.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "transitops-aadarsh",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "transitops-aadarsh.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abc123xyz"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Demo Credentials to register/login
export const DEMO_ACCOUNTS = [
  {
    role: 'Manager',
    email: 'manager@transitops.global',
    password: 'managerSecretPassword2026',
    name: 'Marcus Chen'
  },
  {
    role: 'Dispatcher',
    email: 'dispatcher@transitops.global',
    password: 'dispatcherSecretPassword2026',
    name: 'Sarah Chen'
  },
  {
    role: 'Safety',
    email: 'safety@transitops.global',
    password: 'safetySecretPassword2026',
    name: 'Sarah Jenkins'
  },
  {
    role: 'Analyst',
    email: 'analyst@transitops.global',
    password: 'analystSecretPassword2026',
    name: 'David Miller'
  }
];

// Helper to seed default data if DB is empty
export async function seedDatabaseIfEmpty() {
  try {
    const vehicleSnap = await getDocs(collection(db, 'vehicles'));
    if (!vehicleSnap.empty) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding initial TransitOps data to Firestore...');

    // 1. Seed Vehicles
    const initialVehicles = [
      { registrationNumber: 'V-102', vehicleName: 'Freightliner M2', vehicleType: 'Heavy Duty', maxLoadCapacity: 26000, odometer: 248310, acquisitionCost: 95000, health: 92, status: 'ON TRIP', assignment: 'Region West', nextSvc: 3400, image: '/white_delivery_truck.png' },
      { registrationNumber: 'V-089', vehicleName: 'Ford F-550', vehicleType: 'Medium Duty', maxLoadCapacity: 19500, odometer: 112450, acquisitionCost: 65000, health: 98, status: 'AVAILABLE', assignment: 'Region East', nextSvc: 7800, image: '/white_delivery_truck.png' },
      { registrationNumber: 'V-211', vehicleName: 'Hino 268', vehicleType: 'Heavy Duty', maxLoadCapacity: 25950, odometer: 310220, acquisitionCost: 88000, health: 64, status: 'IN SHOP', assignment: 'Maintenance Bay 4', nextSvc: 0, image: '/white_delivery_truck.png' },
      { registrationNumber: 'V-304', vehicleName: 'Ram ProMaster', vehicleType: 'Van', maxLoadCapacity: 4600, odometer: 142402, acquisitionCost: 42000, health: 88, status: 'ON TRIP', assignment: 'Region South', nextSvc: 1200, image: '/white_delivery_truck.png' },
      { registrationNumber: 'V-012', vehicleName: 'Peterbilt 579', vehicleType: 'Heavy Duty', maxLoadCapacity: 80000, odometer: 894330, acquisitionCost: 145000, health: 42, status: 'RETIRED', assignment: 'Retired', nextSvc: 0, image: '/white_delivery_truck.png' }
    ];

    for (const v of initialVehicles) {
      await setDoc(doc(db, 'vehicles', v.registrationNumber), v);
    }

    // 2. Seed Drivers
    const initialDrivers = [
      { licenseNumber: 'DL-90821', name: 'John Doe', category: 'Class A', expiryDate: '2026-06-01', contactNumber: '+1 (555) 019-2831', safetyScore: 68, status: 'AVAILABLE', vehicle: 'None' },
      { licenseNumber: 'DL-72019', name: 'Sarah Jenkins', category: 'Class B', expiryDate: '2026-09-01', contactNumber: '+1 (555) 022-9988', safetyScore: 91, status: 'AVAILABLE', vehicle: 'None' },
      { licenseNumber: 'DL-11028', name: 'David Miller', category: 'Class A', expiryDate: '2027-02-14', contactNumber: '+1 (555) 014-4455', safetyScore: 42, status: 'SUSPENDED', vehicle: 'None' },
      { licenseNumber: 'DL-88201', name: 'Marcus Chen', category: 'Class A', expiryDate: '2026-10-15', contactNumber: '+1 (555) 018-8833', safetyScore: 97, status: 'AVAILABLE', vehicle: 'None' },
      { licenseNumber: 'DL-34012', name: 'Elena Rodriguez', category: 'Class A', expiryDate: '2027-05-20', contactNumber: '+1 (555) 017-1122', safetyScore: 95, status: 'ON TRIP', vehicle: 'V-102' },
      { licenseNumber: 'DL-55201', name: 'Robert Jenkins', category: 'Class B', expiryDate: '2026-12-10', contactNumber: '+1 (555) 016-5566', safetyScore: 98, status: 'AVAILABLE', vehicle: 'None' }
    ];

    for (const d of initialDrivers) {
      await setDoc(doc(db, 'drivers', d.licenseNumber), d);
    }

    // 3. Seed Trips
    const initialTrips = [
      { tripId: 'TR-3025', source: 'Chicago Hub', destination: 'Detroit Depot', vehicle: 'V-102', driver: 'DL-34012', cargoWeight: 22000, plannedDistance: 450, status: 'Dispatched', createdAt: new Date() },
      { tripId: 'TR-3026', source: 'Austin Logistics', destination: 'Houston Terminal', vehicle: 'V-304', driver: 'DL-55201', cargoWeight: 3500, plannedDistance: 260, status: 'Draft', createdAt: new Date() },
      { tripId: 'TR-3027', source: 'Denver Center', destination: 'Salt Lake Yard', vehicle: 'V-089', driver: 'DL-88201', cargoWeight: 12000, plannedDistance: 820, status: 'Completed', createdAt: new Date() }
    ];

    for (const t of initialTrips) {
      await setDoc(doc(db, 'trips', t.tripId), t);
    }

    // 4. Seed Maintenance Logs
    const initialMaintenance = [
      { id: 'MX-4021', vehicle: 'V-211', category: 'Transmission Overhaul', cost: 3500, entryDate: '2026-07-10', status: 'Open', notes: 'Gears slipping in third. Swapping clutch assemblies.' },
      { id: 'MX-4022', vehicle: 'V-102', category: 'Routine Brake Pad Swap', cost: 450, entryDate: '2026-07-09', status: 'Closed', notes: 'Replaced rear axle brake linings. Verified system torque.' }
    ];

    for (const mx of initialMaintenance) {
      await setDoc(doc(db, 'maintenanceLogs', mx.id), mx);
    }

    // 5. Seed Fuel Logs
    const initialFuel = [
      { id: 'FL-8021', vehicle: 'V-102', liters: 120, cost: 240, date: '2026-07-11', odometer: 248200 },
      { id: 'FL-8022', vehicle: 'V-304', liters: 45, cost: 90, date: '2026-07-12', odometer: 142380 }
    ];

    for (const fl of initialFuel) {
      await setDoc(doc(db, 'fuelLogs', fl.id), fl);
    }

    // 6. Seed Expenses
    const initialExpenses = [
      { id: 'EXP-9001', category: 'Fuel', amount: 330, vehicle: 'V-102', trip: 'TR-3025', description: 'Highway refuel post dispatch', date: '2026-07-12' },
      { id: 'EXP-9002', category: 'Maintenance', amount: 3500, vehicle: 'V-211', trip: 'N/A', description: 'Transmission service bay fees', date: '2026-07-10' }
    ];

    for (const exp of initialExpenses) {
      await setDoc(doc(db, 'expenses', exp.id), exp);
    }

    // 7. Seed Incidents & Complaints
    const initialIncidents = [
      { id: 'INC-7021', driver: 'Robert Jenkins', vehicle: 'V-202', type: 'Speeding Violation', severity: 'Medium', date: '2026-07-12', status: 'Investigating', notes: 'Speed limit exceeded by 15 mph in I-94 corridor corridor zone. Warning sent.' },
      { id: 'INC-7022', driver: 'John Doe', vehicle: 'V-118', type: 'Hard Braking Event', severity: 'Low', date: '2026-07-12', status: 'Open', notes: 'G-force sensor triggered decelerating warning. Driver logs under review.' }
    ];
    for (const inc of initialIncidents) {
      await setDoc(doc(db, 'incidents', inc.id), inc);
    }

    const initialComplaints = [
      { id: 'CMP-1025', driver: 'Sarah Jenkins', category: 'Dispatcher Scheduling Conflict', priority: 'Medium', date: '2026-07-12', status: 'Pending', description: 'Assigned route exceeds maximum legal daily log hours. Review needed.' }
    ];
    for (const cmp of initialComplaints) {
      await setDoc(doc(db, 'complaints', cmp.id), cmp);
    }

    // 8. Seed AI Insights
    const initialInsights = [
      { id: 'INS-01', type: 'Maintenance', severity: 'Warning', title: 'V-102 Predictive Alert', message: 'Vehicle requires service within 320 km based on fuel efficiency degradation.', generatedAt: new Date() },
      { id: 'INS-02', type: 'Risk', severity: 'Critical', title: 'High Risk Driver Flagged', message: 'David Miller shows safety score 42% due to repeated speeding incidents.', generatedAt: new Date() }
    ];
    for (const ins of initialInsights) {
      await setDoc(doc(db, 'aiInsights', ins.id), ins);
    }

    // 9. Seed Audit Logs
    const initialAudits = [
      { id: 'AUD-001', userId: 'SYSTEM', userEmail: 'system@transitops.global', action: 'DATABASE_INITIALIZATION', details: 'Initial fleet and driver registries auto-seeded successfully.', timestamp: new Date() }
    ];
    for (const aud of initialAudits) {
      await setDoc(doc(db, 'auditLogs', aud.id), aud);
    }

    // 10. Automatically pre-register the demo users in Firebase Auth
    for (const user of DEMO_ACCOUNTS) {
      try {
        await createUserWithEmailAndPassword(auth, user.email, user.password);
        // Create user document mapping the role
        await setDoc(doc(db, 'users', user.email), {
          email: user.email,
          displayName: user.name,
          role: user.role,
          createdAt: serverTimestamp()
        });
        console.log(`Registered auth account for ${user.email} (${user.role})`);
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          await setDoc(doc(db, 'users', user.email), {
            email: user.email,
            displayName: user.name,
            role: user.role,
            createdAt: serverTimestamp()
          }, { merge: true });
        } else {
          console.warn(`Auth pre-registration issue for ${user.email}:`, err.message);
        }
      }
    }

    console.log('Seeding process completed successfully!');
  } catch (error) {
    console.error('Error during auto-seeding:', error);
  }
}
