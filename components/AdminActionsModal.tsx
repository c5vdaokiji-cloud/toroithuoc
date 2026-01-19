import React from 'react';
import { X, Trash2, ShieldAlert, Users } from 'lucide-react';

interface AdminActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDatabase: () => void;
}

const AdminActionsModal: React.FC<AdminActionsModalProps> = ({ isOpen, onClose, onResetDatabase }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            Admin Actions
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> User Management
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Manage user roles and permissions.</p>
            <button disabled className="w-full py-2 px-3 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed">
                Coming Soon
            </button>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
             <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Reset Database
             </h4>
             <p className="text-xs text-red-600 dark:text-red-400 mb-3">
               Permanently delete all data. This action cannot be undone.
             </p>
             <button 
                onClick={() => {
                    if(window.confirm('Are you sure you want to delete all data?')) {
                        onResetDatabase();
                    }
                }}
                className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-red-600/20"
             >
                Delete All Data
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActionsModal;