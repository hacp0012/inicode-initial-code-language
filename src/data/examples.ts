import ex1 from '../examples/01_saisie_affichage.ic?raw';
import ex2 from '../examples/02_conditions_mentions.ic?raw';
import ex3 from '../examples/03_boucle_pour.ic?raw';
import ex4 from '../examples/04_nombre_mystere.ic?raw';
import ex5 from '../examples/05_tableaux_statistiques.ic?raw';
import ex6 from '../examples/06_fonctions_factorielle.ic?raw';
import ex7 from '../examples/07_selecteur_note.ic?raw';
import ex8 from '../examples/08_classes_compte.ic?raw';

export interface AlgorithmExample {
  id: string;
  title: string;
  description: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  code: string;
}

export const ALGORITHM_EXAMPLES: AlgorithmExample[] = [
  {
    id: 'hello-world',
    title: '1. Saisie et Affichage',
    description: 'Découverte des déclarations de variables et des entrées/sorties.',
    difficulty: 'Débutant',
    code: ex1,
  },
  {
    id: 'condition-mention',
    title: '2. Conditions & Mentions',
    description: 'Structure conditionnelle si / sinonsi / sinon.',
    difficulty: 'Débutant',
    code: ex2,
  },
  {
    id: 'boucle-pour-somme',
    title: '3. Boucle Pour (Somme & Table de 7)',
    description: 'Répétition avec un compteur fixe.',
    difficulty: 'Débutant',
    code: ex3,
  },
  {
    id: 'boucle-tant-que',
    title: '4. Boucle Tantque (Nombre Mystère)',
    description: 'Répétition sous condition logique dynamique.',
    difficulty: 'Intermédiaire',
    code: ex4,
  },
  {
    id: 'tableaux-statistiques',
    title: '5. Tableaux & Recherche',
    description: 'Parcours de liste, calcul de moyenne et recherche du maximum.',
    difficulty: 'Intermédiaire',
    code: ex5,
  },
  {
    id: 'fonctions-factorielle',
    title: '6. Fonctions & Recursivité',
    description: 'Définition et appel de fonctions réutilisables.',
    difficulty: 'Avancé',
    code: ex6,
  },
  {
    id: 'selecteur-note',
    title: '7. Sélection par Cas',
    description: 'Utilisation des structures selon / cas / defaut pour choisir un bloc.',
    difficulty: 'Intermédiaire',
    code: ex7,
  },
  {
    id: 'classes-compte',
    title: '8. Classes & Cas d’usage',
    description: 'Modélisation d’un objet avec propriétés, constructeur et méthode.',
    difficulty: 'Avancé',
    code: ex8,
  },
];
