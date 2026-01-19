import React from 'react';
import { TradeItem } from '../types';
import { ExternalLink, Star, Image as ImageIcon, FileQuestion, SearchX } from 'lucide-react';
import TiltCard from './TiltCard';

interface DataGridProps {
  data: TradeItem[];
  isLoading: boolean;
  onRowClick: (item: TradeItem) => void;
  onToggleFavorite: (item: TradeItem) => void;
}

const DataGrid: React.FC<DataGridProps> = ({ data, isLoading, onRowClick, onToggleFavorite }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-[2rem] p-4 h-64 animate-pulse border border-slate-200 dark:border-slate-700">
            <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded-2xl mb-4"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-lg w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-full mb-4 shadow-sm relative group">
          <SearchX className="w-12 h-12 text-slate-300 dark:text-slate-500 relative z-10 transition-transform group-hover:scale-110" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Không tìm thấy dữ liệu</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mt-1 leading-relaxed px-4 text-sm">
          Không có kết quả nào phù hợp. <br />
          Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((item, index) => (
        <TiltCard 
          key={`${item.stt}-${index}`}
          className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-2xl hover:shadow-brand-500/10 cursor-pointer flex flex-col relative animate-fade-in-up transition-all duration-300"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
          onClick={() => onRowClick(item)}
        >
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10 transform translate-z-10" style={{ transform: 'translateZ(20px)' }}>
             <span className="px-2.5 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-lg text-xs font-mono font-bold text-slate-700 dark:text-slate-200 shadow-sm border border-white/50 dark:border-white/10">
                #{item.stt}
             </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item);
            }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md text-slate-400 hover:text-yellow-400 transition-colors shadow-sm active:scale-95 border border-white/50 dark:border-white/10"
            style={{ transform: 'translateZ(20px)' }}
          >
            <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </button>

          {/* Image Area */}
          <div className="h-48 w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden flex items-center justify-center rounded-t-[2rem]">
            {item.imageUrl ? (
                <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110" 
                    style={{ transform: 'translateZ(10px)' }}
                />
            ) : (
                <div className="text-slate-300 dark:text-slate-600 flex flex-col items-center transform transition-transform group-hover:scale-110" style={{ transform: 'translateZ(10px)' }}>
                    <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">No Preview</span>
                </div>
            )}
            
            {/* Hover Link Overlay */}
            {item.link && item.link !== '#' && (
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" style={{ transform: 'translateZ(30px)' }}>
                     <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.link, '_blank');
                        }}
                        className="w-full py-2.5 bg-brand-600/90 hover:bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg backdrop-blur-sm flex items-center justify-center gap-2"
                     >
                        Xem tài liệu <ExternalLink className="w-3.5 h-3.5" />
                     </button>
                </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" style={{ transform: 'translateZ(15px)' }}>
                {item.name}
            </h3>
            
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50">
               <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.link && item.link !== '#' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500'}`}>
                  {item.link && item.link !== '#' ? 'Available' : 'Pending'}
               </span>
            </div>
          </div>
        </TiltCard>
      ))}
    </div>
  );
};

export default DataGrid;