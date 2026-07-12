import React, { useState } from 'react';
import { Lock, Route, ShieldCheck, Landmark } from 'lucide-react';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { RoleCard } from './RoleCard';

// Demo credentials
const DEMO_ACCOUNTS = [
  {
    role: 'Manager',
    description: 'Full Oversight',
    email: 'manager@transitops.global',
    password: 'managerSecretPassword2026',
    icon: <Lock className="w-5 h-5 text-slate-800" />,
  },
  {
    role: 'Dispatcher',
    description: 'Trip Planning',
    email: 'dispatcher@transitops.global',
    password: 'dispatcherSecretPassword2026',
    icon: <Route className="w-5 h-5 text-slate-800" />,
  },
  {
    role: 'Safety',
    description: 'Compliance',
    email: 'safety@transitops.global',
    password: 'safetySecretPassword2026',
    icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
  },
  {
    role: 'Analyst',
    description: 'ROI & Revenue',
    email: 'analyst@transitops.global',
    password: 'analystSecretPassword2026',
    icon: <Landmark className="w-5 h-5 text-amber-700" />,
  },
];

export const LoginCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (roleName: string, roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setSelectedRole(roleName);
    setError({});
    setSuccessMessage('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
    setSelectedRole(null); // Deselect demo role if user types manually
    setError({});
    setSuccessMessage('');
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSuccessMessage('');

    // Simulate API login call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Successfully signed in as ${email}!`);
    }, 1500);
  };

  return (
    <div className="w-full max-w-[460px] mx-auto px-4 py-8 md:py-12 flex flex-col justify-center min-h-[calc(100vh-140px)]">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
          Welcome Back
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-medium">
          Sign in to access TransitOps
        </p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium animate-fadeIn">
          {successMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email Address"
          id="email-address"
          type="email"
          placeholder="name@transitops.global"
          value={email}
          onChange={(e) => handleInputChange(e, setEmail)}
          error={error.email}
          required
        />

        <AuthInput
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => handleInputChange(e, setPassword)}
          error={error.password}
          rightLabelAction={
            <a href="#forgot" className="text-xs text-slate-500 hover:text-slate-900 hover:underline">
              Forgot Password?
            </a>
          }
          required
        />

        <div className="flex items-center justify-between py-1">
          <label className="flex items-center cursor-pointer select-none group">
            <input
              type="checkbox"
              className="sr-only"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-2.5 transition-all duration-200 ${
              rememberMe 
                ? 'bg-black border-black text-white' 
                : 'bg-[#F8F9FC] border-[#E5E7EB] group-hover:border-slate-400'
            }`}>
              {rememberMe && (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              )}
            </div>
            <span className="text-xs md:text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
              Remember this device
            </span>
          </label>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          Sign In
        </AuthButton>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs font-bold tracking-widest text-[#2B3C59] uppercase">
          <span className="bg-white px-4 text-[10px] tracking-[0.15em] font-extrabold">
            Quick Access Demo Accounts
          </span>
        </div>
      </div>

      {/* Quick Access Roles Grid */}
      <div className="grid grid-cols-2 gap-3">
        {DEMO_ACCOUNTS.map((acc) => (
          <RoleCard
            key={acc.role}
            role={acc.role}
            description={acc.description}
            icon={acc.icon}
            onClick={() => handleRoleSelect(acc.role, acc.email, acc.password)}
            isActive={selectedRole === acc.role}
          />
        ))}
      </div>
    </div>
  );
};
