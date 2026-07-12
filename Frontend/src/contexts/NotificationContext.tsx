import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: number;
}

interface NotificationContextType {
  notifications: ToastNotification[];
  addNotification: (notification: Omit<ToastNotification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Add a manual notification
  const addNotification = (notif: Omit<ToastNotification, 'id' | 'createdAt'>) => {
    const newNotif: ToastNotification = {
      ...notif,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
    };
    setNotifications((prev) => [...prev, newNotif]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotif.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Listen to new Audit Logs to trigger a toast
  useEffect(() => {
    const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (initialLoad) {
        setInitialLoad(false);
        return;
      }
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          
          // Verify it's actually new (within last 10 seconds)
          const now = Date.now();
          const logTime = data.timestamp?.toMillis ? data.timestamp.toMillis() : 0;
          if (now - logTime < 10000) {
            
            let type: 'info' | 'success' | 'warning' | 'error' = 'info';
            if (data.action?.includes('CREATE') || data.action?.includes('COMPLETED')) type = 'success';
            if (data.action?.includes('ERROR') || data.action?.includes('CRITICAL')) type = 'error';
            if (data.action?.includes('CANCEL') || data.action?.includes('DELAY')) type = 'warning';

            addNotification({
              title: data.action?.replace(/_/g, ' ') || 'System Update',
              message: data.details || 'A new system event occurred.',
              type: type
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [initialLoad]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
