import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  rightLabelAction?: React.ReactNode;
  error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  id,
  rightLabelAction,
  error,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-baseline mb-1.5">
        <label
          htmlFor={id}
          className="text-xs md:text-sm font-semibold text-slate-700 tracking-wide"
        >
          {label}
        </label>
        {rightLabelAction && (
          <div className="text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors">
            {rightLabelAction}
          </div>
        )}
      </div>
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-3 bg-[#F8F9FC] border border-[#E5E7EB] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all text-sm md:text-base ${
          error ? 'border-brand-danger focus:ring-brand-danger focus:border-brand-danger' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-brand-danger mt-1">{error}</span>}
    </div>
  );
};
