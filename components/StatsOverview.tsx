import React, { useEffect, useState, useRef } from 'react';
import { Database, Star, Zap, Activity } from 'lucide-react';
import { TradeItem } from '../types';

interface StatsOverviewProps {
  items: TradeItem[];
}

// Helper component for counting up numbers
const CountUp: React.FC<{ end: number; duration?: number }> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeValue = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeValue * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Spotlight Card Component
const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string; spotlightColor?: string }> = ({ 
  children, 
  className = "", 
  spotlightColor = "rgba(14, 116, 144, 0.15)" // Default teal
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ items }) => {
  const totalItems = items.length;
  const favoriteItems = items.filter(i => i.isFavorite).length;
  const itemsWithLink = items.filter(i => i.link && i.link !== '#').length;
  const linkPercentage = totalItems > 0 ? Math.round((itemsWithLink / totalItems) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-up">
      {/* Total Card - Cyan Spotlight */}
      <SpotlightCard className="p-6 group" spotlightColor="rgba(6, 182, 212, 0.25)">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3.5 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl shadow-lg shadow-brand-500/30 text-white ring-4 ring-brand-50 dark:ring-slate-800 transition-transform group-hover:rotate-6">
                <Database className="w-6 h-6" />
            </div>
            <div>
                 <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tổng quan</p>
                 <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dữ liệu hệ thống</p>
            </div>
        </div>
        
        <div>
            <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  <CountUp end={totalItems} />
                </h3>
                <span className="text-sm font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-full flex items-center border border-brand-100 dark:border-brand-800">
                    <Activity className="w-3 h-3 mr-1" /> Active
                </span>
            </div>
            <div className="mt-3 text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></div>
                Cập nhật real-time
            </div>
        </div>
      </SpotlightCard>

      {/* Favorites Card - Indigo Spotlight */}
      <SpotlightCard className="p-6 group" spotlightColor="rgba(99, 102, 241, 0.25)">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3.5 bg-gradient-to-br from-indigo-400 to-accent-600 rounded-2xl shadow-lg shadow-accent-500/30 text-white ring-4 ring-indigo-50 dark:ring-slate-800 transition-transform group-hover:-rotate-6">
                <Star className="w-6 h-6 fill-white/20" />
            </div>
             <div>
                 <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Đánh dấu</p>
                 <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mục quan tâm</p>
            </div>
        </div>

        <div>
            <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  <CountUp end={favoriteItems} />
                </h3>
                <span className="text-sm text-slate-400 font-medium">mục</span>
            </div>
             <div className="mt-3 text-xs font-medium text-slate-400 dark:text-slate-500">
                Danh sách thuốc đang theo dõi
             </div>
        </div>
      </SpotlightCard>

      {/* Coverage Card - Emerald Spotlight */}
      <SpotlightCard className="p-6 group" spotlightColor="rgba(16, 185, 129, 0.25)">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3.5 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-2xl shadow-lg shadow-teal-500/30 text-white ring-4 ring-teal-50 dark:ring-slate-800 transition-transform group-hover:scale-110">
                <Zap className="w-6 h-6" />
            </div>
             <div>
                 <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Chất lượng</p>
                 <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tỷ lệ số hóa</p>
            </div>
        </div>

        <div>
            <div className="flex items-end justify-between mb-2">
                <h3 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  <CountUp end={linkPercentage} />%
                </h3>
                <span className="mb-2 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-lg">
                    {itemsWithLink} / {totalItems} links
                </span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${linkPercentage}%` }}
              >
                  <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default StatsOverview;