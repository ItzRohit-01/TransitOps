import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, seedDatabaseIfEmpty } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  userRole: 'Manager' | 'Dispatcher' | 'Safety' | 'Analyst' | null;
  userDisplayName: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'Manager' | 'Dispatcher' | 'Safety' | 'Analyst' | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('demoAuthBypass');
    return firebaseSignOut(auth);
  };

  useEffect(() => {
    // Run DB Seeding if empty on start
    seedDatabaseIfEmpty();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user && localStorage.getItem('demoAuthBypass') === 'true') {
        const storedRole = localStorage.getItem('userRole') as any;
        setCurrentUser({ email: 'demo@transitops.global', uid: 'demo-123' } as User);
        setUserRole(storedRole || 'Manager');
        setUserDisplayName('Demo User');
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      if (user) {
        try {
          // Fetch user doc from Firestore
          const userDocRef = doc(db, 'users', user.email || '');
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.role || 'Manager');
            setUserDisplayName(data.displayName || user.email);
            localStorage.setItem('userRole', data.role || 'Manager');
          } else {
            // Fallback parsing based on email prefix
            const email = (user.email || '').toLowerCase();
            let role: 'Manager' | 'Dispatcher' | 'Safety' | 'Analyst' = 'Manager';
            if (email.includes('dispatcher')) role = 'Dispatcher';
            else if (email.includes('safety')) role = 'Safety';
            else if (email.includes('analyst') || email.includes('finance')) role = 'Analyst';

            setUserRole(role);
            setUserDisplayName(user.email);
            localStorage.setItem('userRole', role);
          }
        } catch (e) {
          console.error("Failed to load user role doc:", e);
          setUserRole('Manager');
          setUserDisplayName(user.email);
        }
      } else {
        setUserRole(null);
        setUserDisplayName(null);
        localStorage.removeItem('userRole');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, userDisplayName, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
