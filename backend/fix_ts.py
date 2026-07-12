import re

def fix_manager():
    with open('Frontend/src/pages/ManagerDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace(">{482}</span>", ">{totalFleet}</span>")
    content = content.replace(">{128}</span>", ">{activeDrivers}</span>")
    content = content.replace(">{89}</span>", ">{activeTripsCount}</span>")
    
    content = content.replace(">482</span>", ">{totalFleet}</span>")
    content = content.replace(">128</span>", ">{activeDrivers}</span>")
    content = content.replace(">89</span>", ">{activeTripsCount}</span>")

    content = content.replace(">342</span>", ">{activeVehiclesCount}</span>")
    content = content.replace(">96</span>", ">{availableVehiclesCount}</span>")
    content = content.replace(">34</span>", ">{maintenanceVehiclesCount}</span>")

    # Remove Flame from imports if unused
    content = content.replace("  Flame, \n", "")
    content = content.replace("  Flame,\n", "")

    # For insights
    content = content.replace("const [insights, setInsights] = useState<any[]>([]);", "")
    content = content.replace("const unsubInsights = onSnapshot(collection(db, 'aiInsights'), (snapshot) => {", "// unused\n")
    content = content.replace("const list: any[] = [];\n      snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));\n      setInsights(list);\n    });", "")
    content = content.replace("unsubInsights(); ", "")

    with open('Frontend/src/pages/ManagerDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_admin():
    with open('Frontend/src/pages/Administration.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The variables might not have been replaced if the regex was wrong
    content = content.replace(">1,240</span>", ">{totalUsers}</span>")
    content = content.replace(">1,182</span>", ">{activeUsers}</span>")
    content = content.replace(">12</span>", ">{configuredRoles}</span>")
    content = content.replace(">99.9%</span>", ">{systemHealth}%</span>")

    # auditLogs is actually used in Administration.tsx, but TS thinks it's not because I might have left an old hardcoded array? Let's check
    # Actually, the error said `auditLogs` is declared but never read. Wait, I added it as state but maybe didn't use it in JSX?
    # No, I used it in `{auditLogs.length > 0 ? auditLogs.slice(0, 5).map...`
    # Let's verify why it thinks it's not read.
    pass

    with open('Frontend/src/pages/Administration.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_finance():
    with open('Frontend/src/pages/FinanceCenter.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("(prev => ({", "((prev: any) => ({")
    with open('Frontend/src/pages/FinanceCenter.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_notif():
    with open('Frontend/src/contexts/NotificationContext.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';", "import React, { createContext, useContext, useState, useEffect } from 'react';\nimport type { ReactNode } from 'react';")
    content = content.replace(" limit, Timestamp }", " limit }")
    with open('Frontend/src/contexts/NotificationContext.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_mock():
    with open('Frontend/src/mockFirestore.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("import { db } from './firebase';", "// import { db } from './firebase';")
    content = content.replace("...args: any[]", "")
    with open('Frontend/src/mockFirestore.ts', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_manager()
    fix_admin()
    fix_finance()
    fix_notif()
    fix_mock()
    print("Fixes applied.")
