/**
 * Bibliothèque standard IniCode
 * Expose des classes utilitaires (Math/Maths, Texte/String, Tableau/Array, DateHeure/DateTime)
 * et des fonctions d'aide, ainsi que le support d'exécution JS native (eval, js, JS).
 */

// Module Math / Maths
export const IniMath = {
  PI: Math.PI,
  pi: Math.PI,
  E: Math.E,
  e: Math.E,
  racine: (x: number) => Math.sqrt(x),
  sqrt: (x: number) => Math.sqrt(x),
  arrondi: (x: number, decimales: number = 0) => {
    const facteur = Math.pow(10, decimales);
    return Math.round(x * facteur) / facteur;
  },
  round: (x: number, decimales: number = 0) => {
    const facteur = Math.pow(10, decimales);
    return Math.round(x * facteur) / facteur;
  },
  sol: (x: number) => Math.floor(x),
  plancher: (x: number) => Math.floor(x),
  floor: (x: number) => Math.floor(x),
  plafond: (x: number) => Math.ceil(x),
  ceil: (x: number) => Math.ceil(x),
  abs: (x: number) => Math.abs(x),
  max: (...nums: number[]) => Math.max(...nums),
  min: (...nums: number[]) => Math.min(...nums),
  puissance: (base: number, exp: number) => Math.pow(base, exp),
  pow: (base: number, exp: number) => Math.pow(base, exp),
  aleatoire: (min: number = 0, max: number = 1) => {
    if (min > max) [min, max] = [max, min];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  random: (min: number = 0, max: number = 1) => {
    if (min > max) [min, max] = [max, min];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  sin: (x: number) => Math.sin(x),
  cos: (x: number) => Math.cos(x),
  tan: (x: number) => Math.tan(x),
  log: (x: number) => Math.log(x),
  exp: (x: number) => Math.exp(x),
  tronquer: (x: number) => Math.trunc(x),
  trunc: (x: number) => Math.trunc(x),
  signe: (x: number) => Math.sign(x),
  sign: (x: number) => Math.sign(x),
};

// Module Texte / String
export const IniTexte = {
  longueur: (s: any) => String(s ?? '').length,
  length: (s: any) => String(s ?? '').length,
  majuscule: (s: any) => String(s ?? '').toUpperCase(),
  toUpperCase: (s: any) => String(s ?? '').toUpperCase(),
  minuscule: (s: any) => String(s ?? '').toLowerCase(),
  toLowerCase: (s: any) => String(s ?? '').toLowerCase(),
  contient: (s: any, sousChaine: any) => String(s ?? '').includes(String(sousChaine ?? '')),
  contains: (s: any, sousChaine: any) => String(s ?? '').includes(String(sousChaine ?? '')),
  remplacer: (s: any, cible: any, remplacement: any) => String(s ?? '').replace(String(cible ?? ''), String(remplacement ?? '')),
  replace: (s: any, cible: any, remplacement: any) => String(s ?? '').replace(String(cible ?? ''), String(remplacement ?? '')),
  remplacerTout: (s: any, cible: any, remplacement: any) => String(s ?? '').replace(String(cible ?? ''), String(remplacement ?? '')),
  replaceAll: (s: any, cible: any, remplacement: any) => String(s ?? '').replace(String(cible ?? ''), String(remplacement ?? '')),
  decouper: (s: any, separateur: any = ' ') => String(s ?? '').split(String(separateur ?? ' ')),
  split: (s: any, separateur: any = ' ') => String(s ?? '').split(String(separateur ?? ' ')),
  sousTexte: (s: any, debut: number, fin?: number) => String(s ?? '').substring(debut, fin),
  substring: (s: any, debut: number, fin?: number) => String(s ?? '').substring(debut, fin),
  nettoyer: (s: any) => String(s ?? '').trim(),
  trim: (s: any) => String(s ?? '').trim(),
  commencePar: (s: any, prefixe: any) => String(s ?? '').startsWith(String(prefixe ?? '')),
  startsWith: (s: any, prefixe: any) => String(s ?? '').startsWith(String(prefixe ?? '')),
  finitPar: (s: any, suffixe: any) => String(s ?? '').endsWith(String(suffixe ?? '')),
  endsWith: (s: any, suffixe: any) => String(s ?? '').endsWith(String(suffixe ?? '')),
  caractereA: (s: any, index: number) => String(s ?? '').charAt(index),
  charAt: (s: any, index: number) => String(s ?? '').charAt(index),
  repeter: (s: any, fois: number) => String(s ?? '').repeat(fois),
  repeat: (s: any, fois: number) => String(s ?? '').repeat(fois),
  inverser: (s: any) => String(s ?? '').split('').reverse().join(''),
  reverse: (s: any) => String(s ?? '').split('').reverse().join(''),
};

// Module Tableau / Array
export const IniTableau = {
  longueur: (arr: any[]) => (Array.isArray(arr) ? arr.length : 0),
  taille: (arr: any[]) => (Array.isArray(arr) ? arr.length : 0),
  length: (arr: any[]) => (Array.isArray(arr) ? arr.length : 0),
  ajouter: (arr: any[], ...elements: any[]) => {
    if (Array.isArray(arr)) arr.push(...elements);
    return arr;
  },
  push: (arr: any[], ...elements: any[]) => {
    if (Array.isArray(arr)) arr.push(...elements);
    return arr;
  },
  retirer: (arr: any[]) => (Array.isArray(arr) ? arr.pop() : undefined),
  pop: (arr: any[]) => (Array.isArray(arr) ? arr.pop() : undefined),
  retirerPremier: (arr: any[]) => (Array.isArray(arr) ? arr.shift() : undefined),
  shift: (arr: any[]) => (Array.isArray(arr) ? arr.shift() : undefined),
  ajouterPremier: (arr: any[], ...elements: any[]) => {
    if (Array.isArray(arr)) arr.unshift(...elements);
    return arr;
  },
  unshift: (arr: any[], ...elements: any[]) => {
    if (Array.isArray(arr)) arr.unshift(...elements);
    return arr;
  },
  contient: (arr: any[], element: any) => (Array.isArray(arr) ? arr.includes(element) : false),
  includes: (arr: any[], element: any) => (Array.isArray(arr) ? arr.includes(element) : false),
  trouverIndex: (arr: any[], element: any) => (Array.isArray(arr) ? arr.indexOf(element) : -1),
  indexOf: (arr: any[], element: any) => (Array.isArray(arr) ? arr.indexOf(element) : -1),
  inverser: (arr: any[]) => (Array.isArray(arr) ? [...arr].reverse() : []),
  reverse: (arr: any[]) => (Array.isArray(arr) ? [...arr].reverse() : []),
  trier: (arr: any[]) => (Array.isArray(arr) ? [...arr].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0)) : []),
  sort: (arr: any[]) => (Array.isArray(arr) ? [...arr].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0)) : []),
  joindre: (arr: any[], separateur: string = ', ') => (Array.isArray(arr) ? arr.join(separateur) : ''),
  join: (arr: any[], separateur: string = ', ') => (Array.isArray(arr) ? arr.join(separateur) : ''),
  decouper: (arr: any[], debut: number, fin?: number) => (Array.isArray(arr) ? arr.slice(debut, fin) : []),
  slice: (arr: any[], debut: number, fin?: number) => (Array.isArray(arr) ? arr.slice(debut, fin) : []),
  somme: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((acc, v) => acc + (Number(v) || 0), 0) : 0),
  moyenne: (arr: number[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.reduce((acc, v) => acc + (Number(v) || 0), 0) / arr.length;
  },
  max: (arr: number[]) => (Array.isArray(arr) ? Math.max(...arr) : 0),
  min: (arr: number[]) => (Array.isArray(arr) ? Math.min(...arr) : 0),
  transformer: (arr: any[], fn: (item: any, index: number) => any) => (Array.isArray(arr) ? arr.map(fn) : []),
  map: (arr: any[], fn: (item: any, index: number) => any) => (Array.isArray(arr) ? arr.map(fn) : []),
  filtrer: (arr: any[], fn: (item: any, index: number) => boolean) => (Array.isArray(arr) ? arr.filter(fn) : []),
  filter: (arr: any[], fn: (item: any, index: number) => boolean) => (Array.isArray(arr) ? arr.filter(fn) : []),
  pourChaque: (arr: any[], fn: (item: any, index: number) => void) => {
    if (Array.isArray(arr)) arr.forEach(fn);
  },
  forEach: (arr: any[], fn: (item: any, index: number) => void) => {
    if (Array.isArray(arr)) arr.forEach(fn);
  },
};

// Module DateHeure / DateTime
export const IniDateHeure = {
  maintenant: () => new Date(),
  now: () => new Date(),
  aujourdhui: () => new Date().toISOString().split('T')[0],
  today: () => new Date().toISOString().split('T')[0],
  annee: (d: Date = new Date()) => new Date(d).getFullYear(),
  year: (d: Date = new Date()) => new Date(d).getFullYear(),
  mois: (d: Date = new Date()) => new Date(d).getMonth() + 1,
  month: (d: Date = new Date()) => new Date(d).getMonth() + 1,
  jour: (d: Date = new Date()) => new Date(d).getDate(),
  day: (d: Date = new Date()) => new Date(d).getDate(),
  heure: (d: Date = new Date()) => new Date(d).getHours(),
  hour: (d: Date = new Date()) => new Date(d).getHours(),
  minute: (d: Date = new Date()) => new Date(d).getMinutes(),
  seconde: (d: Date = new Date()) => new Date(d).getSeconds(),
  second: (d: Date = new Date()) => new Date(d).getSeconds(),
  timestamp: (d: Date = new Date()) => new Date(d).getTime(),
  formater: (d: Date = new Date(), format?: string) => {
    const dateObj = new Date(d);
    if (format === 'heure' || format === 'time') return dateObj.toLocaleTimeString('fr-FR');
    if (format === 'date') return dateObj.toLocaleDateString('fr-FR');
    return dateObj.toLocaleString('fr-FR');
  },
  format: (d: Date = new Date(), format?: string) => {
    const dateObj = new Date(d);
    if (format === 'heure' || format === 'time') return dateObj.toLocaleTimeString('fr-FR');
    if (format === 'date') return dateObj.toLocaleDateString('fr-FR');
    return dateObj.toLocaleString('fr-FR');
  },
};

// Fonctions d'évaluation JS direct
export const IniEval = {
  eval: (code: string) => {
    try {
      // eslint-disable-next-line no-eval
      return eval(code);
    } catch (err: any) {
      throw new Error(`[Erreur JS eval] ${err.message}`);
    }
  },
  js: (code: string) => {
    try {
      // eslint-disable-next-line no-eval
      return eval(code);
    } catch (err: any) {
      throw new Error(`[Erreur JS execution] ${err.message}`);
    }
  },
  JS: (code: string) => {
    try {
      // eslint-disable-next-line no-eval
      return eval(code);
    } catch (err: any) {
      throw new Error(`[Erreur JS execution] ${err.message}`);
    }
  },
};

export const INI_STD_LIB = {
  // Modules / Objets
  Math: IniMath,
  Maths: IniMath,
  Texte: IniTexte,
  String: IniTexte,
  Tableau: IniTableau,
  Array: IniTableau,
  DateHeure: IniDateHeure,
  DateTime: IniDateHeure,

  // Évaluation JS
  eval: IniEval.eval,
  js: IniEval.js,
  JS: IniEval.JS,

  // Fonctions globales rapides
  aleatoire: IniMath.aleatoire,
  longueur: IniTexte.longueur,
  arrondi: IniMath.arrondi,
  abs: IniMath.abs,
  max: IniMath.max,
  min: IniMath.min,
  puissance: IniMath.puissance,
  entier: (value: number) => Math.trunc(value),
  texte: (value: any) => String(value ?? ''),
  est_nombre: (value: any) => typeof value === 'number' && !Number.isNaN(value),
  est_texte: (value: any) => typeof value === 'string',
  est_vrai: (value: any) => Boolean(value),
  est_tableau: (value: any) => Array.isArray(value),
  pause: async (ms: number) => new Promise((res) => setTimeout(res, ms)),
};

export const INI_STD_LIB_KEYS = Object.keys(INI_STD_LIB) as (keyof typeof INI_STD_LIB)[];
