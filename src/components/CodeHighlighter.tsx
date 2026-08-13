import React from "react";

interface CodeHighlighterProps {
  code: string;
  language?: "ic" | "js" | "ts" | string;
  className?: string;
}

// IniCode Keyword definitions
const IC_KEYWORDS = [
  "soit",
  "constante",
  "si",
  "alors",
  "sinonsi",
  "sinon",
  "finsi",
  "selon",
  "cas",
  "defaut",
  "finselon",
  "pour",
  "de",
  "à",
  "pas",
  "faire",
  "finpour",
  "tantque",
  "fintantque",
  "fonction",
  "procedure",
  "finprocedure",
  "finfonction",
  "retourner",
  "affiche",
  "saisir",
];

const IC_TYPES = ["entier", "réel", "texte", "booleen", "tableau"];
const IC_BOOLEANS = ["vrai", "faux", "nul"];
const IC_OPERATORS = [
  "superieur_ou_egal_a",
  "inferieur_ou_egal_a",
  "superieur_a",
  "inferieur_a",
  "egal_a",
  "different_de",
  "equivalent_a",
  "et",
  "ou",
  "non",
];

export const highlightIcCode = (code: string): React.ReactNode[] => {
  const lines = code.split("\n");

  return lines.map((line, lineIdx) => {
    // If line is a comment
    const commentMatch = line.match(/^(\s*)(\/\/.*)$/);
    if (commentMatch) {
      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell select-none text-zinc-600 text-right pr-4 italic font-mono text-[11px]">
            {lineIdx + 1}
          </span>
          <span className="table-cell text-zinc-500 italic">
            {commentMatch[1]}
            {commentMatch[2]}
          </span>
        </div>
      );
    }

    // Tokenize line with regex
    // Tokens: Strings ("..."), Comments (//...), Words, Numbers, Operators/Punctuation
    const tokenRegex = /(".*?"|'.*?'|\/\/.*|\b[a-zA-Z_À-ÿ][a-zA-Z0-9_À-ÿ]*\b|\d+(?:\.\d+)?|[^\s\wÀ-ÿ]+|\s+)/g;
    const tokens: string[] = line.match(tokenRegex) || [line];

    const renderedTokens = tokens.map((token, tokIdx) => {
      // Inline comments
      if (token.startsWith("//")) {
        return (
          <span key={tokIdx} className="text-zinc-500 italic">
            {token}
          </span>
        );
      }

      // Strings
      if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
        return (
          <span key={tokIdx} className="text-emerald-400 font-medium">
            {token}
          </span>
        );
      }

      // Numbers
      if (/^\d+(?:\.\d+)?$/.test(token)) {
        return (
          <span key={tokIdx} className="text-amber-400 font-semibold">
            {token}
          </span>
        );
      }

      const lowerToken = token.toLowerCase();

      // Keywords
      if (IC_KEYWORDS.includes(lowerToken)) {
        return (
          <span key={tokIdx} className="text-orange-400 font-bold">
            {token}
          </span>
        );
      }

      // Types
      if (IC_TYPES.includes(lowerToken)) {
        return (
          <span key={tokIdx} className="text-cyan-400 font-semibold">
            {token}
          </span>
        );
      }

      // Booleans
      if (IC_BOOLEANS.includes(lowerToken)) {
        return (
          <span key={tokIdx} className="text-purple-400 font-semibold">
            {token}
          </span>
        );
      }

      // Operators words
      if (["et", "ou", "non"].includes(lowerToken)) {
        return (
          <span key={tokIdx} className="text-yellow-400 font-semibold">
            {token}
          </span>
        );
      }

      // Functions / Builtins
      if (["affiche", "saisir"].includes(lowerToken)) {
        return (
          <span key={tokIdx} className="text-blue-400 font-bold">
            {token}
          </span>
        );
      }

      // Default text / operators
      return (
        <span key={tokIdx} className="text-zinc-200">
          {token}
        </span>
      );
    });

    return (
      <div key={lineIdx} className="table-row">
        <span className="table-cell select-none text-zinc-600 text-right pr-4 font-mono text-[11px]">{lineIdx + 1}</span>
        <span className="table-cell whitespace-pre">{renderedTokens}</span>
      </div>
    );
  });
};

export const CodeHighlighter: React.FC<CodeHighlighterProps> = ({ code, language = "ic", className = "" }) => {
  return (
    <div
      className={`font-mono text-xs leading-relaxed overflow-x-auto bg-[#101018] p-4 rounded-xl border border-zinc-800 ${className}`}
    >
      <div className="table w-full border-collapse">{highlightIcCode(code)}</div>
    </div>
  );
};
