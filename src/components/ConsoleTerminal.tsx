import React, { useState, useRef, useEffect } from "react";
import { Terminal, Trash2, Send } from "lucide-react";
import { ConsoleLog } from "../transpiler/executor";

interface ConsoleTerminalProps {
  logs: ConsoleLog[];
  onClear: () => void;
  onProvideInput?: (value: string) => void;
  waitingForInput?: boolean;
  promptMessage?: string;
  resolvedTheme?: "light" | "dark";
}

export const ConsoleTerminal: React.FC<ConsoleTerminalProps> = ({
  logs,
  onClear,
  onProvideInput,
  waitingForInput = false,
  promptMessage = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, waitingForInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onProvideInput && inputValue.trim() !== "") {
      onProvideInput(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="console-terminal flex flex-col h-full bg-white dark:bg-[#1e1e24] font-mono text-xs text-slate-800 dark:text-zinc-200">
      {/* Console Subheader */}
      <div className="bg-slate-100 dark:bg-[#18181c] border-b border-slate-200 dark:border-[#2d2d38] px-3 py-2 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-slate-800 dark:text-zinc-200">Console d'Exécution</span>
        </div>
        <button
          onClick={onClear}
          title="Effacer la console"
          className="text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition p-1 hover:bg-slate-200 dark:hover:bg-[#2a2a32] rounded cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Console Output Log List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono bg-slate-50/50 dark:bg-[#1e1e24]">
        {logs.length === 0 ? (
          <div className="text-slate-400 dark:text-zinc-500 italic py-8 text-center font-sans">
            Appuyez sur <span className="font-semibold text-orange-600 dark:text-orange-400">"Exécuter (F5)"</span> pour
            lancer votre algorithme...
          </div>
        ) : (
          logs.map((log) => {
            let badgeStyle = "text-slate-800 dark:text-zinc-200";
            if (log.type === "output") badgeStyle = "text-emerald-700 dark:text-emerald-400 font-bold text-sm";
            if (log.type === "info") badgeStyle = "text-sky-700 dark:text-sky-300";
            if (log.type === "input") badgeStyle = "text-amber-700 dark:text-amber-400 font-bold";
            if (log.type === "error") badgeStyle = "text-rose-700 dark:text-rose-400 font-bold";
            if (log.type === "system") badgeStyle = "text-slate-500 dark:text-zinc-500 italic text-[11px]";

            return (
              <div key={log.id} className={`selectable-text leading-relaxed whitespace-pre-wrap cursor-text ${badgeStyle}`}>
                {log.text}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Input Field when program requests input */}
      {waitingForInput && (
        <form
          onSubmit={handleSubmit}
          className="bg-amber-50 dark:bg-amber-950/40 border-t border-amber-300 dark:border-amber-700/50 p-2.5 flex items-center gap-2 shrink-0 font-sans"
        >
          <span className="text-amber-700 dark:text-amber-400 font-semibold text-xs animate-pulse">
            {promptMessage || "Entrée requise :"}
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Saisissez votre réponse et appuyez sur Entrée..."
            autoFocus
            className="flex-1 bg-white dark:bg-[#18181c] border border-amber-500 text-slate-900 dark:text-amber-100 px-2.5 py-1 text-xs rounded focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-white p-1.5 rounded transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
};
