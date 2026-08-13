# Setup Electron pour IniCode

Ce document regroupe les commandes utiles pour lancer l’application en mode web, en mode desktop Electron et pour générer un installateur Windows .exe avec NSIS.

## 1. Installer les dépendances

```bash
npm install
```

Pour Electron et le packaging Windows :

```bash
npm install --save-dev electron electron-builder concurrently wait-on
```

## 2. Lancer l’application web

```bash
npm run dev
```

Le projet démarre en Vite sur le port 3000.

## 3. Lancer l’application desktop Electron

### Version simple

```bash
npm run electron
```

### Version avec Vite + Electron en même temps

```bash
npm run dev:electron
```

Cette commande démarre Vite puis ouvre Electron quand le serveur est disponible.

## 4. Build de production du site web

```bash
npm run build
```

Ceci crée le dossier `dist/` pour la version web prête à être servie.

## 5. Générer l’installateur Windows (.exe)

### Commande principale

```bash
npx electron-builder --win --x64
```

### Variante avec build + packaging

```bash
npm run build && npx electron-builder --win --x64
```

### Script ajouté dans le projet

```bash
npm run dist
```

Cette commande exécute automatiquement :
- `npm run build`
- `electron-builder`

## 6. Nettoyer les fichiers de build

```bash
npm run clean
```

## 7. Vérification TypeScript

```bash
npm run lint
```

## 8. Structure ajoutée pour Electron

- `electron/main.js` : fenêtre Electron principale
- `electron/preload.js` : preload sécurisé pour l’application
- `build/icon.ico` : icône de l’application et de l’installateur
- `package.json` : configuration de packaging `build`

## 9. Points de configuration importants

Le packaging Windows est configuré avec NSIS dans `package.json` :
- `target: "nsis"`
- `installerIcon: "build/icon.ico"`
- `createDesktopShortcut: true`
- `createStartMenuShortcut: true`

## 10. Remarques importantes

- Le développement web Vite reste intact.
- Electron est utilisé comme couche desktop pour le packaging Windows.
- Le projet ne doit pas être lancé en Electron pendant qu’un ancien packaging est encore ouvert, sinon Windows peut bloquer le renommage du dossier de sortie.

## 11. Commandes utiles en résumé

```bash
npm install
npm run dev
npm run electron
npm run dev:electron
npm run build
npm run lint
npm run clean
npx electron-builder --win --x64
npm run dist
```

## 12. Problème courant de packaging Windows

Si tu obtiens une erreur du type :

```bash
EPERM: operation not permitted, rename ... release\win-unpacked.tmp
```

cela signifie généralement qu’un dossier de sortie est encore verrouillé ou ouvert par Windows. Dans ce cas :

1. ferme toute fenêtre Electron ouverte
2. supprime manuellement le dossier `release/`
3. relance la commande de packaging

---

Ce fichier sert de référence rapide pour lancer et packager IniCode en application Windows.
