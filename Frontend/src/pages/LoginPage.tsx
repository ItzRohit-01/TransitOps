import React from 'react';
import { Network, Clock, Cpu, Landmark, LineChart } from 'lucide-react';
import { FeatureCard } from '../components/shared/FeatureCard';
import { KPIStatCard } from '../components/shared/KPIStatCard';
import { LoginCard } from '../components/auth/LoginCard';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10">
        
        {/* Left Hero Section (60% on desktop, stacked on tablet, hidden on mobile) */}
        <div className="hidden md:flex md:col-span-1 lg:col-span-6 bg-[#F8F9FC] flex-col justify-between p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-200/60">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2.5 rounded-xl flex items-center justify-center shadow-md">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform rotate-0"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span className="font-outfit font-extrabold text-xl tracking-tight text-slate-900">
              TransitOps
            </span>
          </div>

          {/* Core Copy */}
          <div className="mt-8 lg:mt-12 max-w-xl">
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.1] font-outfit">
              TransitOps Fleet Operations Command Center
            </h1>
            <p className="mt-4 text-sm md:text-base text-slate-500 font-medium leading-relaxed">
              Manage vehicles, drivers, dispatch, maintenance, safety, and financial operations from a single intelligent platform.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-2xl">
            <FeatureCard
              title="Fleet Operations"
              description="Unified visibility"
              icon={<Network className="w-5 h-5 text-indigo-600" />}
              iconBgClass="bg-indigo-50"
            />
            <FeatureCard
              title="Real-Time Dispatch"
              description="Dynamic routing"
              icon={<Clock className="w-5 h-5 text-blue-600" />}
              iconBgClass="bg-blue-50"
            />
            <FeatureCard
              title="Predictive AI"
              description="Maintenance insights"
              icon={<Cpu className="w-5 h-5 text-purple-600" />}
              iconBgClass="bg-purple-50"
            />
            <FeatureCard
              title="Financial Intel"
              description="ROI & cost tracking"
              icon={<Landmark className="w-5 h-5 text-slate-700" />}
              iconBgClass="bg-slate-100"
            />
          </div>

          {/* Fleet Operations Illustration Area */}
          <div className="mt-10 mb-8 max-w-2xl w-full relative rounded-2xl overflow-hidden bg-slate-900 shadow-premium border border-slate-200/50 aspect-[16/9] flex items-center justify-center">
            
            {/* Animated Stylized Map SVG */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 450"
              fill="none"
            >
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="800" height="450" fill="url(#grid)" />

              {/* Map Land Mock */}
              <path
                d="M 50 100 Q 150 80 200 150 T 400 200 T 600 120 T 750 180 T 700 350 T 500 380 T 300 320 T 100 400 Z"
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1.5"
              />

              {/* Route Lines */}
              <path
                d="M 120 180 Q 250 140 380 260 T 620 220"
                stroke="#3B82F6"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.85"
                className="animate-pulse"
              />
              <path
                d="M 220 320 Q 350 250 480 340 T 700 290"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.65"
              />
              <path
                d="M 180 120 Q 300 280 500 150"
                stroke="#8B5CF6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 4"
                opacity="0.5"
              />

              {/* Route Nodes */}
              <circle cx="120" cy="180" r="6" fill="#3B82F6" />
              <circle cx="120" cy="180" r="12" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />
              
              <circle cx="380" cy="260" r="6" fill="#3B82F6" />
              <circle cx="620" cy="220" r="6" fill="#3B82F6" />
              <circle cx="620" cy="220" r="12" stroke="#3B82F6" strokeWidth="2" opacity="0.4" />

              <circle cx="220" cy="320" r="5" fill="#10B981" />
              <circle cx="480" cy="340" r="5" fill="#10B981" />
              <circle cx="700" cy="290" r="5" fill="#10B981" />

              <circle cx="180" cy="120" r="4" fill="#8B5CF6" />
              <circle cx="500" cy="150" r="4" fill="#8B5CF6" />
            </svg>

            {/* Float overlay cards inside the dashboard preview */}
            
            {/* Top Left: Active Trips */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-white/40 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-ping shrink-0" />
              <span className="text-xs font-bold text-slate-800">
                Active Trips: 89
              </span>
            </div>

            {/* Bottom Left: Fleet Health */}
            <div className="absolute top-16 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-white/40 flex items-center gap-2">
              <LineChart className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">
                Fleet Health: 89%
              </span>
            </div>

            {/* Bottom Right: Monthly Revenue */}
            <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 text-white min-w-[130px]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Monthly Revenue
              </span>
              <span className="text-lg font-extrabold tracking-tight mt-0.5 block">
                $2.4M
              </span>
            </div>

            {/* Mini login screen recursive mockup inside the illustration map */}
            <div className="absolute top-1/4 right-8 w-44 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-lg p-3 shadow-2xl hidden sm:block scale-95 opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="bg-black text-white p-1 rounded-sm">
                  <div className="w-2 h-2 border border-white rounded-2xs" />
                </div>
                <span className="text-[8px] font-bold text-slate-800">TransitOps</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-12 bg-slate-300 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded border border-slate-200" />
                <div className="h-1.5 w-10 bg-slate-300 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded border border-slate-200" />
                <div className="h-4 w-full bg-black rounded" />
              </div>
            </div>
          </div>

          {/* Bottom KPI Previews */}
          <div className="border-t border-slate-200/60 pt-6 mt-auto flex gap-12">
            <KPIStatCard
              label="Total Fleet"
              value="482"
              unit="Vehicles"
            />
            <KPIStatCard
              label="Active Drivers"
              value="128"
              unit="Online"
              highlightDot={true}
            />
          </div>

        </div>

        {/* Right Authentication Section (40% on desktop) */}
        <div className="col-span-1 lg:col-span-4 bg-white flex items-center justify-center border-l border-slate-100">
          <LoginCard />
        </div>

      </div>

      {/* Footer Area */}
      <footer className="border-t border-slate-200/50 bg-[#F8F9FC] lg:bg-white px-8 md:px-12 lg:px-16 py-4 flex flex-col md:flex-row items-center justify-between text-[11px] md:text-xs text-slate-500 font-medium gap-3">
        <div>
          TransitOps © 2025 | Fleet Operations Intelligence Platform
        </div>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          <a href="#support" className="hover:text-slate-900 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};
