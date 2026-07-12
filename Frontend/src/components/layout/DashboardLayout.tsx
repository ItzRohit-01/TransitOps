import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  ShieldCheck, 
  Landmark, 
  Brain, 
  Settings, 
  Search, 
  Bell, 
  AlertTriangle, 
  Zap, 
  MoreVertical,
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const userRole = localStorage.getItem('userRole') || 'Manager';
  const isDispatcher = userRole === 'Dispatcher';

  const isFleetView = currentPath === '/fleet';
  const isDriversView = currentPath === '/drivers';
  const isTripsView = currentPath === '/trips';
  const isSafetyView = currentPath === '/safety';
  const isFinanceView = currentPath === '/finance';
  const isAIView = currentPath === '/ai';
  const isAdminView = currentPath === '/admin';
  const isDispatcherDashboard = currentPath === '/dispatcher';

  // Customize Sidebar Menu Items dynamically
  let menuItems = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      path: isDispatcher ? '/dispatcher' : '/dashboard' 
    }
  ];

  if (userRole === 'Dispatcher') {
    menuItems.push(
      { name: 'Fleet Management', icon: <Truck className="w-5 h-5" />, path: '/fleet' },
      { name: 'Driver Management', icon: <Users className="w-5 h-5" />, path: '/drivers' },
      { name: 'Trip Operations', icon: <Route className="w-5 h-5" />, path: '/trips' }
    );
  } else if (userRole === 'Safety') {
    menuItems.push(
      { name: 'Driver Management', icon: <Users className="w-5 h-5" />, path: '/drivers' },
      { name: 'Trip Operations', icon: <Route className="w-5 h-5" />, path: '/trips' },
      { name: 'Safety Center', icon: <ShieldCheck className="w-5 h-5" />, path: '/safety' }
    );
  } else if (userRole === 'Analyst') {
    menuItems.push(
      { name: 'Trip Operations', icon: <Route className="w-5 h-5" />, path: '/trips' },
      { name: 'Finance Center', icon: <Landmark className="w-5 h-5" />, path: '/finance' },
      { name: 'AI Intelligence', icon: <Brain className="w-5 h-5" />, path: '/ai' }
    );
  } else {
    // Fleet Manager (full access)
    menuItems.push(
      { name: 'Fleet Management', icon: <Truck className="w-5 h-5" />, path: '/fleet' },
      { name: 'Driver Management', icon: <Users className="w-5 h-5" />, path: '/drivers' },
      { name: 'Trip Operations', icon: <Route className="w-5 h-5" />, path: '/trips' },
      { name: 'Safety Center', icon: <ShieldCheck className="w-5 h-5" />, path: '/safety' },
      { name: 'Finance Center', icon: <Landmark className="w-5 h-5" />, path: '/finance' },
      { name: 'AI Intelligence', icon: <Brain className="w-5 h-5" />, path: '/ai' },
      { name: 'Administration', icon: <Settings className="w-5 h-5" />, path: '/admin' }
    );
  }

  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  // Determine profile information dynamically based on user role
  let displayProfileName = 'Marcus Chen';
  let displayProfileTitle = 'Fleet Director';
  let displayProfileEmail = 'manager@transitops.global';
  let displayProfileImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop';

  if (userRole === 'Dispatcher') {
    displayProfileName = 'Alexander Sterling';
    displayProfileTitle = 'Lead Dispatcher';
    displayProfileEmail = 'dispatcher@transitops.global';
    displayProfileImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop';
  } else if (userRole === 'Safety') {
    displayProfileName = 'Sarah Jenkins';
    displayProfileTitle = 'Safety Compliance';
    displayProfileEmail = 'safety@transitops.global';
    displayProfileImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop';
  } else if (userRole === 'Analyst') {
    displayProfileName = 'David Miller';
    displayProfileTitle = 'Financial Analyst';
    displayProfileEmail = 'analyst@transitops.global';
    displayProfileImage = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop';
  }

  const profileName = displayProfileName;
  const profileImage = displayProfileImage;

  // Dynamic search placeholders
  const searchPlaceholder = isDispatcherDashboard
    ? 'Search active trips, dispatch codes...'
    : isSafetyView 
    ? 'Search incidents, drivers...'
    : isFinanceView 
    ? 'Search financials...'
    : isAIView 
    ? 'Search operational intelligence...'
    : isAdminView 
    ? 'Search across administration...'
    : isTripsView 
    ? 'Search trips, drivers, or route IDs...'
    : isDriversView 
    ? 'Search drivers, vehicles, or trips...'
    : isFleetView 
    ? 'Search vehicles, VIN, or drivers...' 
    : 'Search fleet, drivers, or active routes...';

  // Dynamic logo subtitle branding
  const logoSubtitle = isDispatcherDashboard
    ? 'DISPATCH COMMAND'
    : isSafetyView 
    ? 'ENTERPRISE SAFETY'
    : isFinanceView 
    ? 'ENTERPRISE FINANCE'
    : isAdminView 
    ? 'ENTERPRISE ADMIN'
    : isDriversView || isFleetView 
    ? 'Fleet Command Center' 
    : 'Enterprise Fleet';

  const logoTitle = 'TransitOps';

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-20">
        <div className="p-6">
          {/* Logo & Branding */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-90 transition-opacity"
          >
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
              >
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-outfit font-extrabold text-lg leading-tight tracking-tight text-slate-900">
                {logoTitle}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                {logoSubtitle}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}>
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/80 space-y-3 relative">
          {showProfileMenu && (
            <div className="absolute bottom-[72px] left-4 right-4 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-3.5 space-y-3.5 font-inter text-xs text-slate-700 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Account Details</span>
                <div className="font-extrabold text-slate-900">{displayProfileName}</div>
                <div className="text-[10px] text-slate-500 font-semibold">{displayProfileTitle}</div>
                <div className="text-[10px] text-slate-400 font-medium">{displayProfileEmail}</div>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <button 
                  onClick={() => {
                    localStorage.removeItem('userRole');
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-slate-50 rounded-lg text-rose-600 font-extrabold transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {isDriversView ? (
            <div className="bg-[#0B132B] text-white rounded-xl p-4 shadow-md font-inter space-y-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block tracking-wide">Next Maintenance</span>
                <span className="text-sm font-black tracking-tight mt-0.5 block font-outfit">14 Vehicles Pending</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          ) : isTripsView ? (
            <div className="bg-[#F8F9FC] border border-slate-200/80 text-slate-700 rounded-xl px-4 py-3 shadow-xs flex items-center gap-2.5 font-inter">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="text-xs font-bold text-slate-850">System Status: Online</span>
            </div>
          ) : isSafetyView ? (
            <div className="space-y-3 font-inter">
              <button className="w-full bg-black hover:bg-slate-900 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                🚨 Emergency Response
              </button>
              <div className="flex flex-col gap-1.5 px-2 text-xs font-bold text-slate-500">
                <button className="flex items-center gap-2.5 py-1 hover:text-slate-950 text-left">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </button>
                <button className="flex items-center gap-2.5 py-1 hover:text-slate-950 text-left">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  Support
                </button>
              </div>
            </div>
          ) : isFinanceView ? (
            <div className="space-y-3 font-inter">
              <button className="w-full bg-[#FAF5FF] hover:bg-[#F3E8FF] text-purple-700 border border-purple-200 font-extrabold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-between px-4">
                <span>✨ AI Insights</span>
                <span>➔</span>
              </button>
              <div className="flex flex-col gap-1.5 px-2 text-xs font-bold text-slate-500">
                <button className="flex items-center gap-2.5 py-1 hover:text-slate-950 text-left">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </button>
                <button className="flex items-center gap-2.5 py-1 hover:text-slate-950 text-left">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  Support
                </button>
              </div>
            </div>
          ) : isAIView ? (
            <div className="space-y-3 font-inter">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-950 w-full px-2 py-1">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                Help Center
              </button>
              <button className="w-full bg-black hover:bg-slate-900 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95">
                Request Support
              </button>
            </div>
          ) : isAdminView ? (
            <div 
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer font-inter"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                    alt="Marcus Thome"
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-100"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Marcus Thome</span>
                  <span className="text-[10px] text-slate-400 font-medium">Super Admin</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(prev => !prev);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={profileImage}
                    alt={profileName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-100"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">{profileName}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{displayProfileTitle}</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(prev => !prev);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Layout */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Dynamic Header */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-10 font-inter">
          <div className="flex items-center gap-2">
            <h2 className="font-outfit font-extrabold text-xl text-slate-950">
              {isSafetyView ? 'Safety Center' : isFinanceView ? 'Finance Center' : isAIView ? 'AI Intelligence' : isAdminView ? 'Administration Center' : isDispatcherDashboard ? 'Dispatcher Command Center' : 'Fleet Command'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative w-96 font-inter">
              <Search className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F8F9FC] border border-slate-200/80 rounded-xl text-sm font-medium placeholder-slate-400 text-slate-800 focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>

            {/* Quick Icons / Custom profiles on the right */}
            <div className="flex items-center gap-4">
              {isSafetyView ? (
                <div className="flex items-center gap-4">
                  <button className="p-2.5 text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-xl relative transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                  </button>
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 cursor-pointer shadow-sm">
                    👤
                  </div>
                </div>
              ) : isFinanceView ? (
                <div className="flex items-center gap-4">
                  <button className="p-2 text-slate-500 hover:text-slate-950 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-950 rounded-lg">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=80&auto=format&fit=crop" 
                      alt="Executive Admin" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-100"
                    />
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Executive Admin</span>
                  </div>
                </div>
              ) : isAIView ? (
                <div className="flex items-center gap-4">
                  <button className="p-2.5 text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-xl relative transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-950 rounded-lg">
                    <Settings className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=80&auto=format&fit=crop" 
                      alt="Alex Rivera" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-100"
                    />
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Alex Rivera</span>
                  </div>
                </div>
              ) : isAdminView ? (
                <div className="flex items-center gap-4">
                  <button className="p-2.5 text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-xl relative transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-950 rounded-lg">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/50 cursor-pointer hover:bg-slate-100">
                    <span>Organization: TransitOps Global</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-xl relative transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                  </button>
                  {!isDriversView && !isTripsView && (
                    <>
                      <button className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      </button>
                      <button className="p-2.5 text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-all">
                        <Zap className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Dynamic Header Action Buttons */}
              {isSafetyView ? (
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm">Export Report</button>
                  <button className="px-4.5 py-2 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md">Report Incident</button>
                </div>
              ) : isFinanceView ? (
                <div className="flex gap-2">
                  <button className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                    ⬇ Download CSV
                  </button>
                  <button className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                    Generate Summary
                  </button>
                  <button className="px-4.5 py-2 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md">
                    Export Report
                  </button>
                </div>
              ) : isAIView ? (
                <div className="flex gap-2">
                  <button className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm">Refresh Predictions</button>
                  <button className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm">Export Report</button>
                  <button className="px-4.5 py-2 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md">Run Analysis</button>
                </div>
              ) : isAdminView ? (
                <div className="flex gap-2">
                  <button className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm">Export Logs</button>
                  <button className="px-3.5 py-2 border border-slate-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl text-xs font-bold">Create Role</button>
                  <button className="px-4.5 py-2 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md">Add User</button>
                </div>
              ) : (
                !isDriversView && !isTripsView && (
                  <button className="bg-black hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-95">
                    Quick Actions +
                  </button>
                )
              )}
            </div>
          </div>
        </header>

        {/* Content Page */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
