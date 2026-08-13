import React from 'react';
import { Download, FileCode, CheckCircle2, X } from 'lucide-react';
import { CodeFile } from '../types';

interface ExportConfirmModalProps {
  isOpen: boolean;
  file: CodeFile | null;
  onConfirmDownload: () => void;
  onCancel: () => void;
}

export const ExportConfirmModal: React.FC<ExportConfirmModalProps> = ({
  isOpen,
  file,
  onConfirmDownload,
  onCancel,
}) => {
  if (!isOpen || !file) return null;

  const linesCount = file.content.split('\n').length;
  const sizeBytes = new Blob([file.content]).size;
  const formattedSize = sizeBytes < 1024 ? `${sizeBytes} B` : `${(sizeBytes / 1024).toFixed(1)} KB`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#1a1a22] border border-slate-200 dark:border-[#2f2f3e] rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-zinc-100 relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-sans text-base">Exportation de Fichier</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Raccourci déclenché (Ctrl+S / Cmd+S)</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
          Vous êtes sur le point de télécharger le fichier source algorithmique sur votre disque local :
        </p>

        {/* File summary card */}
        <div className="bg-slate-50 dark:bg-[#22222c] border border-slate-200 dark:border-[#333342] rounded-xl p-3.5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCode className="w-8 h-8 text-orange-500 shrink-0" />
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-zinc-100 font-mono">
                {file.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400">
                Format IniCode (`.ic`) • {linesCount} ligne{linesCount > 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 bg-white dark:bg-[#181820] border border-slate-200 dark:border-zinc-700/80 rounded-md text-slate-600 dark:text-zinc-300">
            {formattedSize}
          </span>
        </div>

        <div className="bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-6 flex items-start gap-2.5 text-xs text-orange-800 dark:text-orange-300">
          <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <span>
            Ce fichier pourra être réimporté à tout moment dans l'IDE IniCode via l'explorateur de fichiers.
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={onConfirmDownload}
            className="px-5 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger maintenant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
