import React from "react";
import { Building2, ExternalLink, GitBranch, Heart, Info, Mail, ShieldCheck, Sparkles, UserRound, X } from "lucide-react";

interface AppInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppInfoModal: React.FC<AppInfoModalProps> = ({ isOpen, onClose }) => {
  // @ts-ignore
  const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.1";
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 dark:border-[#2d2d38] bg-white dark:bg-[#1a1a20] shadow-2xl transition-all">
        {/* Header avec Bannière */}
        <div className="relative border-b border-slate-100 dark:border-[#282832] bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-[#252530] dark:hover:text-zinc-200 transition"
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-200/80 bg-white dark:border-orange-900/50 dark:bg-[#24242e] shadow-xs">
              <img src="logo.png" alt="IniCode" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-zinc-100">IniCode</h2>
                <span className="rounded-full bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40">
                  v{appVersion}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                IDE algorithmique & transpileur interactif en pseudo-code français
              </p>
            </div>
          </div>
        </div>

        {/* Corps du modal */}
        <div className="p-5 space-y-4 text-xs">
          {/* Description */}
          <div className="rounded-xl border border-slate-100 dark:border-[#2a2a34] bg-slate-50/80 dark:bg-[#16161b] p-3.5 leading-relaxed text-slate-600 dark:text-zinc-300">
            <p>
              IniCode est un environnement pédagogique conçu pour apprendre la programmation et l’algorithmique en français,
              avec exécution en temps réel, débogueur pas-à-pas et transpilateur vers JavaScript et TypeScript.
            </p>
          </div>

          {/* Liste épurée des informations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 dark:bg-[#202028] border border-slate-100 dark:border-[#2c2c36]">
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                <UserRound className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-medium">Auteur & Créateur</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">hacp0012</span>
            </div>

            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 dark:bg-[#202028] border border-slate-100 dark:border-[#2c2c36]">
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                <Building2 className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-medium">Organisation</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">--- ---</span>
            </div>

            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 dark:bg-[#202028] border border-slate-100 dark:border-[#2c2c36]">
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-medium">Licence</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">Open Source (MIT)</span>
            </div>

            <a
              href="https://github.com/hacp0012/inicode-initial-code-language"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 dark:bg-[#202028] border border-slate-100 dark:border-[#2c2c36] hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition group"
            >
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                <GitBranch className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-medium">Code source sur GitHub</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-orange-500 transition" />
            </a>

            <a
              href="mailto:princeieugene48@gmail.com"
              className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 dark:bg-[#202028] border border-slate-100 dark:border-[#2c2c36] hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition group"
            >
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                <Mail className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-medium">Contact Développeur</span>
              </div>
              <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">Envoyer un message</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#282832] bg-slate-50/60 dark:bg-[#16161b] px-5 py-3 text-[11px] text-slate-400 dark:text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} IniCode</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Fait avec <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" /> par hacp0012
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-orange-600 hover:bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
