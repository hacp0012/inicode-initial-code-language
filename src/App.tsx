import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { IdePage } from "./pages/inicode_ide/IdePage";
import { DocsPage } from "./pages/docs/DocsPage";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, setTheme, resolvedTheme, cycleTheme } = useTheme();
  const [codeToLoadInIde, setCodeToLoadInIde] = useState<string | null>(null);

  const handleOpenCodeInIde = (code: string) => {
    setCodeToLoadInIde(code);
  };

  return (
    <>
      <Helmet>
        <title>IniCode</title>
        <meta name="description" content="IDE d’apprentissage de l’algorithmique et de la programmation avec IniCode." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Helmet>

      <Routes>
        {/* Presentation Landing Page */}
        <Route
          path="/"
          element={<HomePage theme={resolvedTheme} onToggleTheme={cycleTheme} onOpenCodeInIde={handleOpenCodeInIde} />}
        />

        {/* Main Algorithmic IDE Workspace */}
        <Route
          path="/ide"
          element={
            <IdePage
              theme={theme}
              setTheme={setTheme}
              resolvedTheme={resolvedTheme}
              cycleTheme={cycleTheme}
              initialCodeToLoad={codeToLoadInIde}
            />
          }
        />

        {/* Pedagogical Markdown Documentation Reader */}
        <Route
          path="/docs"
          element={<DocsPage theme={resolvedTheme} onToggleTheme={cycleTheme} onOpenCodeInIde={handleOpenCodeInIde} />}
        />

        <Route
          path="/docs/:slug"
          element={<DocsPage theme={resolvedTheme} onToggleTheme={cycleTheme} onOpenCodeInIde={handleOpenCodeInIde} />}
        />

        {/* Fallback route */}
        <Route path="*" element={<HomePage theme={resolvedTheme} onToggleTheme={cycleTheme} />} />
      </Routes>
    </>
  );
}
