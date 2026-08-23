# Bibliothèque Standard (StdLib) & Utilitaires

La bibliothèque standard d'IniCode fournit un ensemble complet de modules, classes utilitaires et fonctions d'aide pour manipuler les nombres, les chaînes, les tableaux, le temps, ainsi que la possibilité d'exécuter du JavaScript natif.

---

## 1. Modules et Classes Utilitaires

### 📐 Classe `Math` (ou `Maths`)
Fournit les constantes et opérations mathématiques courantes :

| Méthode / Constante | Description | Exemple |
| :--- | :--- | :--- |
| `Math.PI` / `Math.E` | Constantes $\pi$ et $e$ | `soit pi = Math.PI` |
| `Math.racine(x)` | Racine carrée | `Math.racine(25)` *(donne 5)* |
| `Math.arrondi(x, dec?)` | Arrondi avec décimales optionnelles | `Math.arrondi(3.14159, 2)` *(donne 3.14)* |
| `Math.sol(x)` / `Math.plancher(x)` | Arrondi vers le bas (floor) | `Math.sol(4.9)` *(donne 4)* |
| `Math.plafond(x)` | Arrondi vers le haut (ceil) | `Math.plafond(4.1)` *(donne 5)* |
| `Math.abs(x)` | Valeur absolue | `Math.abs(-15)` *(donne 15)* |
| `Math.max(a, b, ...)` | Valeur maximale | `Math.max(10, 25, 3)` *(donne 25)* |
| `Math.min(a, b, ...)` | Valeur minimale | `Math.min(10, 25, 3)` *(donne 3)* |
| `Math.puissance(base, exp)` | Élévation à la puissance | `Math.puissance(2, 3)` *(donne 8)* |
| `Math.aleatoire(min, max)` | Entier aléatoire entre min et max | `Math.aleatoire(1, 6)` |
| `Math.sin(x)`, `cos(x)`, `tan(x)` | Trigonométrie (en radians) | `Math.cos(0)` *(donne 1)* |
| `Math.log(x)`, `exp(x)` | Logarithme et exponentielle | `Math.log(Math.E)` *(donne 1)* |

---

### 📝 Classe `Texte` (ou `String`)
Utilitaires complets pour le traitement des chaînes de caractères :

| Méthode | Description | Exemple |
| :--- | :--- | :--- |
| `Texte.longueur(s)` | Longueur d'une chaîne | `Texte.longueur("IniCode")` *(donne 7)* |
| `Texte.majuscule(s)` | Convertit en majuscules | `Texte.majuscule("bonjour")` |
| `Texte.minuscule(s)` | Convertit en minuscules | `Texte.minuscule("SALUT")` |
| `Texte.contient(s, sous)` | Vérifie la présence d'une sous-chaîne | `Texte.contient("bonjour", "jour")` *(vrai)* |
| `Texte.remplacer(s, a, b)` | Remplace la 1ère occurrence | `Texte.remplacer("pomme", "m", "p")` |
| `Texte.remplacerTout(s, a, b)`| Remplace toutes les occurrences | `Texte.remplacerTout("pomme", "m", "p")` |
| `Texte.decouper(s, sep)` | Découpe un texte en tableau | `Texte.decouper("un,deux,trois", ",")` |
| `Texte.sousTexte(s, deb, fin)` | Extrait une portion de texte | `Texte.sousTexte("IniCode", 0, 3)` *(Ini)* |
| `Texte.nettoyer(s)` | Supprime les espaces superflus (trim) | `Texte.nettoyer("  salut  ")` |
| `Texte.commencePar(s, pref)`| Teste le préfixe | `Texte.commencePar("IniCode", "Ini")` *(vrai)* |
| `Texte.finitPar(s, suff)` | Teste le suffixe | `Texte.finitPar("fichier.ic", ".ic")` *(vrai)* |
| `Texte.inverser(s)` | Inverse les caractères | `Texte.inverser("abc")` *(cba)* |

---

### 📊 Classe `Tableau` (ou `Array`)
Gestion simplifiée des tableaux et listes :

| Méthode | Description | Exemple |
| :--- | :--- | :--- |
| `Tableau.longueur(t)` | Nombre d'éléments | `Tableau.longueur([1, 2, 3])` *(3)* |
| `Tableau.ajouter(t, elem)` | Ajoute un élément à la fin | `Tableau.ajouter(t, 4)` |
| `Tableau.retirer(t)` | Retire le dernier élément | `Tableau.retirer(t)` |
| `Tableau.contient(t, elem)` | Teste la présence d'un élément | `Tableau.contient(t, "pomme")` |
| `Tableau.trier(t)` | Trie les éléments en ordre croissant | `Tableau.trier(t)` |
| `Tableau.inverser(t)` | Inverse l'ordre des éléments | `Tableau.inverser(t)` |
| `Tableau.joindre(t, sep)` | Fusionne en texte | `Tableau.joindre(["a", "b"], " - ")` |
| `Tableau.somme(t)` | Calcule la somme des nombres | `Tableau.somme([10, 20, 30])` *(60)* |
| `Tableau.moyenne(t)` | Calcule la moyenne | `Tableau.moyenne([10, 20])` *(15)* |
| `Tableau.max(t)` / `min(t)` | Plus grand ou plus petit élément | `Tableau.max([4, 9, 2])` *(9)* |

---

### ⏰ Classe `DateHeure` (ou `DateTime`)
Gestion des dates et du temps :

| Méthode | Description | Exemple |
| :--- | :--- | :--- |
| `DateHeure.maintenant()` | Date et heure actuelles | `DateHeure.maintenant()` |
| `DateHeure.aujourdhui()` | Date du jour au format `YYYY-MM-DD` | `DateHeure.aujourdhui()` |
| `DateHeure.annee()`, `mois()`, `jour()` | Composantes de date | `DateHeure.annee()` *(2026)* |
| `DateHeure.heure()`, `minute()`, `seconde()` | Composantes de temps | `DateHeure.heure()` |
| `DateHeure.timestamp()` | Horodatage Unix en millisecondes | `DateHeure.timestamp()` |
| `DateHeure.formater(d, "date")` | Formatage en texte français | `DateHeure.formater(d, "date")` |

---

## 2. Strings, Interpolation et Concaténation

IniCode supporte 3 façons d'assembler des chaînes de caractères :

```inicode
soit nom = "Ada"
soit age = 25

// 1. Template strings avec backticks
soit msg1 = `Bienvenue ${nom}, tu as ${age} ans !`

// 2. Interpolation automatique $variable
soit msg2 = "Bonjour $nom, dans 5 ans tu auras ${age + 5} ans."

// 3. Concaténation classique avec l'opérateur +
soit msg3 = "Bienvenue " + nom + " (" + age + " ans)"

affiche msg1, msg2, msg3
```

---

## 3. Évaluation JavaScript Directe (`eval`, `js`, `JS`)

Pour exécuter du code JavaScript arbitraire ou exploiter les APIs du navigateur / Node :

```inicode
// Exécution d'expressions JavaScript
soit resultat = js("Math.hypot(3, 4)")
affiche "Hypoténuse :", resultat

// Évaluation dynamique
soit cal = eval("10 * 10 + 5")
affiche "Calcul JS :", cal
```
