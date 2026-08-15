process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

import { app, BrowserWindow, ipcMain, session } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

const devURL = "http://localhost:3000";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 1000,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#111827",
    autoHideMenuBar: true,
    title: "IniCode",
    frame: false,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 18, y: 18 },
    icon: path.join(__dirname, "../build/icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Injecter les dependances dans la nouvelle fenetre popup.
  // et bliquer les liens externe.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // 1. Définir les adresses autorisées (votre app React en dev et en prod)
    const estAutorise = url.startsWith(devURL) || url.startsWith("file://");

    // Si l'URL est interne, on autorise l'ouverture avec le preload
    if (estAutorise) {
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
          webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
          },
        },
      };
    }

    // 2. Si le site est externe (ex: google.com, pirate.com), on bloque complètement !
    console.log(`Ouverture bloquée pour le site externe : ${url}`);
    return { action: "deny" }; // 👈 Bloque l'ouverture de la fenêtre
  });

  ipcMain.on("window:minimize", () => mainWindow.minimize());
  ipcMain.on("window:toggle-maximize", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      return;
    }

    mainWindow.maximize();
  });
  ipcMain.on("window:close", () => mainWindow.close());

  if (isDev) {
    mainWindow.loadURL(devURL + "/#/ide");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"), { hash: "/ide" });
    // mainWindow.loadURL(`file://${filePath}#/ide`);

    // Open automatically the DevTools
    // mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          isDev
            ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: http://localhost:3000; connect-src 'self' https: http://localhost:3000 ws://localhost:3000; worker-src 'self' blob:;"
            : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https:; worker-src 'self' blob:;",
        ],
      },
    });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
