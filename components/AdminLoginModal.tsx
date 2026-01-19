import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Retrieve password from localStorage or use default
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';

    if (password === storedPassword) {
      onLoginSuccess();
      onClose();
    } else {
      setError('Mật khẩu không chính xác');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative pt-8 pb-6 px-8 flex flex-col items-center text-center">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quyền Quản Trị</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                Vui lòng nhập mật khẩu quản trị viên để truy cập tính năng cập nhật dữ liệu.
            </p>
        </div>

        <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                        Mật khẩu bảo vệ
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyRound className="h-5 w-5 text-slate-400" />
                        </div>
                        <input 
                            ref={inputRef}
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white outline-none transition-all"
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-medium animate-in slide-in-from-left-1">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>

                <button 
                    type="submit"
                    className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Lock className="w-4 h-4" />
                    Xác nhận truy cập
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;