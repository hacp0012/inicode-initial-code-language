import React, { useState } from 'react';
import { Layers, X, Search, FileText, Code, CheckCircle2 } from 'lucide-react';
import { Token, ASTNode } from '../transpiler/types';

interface LexerAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  ast: ASTNode | null;
}

export const LexerAnalyzerModal: React.FC<LexerAnalyzerModalProps> = ({
  isOpen,
  onClose,
  tokens,
  ast,
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'ast' | 'regex'>('tokens');
  const [filterToken, setFilterToken] = useState('');

  if (!isOpen) return null;

  const filteredTokens = tokens.filter(
    (t) =>
      t.type.toLowerCase().includes(filterToken.toLowerCase()) ||
      t.value.toLowerCase().includes(filterToken.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111114] dark:bg-[#111114] light:bg-white border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-300 rounded-xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100 dark:text-zinc-100 light:text-slate-900">
        {/* Modal Header */}
        <div className="bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-slate-100 px-5 py-3.5 border-b border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orange-500/10 text-orange-500 rounded-lg border border-orange-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-zinc-100 dark:text-zinc-100 light:text-slate-900">
                Inspecteur de Compilation : Lexer & AST Parser
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Analyse détaillée de la découpe lexicale (Tokenization) et de l'arbre syntaxique abstrait
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 dark:hover:text-zinc-100 light:hover:text-slate-900 p-1 rounded-lg hover:bg-[#18181C] dark:hover:bg-[#18181C] light:hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-[#111114] dark:bg-[#111114] light:bg-slate-50 border-b border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 px-5 py-2 flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-orange-600 text-white shadow'
                : 'bg-[#18181C] dark:bg-[#18181C] light:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-[#27272A]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Jetons Lexicaux ({tokens.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ast')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'ast'
                ? 'bg-orange-600 text-white shadow'
                : 'bg-[#18181C] dark:bg-[#18181C] light:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-[#27272A]'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Arbre Syntaxe Abstrait (AST)</span>
          </button>

          <button
            onClick={() => setActiveTab('regex')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'regex'
                ? 'bg-orange-600 text-white shadow'
                : 'bg-[#18181C] dark:bg-[#18181C] light:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-[#27272A]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Règles RegEx du Français</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white font-mono text-xs">
          {activeTab === 'tokens' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-xs font-sans">
                  Liste ordonnée des jetons (Tokens) extraits par l'analyseur lexical :
                </span>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Filtrer les tokens..."
                    value={filterToken}
                    onChange={(e) => setFilterToken(e.target.value)}
                    className="bg-[#18181C] dark:bg-[#18181C] light:bg-slate-100 border border-[#27272A] dark:border-[#27272A] light:border-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-900 text-xs pl-8 pr-2.5 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 font-sans"
                  />
                </div>
              </div>

              <div className="border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 rounded-lg overflow-hidden bg-[#111114] dark:bg-[#111114] light:bg-slate-50">
                <table className="w-full text-left">
                  <thead className="bg-[#18181C] dark:bg-[#18181C] light:bg-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-700 border-b border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-300 font-sans text-xs">
                    <tr>
                      <th className="py-2 px-3">Type du Jeton (TokenType)</th>
                      <th className="py-2 px-3">Texte Brut (Value)</th>
                      <th className="py-2 px-3">Ligne</th>
                      <th className="py-2 px-3">Colonne</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F23] dark:divide-[#1F1F23] light:divide-slate-200 bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white text-xs">
                    {filteredTokens.map((t, idx) => (
                      <tr key={idx} className="hover:bg-[#141418] dark:hover:bg-[#141418] light:hover:bg-slate-100 transition">
                        <td className="py-2 px-3 font-bold text-orange-400 dark:text-orange-400 light:text-orange-700">{t.type}</td>
                        <td className="py-2 px-3 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-bold">
                          {JSON.stringify(t.value)}
                        </td>
                        <td className="py-2 px-3 text-zinc-400 dark:text-zinc-400 light:text-slate-500">{t.line}</td>
                        <td className="py-2 px-3 text-zinc-400 dark:text-zinc-400 light:text-slate-500">{t.column}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ast' && (
            <div className="space-y-2">
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-xs font-sans">
                Représentation structurée en JSON de l'Arbre Syntaxique Abstrait (AST) généré par le Parser :
              </p>
              <pre className="bg-[#111114] dark:bg-[#111114] light:bg-slate-900 p-4 rounded-lg border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-800 text-amber-300 font-mono text-xs overflow-x-auto leading-5 shadow-inner">
                {JSON.stringify(ast, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'regex' && (
            <div className="space-y-4 font-sans text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-800">
              <p className="font-bold">
                Expressions Régulières (RegEx) utilisées par le Lexer de IniCode :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#111114] dark:bg-[#111114] light:bg-slate-100 p-3 rounded-lg border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 space-y-1">
                  <span className="text-orange-400 font-bold text-xs">Conditionnelles & Mots-clés blocs</span>
                  <code className="block text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white p-1.5 rounded border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-300 text-xs font-mono">
                    /^sinon\s+si\b/i , /^fin\s+si\b/i
                  </code>
                </div>

                <div className="bg-[#111114] dark:bg-[#111114] light:bg-slate-100 p-3 rounded-lg border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 space-y-1">
                  <span className="text-orange-400 font-bold text-xs">Boucles & Fonctions</span>
                  <code className="block text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white p-1.5 rounded border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-300 text-xs font-mono">
                    /^tant\s+que\b/i , /^fin\s+pour\b/i
                  </code>
                </div>

                <div className="bg-[#111114] dark:bg-[#111114] light:bg-slate-100 p-3 rounded-lg border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 space-y-1">
                  <span className="text-orange-400 font-bold text-xs">Opérateurs d'égalité & comparaison</span>
                  <code className="block text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white p-1.5 rounded border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-300 text-xs font-mono">
                    /^est\s+supérieur\s+ou\s+égal\s+à\b/i
                  </code>
                  <code className="block text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white p-1.5 rounded border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-300 text-xs font-mono">
                    /^est\s+égal\s+à\b/i , /^est\s+différent\s+de\b/i
                  </code>
                </div>

                <div className="bg-[#111114] dark:bg-[#111114] light:bg-slate-100 p-3 rounded-lg border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-200 space-y-1">
                  <span className="text-orange-400 font-bold text-xs">Identifiants avec accents français</span>
                  <code className="block text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-[#0A0A0B] dark:bg-[#0A0A0B] light:bg-white p-1.5 rounded border border-[#1F1F23] dark:border-[#1F1F23] light:border-slate-300 text-xs font-mono">
                    /^[a-zA-Zà-ÿÀ-Ÿ_][a-zA-Z0-9à-ÿÀ-Ÿ_]*/
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
