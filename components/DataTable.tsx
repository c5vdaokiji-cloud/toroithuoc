import React, { useState, useEffect, useRef } from 'react';
import { TradeItem, SortConfig, SortField } from '../types';
import { ExternalLink, FileQuestion, ArrowUpDown, ArrowUp, ArrowDown, Pill, FileText, Star, Hash, Edit2, Check, X as XIcon, SearchX } from 'lucide-react';

interface DataTableProps {
  data: TradeItem[];
  isLoading: boolean;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  onRowClick: (item: TradeItem) => void;
  onToggleFavorite: (item: TradeItem) => void;
  onUpdateItem?: (original: TradeItem, updated: TradeItem) => void;
}

// Editable Cell Component
const EditableCell = ({ 
  value, 
  onSave, 
  type = 'text',
  className = ''
}: { 
  value: string | number; 
  onSave: (val: string) => void;
  type?: 'text' | 'number';
  className?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (tempValue !== String(value)) {
        onSave(tempValue);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(String(value)); // Reset
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== String(value)) {
      onSave(tempValue);
    }
  };

  if (isEditing) {
    return (
      <div className="relative w-full" onClick={e => e.stopPropagation()}>
         <input
          ref={inputRef}
          type={type}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`w-full px-2 py-1 bg-white dark:bg-slate-900 border-2 border-brand-500 rounded-lg text-sm text-slate-900 dark:text-white outline-none shadow-lg ${className}`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none">
            <Check className="w-3 h-3" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group/cell relative cursor-text rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 px-2 py-1 -mx-2 transition-colors ${className}`}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
        setTempValue(String(value));
      }}
      title="Click đúp để chỉnh sửa"
    >
      <span className="truncate block">{value}</span>
      <Edit2 className="w-3 h-3 text-slate-300 dark:text-slate-600 absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

const TableSkeleton = () => (
  <div className="animate-pulse w-full">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-5 border-b border-slate-100 dark:border-slate-700">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
    ))}
  </div>
);

const DataTable: React.FC<DataTableProps> = ({ data, isLoading, sortConfig, onSort, onRowClick, onToggleFavorite, onUpdateItem }) => {
  const [displayData, setDisplayData] = useState(data);
  const [isAnimating, setIsAnimating] = useState(false);

  // Effect to handle data transitions (fade out -> update -> fade in)
  useEffect(() => {
    // Trigger fade out
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      setDisplayData(data);
      setIsAnimating(false); // Trigger fade in
    }, 150); // Wait for fade out to almost complete

    return () => clearTimeout(timer);
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6">
           <TableSkeleton />
        </div>
      </div>
    );
  }

  // Handle empty state separately
  if (displayData.length === 0 && !isAnimating) {
     if (data.length === 0) { // Check prop data as well to be sure
        return (
          <div className="w-full flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 transition-colors shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-full mb-6 relative group">
              <SearchX className="w-16 h-16 text-slate-300 dark:text-slate-500 relative z-10 transition-transform group-hover:scale-110 duration-300" />
              <div className="absolute inset-0 bg-brand-100 dark:bg-brand-900/20 rounded-full animate-ping opacity-20"></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Không tìm thấy dữ liệu</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mx-auto leading-relaxed px-4 text-base">
              Rất tiếc, chúng tôi không tìm thấy kết quả nào phù hợp.
              <br />
              <span className="text-slate-400 dark:text-slate-500 text-sm mt-2 block">
                Gợi ý: Hãy thử tìm kiếm với từ khóa ngắn gọn hơn hoặc điều chỉnh bộ lọc của bạn.
              </span>
            </p>
          </div>
        );
     }
  }

  const renderSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 opacity-50 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 font-bold" />
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
          <thead className="hidden md:table-header-group bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-6 py-5 w-16 text-center">
                 <span className="sr-only">Favorite</span>
              </th>
              <th 
                scope="col" 
                className="px-6 py-5 text-left text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-32 cursor-pointer group hover:bg-white dark:hover:bg-slate-800 transition-colors select-none"
                onClick={() => onSort('stt')}
              >
                <div className="flex items-center gap-2">
                  STT
                  {renderSortIcon('stt')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-5 text-left text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer group hover:bg-white dark:hover:bg-slate-800 transition-colors select-none"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                  Tên Thương Mại / Hoạt Chất
                  {renderSortIcon('name')}
                </div>
              </th>
              <th scope="col" className="px-6 py-5 text-right text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Tài liệu & Liên kết
              </th>
            </tr>
          </thead>
          <tbody 
            className={`bg-white dark:bg-slate-800 divide-y divide-slate-50 dark:divide-slate-700/50 block md:table-row-group transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
          >
            {displayData.map((item, index) => (
              <tr 
                key={`${item.stt}-${item.name}-${index}`} 
                className={`hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors group cursor-pointer active:bg-brand-50/50 dark:active:bg-brand-900/20 block md:table-row border-b md:border-none last:border-0 border-slate-100 dark:border-slate-700 p-5 md:p-0 relative ${!isAnimating ? 'animate-in fade-in slide-in-from-bottom-2' : ''}`}
                style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'backwards' }}
                onClick={() => onRowClick(item)}
              >
                {/* Mobile Favorite Position */}
                <div className="md:hidden absolute top-5 right-5 z-10">
                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item);
                        }}
                        className={`p-2 rounded-full transition-all
                            ${item.isFavorite 
                                ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-sm' 
                                : 'text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-700'}`}
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                </div>

                <td className="hidden md:table-cell px-4 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item);
                    }}
                    className={`p-2 rounded-xl transition-all transform active:scale-90
                        ${item.isFavorite 
                            ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-sm' 
                            : 'text-slate-300 dark:text-slate-600 hover:text-yellow-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </td>
                
                <td className="block md:table-cell px-2 py-1 md:px-6 md:py-5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono font-medium md:w-auto">
                    <div className="flex items-center gap-2 md:hidden mb-2">
                        <Hash className="w-3.5 h-3.5 text-brand-500" />
                        <span className="text-xs font-bold uppercase text-slate-400">Số thứ tự:</span>
                    </div>
                    {/* Inline Edit for STT */}
                    {onUpdateItem ? (
                      <EditableCell 
                        value={item.stt}
                        onSave={(val) => onUpdateItem(item, { ...item, stt: val })}
                        type="number"
                        className="bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md max-w-[80px]"
                      />
                    ) : (
                      <span className="text-base md:text-sm bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">{item.stt}</span>
                    )}
                </td>

                <td className="block md:table-cell px-2 py-1 md:px-6 md:py-5 md:whitespace-nowrap">
                  <div className="flex items-center gap-2 md:hidden mb-1">
                        <Pill className="w-3.5 h-3.5 text-brand-500" />
                        <span className="text-xs font-bold uppercase text-slate-400">Tên thuốc:</span>
                  </div>
                  <div className="text-lg md:text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                    {/* Inline Edit for Name */}
                     {onUpdateItem ? (
                      <EditableCell 
                        value={item.name}
                        onSave={(val) => onUpdateItem(item, { ...item, name: val })}
                      />
                    ) : (
                      item.name
                    )}
                  </div>
                </td>

                <td className="block md:table-cell px-2 py-3 md:px-6 md:py-5 md:whitespace-nowrap text-left md:text-right text-sm mt-2 md:mt-0">
                  {onUpdateItem ? (
                     <div className="flex justify-end w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                             <div 
                                className="group/link relative w-full md:w-auto"
                             >
                                {item.link && item.link !== '#' ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation(); 
                                            window.open(item.link, '_blank');
                                          }}
                                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-800 font-semibold transition-all w-full md:w-auto justify-center md:justify-start shadow-sm hover:shadow-md"
                                        >
                                          <FileText className="w-4 h-4" />
                                          Xem chi tiết
                                          <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-50" />
                                        </button>
                                        
                                        <button
                                            className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Sửa liên kết"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newLink = prompt("Nhập liên kết mới:", item.link);
                                                if (newLink !== null) {
                                                    onUpdateItem(item, { ...item, link: newLink });
                                                }
                                            }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end gap-2 group-hover:opacity-100">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-medium w-full md:w-auto justify-center md:justify-end">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                            Đang cập nhật
                                        </span>
                                        <button
                                            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                                            title="Thêm liên kết"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newLink = prompt("Nhập liên kết mới:", "");
                                                if (newLink) {
                                                    onUpdateItem(item, { ...item, link: newLink });
                                                }
                                            }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                             </div>
                        </div>
                     </div>
                  ) : (
                    item.link && item.link !== '#' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          window.open(item.link, '_blank');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-800 font-semibold transition-all w-full md:w-auto justify-center md:justify-start shadow-sm hover:shadow-md"
                      >
                        <FileText className="w-4 h-4" />
                        Xem chi tiết
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-50" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-medium w-full md:w-auto justify-center md:justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          Đang cập nhật
                      </span>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;