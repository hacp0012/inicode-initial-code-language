import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code2,
  Play,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Cpu,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Smartphone,
  Check,
  Copy,
} from "lucide-react";
import { CodeHighlighter } from "../components/CodeHighlighter";

interface HomePageProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);

  const heroSnippet = `// Algorithme du Maximum dans un Tableau
soit nombres: tableau = [12, 45, 89, 23, 67]
soit max: entier = nombres[0]

pour i de 1 à 4 pas 1 faire
    si nombres[i] superieur_a max alors
        max = nombres[i]
    finsi
finpour

affiche("Le nombre maximum est : " + max)`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(heroSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f14] text-slate-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-[#14141d]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/80 px-4 lg:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 font-black text-xl text-slate-900 dark:text-white tracking-tight">
            <div className="text-white rounded-xl shadow-lg shadow-orange-600/30">
              <img src="/logo.png" alt="IniCode Logo" className="w-7 h-7" />
            </div>
            <span>IniCode</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-6">
          <Link
            to="/docs"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Documentation</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
            title="Basculer le thème clair/sombre"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Primary CTA */}
          <Link
            to="/ide"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-600/25 transition flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Ouvrir l'IDE</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold text-xs rounded-full border border-orange-500/20 mb-6 animate-in fade-in zoom-in duration-300">
          <Sparkles className="w-4 h-4" />
          <span>IDE Algorithmique Francophone & Transpileur Interactif</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl leading-tight font-sans mb-6">
          Pensez la{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-amber-500 to-orange-600">
            Logique
          </span>
          , Pas la Barrière de la Langue.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-8 font-sans">
          <strong>IniCode</strong> est un environnement de développement conçu pour enseigner et concevoir des algorithmes
          stricts en Français. Écrivez, déboguez pas-à-pas et transpilez instantanément en <strong>JavaScript ES6</strong> et{" "}
          <strong>TypeScript</strong>.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <button
            onClick={() => navigate("/ide")}
            className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-orange-600/30 hover:scale-105 transition flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Lancer l'IDE Gratuitement</span>
          </button>

          <button
            onClick={() => navigate("/docs")}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 dark:bg-[#1f1f2a] hover:bg-slate-200 dark:hover:bg-[#282836] text-slate-800 dark:text-zinc-200 font-semibold text-base rounded-2xl border border-slate-200 dark:border-zinc-800 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span>Explorer la Documentation</span>
          </button>
        </div>

        {/* Live Code Preview Card */}
        <div className="w-full max-w-3xl bg-[#14141e] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-left text-zinc-200">
          <div className="px-4 py-3 bg-[#1c1c28] border-b border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-zinc-400 ml-2 text-[11px]">algorithme_maximum.ic</span>
            </div>
            <button
              onClick={handleCopySnippet}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition flex items-center gap-1.5 text-[11px]"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? "Copié !" : "Copier"}</span>
            </button>
          </div>

          <CodeHighlighter code={heroSnippet} language="ic" className="border-0 rounded-none bg-[#101018]" />

          <div className="p-4 bg-[#181824] border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Transpilation ES6 & TS Valide</span>
            </div>
            <Link to="/ide" className="text-orange-400 hover:underline flex items-center gap-1 font-semibold">
              <span>Exécuter cet algorithme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Tout pour Maîtriser l'Algorithmique</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-xl mx-auto">
            Une expérience pédagogique complète pensée pour les enseignants, étudiants et autodidactes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-white dark:bg-[#181822] border border-slate-200 dark:border-zinc-800/80 rounded-2xl shadow-sm hover:border-orange-500/50 transition">
            <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl w-fit mb-4">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Syntaxe Francophone</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Mots-clés naturels (`soit`, `si`, `pour`, `tantque`, `affiche`) évitant les erreurs de traduction chez les
              apprenants.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white dark:bg-[#181822] border border-slate-200 dark:border-zinc-800/80 rounded-2xl shadow-sm hover:border-orange-500/50 transition">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl w-fit mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Transpilation Multi-Cible</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Passez de l'algorithme francophone à du code JavaScript moderne ou TypeScript typé en un seul clic.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white dark:bg-[#181822] border border-slate-200 dark:border-zinc-800/80 rounded-2xl shadow-sm hover:border-orange-500/50 transition">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Débogueur Pas-à-Pas</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Suivez le fil d'exécution ligne par ligne et visualisez l'évolution de la mémoire dans l'inspecteur dynamique.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white dark:bg-[#181822] border border-slate-200 dark:border-zinc-800/80 rounded-2xl shadow-sm hover:border-orange-500/50 transition">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl w-fit mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Arbre Syntaxique (AST)</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Analysez la structure interne de vos programmes grâce à l'inspecteur d'AST pour comprendre la compilation.
            </p>
          </div>
        </div>
      </section>

      {/* PWA & Offline Banner */}
      <section className="py-12 px-4 lg:px-8 max-w-5xl mx-auto w-full my-8">
        <div className="bg-linear-to-r from-orange-500 to-amber-500 rounded-3xl p-8 lg:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Application PWA Hors-Ligne</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black">Installez IniCode & Codez Partout</h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg">
              Aucune dépendance serveur. L'ensemble de l'éditeur Monaco, du transpileur et du débogueur s'exécute à 100% dans
              votre navigateur, même sans connexion Internet.
            </p>
          </div>

          <button
            onClick={() => navigate("/ide")}
            className="px-6 py-3.5 bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm rounded-2xl shadow-lg transition shrink-0 cursor-pointer"
          >
            Lancer l'IDE Maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#121218] py-8 px-4 lg:px-12 text-center text-xs text-slate-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-zinc-300">
            <Code2 className="w-4 h-4 text-orange-500" />
            <span>IniCode IDE — Environnement Algorithmique Francophone</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/ide" className="hover:text-orange-500 transition">
              IDE
            </Link>
            <Link to="/docs" className="hover:text-orange-500 transition">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
