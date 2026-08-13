import React from 'react';
import { Bug, Play, Square, Eye } from 'lucide-react';
import { VariableState } from '../transpiler/executor';

interface VisualDebuggerProps {
  variables: VariableState[];
  highlightedLine: number | null;
  executionState: 'idle' | 'running' | 'paused' | 'waiting_input';
  onNextStep: () => void;
  onStop: () => void;
}

export const VisualDebugger: React.FC<VisualDebuggerProps> = ({
  variables,
  highlightedLine,
  executionState,
  onNextStep,
  onStop,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e24] font-mono text-xs text-slate-800 dark:text-zinc-200">
      {/* Debugger Header */}
      <div className="bg-slate-100 dark:bg-[#18181c] border-b border-slate-200 dark:border-[#2d2d38] px-3 py-2 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="font-bold text-slate-800 dark:text-zinc-200">
            Débogueur Pas-à-Pas
          </span>
        </div>
        {executionState === 'paused' && (
          <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-300 dark:border-amber-500/30">
            SUSPENDU A LA LIGNE {highlightedLine}
          </span>
        )}
      </div>

      {/* Debugger Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-[#1e1e24]">
        {/* Step Control Bar */}
        {executionState === 'paused' && (
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60 p-3 rounded-lg space-y-2">
            <div className="text-orange-800 dark:text-orange-300 font-bold text-xs flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Ligne active : Ligne {highlightedLine}</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-zinc-300 font-sans">
              L'exécution est suspendue. Inspectez l'état des variables en mémoire ci-dessous puis passez à l'instruction suivante.
            </p>
            <div className="flex items-center gap-2 pt-1 font-sans">
              <button
                onClick={onNextStep}
                className="bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-3 py-1.5 rounded flex items-center gap-1 shadow-xs transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Pas Suivant (Ligne suivante)</span>
              </button>
              <button
                onClick={onStop}
                className="bg-white dark:bg-[#2a2a32] hover:bg-slate-100 dark:hover:bg-[#32323c] text-slate-700 dark:text-zinc-300 text-xs px-3 py-1.5 rounded border border-slate-300 dark:border-[#383842] transition cursor-pointer"
              >
                Arrêter
              </button>
            </div>
          </div>
        )}

        {/* Variables Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1 font-sans">
            <span>Variables en mémoire</span>
          </h3>

          {variables.length === 0 ? (
            <div className="text-slate-400 dark:text-zinc-500 italic py-6 text-center bg-white dark:bg-[#18181c] rounded border border-slate-200 dark:border-[#2d2d38] font-sans">
              Aucune variable déclarée dans la mémoire pour le moment.
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-[#2d2d38] rounded-lg overflow-hidden bg-white dark:bg-[#18181c] shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-[#2a2a32] text-slate-700 dark:text-zinc-300 font-bold border-b border-slate-200 dark:border-[#2d2d38]">
                  <tr>
                    <th className="py-2 px-3">Nom</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Valeur Actuelle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#2d2d38] bg-white dark:bg-[#1e1e24]">
                  {variables.map((v) => (
                    <tr key={v.name} className="hover:bg-slate-50 dark:hover:bg-[#2a2a32] transition">
                      <td className="py-2 px-3 font-bold text-orange-600 dark:text-orange-400">{v.name}</td>
                      <td className="py-2 px-3 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">{v.type}</td>
                      <td className="py-2 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {typeof v.value === 'string' ? `"${v.value}"` : String(v.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
