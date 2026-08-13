import React from "react";
import { CheckCircle2, AlertTriangle, Play, Pause, HelpCircle, Code2, Sun, Moon, Monitor, Terminal } from "lucide-react";
import { ThemeMode } from "../hooks/useTheme";

interface StatusBarProps {
  executionState: "idle" | "running" | "paused" | "waiting_input";
  errorsCount: number;
  activeFileName: string;
  codeLength: number;
  lineCount: number;
  cursorLine: number;
  cursorColumn: number;
  selectionLength: number;
  theme: ThemeMode;
  onCycleTheme: () => void;
  onOpenCheatSheet: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  executionState,
  errorsCount,
  activeFileName,
  codeLength,
  lineCount,
  cursorLine,
  cursorColumn,
  selectionLength,
  theme,
  onCycleTheme,
  onOpenCheatSheet,
}) => {
  const getExecutionBadge = () => {
    switch (executionState) {
      case "running":
        return (
          <span className="flex items-center gap-1.5 text-amber-300 font-bold animate-pulse">
            <Play className="w-3 h-3 fill-current" />
            <span>En cours...</span>
          </span>
        );
      case "paused":
        return (
          <span className="flex items-center gap-1.5 text-orange-300 font-bold">
            <Pause className="w-3 h-3 fill-current" />
            <span>Pas-à-Pas</span>
          </span>
        );
      case "waiting_input":
        return (
          <span className="flex items-center gap-1.5 text-amber-300 font-bold animate-pulse">
            <Terminal className="w-3 h-3" />
            <span>Saisie requise</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-emerald-300 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Prêt</span>
          </span>
        );
    }
  };

  const getThemeIcon = () => {
    if (theme === "system") return <Monitor className="w-3 h-3" />;
    if (theme === "light") return <Sun className="w-3 h-3 text-amber-300" />;
    return <Moon className="w-3 h-3 text-sky-300" />;
  };

  return (
    <footer className="h-6 bg-orange-600 dark:bg-[#18181c] border-t border-orange-700 dark:border-[#2d2d38] text-white dark:text-zinc-400 px-3 flex items-center justify-between text-[11px] font-mono select-none z-20 shrink-0">
      {/* Left items: State, Errors, File */}
      <div className="flex items-center gap-3">
        {/* Execution state */}
        <div className="flex items-center px-1.5 py-0.5 rounded bg-orange-700/50 dark:bg-[#25252e]">
          {getExecutionBadge()}
        </div>

        {/* Errors indicator */}
        {errorsCount > 0 ? (
          <span className="flex items-center gap-1 text-rose-200 dark:text-rose-400 font-bold bg-rose-900/60 px-1.5 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" />
            <span>
              {errorsCount} Erreur{errorsCount > 1 ? "s" : ""}
            </span>
          </span>
        ) : (
          <span className="hidden sm:flex items-center gap-1 text-emerald-200 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>0 Erreur</span>
          </span>
        )}

        <div className="h-3 w-px bg-orange-500 dark:bg-[#2d2d38]" />

        {/* Active file */}
        <span className="truncate max-w-37.5 sm:max-w-xs font-semibold text-white dark:text-zinc-300">{activeFileName}</span>
      </div>

      {/* Right items: Cursor position, selection, stats, encoding, language, theme */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-orange-100 dark:text-zinc-400">
          Ln {cursorLine}, Col {cursorColumn}
        </span>

        {selectionLength > 0 && (
          <span className="hidden md:inline text-orange-100 dark:text-zinc-400">Sel {selectionLength}</span>
        )}

        <span className="hidden lg:inline text-orange-100 dark:text-zinc-400">
          Lignes {lineCount}, Car {codeLength}
        </span>

        {/* Tab Indentation */}
        <span className="hidden xl:inline text-orange-100 dark:text-zinc-400">Espaces: 4</span>

        {/* Encoding */}
        <span className="hidden lg:inline text-orange-100 dark:text-zinc-400">UTF-8</span>

        {/* Language */}
        <span className="flex items-center gap-1 font-bold text-white dark:text-orange-400 bg-orange-700/60 dark:bg-[#25252e] px-1.5 py-0.5 rounded">
          <Code2 className="w-3 h-3" />
          <span>IniCode</span>
        </span>

        {/* Aide Syntaxe */}
        <button
          onClick={onOpenCheatSheet}
          title="Guide de syntaxe"
          className="hover:text-white dark:hover:text-zinc-200 flex items-center gap-1 transition cursor-pointer"
        >
          <HelpCircle className="w-3 h-3" />
          <span className="hidden xl:inline">Aide</span>
        </button>

        {/* Theme quick switch */}
        <button
          onClick={onCycleTheme}
          title="Changer le thème (Système/Clair/Sombre)"
          className="hover:text-white dark:hover:text-zinc-200 flex items-center gap-1 p-0.5 rounded transition cursor-pointer"
        >
          {getThemeIcon()}
          <span className="capitalize text-[10px] hidden xl:inline">{theme}</span>
        </button>
      </div>
    </footer>
  );
};
