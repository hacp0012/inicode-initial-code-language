# Transpilation : Du Français vers JS & TS

L'une des plus grandes forces d'IniCode est son architecture de **transpilation moderne**. Votre code écrit en Français algorithmique n'est pas simplement exécuté dans un bac à sable opaque : il est converti en **JavaScript ES6 réactif** et **TypeScript typé**.

---

## ⚙️ La Chaîne de Transpilation en 3 Étapes

```
 [ Code IniCode ]
        │
        ▼  1. Analyse Lexicale (Lexer)
   [ Tokens ]
        │
        ▼  2. Analyse Syntaxique (Parser)
    [ AST ]  (Arbre Syntactique Abstrait)
        │
        ▼  3. Générateur de Code (Generator)
 ┌──────┴────────┐
 ▼               ▼
[JavaScript ES6] [TypeScript]
```

### 1. Le Lexer (Analyseur Lexical)

Il découpe la chaîne de texte brute en une série de **Tokens** typés (`KW_SOIT`, `IDENTIFIER`, `ASSIGN`, `NUMBER`, `KW_SI`, etc.), tout en conservant le numéro de ligne et de colonne pour les messages d'erreur.

### 2. Le Parser (Analyseur Syntaxique)

Il transforme la séquence de tokens en un **Arbre Syntactique Abstrait (AST)**. L'AST représente la structure logique hiérarchique du programme sous forme de nœuds typés (`VarDecl`, `If`, `While`, `For`, `FunctionDecl`).

### 3. Le Generator (Générateur de Code)

Il parcourt l'AST et produit le code cible :

- **Mode JS** : Code ES6 lisible, fluide avec `async/await`.
- **Mode TS** : Code TypeScript annoté avec les types natifs (`number`, `string`, `boolean`, `any[]`).

---

## 🔄 Mappage de la Syntaxe

| Instruction IniCode             | JavaScript Généré (ES6)              | TypeScript Généré                            |
| :------------------------------ | :----------------------------------- | :------------------------------------------- |
| `soit x: entier = 10`           | `let x = 10;`                        | `let x: number = 10;`                        |
| `constante PI: réel = 3.14`     | `const PI = 3.14;`                   | `const PI: number = 3.14;`                   |
| `si x superieur_a 5 alors`      | `if (x > 5) {`                       | `if (x > 5) {`                               |
| `pour i de 1 à 10 pas 1 faire`  | `for (let i = 1; i <= 10; i += 1) {` | `for (let i: number = 1; i <= 10; i += 1) {` |
| `tantque x superieur_a 0 faire` | `while (x > 0) {`                    | `while (x > 0) {`                            |
| `affiche("OK")`                 | `await __affiche__("OK");`           | `await __affiche__("OK");`                   |
| `x = demander("Nom ?")`         | `x = await __lire__("Nom ?");`       | `x = await __lire__("Nom ?");`               |

---

## 🔍 Inspection de l'AST dans l'IDE

Dans l'IDE IniCode, vous pouvez à tout moment cliquer sur l'onglet **"Arbre AST"** ou **"JS / TS Généré"** dans le panneau inférieur pour visualiser l'arbre syntaxique sous forme JSON structuré ou consulter le code transpilation en direct.
