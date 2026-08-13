import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  BookOpen,
  Code2,
  Search,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Play,
  Copy,
  Check,
  Home,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { DOC_CHAPTERS, DocChapter } from "./docsData";
import { CodeHighlighter } from "../../components/CodeHighlighter";

interface DocsPageProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenCodeInIde?: (code: string) => void;
}

export const DocsPage: React.FC<DocsPageProps> = ({ theme, onToggleTheme, onOpenCodeInIde }) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<string | null>(null);

  // Active chapter
  const currentChapter = DOC_CHAPTERS.find((ch) => ch.slug === slug) || DOC_CHAPTERS[0];

  const currentChapterIndex = DOC_CHAPTERS.findIndex((ch) => ch.id === currentChapter.id);
  const prevChapter = currentChapterIndex > 0 ? DOC_CHAPTERS[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < DOC_CHAPTERS.length - 1 ? DOC_CHAPTERS[currentChapterIndex + 1] : null;

  // Search filter
  const filteredChapters = DOC_CHAPTERS.filter(
    (ch) =>
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories: Array<DocChapter["category"]> = ["Bases", "Logique", "Avancé", "IDE"];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(id);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleTryInIde = (code: string) => {
    if (onOpenCodeInIde) {
      onOpenCodeInIde(code);
    }
    navigate("/ide");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121218] text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#181822]/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2.5 font-black text-lg text-slate-900 dark:text-white tracking-tight group"
          >
            {/* <div className="p-2 bg-orange-600 text-white rounded-xl shadow-md shadow-orange-600/30 group-hover:scale-105 transition">
              <Code2 className="w-5 h-5" />
            </div> */}
            <div className="bg-orange-600 text-white rounded-xl shadow-md shadow-orange-600/30 group-hover:scale-105 transition">
              <img src="pwa-192x192.svg" alt="IniCode Logo" className="w-7 h-7" />
            </div>
            <span>IniCode</span>
            <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium rounded-full border border-orange-500/20">
              Docs
            </span>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2.5 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
            title="Changer de thème"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Accueil</span>
          </Link>

          <Link
            to="/ide"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs rounded-xl shadow-md shadow-orange-600/20 transition flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ouvrir l'IDE</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Sidebar Chapter Navigation */}
        <aside
          className={`fixed lg:sticky top-14.25 left-0 z-30 h-[calc(100vh-57px)] w-72 bg-white dark:bg-[#181822] border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Search Box */}
          <div className="p-4 border-b border-slate-100 dark:border-zinc-800/80">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un sujet..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-[#22222d] border border-slate-200 dark:border-zinc-700/60 rounded-xl text-xs text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          {/* Chapters List grouped by Category */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            {categories.map((cat) => {
              const catChapters = filteredChapters.filter((ch) => ch.category === cat);
              if (catChapters.length === 0) return null;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="px-2 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    {cat}
                  </div>
                  {catChapters.map((ch) => {
                    const isActive = ch.slug === currentChapter.slug;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          navigate(`/docs/${ch.slug}`);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold border-l-2 border-orange-500"
                            : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#22222d] hover:text-slate-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        <span className="truncate">{ch.title}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content Article Reader */}
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-w-4xl">
          {/* Article Header Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-xs rounded-full border border-orange-500/20 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Chapitre {currentChapter.id} • {currentChapter.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans mb-2">
              {currentChapter.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400">{currentChapter.description}</p>
          </div>

          <hr className="border-slate-200 dark:border-zinc-800 mb-8" />

          {/* Markdown Content Container */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 leading-relaxed space-y-6 text-sm lg:text-base">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");

                  if (match || codeString.includes("soit") || codeString.includes("affiche")) {
                    const snippetId = `code-${Math.random().toString(36).substr(2, 9)}`;
                    return (
                      <div className="my-6 rounded-2xl overflow-hidden bg-[#181822] border border-zinc-800 shadow-xl">
                        <div className="px-4 py-2.5 bg-[#20202c] border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
                          <span className="flex items-center gap-2 text-orange-400 font-sans font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            Exemple IniCode
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyCode(codeString, snippetId)}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition flex items-center gap-1 text-[11px]"
                              title="Copier le code"
                            >
                              {copiedCodeIndex === snippetId ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copié</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleTryInIde(codeString)}
                              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition flex items-center gap-1 text-[11px] font-sans font-semibold shadow-xs"
                              title="Tester cet exemple dans l'IDE"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Tester dans l'IDE</span>
                            </button>
                          </div>
                        </div>

                        <CodeHighlighter
                          code={codeString}
                          language={match ? match[1] : "ic"}
                          className="border-0 rounded-none bg-[#14141d]"
                        />
                      </div>
                    );
                  }

                  return (
                    <code
                      className="px-1.5 py-0.5 bg-slate-200 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 font-mono text-xs rounded-md"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                h1({ children }) {
                  return (
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-8 mb-4 border-b pb-2 border-slate-200 dark:border-zinc-800">
                      {children}
                    </h2>
                  );
                },
                h2({ children }) {
                  return (
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-6 mb-3">{children}</h3>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-6 border border-slate-200 dark:border-zinc-800 rounded-xl">
                      <table className="w-full text-left text-xs lg:text-sm border-collapse">{children}</table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="bg-slate-100 dark:bg-zinc-800/80 p-3 font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="p-3 border-b border-slate-100 dark:border-zinc-800/60 text-slate-700 dark:text-zinc-300">
                      {children}
                    </td>
                  );
                },
              }}
            >
              {currentChapter.content}
            </ReactMarkdown>
          </div>

          {/* Chapter Bottom Pagination */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            {prevChapter ? (
              <button
                onClick={() => navigate(`/docs/${prevChapter.slug}`)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#181822] border border-slate-200 dark:border-zinc-800 hover:border-orange-500 rounded-xl transition text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-orange-500 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400">Précédent</div>
                  <div>{prevChapter.title}</div>
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <button
                onClick={() => navigate(`/docs/${nextChapter.slug}`)}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition text-xs font-medium shadow-md shadow-orange-600/20 cursor-pointer ml-auto"
              >
                <div className="text-right">
                  <div className="text-[10px] text-orange-200">Suivant</div>
                  <div>{nextChapter.title}</div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
