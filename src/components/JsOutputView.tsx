import React, { useState } from "react";
import { FileCode, Copy, Check, Info, Download } from "lucide-react";
import Editor from "@monaco-editor/react";
import { registerIniCodeLanguage } from "../lib/monacoIniCode";

interface JsOutputViewProps {
  jsCode: string;
  tsCode?: string;
  resolvedTheme?: "light" | "dark";
}

export const JsOutputView: React.FC<JsOutputViewProps> = ({ jsCode, tsCode = "", resolvedTheme = "dark" }) => {
  const [lang, setLang] = useState<"js" | "ts">("js");
  const [copied, setCopied] = useState(false);

  const activeCode = lang === "ts" ? tsCode || jsCode : jsCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = lang === "ts" ? ".ts" : ".js";
    const blob = new Blob([activeCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `code_transpile${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e24] text-slate-800 dark:text-zinc-200 font-mono text-sm">
      {/* Sub Header */}
      <div className="bg-slate-100 dark:bg-[#18181c] border-b border-slate-200 dark:border-[#2d2d38] px-3 py-2 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 shrink-0 gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
            <FileCode className="w-4 h-4 text-amber-500 dark:text-yellow-400" />
            <span>Code Transpilié</span>
          </div>

          {/* Toggle JS / TS */}
          <div className="flex items-center bg-slate-200/80 dark:bg-[#282832] p-0.5 rounded-md text-[11px] font-sans font-medium">
            <button
              onClick={() => setLang("js")}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                lang === "js"
                  ? "bg-orange-600 text-white font-bold shadow-2xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              JavaScript (.js)
            </button>
            <button
              onClick={() => setLang("ts")}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                lang === "ts"
                  ? "bg-blue-600 text-white font-bold shadow-2xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              TypeScript (.ts)
            </button>
          </div>
        </div>

        {/* Action Buttons: Download & Copy */}
        <div className="flex items-center gap-1.5 font-sans">
          <button
            onClick={handleDownload}
            title={`Télécharger le fichier code_transpile.${lang}`}
            className="bg-white dark:bg-[#2a2a32] hover:bg-slate-50 dark:hover:bg-[#32323c] text-slate-800 dark:text-zinc-200 px-2.5 py-1 rounded border border-slate-300 dark:border-[#383842] flex items-center gap-1.5 transition text-xs cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-orange-500" />
            <span>Télécharger .{lang}</span>
          </button>

          <button
            onClick={handleCopy}
            className="bg-white dark:bg-[#2a2a32] hover:bg-slate-50 dark:hover:bg-[#32323c] text-slate-800 dark:text-zinc-200 px-2.5 py-1 rounded border border-slate-300 dark:border-[#383842] flex items-center gap-1.5 transition text-xs cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Display with Monaco Editor */}
      <div className="flex-1 overflow-hidden relative min-h-50">
        <Editor
          height="100%"
          language={lang === "ts" ? "typescript" : "javascript"}
          beforeMount={(monaco) => registerIniCodeLanguage(monaco)}
          theme={resolvedTheme === "dark" ? "inicode-dark" : "inicode-light"}
          value={activeCode || `// Aucun code ${lang.toUpperCase()} généré`}
          options={{
            readOnly: true,
            domReadOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 20,
            scrollBeyondLastLine: false,
            folding: true,
            lineNumbers: "on",
            renderLineHighlight: "none",
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Transpiler Explanatory Footer */}
      <div className="bg-slate-100 dark:bg-[#18181c] border-t border-slate-200 dark:border-[#2d2d38] p-3 text-xs text-slate-600 dark:text-zinc-400 space-y-1 shrink-0 font-sans">
        <div className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-orange-400">
          <Info className="w-4 h-4 text-orange-500" />
          <span>Correspondances de Transpilation ({lang.toUpperCase()}) :</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-zinc-400 pt-1 font-mono">
          <div>
            <code className="text-orange-600 dark:text-orange-400 font-bold">soit x: entier</code> &rarr;{" "}
            <code className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {lang === "ts" ? "let x: number" : "let x"}
            </code>
          </div>
          <div>
            <code className="text-orange-600 dark:text-orange-400 font-bold">fonction f(a: texte): booleen</code> &rarr;{" "}
            <code className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {lang === "ts" ? "async function f(a: string): Promise<boolean>" : "async function f(a)"}
            </code>
          </div>
          <div>
            <code className="text-orange-600 dark:text-orange-400 font-bold">affiche ...</code> &rarr;{" "}
            <code className="text-emerald-600 dark:text-emerald-400 font-semibold">await __affiche__(...)</code>
          </div>
          <div>
            <code className="text-orange-600 dark:text-orange-400 font-bold">egal_a</code> &rarr;{" "}
            <code className="text-emerald-600 dark:text-emerald-400 font-semibold">===</code>
          </div>
        </div>
      </div>
    </div>
  );
};
