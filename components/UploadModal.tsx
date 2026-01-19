import React, { useRef, useState, useEffect } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, Trash2, FileCheck, Loader2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isProcessing: boolean;
  progress?: number;
  status?: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, isProcessing, progress = 0, status }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reset state khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSelect = (file: File) => {
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
    ];

    if (!validTypes.includes(file.type)) {
        setError("Định dạng file không hợp lệ. Vui lòng chọn file Excel (.xlsx, .xls).");
        return;
    }
    
    // Check file size (e.g. 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        setError("File quá lớn. Kích thước tối đa là 10MB.");
        return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 dark:border-slate-700 transform transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-teal-50/50 dark:bg-teal-900/20">
          <h3 className="text-lg font-bold text-teal-900 dark:text-teal-400">Cập Nhật Dữ Liệu Y Tế</h3>
          {!isProcessing && (
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
               <X className="w-5 h-5" />
             </button>
          )}
        </div>

        <div className="p-8">
          {isProcessing ? (
             <div className="flex flex-col items-center justify-center py-6 px-4">
                 <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                       <Loader2 className="w-10 h-10 text-teal-600 dark:text-teal-400 animate-spin" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-700 rounded-full p-1.5 shadow-md border border-slate-100 dark:border-slate-600">
                        <span className="text-xs font-bold text-teal-700 dark:text-teal-400 px-1">{Math.round(progress)}%</span>
                    </div>
                 </div>
                 
                 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 animate-pulse">
                    {status || 'Đang xử lý dữ liệu...'}
                 </h4>
                 
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center max-w-xs">
                     Hệ thống đang đọc và phân tích file Excel. Vui lòng giữ nguyên cửa sổ.
                 </p>

                 {/* Custom Progress Bar */}
                 <div className="w-full max-w-sm bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner border border-slate-200 dark:border-slate-600 p-0.5">
                    <div 
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500 shadow-sm transition-all duration-300 ease-out relative overflow-hidden" 
                        style={{ width: `${Math.max(5, progress)}%` }}
                    >
                         {/* Shimmer Effect */}
                         <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]"></div>
                    </div>
                 </div>
             </div>
          ) : selectedFile ? (
            <div className="space-y-4">
               {/* File Info Card */}
               <div className="flex items-center justify-between bg-teal-50/50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                        <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                 </div>
                 <button 
                    onClick={handleRemoveFile}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Xóa file"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>
               </div>

               {/* Action Buttons */}
               <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
                   <button 
                       onClick={handleRemoveFile}
                       className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                   >
                       Hủy bỏ
                   </button>
                   <button 
                       onClick={handleConfirmUpload}
                       className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40"
                   >
                       <FileCheck className="w-5 h-5" />
                       Tiến hành xử lý
                   </button>
               </div>
            </div>
          ) : (
            <>
                <div 
                    className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group
                    ${dragActive 
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' 
                        : 'border-slate-300 dark:border-slate-600 hover:border-teal-400 hover:bg-teal-50/30 dark:hover:bg-teal-900/10'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept=".xlsx, .xls" 
                        onChange={handleChange}
                    />
                    
                    <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                    </div>
                    
                    <p className="text-slate-900 dark:text-white font-bold text-lg mb-2">Nhấn để tải lên hoặc kéo thả file</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">Hỗ trợ định dạng Excel danh mục thuốc</p>

                    <div className="flex gap-3 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg"><FileSpreadsheet className="w-4 h-4 text-green-600"/> Excel</div>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;