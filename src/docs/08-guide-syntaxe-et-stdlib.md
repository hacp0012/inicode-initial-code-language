# Guide de Syntaxe Canonique & StdLib

Ce guide résume la convention de syntaxe que IniCode privilégie dans l'éditeur, les exemples et la documentation. L'objectif est d'avoir une langue cohérente, lisible et stable pour les débutants.

---

## 1. Syntaxe canonique : les règles de base

### Déclaration de variable

```inicode
soit age = 12
soit score: entier = 0
soit nom: texte = "Ada"
```

- Le mot-clé canonique est `soit`.
- L'affectation se fait avec `=`.
- La forme `soit age = 12` est la forme de référence.
- Les variantes anciennes sont tolérées uniquement pour compatibilité, mais le standard documenté reste le plus court et le plus lisible.

### Constante

```inicode
constante PI = 3.14159
constante NOM = "IniCode"
```

### Affectation simple

```inicode
age = age + 1
score = score + 10
```

### Affichage

```inicode
affiche "Bonjour"
affiche score
affiche "Votre âge est : ", age
```

### Lecture de saisie

```inicode
lire age "Quel est votre âge ?"
```

---

## 2. Opérateurs de comparaison canonique

IniCode privilégie les opérateurs écrits en un seul mot :

```inicode
si age egal_a 18 alors
    affiche "Tu es majeur"
finsi

si note different_de 0 alors
    affiche "Note non nulle"
finsi

si score superieur_a 100 alors
    affiche "Score élevé"
finsi
```

### Tableau des comparateurs

| Canonique             | Symbole | Exemple                              |
| :-------------------- | :-----: | :----------------------------------- |
| `egal_a`              |  `==`   | `si x egal_a 10 alors`               |
| `different_de`        |  `!=`   | `si x different_de 0 alors`          |
| `superieur_a`         |   `>`   | `si x superieur_a 5 alors`           |
| `inferieur_a`         |   `<`   | `si x inferieur_a 10 alors`          |
| `superieur_ou_egal_a` |  `>=`   | `si x superieur_ou_egal_a 18 alors`  |
| `inferieur_ou_egal_a` |  `<=`   | `si x inferieur_ou_egal_a 100 alors` |

Les formes symboliques (`==`, `>`, `<`, etc.) restent également acceptées pour compatibilité.

---

## 3. Structures de contrôle

### Condition

```inicode
si age superieur_ou_egal_a 18 alors
    affiche "Majeur"
sinon
    affiche "Mineur"
finsi
```

### Sélection

```inicode
selon note
    cas 1
        affiche "Très faible"
    cas 2
        affiche "Faible"
    defaut
        affiche "Autre cas"
finselon
```

### Boucle pour

```inicode
pour i de 1 à 10 faire
    affiche i
finpour
```

### Boucle tant que

```inicode
tantque score inferieur_a 100 faire
    score = score + 10
fintantque
```

---

## 4. Fonctions et procédures

### Fonction

```inicode
fonction carre(x: entier): entier
    retourner x * x
finfonction
```

### Procédure

```inicode
procedure afficherBonjour()
    affiche "Bonjour"
finprocedure
```

---

## 5. Modules et fichiers `.ic`

IniCode sait gérer des fichiers de code distincts et les échanges entre modules :

```inicode
importer "maths.ic"
exporter score
```

- `importer` charge un autre fichier `.ic`.
- `exporter` expose un symbole pour un module ou un autre fichier.
- Cette convention est utilisée dans les exemples, l’IDE et la documentation afin de rester uniforme.

---

## 6. StdLib de base

La bibliothèque standard de base d'IniCode fournit des fonctions utiles pour l'apprentissage et la manipulation simple des données.

### Fonctions disponibles

| Fonction                    | Description                                 | Exemple               |
| :-------------------------- | :------------------------------------------ | :-------------------- |
| `aleatoire(min, max)`       | Génère un entier aléatoire entre min et max | `aleatoire(1, 10)`    |
| `longueur(valeur)`          | Renvoie la longueur d'un texte              | `longueur("bonjour")` |
| `arrondi(valeur)`           | Arrondit une valeur numérique               | `arrondi(3.7)`        |
| `abs(valeur)`               | Valeur absolue                              | `abs(-12)`            |
| `max(...)`                  | Valeur maximale                             | `max(1, 5, 9)`        |
| `min(...)`                  | Valeur minimale                             | `min(1, 5, 9)`        |
| `puissance(base, exposant)` | Puissance                                   | `puissance(2, 3)`     |
| `entier(valeur)`            | Conversion en entier                        | `entier(3.9)`         |
| `texte(valeur)`             | Conversion en texte                         | `texte(123)`          |

### Exemple

```inicode
soit nombre = aleatoire(1, 100)
affiche "Nombre tiré au sort : ", nombre

soit mot = "bonjour"
affiche longueur(mot)
```

---

## 7. Exemples pédagogiques : comment lire la syntaxe

### Exemple 1 : décider entre plusieurs cas

```inicode
soit note = 15

selon note
    cas 1
        affiche "Très faible"
    cas 2
        affiche "Faible"
    cas 3
        affiche "Moyen"
    defaut
        affiche "Autre niveau"
finselon
```

➡️ Ici, le mot-clé `selon` annonce une sélection. Chaque `cas` représente une valeur possible. Le bloc `defaut` couvre les autres valeurs.

### Exemple 2 : répéter tant qu'une condition est vraie

```inicode
soit compteur = 0

tantque compteur inferieur_a 5 faire
    affiche compteur
    compteur = compteur + 1
fintantque
```

➡️ `tantque` signifie “répéter tant que”. La boucle s'arrête quand la condition devient fausse.

### Exemple 3 : utiliser la stdlib sans effort

```inicode
soit nombre = aleatoire(1, 100)
soit message = "bonjour"

affiche "Nombre : ", nombre
affiche "Longueur : ", longueur(message)
```

➡️ `aleatoire` donne un nombre aléatoire, `longueur` mesure la taille du texte.

---

## 8. FAQ : quand utiliser quoi ?

### Quand utiliser `soit` ?

Utilisez `soit` pour créer une variable qui peut changer au cours du programme.

```inicode
soit score = 0
score = score + 1
```

### Quand utiliser `constante` ?

Utilisez `constante` pour une valeur qui ne doit jamais changer.

```inicode
constante PI = 3.14159
```

### Quand utiliser `si` ?

Utilisez `si` pour prendre une décision.

```inicode
si age egal_a 18 alors
    affiche "Majeur"
finsi
```

### Quand utiliser `selon` ?

Utilisez `selon` quand vous avez plusieurs valeurs possibles et que vous voulez une branche par cas.

```inicode
selon niveau
    cas 1
        affiche "Débutant"
    cas 2
        affiche "Intermédiaire"
    defaut
        affiche "Autre"
finselon
```

### Quand utiliser `pour` ?

Utilisez `pour` quand vous connaissez le nombre de répétitions à l'avance.

```inicode
pour i de 1 à 5 faire
    affiche i
finpour
```

### Quand utiliser `tantque` ?

Utilisez `tantque` quand la répétition dépend d'une condition dynamique.

```inicode
tantque score inferieur_a 100 faire
    score = score + 10
fintantque
```

### Quand utiliser `fonction` ou `procedure` ?

- `fonction` pour calculer et renvoyer une valeur
- `procedure` pour faire une action sans renvoyer de résultat

```inicode
fonction carre(x: entier): entier
    retourner x * x
finfonction

procedure afficherBonjour()
    affiche "Bonjour"
finprocedure
```

---

## 9. Règle de cohérence documentaire

Pour éviter toute confusion :

- la syntaxe compacte en un seul mot est la forme canonique,
- les formes historique ou symbolique restent tolérées,
- l'IDE, les démonstrations et les docs sont alignés sur cette convention.

Cela permet aux élèves de lire une seule règle et de la retrouver partout.
