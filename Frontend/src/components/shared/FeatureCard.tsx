import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  iconBgClass = 'bg-slate-50 text-slate-600',
}) => {
  return (
    <div className="flex items-center p-4 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-soft hover:shadow-premium transition-all duration-300 gap-4 group hover:-translate-y-0.5">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconBgClass}`}>
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <h3 className="font-semibold text-slate-800 text-[14px] md:text-[15px] leading-tight">
          {title}
        </h3>
        <p className="text-[12px] text-slate-500 mt-0.5 truncate">
          {description}
        </p>
      </div>
    </div>
  );
};
