export interface CheatSheetCategory {
  category: string;
  items: {
    syntax: string;
    jsEquivalent: string;
    description: string;
    example: string;
  }[];
}

export const CHEAT_SHEET_DATA: CheatSheetCategory[] = [
  {
    category: 'Variables & Constantes',
    items: [
      {
        syntax: 'soit x = 10',
        jsEquivalent: 'let x = 10;',
        description: 'Déclare une variable modifiable.',
        example: 'soit score = 0',
      },
      {
        syntax: 'constante PI = 3.14',
        jsEquivalent: 'const PI = 3.14;',
        description: 'Déclare une constante non modifiable.',
        example: 'constante TAUX = 0.20',
      },
    ],
  },
  {
    category: 'Entrées / Sorties (I/O)',
    items: [
      {
        syntax: 'affiche "Texte", x',
        jsEquivalent: 'console.log("Texte", x);',
        description: 'Affiche un ou plusieurs éléments dans la console.',
        example: 'affiche "Résultat :", x',
      },
      {
        syntax: 'lire x "Message"',
        jsEquivalent: 'x = await prompt("Message");',
        description: 'Demande une saisie à l\'utilisateur.',
        example: 'demander nom "Quel est votre prénom ?"',
      },
    ],
  },
  {
    category: 'Conditions',
    items: [
      {
        syntax: 'si [condition] alors ... finsi',
        jsEquivalent: 'if (condition) { ... }',
        description: 'Exécute un bloc si la condition est vraie.',
        example: 'si age superieur_ou_egal_a 18 alors\n  affiche "Majeur"\nfinsi',
      },
      {
        syntax: 'sinonsi / sinon',
        jsEquivalent: 'else if / else',
        description: 'Gère les alternatives conditionnelles.',
        example: 'si x superieur_a 0 alors ... sinon ... finsi',
      },
    ],
  },
  {
    category: 'Boucles',
    items: [
      {
        syntax: 'pour i de [début] à [fin] faire ... finpour',
        jsEquivalent: 'for (let i = début; i <= fin; i++)',
        description: 'Répète un bloc de code avec un compteur.',
        example: 'pour i de 1 à 5 faire\n  affiche i\nfinpour',
      },
      {
        syntax: 'tantque [condition] faire ... fintantque',
        jsEquivalent: 'while (condition) { ... }',
        description: 'Répète un bloc tant que la condition reste vraie.',
        example: 'tantque x inferieur_a 10 faire\n  x = x + 1\nfintantque',
      },
    ],
  },
  {
    category: 'Opérateurs',
    items: [
      {
        syntax: 'egal_a / ==',
        jsEquivalent: '===',
        description: 'Test d\'égalité.',
        example: 'si x egal_a 10 alors ...',
      },
      {
        syntax: 'superieur_a / inferieur_a',
        jsEquivalent: '> / <',
        description: 'Comparaisons de grandeur.',
        example: 'si x superieur_a y alors ...',
      },
      {
        syntax: 'et / ou / non',
        jsEquivalent: '&& / || / !',
        description: 'Opérateurs logiques.',
        example: 'si (a superieur_a 0) et (b superieur_a 0) alors ...',
      },
    ],
  },
  {
    category: 'Fonctions',
    items: [
      {
        syntax: 'fonction nom(p1, p2) ... retourner x ... finfonction',
        jsEquivalent: 'function nom(p1, p2) { return x; }',
        description: 'Déclare une fonction réutilisable.',
        example: 'fonction carre(n)\n  retourner n * n\nfinfonction',
      },
    ],
  },
  {
    category: 'Typage Explicite (TypeScript)',
    items: [
      {
        syntax: 'soit x: entier = 10',
        jsEquivalent: 'let x: number = 10;',
        description: 'Déclare une variable avec un type numérique.',
        example: 'soit age: entier = 25',
      },
      {
        syntax: 'soit nom: texte = "Alex"',
        jsEquivalent: 'let nom: string = "Alex";',
        description: 'Déclare une variable de type texte / chaîne.',
        example: 'soit ville: texte = "Paris"',
      },
      {
        syntax: 'fonction f(n: entier): booleen',
        jsEquivalent: 'async function f(n: number): Promise<boolean>',
        description: 'Déclare une fonction avec typage des arguments et valeur de retour.',
        example: 'fonction estPair(n: entier): booleen\n  retourner n % 2 egal_a 0\nfinfonction',
      },
    ],
  },
  {
    category: 'Chaînes, Interpolation & Concaténation',
    items: [
      {
        syntax: '`Texte ${variable}`',
        jsEquivalent: '`Texte ${variable}`',
        description: 'Template string avec backticks et expression interpolée.',
        example: 'soit msg = `Bienvenue ${nom} !`',
      },
      {
        syntax: '"Texte $variable"',
        jsEquivalent: '`Texte ${variable}`',
        description: 'Interpolation directe avec le symbole dollar ($).',
        example: 'affiche "Score : $score sur 20"',
      },
      {
        syntax: '"Texte " + variable',
        jsEquivalent: '"Texte " + variable',
        description: 'Concaténation classique de texte avec l’opérateur +.',
        example: 'soit full = "Bonjour " + nom + " !"',
      },
    ],
  },
  {
    category: 'Bibliothèque Standard & JavaScript (StdLib)',
    items: [
      {
        syntax: 'Math.racine(x) / Math.aleatoire(min, max)',
        jsEquivalent: 'Math.sqrt(x) / ...',
        description: 'Constantes et fonctions mathématiques (`Math.PI`, `Math.arrondi`, `Math.max`, etc.).',
        example: 'soit de = Math.aleatoire(1, 6)\nsoit r = Math.racine(25)',
      },
      {
        syntax: 'Texte.majuscule(s) / Texte.contient(s, sub)',
        jsEquivalent: 's.toUpperCase() / s.includes(sub)',
        description: 'Traitement de chaînes (`Texte.longueur`, `Texte.decouper`, `Texte.nettoyer`, etc.).',
        example: 'soit maj = Texte.majuscule("bonjour")',
      },
      {
        syntax: 'Tableau.ajouter(t, elem) / Tableau.trier(t)',
        jsEquivalent: 't.push(elem) / t.sort()',
        description: 'Gestion de listes (`Tableau.somme`, `Tableau.joindre`, `Tableau.inverser`, etc.).',
        example: 'soit tab = [3, 1, 2]\nTableau.trier(tab)',
      },
      {
        syntax: 'DateHeure.maintenant() / DateHeure.aujourdhui()',
        jsEquivalent: 'new Date() / ...',
        description: 'Gestion des dates et heures (`DateHeure.timestamp`, `DateHeure.formater`, etc.).',
        example: 'soit d = DateHeure.maintenant()',
      },
      {
        syntax: 'js("code JS") / eval("expression")',
        jsEquivalent: 'eval(code)',
        description: 'Exécute du code JavaScript natif ou appelle des APIs JS.',
        example: 'soit hyp = js("Math.hypot(3, 4)")',
      },
    ],
  },
];
