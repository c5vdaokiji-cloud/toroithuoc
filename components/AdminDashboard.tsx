import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Lock, 
  Database, 
  FileSpreadsheet, 
  Trash2, 
  FileCheck, 
  Loader2, 
  KeyRound, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert,
  ArrowLeft,
  AlertTriangle,
  FileJson,
  Globe,
  HardDrive,
  ArrowRight,
  GitCommit,
  Server,
  Copy,
  Zap,
  Link as LinkIcon
} from 'lucide-react';
import { GOOGLE_SHEET_CONFIG } from '../config';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  onResetDatabase: () => void;
  onExportDeployJson: () => void;
  isProcessing: boolean;
  progress: number;
  status: string;
  itemCount: number;
}

type AdminTab = 'data' | 'connect' | 'security' | 'system';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  onResetDatabase,
  onExportDeployJson,
  isProcessing, 
  progress, 
  status,
  itemCount
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('connect'); // Default to connect for visibility
  
  // --- Upload Logic States ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- Password Logic States ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // --- Database Logic States ---
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  // --- Upload Handlers ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const validateAndSelect = (file: File) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      setUploadError("Định dạng file không hợp lệ. Vui lòng chọn file Excel (.xlsx, .xls).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File quá lớn. Kích thước tối đa là 10MB.");
      return;
    }
    setUploadError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) validateAndSelect(e.dataTransfer.files[0]);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Password Handlers ---
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (currentPassword !== storedPassword) {
      setPwError('Mật khẩu hiện tại không chính xác.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Mật khẩu xác nhận không khớp.');
      return;
    }

    localStorage.setItem('adminPassword', newPassword);
    setPwSuccess('Đổi mật khẩu thành công!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // --- Database Handlers ---
  const handleConfirmReset = () => {
      onResetDatabase();
      setResetSuccess(true);
      setShowResetConfirm(false);
      setTimeout(() => setResetSuccess(false), 3000);
  };

  const isGoogleSheetConfigured = GOOGLE_SHEET_CONFIG.csvUrl && GOOGLE_SHEET_CONFIG.csvUrl.length > 0;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300 font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-lg text-white">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Quản Trị</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Local Admin Mode</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          
          <button 
            onClick={() => setActiveTab('connect')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'connect' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Globe className="w-5 h-5" />
            Kết nối Online
            {isGoogleSheetConfigured && <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
          </button>

          <button 
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'data' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Database className="w-5 h-5" />
            Dữ liệu (Excel)
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Lock className="w-5 h-5" />
            Bảo mật (Security)
          </button>

          <button 
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'system' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <ShieldAlert className="w-5 h-5" />
            Hệ thống (System)
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-10 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              {activeTab === 'data' && <><UploadCloud className="w-8 h-8 text-teal-500" /> Upload Excel (Offline)</>}
              {activeTab === 'connect' && <><Globe className="w-8 h-8 text-purple-500" /> Kết nối Live Data</>}
              {activeTab === 'security' && <><Lock className="w-8 h-8 text-blue-500" /> Bảo Mật</>}
              {activeTab === 'system' && <><ShieldAlert className="w-8 h-8 text-red-500" /> Quản Lý Hệ Thống</>}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              {activeTab === 'data' && 'Dùng khi bạn muốn test file Excel trên máy này. Dữ liệu KHÔNG tự cập nhật cho người khác.'}
              {activeTab === 'connect' && 'Cách đơn giản nhất để cập nhật dữ liệu cho mọi người dùng.'}
              {activeTab === 'security' && 'Quản lý mật khẩu truy cập trang quản trị.'}
              {activeTab === 'system' && 'Các tác vụ nguy hiểm như xóa toàn bộ dữ liệu.'}
            </p>
          </header>

          {/* === CONTENT: LIVE CONNECT (SIMPLEST WAY) === */}
          {activeTab === 'connect' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Globe className="w-32 h-32" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-yellow-300 fill-current" />
                        Chế độ tự động cập nhật
                    </h3>
                    <p className="text-purple-100 text-lg mb-6 max-w-2xl leading-relaxed">
                        Thay vì phải upload file và deploy lại web mỗi lần sửa đổi, hãy sử dụng <strong>Google Sheets</strong>. 
                        Chỉ cần sửa trên Google Sheets, website sẽ tự động cập nhật ngay lập tức.
                    </p>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`w-3 h-3 rounded-full ${isGoogleSheetConfigured ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-red-400'}`}></span>
                            <span className="font-bold uppercase tracking-wider text-sm">Trạng thái kết nối:</span>
                            <span className="font-bold">{isGoogleSheetConfigured ? 'ĐANG HOẠT ĐỘNG' : 'CHƯA CẤU HÌNH'}</span>
                        </div>
                        {isGoogleSheetConfigured ? (
                             <p className="text-sm text-green-200">
                                 Website đang lấy dữ liệu trực tiếp từ Google Sheet của bạn. Bạn không cần dùng tính năng Upload Excel nữa.
                             </p>
                        ) : (
                             <p className="text-sm text-red-200">
                                 Hiện tại web đang chạy bằng dữ liệu Offline hoặc file JSON cũ.
                             </p>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Hướng dẫn cài đặt (Chỉ làm 1 lần)</h4>
                    
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold flex items-center justify-center shrink-0">1</div>
                            <div>
                                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Chuẩn bị Google Sheet</h5>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Upload file Excel của bạn lên Google Drive và mở bằng Google Sheets.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold flex items-center justify-center shrink-0">2</div>
                            <div>
                                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Xuất bản lên Web</h5>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Trên menu Google Sheet, chọn <strong>File (Tệp)</strong> → <strong>Share (Chia sẻ)</strong> → <strong>Publish to web (Xuất bản lên web)</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold flex items-center justify-center shrink-0">3</div>
                            <div>
                                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Lấy link CSV</h5>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Trong hộp thoại hiện ra, đổi "Web page" thành <strong>Comma-separated values (.csv)</strong>. Nhấn Publish và copy đường link.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold flex items-center justify-center shrink-0">4</div>
                            <div>
                                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Cập nhật Code</h5>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                                    Mở file <code className="text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-1 py-0.5 rounded text-xs font-mono">config.ts</code> trong mã nguồn của bạn và dán link vào:
                                </p>
                                <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                                    <span className="text-purple-400">export const</span> GOOGLE_SHEET_CONFIG = {'{'}<br/>
                                    &nbsp;&nbsp;csvUrl: <span className="text-green-400">"https://docs.google.com/.../pub?output=csv"</span><br/>
                                    {'}'};
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          )}

          {/* === CONTENT: DATA UPLOAD === */}
          {activeTab === 'data' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-8 animate-in fade-in slide-in-from-right-8 duration-300">
               <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
                  <div>
                      <h4 className="font-bold text-yellow-700 dark:text-yellow-500 text-sm">Chế độ Offline cục bộ</h4>
                      <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                          Khi bạn upload file ở đây, dữ liệu chỉ lưu trên trình duyệt máy bạn. Người dùng khác sẽ KHÔNG thấy thay đổi này.
                          Để cập nhật cho mọi người, hãy dùng tab <strong>Kết nối Online</strong>.
                      </p>
                  </div>
               </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-10">
                   <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                         <Loader2 className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-spin" />
                      </div>
                   </div>
                   <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 animate-pulse">{status || 'Đang xử lý...'}</h4>
                   <div className="w-full max-w-md bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 relative" style={{ width: `${Math.max(5, progress)}%` }}>
                          <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]"></div>
                      </div>
                   </div>
                </div>
              ) : selectedFile ? (
                <div className="space-y-6">
                   <div className="flex items-center gap-4 p-4 bg-teal-50/50 dark:bg-teal-900/10 rounded-xl border border-teal-100 dark:border-teal-900/50">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                          <FileSpreadsheet className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="flex-1">
                          <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{selectedFile.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={handleFileRemove} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-6 h-6" /></button>
                   </div>
                   <div className="flex justify-end gap-3 pt-4">
                       <button onClick={handleFileRemove} className="px-6 py-3 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Hủy bỏ</button>
                       <button onClick={() => onUpload(selectedFile)} className="flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 transition-all transform hover:-translate-y-1">
                           <FileCheck className="w-5 h-5" /> Test trên máy này
                       </button>
                   </div>
                </div>
              ) : (
                <>
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${dragActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-teal-400 hover:bg-teal-50/30 dark:hover:bg-teal-900/10'}`}
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx, .xls" onChange={(e) => e.target.files?.[0] && validateAndSelect(e.target.files[0])} />
                    <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><UploadCloud className="w-10 h-10" /></div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload Excel để test</p>
                    <p className="text-slate-500 dark:text-slate-400">Lưu ý: Chỉ có tác dụng trên trình duyệt này.</p>
                  </div>
                  {uploadError && <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-3"><AlertCircle className="w-5 h-5" />{uploadError}</div>}
                </>
              )}
            </div>
          )}

          {/* === CONTENT: SECURITY === */}
          {activeTab === 'security' && (
             <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 max-w-2xl animate-in fade-in slide-in-from-right-8 duration-300">
               {pwSuccess ? (
                 <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8" /></div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Đổi mật khẩu thành công</h3>
                    <button onClick={() => setPwSuccess('')} className="mt-4 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 font-medium">Thực hiện lại</button>
                 </div>
               ) : (
                 <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mật khẩu hiện tại</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none dark:text-white" placeholder="••••••" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mật khẩu mới</label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none dark:text-white" placeholder="Min 6 ký tự" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Xác nhận mật khẩu</label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none dark:text-white" placeholder="Nhập lại mật khẩu" />
                        </div>
                      </div>
                    </div>
                    {pwError && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" />{pwError}</div>}
                    <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"><Save className="w-5 h-5" /> Lưu thay đổi</button>
                 </form>
               )}
             </div>
          )}

          {/* === CONTENT: SYSTEM === */}
          {activeTab === 'system' && (
             <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <h4 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Vùng Nguy Hiểm</h4>
                <div className={`p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 transition-all ${showResetConfirm ? 'ring-2 ring-red-500 shadow-lg' : ''}`}>
                  
                  {!showResetConfirm ? (
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                          <div>
                              <h5 className="font-bold text-slate-900 dark:text-white mb-1">Xóa toàn bộ dữ liệu</h5>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Hành động này sẽ xóa vĩnh viễn tất cả <strong>{itemCount}</strong> bản ghi trên trình duyệt này.</p>
                          </div>
                          <button 
                              type="button"
                              onClick={() => setShowResetConfirm(true)}
                              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm whitespace-nowrap flex items-center gap-2 transition-colors"
                          >
                              <Trash2 className="w-4 h-4" /> Reset Database
                          </button>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center text-center animate-in zoom-in duration-200">
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-3">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <h5 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Bạn có chắc chắn muốn xóa?</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-sm">
                            Dữ liệu sẽ bị xóa khỏi trình duyệt này. Nếu bạn đã Deploy lên server, dữ liệu gốc trên server vẫn còn nguyên.
                          </p>
                          <div className="flex gap-3">
                              <button 
                                onClick={() => setShowResetConfirm(false)}
                                className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors"
                              >
                                  Hủy bỏ
                              </button>
                              <button 
                                onClick={handleConfirmReset}
                                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2"
                              >
                                  <Trash2 className="w-4 h-4" /> Có, Xóa tất cả
                              </button>
                          </div>
                      </div>
                  )}

                  {resetSuccess && (
                      <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-center justify-center gap-2 font-bold animate-in fade-in slide-in-from-top-2">
                          <CheckCircle2 className="w-5 h-5" /> Đã xóa dữ liệu cục bộ thành công!
                      </div>
                  )}
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;