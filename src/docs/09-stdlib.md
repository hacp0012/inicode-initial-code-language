# Bibliothèque Standard (StdLib)

La bibliothèque standard de base d'IniCode fournit des fonctions utiles pour l'apprentissage et la manipulation simple des données.

---

## 1. Fonctions disponibles

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

---

## 2. Exemple d'utilisation

```inicode
soit nombre = aleatoire(1, 100)
affiche "Nombre tiré au sort : ", nombre

soit mot = "bonjour"
affiche longueur(mot)
```

### Exemple avec plusieurs fonctions

```inicode
soit valeur = -12.8
soit arr = arrondi(valeur)
soit taille = longueur("IniCode")

affiche "Arrondi : ", arr
affiche "Taille : ", taille
```

---

## 3. Quand utiliser la StdLib ?

La StdLib est utile pour :

- générer des nombres aléatoires,
- convertir des valeurs,
- travailler sur du texte,
- calculer rapidement des résultats mathématiques simples.

Exemple :

```inicode
soit score = aleatoire(0, 100)
soit note = max(0, min(score, 20))

affiche "Score final : ", note
```

---

## 4. Règle de cohérence

La stdlib est documentée séparément pour rester claire et lisible, mais elle suit la même convention syntaxique que le reste du langage :

- noms de fonctions en minuscule,
- appels avec parenthèses,
- syntaxe française et pédagogique,
- compatibilité avec les usages historiques quand nécessaire.

Cette séparation permet de mieux distinguer les règles du langage et les fonctions de base disponibles.
