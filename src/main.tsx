import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { HashRouter, Routes, Route } from "react-router-dom";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import App from "./App.tsx";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/400-italic.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "./index.css";

// Configure Monaco Editor to use local files instead of CDN.
// This prevents ERR_INTERNET_DISCONNECTED errors when running offline in Electron.
import editorWorker from "./monacoWorker?worker";
import tsWorker from "./tsWorker?worker";

self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

loader.config({ monaco });

const rootElement = document.getElementById("root");
const loaderElement = document.getElementById("app-loader");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <HashRouter>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </HashRouter>
      </HelmetProvider>
    </StrictMode>,
  );

  window.setTimeout(() => {
    loaderElement?.classList.add("is-hidden");
    window.setTimeout(() => {
      loaderElement?.remove();
    }, 500);
  }, 800);
}
