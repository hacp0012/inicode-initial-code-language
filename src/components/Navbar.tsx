import React from "react";
import { Play, Square, Bug, Terminal, Minus, Copy, X } from "lucide-react";

interface NavbarProps {
  onRun: () => void;
  onStepByStep: () => void;
  onNextStep: () => void;
  onStop: () => void;
  executionState: "idle" | "running" | "paused" | "waiting_input";
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRun,
  onStepByStep,
  onNextStep,
  onStop,
  executionState,
  onMinimize,
  onMaximize,
  onClose,
}) => {
  const isElectronWindow = !!window.electronAPI?.isElectron;
  const showWindowControls = isElectronWindow && !!onMinimize && !!onMaximize && !!onClose;
  const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0";

  return (
    <header
      className="w-full flex bg-white dark:bg-[#1e1e24] border-b border-slate-200 dark:border-[#2d2d38] text-slate-800 dark:text-zinc-200"
      style={{ WebkitAppRegion: showWindowControls ? "drag" : "none" }}
    >
      <div className="px-4 py-1 flex w-full items-center justify-between gap-3 shadow-xs select-none z-20">
        {/* Brand Logo & Name */}
        <div className="flex min-w-0 items-center gap-3" style={{ WebkitAppRegion: showWindowControls ? "drag" : "no-drag" }}>
          <div className="text-white rounded-xl shadow-sm flex items-center justify-center font-extrabold tracking-tight">
            <img src="pwa-192x192.svg" alt="IniCode Logo" className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black tracking-tight text-xl text-orange-600 dark:text-orange-500">IniCode</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-500/30">
                Initial Code {appVersion}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:block">
              IDE Algorithmique & Transpileur Français
            </p>
          </div>
        </div>

        {/* Execution Controls */}
        <div
          className="ml-auto flex shrink-0 items-center gap-2"
          style={{ WebkitAppRegion: showWindowControls ? "drag" : "no-drag" }}
        >
          {executionState === "running" || executionState === "paused" || executionState === "waiting_input" ? (
            <div className="flex items-center gap-2">
              {executionState === "paused" && (
                <button
                  onClick={onNextStep}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition animate-pulse cursor-pointer"
                  style={{ WebkitAppRegion: "no-drag" }}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Pas Suivant</span>
                </button>
              )}
              <button
                onClick={onStop}
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                style={{ WebkitAppRegion: "no-drag" }}
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Arrêter</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onRun}
                className="bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm hover:shadow-orange-900/20 transition cursor-pointer active:scale-95"
                style={{ WebkitAppRegion: "no-drag" }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Exécuter (F5)</span>
              </button>

              <button
                onClick={onStepByStep}
                className="bg-slate-100 dark:bg-[#2a2a32] hover:bg-orange-50 dark:hover:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-semibold text-xs px-3 py-1.5 rounded-lg border border-orange-500/40 flex items-center gap-1.5 transition cursor-pointer"
                style={{ WebkitAppRegion: "no-drag" }}
              >
                <Bug className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span className="hidden sm:inline">Pas-à-Pas</span>
              </button>
            </>
          )}
        </div>
      </div>

      {showWindowControls && (
        <div className="mt-0 mr-0 ml-auto flex items-start gap-0.5 rounded-tl-md p-0" style={{ WebkitAppRegion: "no-drag" }}>
          <button
            type="button"
            aria-label="Réduire"
            onClick={onMinimize}
            className="group flex h-13 w-10 items-center justify-center border border-transparent bg-transparent text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-[#2f313a] dark:hover:text-zinc-100"
            style={{ WebkitAppRegion: "no-drag" }}
            title="Réduire la fenêtre"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Agrandir"
            onClick={onMaximize}
            className="group flex h-13 w-10 items-center justify-center border border-transparent bg-transparent text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-[#2f313a] dark:hover:text-zinc-100"
            style={{ WebkitAppRegion: "no-drag" }}
            title="Agrandir la fenêtre"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="group flex h-13 w-10 items-center justify-center border border-transparent bg-transparent text-slate-500 transition hover:bg-[#d93025] hover:text-white dark:text-zinc-400 dark:hover:bg-[#d93025] dark:hover:text-white"
            style={{ WebkitAppRegion: "no-drag" }}
            title="Fermer la fenêtre"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
