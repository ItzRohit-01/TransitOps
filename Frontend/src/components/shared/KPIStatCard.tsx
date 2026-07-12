import React from 'react';

interface KPIStatCardProps {
  label: string;
  value: string | number;
  unit: string;
  highlightDot?: boolean;
}

export const KPIStatCard: React.FC<KPIStatCardProps> = ({
  label,
  value,
  unit,
  highlightDot = false,
}) => {
  return (
    <div className="flex flex-col min-w-[140px]">
      <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-slate-500 uppercase">
        {label}
      </span>
      <div className="flex items-baseline mt-1.5 gap-1">
        <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
        <span className="text-xs md:text-sm text-slate-500 font-medium flex items-center gap-1.5">
          {highlightDot && (
            <span className="w-2 h-2 rounded-full bg-brand-success inline-block animate-pulse" />
          )}
          {unit}
        </span>
      </div>
    </div>
  );
};
