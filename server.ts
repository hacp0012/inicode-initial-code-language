import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "node:fs";
import multer from "multer";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || '3000';
  const HOME_DIR = process.env.HOME_DIR || ""; //process.cwd();
  const PACKAGES_DIR_NAME = process.env.RELEASES_DIR || "packages-releases";
  const VITE_WINDOWS_RELEASE = process.env.VITE_WINDOWS_RELEASE || "IniCode.exe";

  // Détecter si on est en mode développement ou production
  const isDev = process.env.NODE_ENV !== "production";

  console.log(process.cwd())

  // default to current working dir.
  let PACKAGES_DIR = path.join(process.cwd(), PACKAGES_DIR_NAME);
  PACKAGES_DIR = isDev ? PACKAGES_DIR : path.join(HOME_DIR, PACKAGES_DIR);
  fs.mkdirSync(PACKAGES_DIR, { recursive: true });

  // -----------------------------------------------------------------------------
  // const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

  // fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req: any, _file: any, cb: (arg0: null, arg1: string) => void) => {
      cb(null, PACKAGES_DIR);
    },
    filename: (_req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  });

  const upload = multer({ storage });

  app.use("/downloads", express.static(PACKAGES_DIR));
  // -----------------------------------------------------------------------------

  // Rendre le dossier de stockage persistant accessible publiquement
  // Body parser
  // app.use("/downloads", express.static(path.join(PACKAGES_DIR, VITE_WINDOWS_RELEASE)));
  app.use(express.json());

  if (isDev) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: true, // Allow Vite to handle HMR on all interfaces
        hmr: {
          // port: parseInt(PORT), // Force le WebSocket à utiliser le port d'Express (3000)
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Démarrer le serveur
  app.listen(parseInt(PORT), "0.0.0.0", () => {
    if (isDev) {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Accessible on your network at http://<YOUR_LOCAL_IP>:${PORT}`);
      console.info(
        'Trouve l\'adresse IP locale de ta machine Windows (en tapant ipconfig dans un terminal, regarde "Adresse IPv4") ',
      );
    } else {
      console.log(`Server running on port ${PORT}`);
    }
  });
}

startServer();
