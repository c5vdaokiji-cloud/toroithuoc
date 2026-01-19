import React from 'react';
import { Activity, Shield, Moon, Sun, Home, Download, Search } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onGoHome: () => void;
  onExport: () => void;
  itemCount: number;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Helper component for Icon Button with Custom Tooltip
const IconButton = ({ onClick, icon, label, className = '' }: { onClick: () => void; icon: React.ReactNode; label: string; className?: string }) => (
  <button
    onClick={onClick}
    className={`group relative p-2.5 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 rounded-xl transition-all outline-none active:scale-95 ${className}`}
    aria-label={label}
  >
    {icon}
    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50 transform translate-y-1 group-hover:translate-y-0">
      {label}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-white"></span>
    </span>
  </button>
);

const Header: React.FC<HeaderProps> = ({ onOpenAdmin, onGoHome, onExport, itemCount, isDarkMode, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 shadow-sm transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3.5 cursor-pointer group select-none" onClick={onGoHome} title="Trang chủ">
          <div className="relative">
             <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
             <div className="relative bg-gradient-to-br from-brand-500 to-accent-600 p-2.5 rounded-2xl shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105 group-hover:rotate-3 border border-white/10">
                <Activity className="w-6 h-6 text-white" />
             </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight leading-none group-hover:to-brand-500 transition-all">
              MediSearch
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase mt-0.5">
              Intelligent Data
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
            {/* Stats Badge */}
            <div className="hidden md:flex items-center gap-2.5 text-sm bg-slate-50/80 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Database:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{itemCount.toLocaleString()}</span>
            </div>

            {/* Icon Group */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 backdrop-blur-md shadow-sm">
                <IconButton 
                    onClick={onExport} 
                    icon={<Download className="w-5 h-5" />} 
                    label="Xuất Excel" 
                />

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                <IconButton 
                    onClick={toggleTheme} 
                    icon={isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} 
                    label={isDarkMode ? "Chế độ sáng" : "Chế độ tối"} 
                />
            </div>
            
            <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 bg-slate-900 hover:bg-brand-600 dark:bg-white dark:hover:bg-brand-400 text-white dark:text-slate-950 pl-4 pr-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-900/10 hover:shadow-brand-500/25 hover:-translate-y-0.5 active:scale-95 group"
                title="Khu vực quản trị hệ thống"
            >
                <Shield className="w-4 h-4 group-hover:text-white dark:group-hover:text-slate-900" />
                <span className="hidden sm:inline">Admin</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;