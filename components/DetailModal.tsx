import React, { useEffect } from 'react';
import { X, ExternalLink, Calendar, History, Activity, Hash, Clock, ShieldCheck, Star, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { TradeItem } from '../types';

interface DetailModalProps {
  item: TradeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (item: TradeItem) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, isOpen, onClose, onToggleFavorite }) => {
  
  if (!isOpen || !item) return null;

  // Mock data lịch sử nếu không có dữ liệu thực (để demo giao diện)
  const displayHistory = item.history && item.history.length > 0 ? item.history : [
    { date: new Date().toISOString().split('T')[0], action: 'Cập nhật hệ thống', user: 'Admin', detail: 'Đồng bộ dữ liệu từ file Excel' },
    { date: '2023-12-01', action: 'Khởi tạo', user: 'System', detail: 'Thêm mới vào danh mục dược quốc gia' }
  ];

  return (
    <>
      {/* Main Detail Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col max-h-[95vh] transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-teal-50/50 dark:bg-teal-900/20 shrink-0">
            <div className="flex gap-4 items-start">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-teal-100 dark:border-slate-700 mt-1">
                <Activity className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Chi tiết dược phẩm</p>
                    {item.isFavorite && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                            <Star className="w-3 h-3 fill-current" /> Đã lưu
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight pr-4">{item.name}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                  onClick={() => onToggleFavorite(item)}
                  className={`p-2 rounded-lg transition-colors border ${
                      item.isFavorite 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-yellow-500 hover:border-yellow-200 dark:hover:border-yellow-800'
                  }`}
                  title={item.isFavorite ? "Bỏ lưu" : "Lưu vào danh sách quan tâm"}
              >
                  <Star className={`w-5 h-5 ${item.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                  onClick={onClose} 
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                  <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Left Column: Image & Basic Info */}
                <div className="lg:w-1/3 space-y-4">
                    {/* Image Display Section */}
                    <div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 relative h-[250px] flex items-center justify-center group">
                    {item.imageUrl ? (
                        <div 
                        className="relative w-full h-full flex justify-center bg-white dark:bg-black/20"
                        title="Hình ảnh minh họa"
                        >
                            <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="max-h-full max-w-full object-contain p-2" 
                            />
                        </div>
                    ) : (
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-slate-600">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Chưa có hình ảnh minh họa</p>
                        </div>
                    )}
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Hash className="w-4 h-4" />
                                <span className="text-xs font-medium">Số thứ tự (STT)</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{item.stt}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-medium">Cập nhật lần cuối</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {item.lastUpdated || new Date().toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & History */}
                <div className="lg:w-2/3 space-y-6">
                    {/* Link Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-teal-500" />
                            Liên kết & Tài liệu
                        </h4>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 font-mono break-all flex items-center">
                                {item.link && item.link !== '#' ? item.link : 'Chưa có liên kết'}
                            </div>
                            
                            {item.link && item.link !== '#' && (
                                <div className="flex gap-2 shrink-0">
                                    <button 
                                        onClick={() => window.open(item.link, '_blank')}
                                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-teal-600/20 transition-all"
                                    >
                                        Mở liên kết <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <History className="w-4 h-4 text-blue-500" />
                                Lịch sử cập nhật
                            </h4>
                            <span className="text-[10px] font-bold uppercase text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Audit Log</span>
                        </div>
                        
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {displayHistory.map((history, idx) => (
                                <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                                            <ShieldCheck className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{history.action}</span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {history.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 pl-9">
                                        {history.detail} <span className="text-xs opacity-70 block mt-1">Bởi: {history.user}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailModal;