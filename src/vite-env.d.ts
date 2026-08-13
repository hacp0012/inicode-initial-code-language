/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isElectron: boolean;
    };
  }

  namespace React {
    interface CSSProperties {
      WebkitAppRegion?: "drag" | "no-drag" | "none";
    }
  }
}

declare module '*.ic?raw' {
  const content: string;
  export default content;
}

declare module '*.ic' {
  const content: string;
  export default content;
}

export { };

