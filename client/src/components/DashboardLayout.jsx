import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BarChart3, 
  CalendarRange, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Bell, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  User
} from 'lucide-react';

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'scheduler', name: 'Post Scheduler', icon: CalendarRange },
  ];

  const dummyNotifications = [
    { id: 1, text: 'Your scheduled LinkedIn post was published successfully.', time: '10m ago', read: false },
    { id: 2, text: 'Your engagement rate increased by 2.4% this week.', time: '2h ago', read: false },
    { id: 3, text: 'Instagram follower count hit 5,000 milestones!', time: '1d ago', read: true },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shrink-0">
              <BarChart3 size={20} />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent truncate">
                SocialMetrics
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hidden md:block"
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'} />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info & Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          {sidebarOpen ? (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User size={16} />
                  </div>
                )}
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 p-1 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Back-drop & Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-sm">
          <div className="w-64 bg-white dark:bg-slate-900 h-full flex flex-col p-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                  <BarChart3 size={18} />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  SocialMetrics
                </span>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="text-slate-500 dark:text-slate-400 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <img src={user?.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-500 dark:text-slate-400 p-1"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden text-slate-600 dark:text-slate-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="hidden md:block">
            <h1 className="font-semibold text-lg text-slate-800 dark:text-slate-100 capitalize">
              {activeTab === 'dashboard' ? 'Analytics Dashboard' : 'Post Manager & Scheduler'}
            </h1>
          </div>

          {/* Action elements */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
              </button>

              {/* Notifications panel dropdown */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setNotificationsOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 py-2 animate-in fade-in slide-in-from-top-3 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-semibold text-sm">Notifications</span>
                      <button 
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {dummyNotifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800/40 last:border-0"
                        >
                          <p className="text-xs text-slate-700 dark:text-slate-300">{notification.text}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">{notification.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Visual spacer */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>

            {/* Profile info in Header */}
            <div className="flex items-center gap-2">
              <img 
                src={user?.avatar} 
                alt="avatar" 
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" 
              />
              <span className="hidden md:inline text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content body container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
