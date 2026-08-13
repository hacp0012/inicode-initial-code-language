import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Supprimer',
  cancelText = 'Annuler',
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#1e1e24] border border-slate-200 dark:border-[#2d2d38] rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-slate-800 dark:text-zinc-200 font-sans">
        {/* Header */}
        <div className="bg-slate-100 dark:bg-[#18181c] px-4 py-3 border-b border-slate-200 dark:border-[#2d2d38] flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
          {message}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-[#18181c] px-4 py-3 border-t border-slate-200 dark:border-[#2d2d38] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#383842] hover:bg-slate-100 dark:hover:bg-[#2a2a32] text-slate-700 dark:text-zinc-300 text-xs font-semibold transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
