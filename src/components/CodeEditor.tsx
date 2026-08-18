import React, { useRef, useEffect, useState } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { INICODE_LANGUAGE_ID, registerIniCodeLanguage } from "../lib/monacoIniCode";
import { FileCode, X, Plus, Download, FolderOpen, ChevronDown, Sparkles, Code2, AlertCircle } from "lucide-react";
import { CodeFile } from "../types";
import { TranspilerError } from "../transpiler/types";

interface CursorState {
  line: number;
  column: number;
  selectionLength: number;
}

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onCursorChange: (cursor: CursorState) => void;
  errors?: TranspilerError[];
  highlightedLine: number | null;
  resolvedTheme: "light" | "dark";
  activeFile: CodeFile;
  openFiles: CodeFile[];
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onTabContextMenu?: (action: "close" | "close_left" | "close_right" | "close_all", fileId: string) => void;
  onImportFile: (file: File) => void;
  onExportFile: (file: CodeFile) => void;
  onCreateNewFile: (filename?: string) => void;
}

const SNIPPETS = [
  { label: "Déclaration (soit)", code: "soit x = 10\n", desc: "Créer une variable mutable" },
  { label: "Déclaration Typée (soit x: entier)", code: "soit age: entier = 25\n", desc: "Variable avec type explicite" },
  { label: "Constante (constante)", code: "constante PI = 3.14159\n", desc: "Créer une valeur immuable" },
  { label: "Affichage (affiche)", code: 'affiche "Message :", x\n', desc: "Afficher du texte ou des variables" },
  {
    label: "Saisie (demander/lire)",
    code: 'demander nom "Quel est votre nom ?"\n',
    desc: "Demander une valeur à l'utilisateur",
  },
  {
    label: "Condition (si / sinon)",
    code: 'si x superieur_a 0 alors\n    affiche "Positif"\nsinon\n    affiche "Négatif"\nfinsi\n',
    desc: "Structure conditionnelle",
  },
  {
    label: "Boucle (pour)",
    code: 'pour i de 1 à 10 faire\n    affiche "Indice :", i\nfinpour\n',
    desc: "Répéter avec un compteur",
  },
  {
    label: "Boucle (tantque)",
    code: "tantque condition faire\n    \nfintantque\n",
    desc: "Répéter tant qu'une condition est vraie",
  },
  {
    label: "Fonction (fonction)",
    code: "fonction addition(a, b)\n    retourner a + b\nfinfonction\n",
    desc: "Définir une fonction réutilisable",
  },
  {
    label: "Fonction Typée (fonction : type)",
    code: "fonction carre(n: entier): entier\n    retourner n * n\nfinfonction\n",
    desc: "Fonction avec typage des paramètres et du retour",
  },
  { label: "Tableau (liste)", code: "soit nombres = [10, 20, 30]\n", desc: "Déclarer une liste d'éléments" },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onCursorChange,
  errors = [],
  highlightedLine,
  resolvedTheme,
  activeFile,
  openFiles,
  onSelectTab,
  onCloseTab,
  onTabContextMenu,
  onImportFile,
  onExportFile,
  onCreateNewFile,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSnippetMenuOpen, setIsSnippetMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ fileId: string; x: number; y: number } | null>(null);

  // Intercept Ctrl+S / Cmd+S to export/download current file
  useEffect(() => {
    const handleSaveKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        e.stopPropagation();
        if (onExportFile) {
          onExportFile(activeFile);
        }
      }
    };
    window.addEventListener("keydown", handleSaveKeyDown, true);
    return () => window.removeEventListener("keydown", handleSaveKeyDown, true);
  }, [activeFile, onExportFile]);

  // Register language and themes when Monaco mounts
  const handleEditorWillMount = (monaco: Monaco) => {
    monacoRef.current = monaco;
    registerIniCodeLanguage(monaco);
  };

  const handleCursorStateChange = () => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const position = editor.getPosition();
    const selection = editor.getSelection();

    if (!position || !selection) return;

    const model = editor.getModel();
    const selectedText = model ? model.getValueInRange(selection) : "";

    onCursorChange({
      line: position.lineNumber,
      column: position.column,
      selectionLength: selectedText.length,
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    registerIniCodeLanguage(monaco);
    handleCursorStateChange();

    editor.onDidChangeCursorPosition(handleCursorStateChange);
    editor.onDidChangeCursorSelection(handleCursorStateChange);

    // Intercept Ctrl+S / Cmd+S in Monaco Editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onExportFile) {
        onExportFile(activeFile);
      }
    });

    // Add context menu actions to Monaco
    SNIPPETS.forEach((s, idx) => {
      editor.addAction({
        id: `inicode-snippet-${idx}`,
        label: `Insérer : ${s.label}`,
        contextMenuGroupId: "1_modification",
        contextMenuOrder: idx + 1,
        run: (ed) => {
          const position = ed.getPosition();
          if (position) {
            ed.executeEdits("snippet-context-menu", [
              {
                range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                text: s.code,
                forceMoveMarkers: true,
              },
            ]);
            ed.focus();
          }
        },
      });
    });
  };

  // Highlight active execution line for step-by-step debugger
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      if (highlightedLine && highlightedLine > 0) {
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
          {
            range: new monacoRef.current.Range(highlightedLine, 1, highlightedLine, 1),
            options: {
              isWholeLine: true,
              className:
                resolvedTheme === "dark"
                  ? "bg-amber-500/20 border-l-4 border-amber-500"
                  : "bg-amber-100 border-l-4 border-amber-600",
              glyphMarginClassName: "text-amber-500 font-bold",
            },
          },
        ]);
        editorRef.current.revealLineInCenter(highlightedLine);
      } else {
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
      }
    }
  }, [highlightedLine, resolvedTheme]);

  // Real-time Linter Markers (inline red squiggly underlines)
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      const model = editor.getModel();

      if (model) {
        if (errors && errors.length > 0) {
          const markers = errors.map((err) => {
            const lineCount = model.getLineCount();
            const targetLine = Math.max(1, Math.min(err.line || 1, lineCount));
            const lineContent = model.getLineContent(targetLine);
            const startCol = Math.max(1, Math.min(err.column || 1, Math.max(1, lineContent.length)));
            const endCol = err.column
              ? Math.min(err.column + 8, lineContent.length + 1)
              : Math.max(lineContent.length + 1, startCol + 1);

            return {
              startLineNumber: targetLine,
              startColumn: startCol,
              endLineNumber: targetLine,
              endColumn: endCol,
              message: `[Erreur de syntaxe IniCode] ${err.message}${err.suggestion ? ` (${err.suggestion})` : ""}`,
              severity: monaco.MarkerSeverity.Error,
            };
          });

          monaco.editor.setModelMarkers(model, "inicode-linter", markers);
        } else {
          monaco.editor.setModelMarkers(model, "inicode-linter", []);
        }
      }
    }
  }, [errors, code]);

  const insertSnippet = (snippetCode: string) => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      if (position) {
        editor.executeEdits("snippet-insert", [
          {
            range: new monacoRef.current.Range(position.lineNumber, position.column, position.lineNumber, position.column),
            text: snippetCode,
            forceMoveMarkers: true,
          },
        ]);
        editor.focus();
      }
    } else {
      onChange(code + "\n" + snippetCode);
    }
    setIsSnippetMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      e.target.value = "";
    }
  };

  const handleContextAction = (action: "close" | "close_left" | "close_right" | "close_all", fileId: string) => {
    if (onTabContextMenu) {
      onTabContextMenu(action, fileId);
    } else {
      if (action === "close") {
        if (openFiles.length > 1) onCloseTab(fileId);
      }
    }
    setContextMenu(null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e24] overflow-hidden border-r border-slate-200 dark:border-[#2d2d38]">
      {/* Hidden File Input for Importing .ic files */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".ic,.txt" className="hidden" />

      {/* VS Code Style File Tabs Bar */}
      <div className="bg-slate-100 dark:bg-[#18181c] border-b border-slate-200 dark:border-[#2d2d38] flex items-center justify-between text-xs shrink-0 select-none relative z-20">
        {/* Open Tabs List */}
        <div className="flex items-center overflow-x-auto no-scrollbar max-w-[70%]">
          {openFiles.map((f) => {
            const isActive = f.id === activeFile.id;
            return (
              <div
                key={f.id}
                onClick={() => onSelectTab(f.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setContextMenu({ fileId: f.id, x: e.clientX, y: e.clientY });
                }}
                className={`group flex items-center gap-1.5 px-3 py-2 border-r border-slate-200 dark:border-[#2d2d38] cursor-pointer transition min-w-27.5 max-w-45 truncate ${
                  isActive
                    ? "bg-white dark:bg-[#1e1e24] text-orange-600 dark:text-orange-400 font-semibold border-t-2 border-t-orange-500 shadow-2xs"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-[#25252e]"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate flex-1 font-mono text-[11px]">{f.name}</span>
                {openFiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(f.id);
                    }}
                    title="Fermer cet onglet"
                    className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded hover:bg-slate-300 dark:hover:bg-[#32323c] opacity-60 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={() => onCreateNewFile()}
            title="Nouveau fichier"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-[#25252e] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls: Insérer Menu, Ouvrir, Télécharger */}
        <div className="flex items-center gap-1.5 px-2 relative">
          {/* Dropdown Insérer Snippet */}
          <div className="relative">
            <button
              onClick={() => setIsSnippetMenuOpen(!isSnippetMenuOpen)}
              className="px-2.5 py-1 bg-white dark:bg-[#2a2a32] hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-xs rounded border border-slate-300 dark:border-[#383842] flex items-center gap-1 transition cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Insérer</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Dropdown Menu Popup */}
            {isSnippetMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsSnippetMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#1e1e24] border border-slate-200 dark:border-[#2d2d38] rounded-lg shadow-xl z-40 py-1 font-sans text-xs animate-fadeIn">
                  <div className="px-3 py-1.5 font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-[#2b2b36]">
                    Insérer un élément de code
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {SNIPPETS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => insertSnippet(s.code)}
                        className="w-full text-left px-3 py-1.5 hover:bg-orange-50 dark:hover:bg-[#2a2a32] transition flex flex-col gap-0.5 cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800 dark:text-zinc-200 font-mono">{s.label}</span>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Import / Ouvrir local file */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Ouvrir un fichier .ic local depuis votre ordinateur"
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-200 dark:hover:bg-[#2a2a32] rounded transition cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>

          {/* Export / Download file */}
          <button
            onClick={() => onExportFile(activeFile)}
            title={`Télécharger le fichier '${activeFile.name}'`}
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-200 dark:hover:bg-[#2a2a32] rounded transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-[#2d2d38] dark:bg-[#1e1e24]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              type="button"
              onClick={() => handleContextAction("close", contextMenu.fileId)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-[#2a2a32]"
            >
              <span>Fermer</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextAction("close_left", contextMenu.fileId)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-[#2a2a32]"
            >
              <span>Fermer à gauche</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextAction("close_right", contextMenu.fileId)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-[#2a2a32]"
            >
              <span>Fermer à droite</span>
            </button>
            <button
              type="button"
              onClick={() => handleContextAction("close_all", contextMenu.fileId)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-[#2a2a32]"
            >
              <span>Fermer tout</span>
            </button>
          </div>
        </>
      )}

      {/* Monaco Editor Component */}
      <div className="flex-1 w-full h-full overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={INICODE_LANGUAGE_ID}
          language={INICODE_LANGUAGE_ID}
          theme={resolvedTheme === "dark" ? "inicode-dark" : "inicode-light"}
          value={code}
          onChange={(val) => onChange(val || "")}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "on",
            lineNumbersMinChars: 3,
            glyphMargin: true,
            folding: true,
            padding: { top: 12, bottom: 12 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
            hover: {
              delay: 150,
            },
            fixedOverflowWidgets: true,
            renderValidationDecorations: "on" as const,
            smoothScrolling: true,
            renderLineHighlight: "all",
          }}
        />
      </div>

      {/* Bottom Syntax Errors Banner */}
      {errors && errors.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900/60 p-2 text-xs font-sans shrink-0 select-text">
          <div className="flex items-center justify-between mb-1 text-rose-600 dark:text-rose-400 font-bold px-1">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 animate-pulse" />
              <span>{errors.length} erreur(s) de syntaxe détectée(s) :</span>
            </div>
            <span className="text-[10px] text-rose-400 font-normal">Cliquez sur une erreur pour y accéder dans le code</span>
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
            {errors.map((err, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (editorRef.current && err.line) {
                    editorRef.current.revealLineInCenter(err.line);
                    editorRef.current.setPosition({ lineNumber: err.line, column: err.column || 1 });
                    editorRef.current.focus();
                  }
                }}
                className="flex items-center gap-2 p-1.5 rounded bg-white/80 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer text-rose-700 dark:text-rose-300 transition border border-rose-100 dark:border-rose-900/40"
              >
                <span className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shrink-0">
                  Ligne {err.line || 1}
                </span>
                <span className="flex-1 truncate font-medium">
                  {err.message}
                  {err.suggestion && (
                    <span className="text-slate-500 dark:text-zinc-400 font-normal ml-2">({err.suggestion})</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
