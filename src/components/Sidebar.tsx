import React, { useState, useRef, useEffect } from "react";
import {
  Files,
  FileCode2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen,
  Layers,
  Sun,
  Moon,
  Monitor,
  Search,
  Sparkles,
  FolderOpen,
  Download,
  MoreVertical,
} from "lucide-react";
import { CodeFile, SidebarTab } from "../types";
import { ALGORITHM_EXAMPLES, AlgorithmExample } from "../data/examples";
import { ThemeMode } from "../hooks/useTheme";
import { ConfirmModal } from "./ConfirmModal";

interface SearchMatch {
  fileId: string;
  fileName: string;
  lineNumber: number;
  lineText: string;
}

interface SidebarProps {
  files: CodeFile[];
  activeFileId: string;
  onSelectFile: (id: string, lineNumber?: number) => void;
  onCreateFile: (name?: string) => void;
  onRenameFile: (id: string, newName: string) => void;
  onDeleteFile: (id: string) => void;
  onSelectExample: (ex: AlgorithmExample) => void;
  onOpenLexer: () => void;
  onOpenCheatSheet: () => void;
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  onCycleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onImportFile?: (file: File) => void;
  onExportFile?: (file: CodeFile) => void;
  drawerWidth?: number;
  onStartResizeDrawer?: (e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  onSelectExample,
  onOpenLexer,
  onOpenCheatSheet,
  theme,
  resolvedTheme,
  onCycleTheme,
  searchQuery,
  onSearchChange,
  onImportFile,
  onExportFile,
  drawerWidth = 240,
  onStartResizeDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>("files");
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newFileNameInput, setNewFileNameInput] = useState("");
  const [isCreatingInline, setIsCreatingInline] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<CodeFile | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    file: CodeFile;
    x: number;
    y: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null);
    window.addEventListener("click", handleCloseMenu);
    return () => {
      window.removeEventListener("click", handleCloseMenu);
    };
  }, []);

  const handleFileContextMenu = (file: CodeFile, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      file,
      x: Math.min(e.clientX, window.innerWidth - 200),
      y: Math.min(e.clientY, window.innerHeight - 150),
    });
  };

  const handleDotsClick = (file: CodeFile, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      file,
      x: Math.min(rect.right + 4, window.innerWidth - 200),
      y: Math.min(rect.bottom + 4, window.innerHeight - 150),
    });
  };

  const handleStartRename = (file: CodeFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFileId(file.id);
    setEditingName(file.name);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      let finalName = editingName.trim();
      if (!finalName.endsWith(".ic")) {
        finalName += ".ic";
      }
      onRenameFile(id, finalName);
    }
    setEditingFileId(null);
  };

  const handleStartCreate = () => {
    setIsCreatingInline(true);
    setNewFileNameInput("");
  };

  const handleConfirmCreate = () => {
    if (newFileNameInput.trim()) {
      let finalName = newFileNameInput.trim();
      if (!finalName.endsWith(".ic")) {
        finalName += ".ic";
      }
      onCreateFile(finalName);
    } else {
      onCreateFile();
    }
    setIsCreatingInline(false);
    setNewFileNameInput("");
  };

  const handleFileImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportFile) {
      onImportFile(file);
      e.target.value = "";
    }
  };

  const toggleTab = (tab: SidebarTab) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  const getThemeIcon = () => {
    if (theme === "system") return <Monitor className="w-4 h-4 text-orange-500" />;
    if (theme === "light") return <Sun className="w-4 h-4 text-amber-500" />;
    return <Moon className="w-4 h-4 text-orange-400" />;
  };

  const getThemeTooltip = () => {
    if (theme === "system") return "Thème : Système (Suivi automatique)";
    if (theme === "light") return "Thème : Clair (Light Mode)";
    return "Thème : Sombre (Dark Mode)";
  };

  // Perform functional search across all files
  const searchResults: SearchMatch[] = [];
  if (searchQuery.trim().length > 0) {
    const queryLower = searchQuery.toLowerCase();
    files.forEach((file) => {
      const lines = file.content.split("\n");
      lines.forEach((lineText, index) => {
        if (lineText.toLowerCase().includes(queryLower)) {
          searchResults.push({
            fileId: file.id,
            fileName: file.name,
            lineNumber: index + 1,
            lineText,
          });
        }
      });
    });
  }

  return (
    <div className="flex h-full select-none font-sans">
      {/* Hidden File Input for Sidebar System File Open */}
      <input type="file" ref={fileInputRef} onChange={handleFileImportChange} accept=".ic,.txt" className="hidden" />

      {/* Confirmation Modal before file deletion */}
      <ConfirmModal
        isOpen={fileToDelete !== null}
        title="Supprimer le fichier"
        message={`Êtes-vous sûr de vouloir supprimer le fichier "${fileToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={() => {
          if (fileToDelete) {
            onDeleteFile(fileToDelete.id);
            setFileToDelete(null);
          }
        }}
        onClose={() => setFileToDelete(null)}
      />

      {/* 1. VS Code Left Activity Rail */}
      <div className="w-12 flex flex-col items-center justify-between py-3 border-r bg-slate-100 dark:bg-[#18181c] border-slate-200 dark:border-[#2d2d38] z-10 shrink-0">
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Flat Logo Icon */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-zinc-300 font-black text-xs tracking-tight mb-2 bg-slate-200/60 dark:bg-[#25252e] border border-slate-300/80 dark:border-[#2d2d38]">
            iC
          </div>

          {/* Files / Explorateur */}
          <button
            onClick={() => toggleTab("files")}
            title="Explorateur de fichiers (.ic)"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition cursor-pointer relative ${
              activeTab === "files"
                ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold"
                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800/60"
            }`}
          >
            <Files className="w-5 h-5" />
            {activeTab === "files" && (
              <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-orange-600 dark:bg-orange-500 rounded-r" />
            )}
          </button>

          {/* Examples */}
          <button
            onClick={() => toggleTab("examples")}
            title="Catalogue d'exemples algorithmiques"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition cursor-pointer relative ${
              activeTab === "examples"
                ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold"
                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800/60"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            {activeTab === "examples" && (
              <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-orange-600 dark:bg-orange-500 rounded-r" />
            )}
          </button>

          {/* Search */}
          <button
            onClick={() => toggleTab("search")}
            title="Rechercher dans le code"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition cursor-pointer relative ${
              activeTab === "search"
                ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold"
                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800/60"
            }`}
          >
            <Search className="w-5 h-5" />
            {activeTab === "search" && (
              <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-orange-600 dark:bg-orange-500 rounded-r" />
            )}
          </button>

          <div className="w-6 h-px bg-slate-200 dark:bg-[#2d2d38] my-1" />

          {/* Lexer & AST Modal Trigger */}
          <button
            onClick={onOpenLexer}
            title="Inspecteur Lexer & Arbre AST"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800/60 transition cursor-pointer"
          >
            <Layers className="w-5 h-5" />
          </button>

          {/* CheatSheet Modal Trigger */}
          <button
            onClick={onOpenCheatSheet}
            title="Guide de syntaxe & Antisèche"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800/60 transition cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Rail: Theme Switch */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onCycleTheme}
            title={getThemeTooltip()}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-700 dark:text-zinc-300 bg-slate-200/80 dark:bg-[#22222b] hover:bg-slate-300 dark:hover:bg-[#2a2a35] transition cursor-pointer border border-slate-300/80 dark:border-[#2d2d38] shadow-sm hover:shadow-none"
          >
            <span className="flex items-center justify-center rounded-md bg-white/60 dark:bg-[#1b1b22] p-1.5 border border-slate-200 dark:border-[#343443]">
              {getThemeIcon()}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Expanded Drawer Panel */}
      {activeTab !== null && (
        <div
          style={{ width: `${drawerWidth}px` }}
          className="h-full flex flex-col border-r bg-white dark:bg-[#1e1e24] border-slate-200 dark:border-[#2d2d38] text-xs overflow-hidden relative shrink-0"
        >
          {/* Resize Handle for Drawer */}
          {onStartResizeDrawer && (
            <div
              onMouseDown={(e) => onStartResizeDrawer?.(e)}
              title="Glisser pour redimensionner l'explorateur de fichiers"
              className="absolute right-0 top-0 bottom-0 w-1 hover:bg-orange-500 active:bg-orange-600 cursor-col-resize z-30 transition-colors bg-transparent hover:w-1.5"
            />
          )}

          {/* TAB 1: FILE EXPLORER */}
          {activeTab === "files" && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-3 py-2.5 border-b border-slate-200 dark:border-[#2d2d38] flex items-center justify-between bg-slate-50 dark:bg-[#18181c]">
                <span className="font-bold tracking-wider uppercase text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-orange-500" />
                  Explorateur (.ic)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Ouvrir un fichier .ic du système"
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#2a2a32] text-slate-600 dark:text-zinc-300 transition cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleStartCreate}
                    title="Créer un nouveau fichier .ic"
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#2a2a32] text-slate-600 dark:text-zinc-300 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* File Creation Inline Input */}
              {isCreatingInline && (
                <div className="p-2 border-b border-slate-200 dark:border-[#2d2d38] bg-orange-50 dark:bg-orange-950/30 flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <input
                    type="text"
                    value={newFileNameInput}
                    onChange={(e) => setNewFileNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirmCreate();
                      if (e.key === "Escape") setIsCreatingInline(false);
                    }}
                    placeholder="nom_fichier.ic"
                    autoFocus
                    className="flex-1 bg-white dark:bg-[#18181c] text-slate-900 dark:text-zinc-100 px-2 py-1 rounded border border-orange-500 text-xs focus:outline-none font-mono"
                  />
                  <button
                    onClick={handleConfirmCreate}
                    className="p-1 hover:bg-orange-600 text-orange-600 dark:text-orange-400 hover:text-white rounded"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsCreatingInline(false)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Files List */}
              <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 font-mono">
                {files.map((file) => {
                  const isActive = file.id === activeFileId;
                  const isEditing = editingFileId === file.id;

                  return (
                    <div
                      key={file.id}
                      onClick={() => onSelectFile(file.id)}
                      onContextMenu={(e) => handleFileContextMenu(file, e)}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition text-xs relative ${
                        isActive
                          ? "bg-orange-500/15 text-orange-700 dark:text-orange-400 font-semibold border-l-2 border-orange-500"
                          : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#2a2a32]"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <FileCode2
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-zinc-500"
                          }`}
                        />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(file.id);
                              if (e.key === "Escape") setEditingFileId(null);
                            }}
                            onBlur={() => handleSaveRename(file.id)}
                            autoFocus
                            className="w-full bg-white dark:bg-[#18181c] text-slate-900 dark:text-zinc-100 px-1 py-0.5 rounded border border-orange-500 text-xs focus:outline-none"
                          />
                        ) : (
                          <span className="truncate">{file.name}</span>
                        )}
                      </div>

                      {/* File Item Action Menu Button (3-dots) */}
                      {!isEditing && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center transition shrink-0">
                          <button
                            onClick={(e) => handleDotsClick(file, e)}
                            title="Options du fichier (Clic droit)"
                            className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 rounded transition"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: EXAMPLES CATALOG */}
          {activeTab === "examples" && (
            <div className="flex flex-col h-full font-sans">
              <div className="px-3 py-2.5 border-b border-slate-200 dark:border-[#2d2d38] bg-slate-50 dark:bg-[#18181c]">
                <span className="font-bold tracking-wider uppercase text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  Exemples d'Algorithmes
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {ALGORITHM_EXAMPLES.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => onSelectExample(ex)}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-[#2d2d38] hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50/80 dark:bg-[#18181c] hover:bg-orange-50 dark:hover:bg-orange-950/20 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                        {ex.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20">
                        {ex.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2">{ex.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FUNCTIONAL SEARCH IN CODE */}
          {activeTab === "search" && (
            <div className="flex flex-col h-full p-3 space-y-3 font-sans overflow-hidden">
              <span className="font-bold tracking-wider uppercase text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 shrink-0">
                <Search className="w-3.5 h-3.5 text-orange-500" />
                Recherche Globale
              </span>
              <div className="relative shrink-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher dans tous les fichiers..."
                  autoFocus
                  className="w-full bg-slate-100 dark:bg-[#18181c] text-slate-900 dark:text-zinc-100 text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-[#2d2d38] focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                />
              </div>

              {/* Search Results Display */}
              <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
                {searchQuery.trim().length === 0 ? (
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans">
                    Saisissez un mot-clé (ex: <code className="text-orange-500">soit</code>,{" "}
                    <code className="text-orange-500">affiche</code>, <code className="text-orange-500">fonction</code>) pour
                    rechercher à travers tous vos fichiers.
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans italic">
                    Aucun résultat trouvé pour "{searchQuery}".
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-orange-600 dark:text-orange-400 font-bold font-sans">
                      {searchResults.length} occurrence{searchResults.length > 1 ? "s" : ""} trouvée
                      {searchResults.length > 1 ? "s" : ""} :
                    </p>
                    {searchResults.map((match, idx) => (
                      <div
                        key={`${match.fileId}-${match.lineNumber}-${idx}`}
                        onClick={() => onSelectFile(match.fileId, match.lineNumber)}
                        className="p-2 rounded border border-slate-200 dark:border-[#2d2d38] hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50 dark:bg-[#18181c] hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                          <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <FileCode2 className="w-3 h-3" />
                            {match.fileName}
                          </span>
                          <span className="text-[10px] text-slate-400">Ligne {match.lineNumber}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-zinc-400 truncate">{match.lineText.trim()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Action Popup Context Menu */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 bg-white dark:bg-[#22222b] border border-slate-200 dark:border-[#383848] rounded-lg shadow-xl py-1.5 w-48 text-xs font-sans text-slate-800 dark:text-zinc-200 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1 font-semibold text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-[#2f2f3a] truncate mb-1">
            {contextMenu.file.name}
          </div>

          {onExportFile && (
            <button
              onClick={() => {
                onExportFile(contextMenu.file);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#32323e] transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-500" />
              <span>Exporter / Télécharger</span>
            </button>
          )}

          <button
            onClick={(e) => {
              handleStartRename(contextMenu.file, e);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#32323e] transition cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Renommer</span>
          </button>

          <button
            disabled={files.length <= 1}
            onClick={() => {
              if (files.length > 1) {
                setFileToDelete(contextMenu.file);
              }
              setContextMenu(null);
            }}
            className={`w-full text-left px-3 py-1.5 flex items-center gap-2 transition cursor-pointer ${
              files.length <= 1
                ? "opacity-40 cursor-not-allowed text-slate-400"
                : "hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Supprimer le fichier"
          message={`Êtes-vous sûr de vouloir supprimer définitivement le fichier "${fileToDelete.name}" ?`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={() => {
            onDeleteFile(fileToDelete.id);
            setFileToDelete(null);
          }}
          onClose={() => setFileToDelete(null)}
        />
      )}
    </div>
  );
};
