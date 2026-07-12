import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  isLoading,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`w-full py-3.5 px-4 bg-black text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group shadow-md hover:shadow-lg ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          <span className="tracking-wide text-[15px] md:text-[16px]">{children}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
};
