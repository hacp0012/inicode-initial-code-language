import React, { useState } from "react";
import { BookOpen, X, Search, Copy, Check } from "lucide-react";
import { CHEAT_SHEET_DATA } from "../data/cheatsheet";

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111114] dark:bg-[#111114] light:bg-white border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-300 rounded-xl w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100 dark:text-zinc-100 light:text-slate-900">
        {/* Header */}
        <div className="bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-slate-100 px-5 py-3.5 border-b border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-zinc-100 dark:text-zinc-100 light:text-slate-900">
                Guide de Syntaxe & Antisèche IniCode (Français)
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Aide-mémoire rapide des équivalences entre le pseudo-code et JavaScript
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 dark:hover:text-zinc-100 light:hover:text-slate-900 p-1 rounded-lg hover:bg-[#18181C] dark:hover:bg-[#18181C] light:hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 bg-[#111114] dark:bg-[#111114] light:bg-slate-50 border-b border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher une instruction (ex: si, pour, affiche, egal_a)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white border border-[#27272A] dark:border-[#27272A] light:border-slate-300 text-zinc-100 dark:text-zinc-100 light:text-slate-900 text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white">
          {CHEAT_SHEET_DATA.map((cat, cIdx) => {
            const filteredItems = cat.items.filter(
              (item) =>
                item.syntax.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.jsEquivalent.toLowerCase().includes(searchTerm.toLowerCase()),
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={cIdx} className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 dark:text-orange-400 light:text-orange-700 border-b border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 pb-1 font-sans">
                  {cat.category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredItems.map((item, iIdx) => {
                    const keyId = `${cIdx}-${iIdx}`;
                    return (
                      <div
                        key={iIdx}
                        className="bg-[#111114] dark:bg-[#111114] light:bg-slate-50 p-3 rounded-lg border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 hover:border-orange-500/40 transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono font-bold text-orange-400 dark:text-orange-400 light:text-orange-700 text-xs">
                              {item.syntax}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono bg-[#18181C] dark:bg-[#18181C] light:bg-slate-200 px-1.5 py-0.5 rounded border border-[#27272A] dark:border-[#27272A] light:border-slate-300">
                              JS: {item.jsEquivalent}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mb-2 font-sans">
                            {item.description}
                          </p>
                          <pre className="bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-slate-900 p-2 rounded text-[11px] font-mono text-emerald-400 dark:text-emerald-400 light:text-emerald-300 overflow-x-auto whitespace-pre border border-[#1F1F23]">
                            {item.example}
                          </pre>
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.example);
                            setCopiedIdx(keyId);
                            setTimeout(() => setCopiedIdx(null), 1500);
                          }}
                          className="mt-2 w-full bg-[#18181C] dark:bg-[#18181C] light:bg-white hover:bg-[#27272A] dark:hover:bg-[#27272A] light:hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 py-1 rounded text-[11px] font-semibold border border-[#27272A] dark:border-[#27272A] light:border-slate-300 flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                        >
                          {copiedIdx === keyId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copié dans l'éditeur</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copier l'exemple</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
