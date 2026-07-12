import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {notifications.map((notif) => {
        let Icon = Info;
        let bgClass = 'bg-white border-slate-200 text-slate-800';
        let iconColor = 'text-blue-500';

        if (notif.type === 'success') {
          Icon = CheckCircle;
          iconColor = 'text-emerald-500';
        } else if (notif.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-amber-500';
        } else if (notif.type === 'error') {
          Icon = XCircle;
          iconColor = 'text-rose-500';
        }

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-xl shadow-xl border ${bgClass} font-inter animate-slide-up bg-white`}
            style={{ animation: 'slideIn 0.3s ease-out forwards' }}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1">
              <h4 className="text-sm font-bold leading-tight mb-1">{notif.title}</h4>
              <p className="text-xs font-medium text-slate-500 leading-snug">{notif.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
};
