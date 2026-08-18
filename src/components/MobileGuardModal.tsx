import React from "react";
import { Monitor, BookOpen, ArrowRight, ShieldAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileGuardModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const MobileGuardModal: React.FC<MobileGuardModalProps> = ({ isOpen, onDismiss }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c24] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-zinc-100 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400">
            <Monitor className="w-6 h-6" />
          </div>
          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg transition"
            title="Fermer et continuer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold font-sans tracking-tight mb-2">Expérience Optimisée sur Grand Écran</h3>

        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
          <strong>IniCode IDE</strong> intègre un éditeur Monaco professionnel, un débogueur pas-à-pas et un panneau
          multi-fichiers. Pour un confort de codage optimal, il est recommandé d'utiliser un{" "}
          <strong>ordinateur ou une tablette</strong>.
        </p>

        <div className="space-y-3">
          {/* <button
            onClick={onDismiss}
            disabled
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer"
          >
            <span>Poursuivre vers l'IDE (Vue adaptée)</span>
            <ArrowRight className="w-4 h-4" />
          </button> */}

          <button
            onClick={() => {
              onDismiss();
              navigate("/docs");
            }}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>Lire la Documentation sur Mobile</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-500">
            <ShieldAlert className="w-3.5 h-3.5" />
            Ratios d'affichage préservés automatiquement
          </span>
        </div>
      </div>
    </div>
  );
};
