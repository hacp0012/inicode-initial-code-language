import React, { useState, useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { CodeEditor } from "../../components/CodeEditor";
import { JsOutputView } from "../../components/JsOutputView";
import { ConsoleTerminal } from "../../components/ConsoleTerminal";
import { VisualDebugger } from "../../components/VisualDebugger";
import { LexerAnalyzerModal } from "../../components/LexerAnalyzerModal";
import { CheatSheetModal } from "../../components/CheatSheetModal";
import { ExportConfirmModal } from "../../components/ExportConfirmModal";
import { MobileGuardModal } from "../../components/MobileGuardModal";
import { StatusBar } from "../../components/StatusBar";
import { ALGORITHM_EXAMPLES, AlgorithmExample } from "../../data/examples";
import { Lexer } from "../../transpiler/lexer";
import { Parser } from "../../transpiler/parser";
import { CodeGenerator } from "../../transpiler/generator";
import { CodeExecutor, ConsoleLog, VariableState } from "../../transpiler/executor";
import { Terminal, FileCode, Bug, Layers, AlertCircle, Columns, Rows, GripVertical, GripHorizontal } from "lucide-react";
import { CodeFile, SidebarTab } from "../../types";
import { encryptedLocalStorage } from "../../lib/encryptedStorage";
import { useIsMobile } from "../../hooks/useIsMobile";
import confetti from "canvas-confetti";

interface IdePageProps {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
  resolvedTheme: "light" | "dark";
  cycleTheme: () => void;
  initialCodeToLoad?: string | null;
}

const INITIAL_FILES: CodeFile[] = [
  {
    id: "f1",
    name: "saisie_affichage.ic",
    content: ALGORITHM_EXAMPLES[0].code,
    isExample: true,
  },
  {
    id: "f2",
    name: "conditions_mentions.ic",
    content: ALGORITHM_EXAMPLES[1].code,
    isExample: true,
  },
  {
    id: "f3",
    name: "boucle_pour.ic",
    content: ALGORITHM_EXAMPLES[2].code,
    isExample: true,
  },
  {
    id: "f4",
    name: "nombre_mystere.ic",
    content: ALGORITHM_EXAMPLES[3].code,
    isExample: true,
  },
  {
    id: "f5",
    name: "tableaux_statistiques.ic",
    content: ALGORITHM_EXAMPLES[4].code,
    isExample: true,
  },
  {
    id: "f6",
    name: "fonctions_factorielle.ic",
    content: ALGORITHM_EXAMPLES[5].code,
    isExample: true,
  },
];

export const IdePage: React.FC<IdePageProps> = ({ theme, setTheme, resolvedTheme, cycleTheme, initialCodeToLoad }) => {
  const isMobile = useIsMobile(768);
  const [showMobileGuard, setShowMobileGuard] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      setShowMobileGuard(true);
    }
  }, [isMobile]);

  // Code files management in workspace using Encrypted Storage
  const [files, setFiles] = useState<CodeFile[]>(() => {
    const saved = encryptedLocalStorage.getItem("inicode_files");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error loading saved files:", e);
      }
    }
    return INITIAL_FILES;
  });

  const [activeFileId, setActiveFileId] = useState<string>(() => {
    return files[0]?.id || "f1";
  });

  // VS Code Open File Tabs Management
  const [openFileIds, setOpenFileIds] = useState<string[]>(() => {
    const saved = encryptedLocalStorage.getItem("inicode_open_tabs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return files.map((f) => f.id);
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Sync files and open tabs to Encrypted Storage
  useEffect(() => {
    encryptedLocalStorage.setItem("inicode_files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    encryptedLocalStorage.setItem("inicode_open_tabs", JSON.stringify(openFileIds));
  }, [openFileIds]);

  // Load custom code from docs test button if passed
  useEffect(() => {
    if (initialCodeToLoad) {
      const newFileId = `doc_snippet_${Date.now()}`;
      const newFile: CodeFile = {
        id: newFileId,
        name: `exemple_docs.ic`,
        content: initialCodeToLoad,
      };
      setFiles((prev) => [newFile, ...prev]);
      setOpenFileIds((prev) => Array.from(new Set([newFileId, ...prev])));
      setActiveFileId(newFileId);
    }
  }, [initialCodeToLoad]);

  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || files[0] || INITIAL_FILES[0];
  }, [files, activeFileId]);

  const openFiles = useMemo(() => {
    return files.filter((f) => openFileIds.includes(f.id));
  }, [files, openFileIds]);

  // Target language for code generation (JavaScript or TypeScript)
  const [targetLanguage, setTargetLanguage] = useState<"js" | "ts">("js");

  // Execution state
  const [executionState, setExecutionState] = useState<
    "idle" | "running" | "paused" | "waiting_input" | "finished" | "error"
  >("idle");
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);

  // Input resolve function ref for user input
  const inputResolverRef = useRef<((val: string) => void) | null>(null);
  const [promptMsg, setPromptMsg] = useState("");
  const [editorCursor, setEditorCursor] = useState({ line: 1, column: 1, selectionLength: 0 });

  // Terminal & Outputs
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [variables, setVariables] = useState<VariableState[]>([]);
  const [activeBottomTab, setActiveBottomTab] = useState<"console" | "code" | "debugger" | "ast">("console");

  // Sidebar Width Resizable State
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const saved = encryptedLocalStorage.getItem("inicode_sidebar_width");
    return saved ? parseInt(saved, 10) : 240;
  });

  useEffect(() => {
    encryptedLocalStorage.setItem("inicode_sidebar_width", sidebarWidth.toString());
  }, [sidebarWidth]);

  const handleSidebarResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const initialWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.min(Math.max(initialWidth + deltaX, 160), 480);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Output Panel Layout Position: 'right' (Default) or 'bottom'
  const [panelPosition, setPanelPosition] = useState<"right" | "bottom">(() => {
    const saved = encryptedLocalStorage.getItem("inicode_panel_position");
    return saved === "bottom" ? "bottom" : "right";
  });

  // Resizable Panel Dimensions
  const [panelWidth, setPanelWidth] = useState<number>(() => {
    const saved = encryptedLocalStorage.getItem("inicode_panel_width");
    return saved ? parseInt(saved, 10) : 520;
  });

  const [panelHeight, setPanelHeight] = useState<number>(() => {
    const saved = encryptedLocalStorage.getItem("inicode_panel_height");
    return saved ? parseInt(saved, 10) : 260;
  });

  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);

  // Sync Panel layout settings to storage
  useEffect(() => {
    encryptedLocalStorage.setItem("inicode_panel_position", panelPosition);
  }, [panelPosition]);

  useEffect(() => {
    encryptedLocalStorage.setItem("inicode_panel_width", panelWidth.toString());
  }, [panelWidth]);

  useEffect(() => {
    encryptedLocalStorage.setItem("inicode_panel_height", panelHeight.toString());
  }, [panelHeight]);

  // Resizable Splitter Drag Handler
  const handleSplitterMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSplitter(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = panelWidth;
    const initialHeight = panelHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (panelPosition === "right") {
        const deltaX = startX - moveEvent.clientX; // dragging left increases right panel width
        const newWidth = Math.min(Math.max(initialWidth + deltaX, 280), window.innerWidth - 320);
        setPanelWidth(newWidth);
      } else {
        const deltaY = startY - moveEvent.clientY; // dragging up increases bottom panel height
        const newHeight = Math.min(Math.max(initialHeight + deltaY, 100), window.innerHeight - 180);
        setPanelHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSplitter(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Modals & Export confirmation
  const [isLexerModalOpen, setIsLexerModalOpen] = useState(false);
  const [isCheatSheetModalOpen, setIsCheatSheetModalOpen] = useState(false);
  const [fileToExportModal, setFileToExportModal] = useState<CodeFile | null>(null);

  // Reference to CodeExecutor
  const executorRef = useRef<CodeExecutor | null>(null);

  useEffect(() => {
    executorRef.current = new CodeExecutor({
      onLog: (newLogs) => setLogs(newLogs),
      onLineHighlight: (line) => setHighlightedLine(line),
      onVariablesUpdate: (vars) => setVariables(vars),
      onInputRequest: (promptText, resolve) => {
        setPromptMsg(promptText);
        inputResolverRef.current = resolve;
      },
      onStateChange: (st) => {
        setExecutionState(st);
        if (st === "idle" || st === "finished" || st === "error") {
          setHighlightedLine(null);
        }
      },
    });

    return () => {
      if (executorRef.current) {
        executorRef.current.stop();
      }
    };
  }, []);

  // Transpilation logic
  const transpilationResult = useMemo(() => {
    const code = activeFile.content;
    const lexer = new Lexer(code);
    const { tokens, errors: lexerErrors } = lexer.tokenize();

    const parser = new Parser(tokens);
    const parseResult = parser.parse();

    const generator = new CodeGenerator(parseResult.ast, false, targetLanguage);
    const generatedCode = generator.generate();

    const tsGenerator = new CodeGenerator(parseResult.ast, false, "ts");
    const tsGeneratedCode = tsGenerator.generate();

    return {
      tokens,
      ast: parseResult.ast,
      errors: [...lexerErrors, ...parseResult.errors],
      jsCode: generatedCode,
      tsCode: tsGeneratedCode,
    };
  }, [activeFile.content, targetLanguage]);

  // Update file content in workspace
  const updateActiveFileContent = (newContent: string) => {
    setFiles((prev) => prev.map((f) => (f.id === activeFile.id ? { ...f, content: newContent } : f)));
  };

  // Create new file
  const handleCreateFile = (filenameInput?: string) => {
    const defaultName = filenameInput?.trim() || `algorithme_${files.length + 1}.ic`;
    const finalName = defaultName.endsWith(".ic") ? defaultName : `${defaultName}.ic`;

    const newFile: CodeFile = {
      id: `file_${Date.now()}`,
      name: finalName,
      content: `// Algorithme ${finalName.replace(".ic", "")}\nsoit message: texte = "Bonjour depuis ${finalName}"\naffiche(message)\n`,
    };

    setFiles((prev) => [...prev, newFile]);
    setOpenFileIds((prev) => Array.from(new Set([...prev, newFile.id])));
    setActiveFileId(newFile.id);
  };

  // Rename file
  const handleRenameFile = (fileId: string, newName: string) => {
    const cleanName = newName.trim();
    if (!cleanName) return;
    const finalName = cleanName.endsWith(".ic") ? cleanName : `${cleanName}.ic`;

    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, name: finalName } : f)));
  };

  // Delete file
  const handleDeleteFile = (fileId: string) => {
    if (files.length <= 1) return;

    const remainingFiles = files.filter((f) => f.id !== fileId);
    setFiles(remainingFiles);

    const remainingOpenTabs = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(remainingOpenTabs);

    if (activeFileId === fileId) {
      setActiveFileId(remainingFiles[0].id);
    }
  };

  // Open file in editor
  const handleSelectFile = (fileId: string) => {
    if (!openFileIds.includes(fileId)) {
      setOpenFileIds((prev) => [...prev, fileId]);
    }
    setActiveFileId(fileId);
  };

  // Close tab
  const handleCloseTab = (fileId: string) => {
    if (openFileIds.length <= 1) return;

    const nextOpen = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(nextOpen);

    if (activeFileId === fileId) {
      setActiveFileId(nextOpen[nextOpen.length - 1]);
    }
  };

  const handleTabContextMenu = (action: "close" | "close_left" | "close_right" | "close_all", fileId: string) => {
    if (openFileIds.length <= 1) return;

    const fileIndex = openFileIds.indexOf(fileId);
    if (fileIndex === -1) return;

    if (action === "close") {
      handleCloseTab(fileId);
      return;
    }

    let idsToClose: string[] = [];

    if (action === "close_left") {
      idsToClose = openFileIds.slice(0, fileIndex);
    } else if (action === "close_right") {
      idsToClose = openFileIds.slice(fileIndex + 1);
    } else if (action === "close_all") {
      idsToClose = openFileIds.filter((id) => id !== fileId);
    }

    if (idsToClose.length === 0) return;

    const survivors = openFileIds.filter((id) => !idsToClose.includes(id));
    const safeSurvivors = survivors.length > 0 ? survivors : [openFileIds[0]];

    setOpenFileIds(safeSurvivors);

    const nextActiveFile = safeSurvivors.includes(activeFileId)
      ? activeFileId
      : safeSurvivors[Math.min(fileIndex, safeSurvivors.length - 1)] || safeSurvivors[0];

    setActiveFileId(nextActiveFile);
  };

  // Import file from disk
  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newFile: CodeFile = {
        id: `imported_${Date.now()}`,
        name: file.name.endsWith(".ic") ? file.name : `${file.name}.ic`,
        content: content || "",
      };
      setFiles((prev) => [...prev, newFile]);
      setOpenFileIds((prev) => Array.from(new Set([...prev, newFile.id])));
      setActiveFileId(newFile.id);
    };
    reader.readAsText(file);
  };

  // Trigger export confirmation modal (for Ctrl+S or Export button)
  const handleRequestExportFile = (file: CodeFile) => {
    setFileToExportModal(file);
  };

  // Execute actual file download after modal confirmation
  const handleExecuteDownload = () => {
    if (!fileToExportModal) return;

    const blob = new Blob([fileToExportModal.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileToExportModal.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFileToExportModal(null);
  };

  // Load algorithm example
  const handleSelectExample = (example: AlgorithmExample) => {
    const existing = files.find((f) => f.content === example.code);
    if (existing) {
      handleSelectFile(existing.id);
    } else {
      const newFile: CodeFile = {
        id: `ex_${Date.now()}`,
        name: `${example.id}.ic`,
        content: example.code,
        isExample: true,
      };
      setFiles((prev) => [...prev, newFile]);
      setOpenFileIds((prev) => Array.from(new Set([...prev, newFile.id])));
      setActiveFileId(newFile.id);
    }
  };

  // Execution Handlers
  const handleRun = async () => {
    if (transpilationResult.errors.length > 0) {
      setActiveBottomTab("console");
      setLogs([
        {
          id: "err_transpile",
          type: "error",
          text: `Impossible d'exécuter l'algorithme. ${transpilationResult.errors.length} erreur(s) de syntaxe détectée(s).`,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setActiveBottomTab("console");
    setLogs([]);
    setVariables([]);

    if (executorRef.current) {
      const success = await executorRef.current.run(transpilationResult.jsCode, false);
      if (success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    }
  };

  const handleStartStepByStep = async () => {
    if (transpilationResult.errors.length > 0) {
      setActiveBottomTab("console");
      return;
    }

    setActiveBottomTab("debugger");
    setLogs([]);
    setVariables([]);
    if (executorRef.current) {
      const stepByStepGen = new CodeGenerator(transpilationResult.ast, true, "js");
      const stepByStepCode = stepByStepGen.generate();
      await executorRef.current.run(stepByStepCode, true);
    }
  };

  const handleNextStep = () => {
    if (executorRef.current) {
      executorRef.current.nextStep();
    }
  };

  const handleStopExecution = () => {
    if (executorRef.current) {
      executorRef.current.stop();
    }
  };

  const handleOpenDocumentationInNewTab = () => {
    const docsUrl = new URL("#/docs", window.location.href).toString();
    window.open(docsUrl, "_blank", "noopener,noreferrer");
  };

  const handleUserInputSubmit = (input: string) => {
    if (inputResolverRef.current) {
      inputResolverRef.current(input);
      inputResolverRef.current = null;
    }
  };

  const codeLinesCount = activeFile.content.split("\n").length;

  return (
    <>
      <Helmet>
        <title>{`${activeFile.name} · IniCode`}</title>
      </Helmet>

      <div className="flex flex-col h-screen bg-slate-100 dark:bg-[#121218] text-slate-900 dark:text-zinc-100 font-sans overflow-hidden ide-container">
        {/* Mobile Guard Modal */}
        <MobileGuardModal isOpen={showMobileGuard} onDismiss={() => setShowMobileGuard(false)} />

        {/* Export Confirmation Modal for Ctrl+S */}
        <ExportConfirmModal
          isOpen={!!fileToExportModal}
          file={fileToExportModal}
          onConfirmDownload={handleExecuteDownload}
          onCancel={() => setFileToExportModal(null)}
        />

        {/* Top Navbar */}
        <Navbar
          onRun={handleRun}
          onStepByStep={handleStartStepByStep}
          onNextStep={handleNextStep}
          onStop={handleStopExecution}
          executionState={executionState === "finished" || executionState === "error" ? "idle" : executionState}
          onMinimize={() => window.electronAPI?.minimize?.()}
          onMaximize={() => window.electronAPI?.maximize?.()}
          onClose={() => window.electronAPI?.close?.()}
        />

        {/* Main Container */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
          <Sidebar
            files={files}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
            onCreateFile={handleCreateFile}
            onRenameFile={handleRenameFile}
            onDeleteFile={handleDeleteFile}
            onSelectExample={handleSelectExample}
            onOpenLexer={() => setIsLexerModalOpen(true)}
            onOpenCheatSheet={handleOpenDocumentationInNewTab}
            theme={theme}
            resolvedTheme={resolvedTheme}
            onCycleTheme={cycleTheme}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onImportFile={handleImportFile}
            onExportFile={handleRequestExportFile}
            drawerWidth={sidebarWidth}
            onStartResizeDrawer={handleSidebarResizeMouseDown}
          />

          {/* Workspace Central Editor & Outputs Area (Flex Row for Right, Flex Col for Bottom) */}
          <div
            className={`flex-1 flex overflow-hidden bg-slate-50 dark:bg-[#16161e] ${
              panelPosition === "right" ? "flex-row" : "flex-col"
            }`}
          >
            {/* Central Code Editor Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col h-full min-w-62.5 min-h-37.5">
              <CodeEditor
                code={activeFile.content}
                onChange={updateActiveFileContent}
                onCursorChange={setEditorCursor}
                errors={transpilationResult.errors}
                highlightedLine={highlightedLine}
                resolvedTheme={resolvedTheme}
                activeFile={activeFile}
                openFiles={openFiles}
                onSelectTab={setActiveFileId}
                onCloseTab={handleCloseTab}
                onImportFile={handleImportFile}
                onExportFile={handleRequestExportFile}
                onCreateNewFile={handleCreateFile}
              />
            </div>

            {/* Resizable Splitter Line */}
            <div
              onMouseDown={handleSplitterMouseDown}
              className={`transition-colors shrink-0 z-20 select-none cursor-grab active:cursor-grabbing hover:bg-orange-500 active:bg-orange-600 ${
                panelPosition === "right"
                  ? "w-1 cursor-col-resize h-full bg-slate-200/80 dark:bg-[#252532]"
                  : "h-1 cursor-row-resize w-full bg-slate-200/80 dark:bg-[#252532]"
              }`}
              title="Glisser pour redimensionner le panneau"
            />

            {/* Output Panel Container (Right or Bottom) */}
            <div
              style={panelPosition === "right" ? { width: `${panelWidth}px` } : { height: `${panelHeight}px` }}
              className="flex flex-col overflow-hidden bg-slate-50 dark:bg-[#14141d] shrink-0"
            >
              {/* Panel Tabs Header & Position Switcher */}
              <div className="bg-slate-200 dark:bg-[#181822] border-b border-slate-300 dark:border-[#2a2a38] flex items-center justify-between px-3 h-9 shrink-0">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveBottomTab("console")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-t-md transition cursor-pointer whitespace-nowrap ${
                      activeBottomTab === "console"
                        ? "bg-slate-50 dark:bg-[#14141d] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Console</span>
                    {logs.some((l) => l.type === "error") && <AlertCircle className="w-3 h-3 text-rose-500 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setActiveBottomTab("code")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-t-md transition cursor-pointer whitespace-nowrap ${
                      activeBottomTab === "code"
                        ? "bg-slate-50 dark:bg-[#14141d] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Code {targetLanguage.toUpperCase()}</span>
                  </button>

                  <button
                    onClick={() => setActiveBottomTab("debugger")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-t-md transition cursor-pointer whitespace-nowrap ${
                      activeBottomTab === "debugger"
                        ? "bg-slate-50 dark:bg-[#14141d] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <Bug className="w-3.5 h-3.5" />
                    <span>Débogueur</span>
                    {executionState === "paused" && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveBottomTab("ast")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-t-md transition cursor-pointer whitespace-nowrap ${
                      activeBottomTab === "ast"
                        ? "bg-slate-50 dark:bg-[#14141d] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>AST</span>
                  </button>
                </div>

                {/* Panel Layout Position Selector Menu */}
                <div className="flex items-center gap-1 bg-slate-300/60 dark:bg-[#20202c] p-0.5 rounded-lg border border-slate-300/80 dark:border-zinc-800 shrink-0 ml-2">
                  <button
                    onClick={() => setPanelPosition("right")}
                    className={`p-1 rounded text-xs flex items-center gap-1 transition cursor-pointer ${
                      panelPosition === "right"
                        ? "bg-white dark:bg-[#12121a] text-orange-600 dark:text-orange-400 font-bold shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                    }`}
                    title="Positionner le panneau à droite (Côte à côte)"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">À droite</span>
                  </button>

                  <button
                    onClick={() => setPanelPosition("bottom")}
                    className={`p-1 rounded text-xs flex items-center gap-1 transition cursor-pointer ${
                      panelPosition === "bottom"
                        ? "bg-white dark:bg-[#12121a] text-orange-600 dark:text-orange-400 font-bold shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                    }`}
                    title="Positionner le panneau en bas"
                  >
                    <Rows className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">En bas</span>
                  </button>
                </div>
              </div>

              {/* Output Panel Content View */}
              <div className="flex-1 bg-slate-50 dark:bg-[#14141d] overflow-hidden">
                {activeBottomTab === "console" && (
                  <ConsoleTerminal
                    logs={logs}
                    onClear={() => setLogs([])}
                    onProvideInput={handleUserInputSubmit}
                    waitingForInput={executionState === "waiting_input"}
                    promptMessage={promptMsg}
                    resolvedTheme={resolvedTheme}
                  />
                )}

                {activeBottomTab === "code" && (
                  <JsOutputView
                    jsCode={transpilationResult.jsCode}
                    tsCode={transpilationResult.tsCode}
                    resolvedTheme={resolvedTheme}
                  />
                )}

                {activeBottomTab === "debugger" && (
                  <VisualDebugger
                    variables={variables}
                    highlightedLine={highlightedLine}
                    executionState={executionState === "finished" || executionState === "error" ? "idle" : executionState}
                    onNextStep={handleNextStep}
                    onStop={handleStopExecution}
                  />
                )}

                {activeBottomTab === "ast" && (
                  <div className="h-full p-3 font-mono text-xs overflow-auto bg-[#12121a] text-emerald-400 selectable-text">
                    <pre>{JSON.stringify(transpilationResult.ast, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status Bar */}
        <StatusBar
          executionState={executionState === "finished" || executionState === "error" ? "idle" : executionState}
          errorsCount={transpilationResult.errors.length}
          activeFileName={activeFile.name}
          codeLength={activeFile.content.length}
          lineCount={codeLinesCount}
          cursorLine={editorCursor.line}
          cursorColumn={editorCursor.column}
          selectionLength={editorCursor.selectionLength}
          theme={theme}
          onCycleTheme={cycleTheme}
          onOpenCheatSheet={handleOpenDocumentationInNewTab}
        />

        {/* Modals */}
        <LexerAnalyzerModal
          isOpen={isLexerModalOpen}
          onClose={() => setIsLexerModalOpen(false)}
          tokens={transpilationResult.tokens}
          ast={transpilationResult.ast}
        />

        <CheatSheetModal isOpen={isCheatSheetModalOpen} onClose={() => setIsCheatSheetModalOpen(false)} />
      </div>
    </>
  );
};
