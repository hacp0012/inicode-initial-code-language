import React from "react";
import { Building2, Copyright, ExternalLink, FileText, GitBranch, Info, Mail, ShieldCheck, UserRound, X } from "lucide-react";

interface AppInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, href }) => {
  const content = (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-[#2d2d38] bg-slate-50 dark:bg-[#17171d] p-3 transition hover:border-orange-500/70 dark:hover:border-orange-500/70">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-zinc-500">{label}</div>
        <div className="mt-1 wrap-break-word text-sm text-slate-800 dark:text-zinc-200">{value}</div>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="block text-inherit no-underline">
      {content}
    </a>
  );
};

export const AppInfoModal: React.FC<AppInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-[#2d2d38] bg-white dark:bg-[#1e1e24] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 dark:border-[#2d2d38] dark:bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-[#2d2d38] dark:bg-[#1b1b22]">
              <img src="logo.png" alt="IniCode" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-slate-800 dark:text-zinc-100">IniCode</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-orange-600 dark:text-orange-400">
                Application d’apprentissage
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-[#2a2a32] dark:hover:text-zinc-100"
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-900/60 dark:bg-orange-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-800 dark:text-zinc-100">
                  IniCode — IDE algorithmique en français
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
                  Environnement pédagogique pour écrire, exécuter et comprendre des algorithmes avec une syntaxe proche du
                  pseudo-code français.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem icon={<UserRound className="h-4 w-4" />} label="Auteur" value="hacp0012" />
            <InfoItem icon={<Building2 className="h-4 w-4" />} label="Organisation" value="IniCode / FREEDEV-ACADEMY" />
            <InfoItem icon={<FileText className="h-4 w-4" />} label="License" value="MIT" />
            <InfoItem icon={<ShieldCheck className="h-4 w-4" />} label="Version" value="1.0.0" />
            <InfoItem
              icon={<GitBranch className="h-4 w-4" />}
              label="Dépôt Git"
              value="github.com/hacp0012/inicode-initial-code-language"
              href="https://github.com/hacp0012/inicode-initial-code-language"
            />
            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              label="Contact"
              value="Cliquer ici pour envoyer un mail au developpeur"
              href="mailto:princeieugene48@gmail.com"
            />
            <InfoItem
              icon={<Copyright className="h-4 w-4" />}
              label="Copyright"
              value="© 2026 IniCode. Tous droits réservés."
            />
            <InfoItem
              icon={<ExternalLink className="h-4 w-4" />}
              label="Site / Ressources"
              value="freedev.dev"
              href="https://freedev.dev"
            />
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-[#2d2d38] dark:bg-[#18181c]">
          <button
            onClick={onClose}
            className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-500"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
