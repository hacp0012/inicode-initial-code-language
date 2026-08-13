# Fonctions et Procédures

Une **fonction** est un bloc de code autonome, nommé et réutilisable, conçu pour accomplir une tâche spécifique. Elle peut recevoir des données en entrée (**paramètres**) et retourner un résultat en sortie via la directive `retourner`.

---

## 🛠️ Déclaration d'une Fonction

### Syntaxe

```inicode
fonction nomDeLaFonction(param1: type, param2: type): type_de_retour
    // Corps de la fonction
    retourner valeur
finfonction
```

### Exemple 1 : Calcul de la Surface d'un Rectangle

```inicode
fonction calculerSurface(largeur: réel, hauteur: réel): réel
    soit surface: réel = largeur * hauteur
    retourner surface
finfonction

// Appel de la fonction
soit s: réel = calculerSurface(5.0, 3.5)
affiche("Surface calculée : " + s) // 17.5
```

---

## 📢 Procédures (Sans valeur de retour)

Si une fonction ne retourne aucune valeur, on utilise la structure `procedure` :

```inicode
procedure afficherEntete(titre: texte)
    affiche "=============================="
    affiche "   " + titre
    affiche "=============================="
finprocedure

afficherEntete("BIENVENUE SUR INICODE")
```

La procédure est très utile pour les actions de type "affichage", "saisie", "tri", "journalisation" ou "mise à jour d'un état" sans devoir renvoyer un résultat.

---

## 🌀 Fonctions Récursives

Une fonction est dite **récursive** lorsqu'elle s'appelle elle-même. Chaque appel doit vous rapprocher d'un **cas de base** (condition d'arrêt) pour éviter un débordement de pile.

### Exemple Canonique : La Factorielle ($N!$)

La factorielle d'un entier $N$ est le produit de tous les entiers de $1$ à $N$.
Par définition : $0! = 1$ et $N! = N \times (N-1)!$.

```inicode
fonction factorielle(n: entier): entier
    si n inferieur_ou_egal_a 1 alors
        retourner 1
    sinon
        retourner n * factorielle(n - 1)
    finsi
finfonction

affiche "Factorielle de 5 : " + factorielle(5)
```

---

## 🔒 Portée des Variables (Scope)

- **Variables Locales** : Déclarées à l'intérieur d'une fonction, elles n'existent que pendant l'exécution de celle-ci.
- **Variables Globales** : Déclarées en dehors de toute fonction, elles sont accessibles partout.

_Bonne pratique : Privilégiez l'utilisation de variables locales et de paramètres pour rendre vos fonctions totalement indépendantes._
