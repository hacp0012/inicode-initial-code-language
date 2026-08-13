import doc1 from '../../docs/01-introduction.md?raw';
import doc2 from '../../docs/02-variables-et-types.md?raw';
import doc3 from '../../docs/03-structures-de-controle.md?raw';
import doc4 from '../../docs/04-boucles.md?raw';
import doc5 from '../../docs/05-fonctions-et-procedures.md?raw';
import doc6 from '../../docs/06-transpilation-js-ts.md?raw';
import doc7 from '../../docs/07-guide-ide.md?raw';
import doc8 from '../../docs/08-guide-syntaxe.md?raw';
import doc8Legacy from '../../docs/08-guide-syntaxe-et-stdlib.md?raw';
import doc9 from '../../docs/09-stdlib.md?raw';
import doc10 from '../../docs/10-classes.md?raw';

export interface DocChapter {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: 'Bases' | 'Logique' | 'Avancé' | 'IDE';
}

export const DOC_CHAPTERS: DocChapter[] = [
  {
    id: '01',
    slug: 'introduction',
    title: 'Introduction & Philosophie',
    description: "Pourquoi l'algorithmique en Français et la vision d'IniCode.",
    content: doc1,
    category: 'Bases',
  },
  {
    id: '02',
    slug: 'variables-et-types',
    title: 'Variables et Types',
    description: 'Déclaration avec soit/constante, types primitifs et tableaux.',
    content: doc2,
    category: 'Bases',
  },
  {
    id: '03',
    slug: 'structures-de-controle',
    title: 'Structures Conditionnelles',
    description: 'si, sinonsi, sinon, comparateurs explicites et opérateurs logiques.',
    content: doc3,
    category: 'Logique',
  },
  {
    id: '04',
    slug: 'boucles',
    title: 'Boucles (pour, tantque)',
    description: 'Répétition itérative et conditionnelle d’instructions.',
    content: doc4,
    category: 'Logique',
  },
  {
    id: '05',
    slug: 'fonctions-et-procedures',
    title: 'Fonctions et Procédures',
    description: 'Modularité, paramètres, valeur de retour et récursivité.',
    content: doc5,
    category: 'Avancé',
  },
  {
    id: '06',
    slug: 'transpilation-js-ts',
    title: 'Transpilation JS & TS',
    description: 'Analyse lexicale, AST et génération de code professionnel.',
    content: doc6,
    category: 'Avancé',
  },
  {
    id: '07',
    slug: 'guide-ide',
    title: 'Guide de l’IDE & Outils',
    description: 'IntelliSense, linter, débogueur pas-à-pas, export Ctrl+S.',
    content: doc7,
    category: 'IDE',
  },
  {
    id: '08',
    slug: 'guide-syntaxe',
    title: 'Guide de Syntaxe Canonique',
    description: 'Conventions officielles et opérateurs compacts du langage.',
    content: doc8,
    category: 'Bases',
  },
  {
    id: '08-legacy',
    slug: 'guide-syntaxe-et-stdlib',
    title: 'Guide de Syntaxe Canonique & StdLib (archive)',
    description: 'Version historique du guide combiné, conservée pour référence.',
    content: doc8Legacy,
    category: 'Bases',
  },
  {
    id: '09',
    slug: 'stdlib',
    title: 'Bibliothèque Standard (StdLib)',
    description: 'Fonctions de base pour texte, mathématiques et conversion.',
    content: doc9,
    category: 'Bases',
  },
  {
    id: '10',
    slug: 'classes',
    title: 'Classes et Objets',
    description: 'Définition de classes, propriétés, constructeur et méthodes.',
    content: doc10,
    category: 'Avancé',
  },
];
