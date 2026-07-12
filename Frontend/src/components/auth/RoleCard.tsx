import React from 'react';

interface RoleCardProps {
  role: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  description,
  icon,
  onClick,
  isActive = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center p-3 text-center transition-all duration-300 rounded-2xl border ${
        isActive
          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
          : 'bg-[#F4F5F7]/80 hover:bg-[#EAECEF] border-transparent text-slate-800 hover:scale-[1.02] shadow-sm hover:shadow'
      }`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full mb-1.5 transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-slate-700'
        }`}
      >
        {icon}
      </div>
      <span className="text-[13px] font-bold tracking-tight block">
        {role}
      </span>
      <span
        className={`text-[10px] mt-0.5 font-medium leading-none block ${
          isActive ? 'text-slate-300' : 'text-slate-500'
        }`}
      >
        {description}
      </span>
    </button>
  );
};
