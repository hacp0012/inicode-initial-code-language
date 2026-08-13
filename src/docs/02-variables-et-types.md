# Variables et Types de Données

En informatique, une **variable** est un emplacement mémoire nommé permettant de stocker une valeur modifiable au cours de l'exécution du programme. Une **constante** est un emplacement dont la valeur ne peut plus être modifiée après son initialisation.

---

## 📝 Déclaration de Variables et Constantes

### Déclaration d'une Variable avec `soit`
Pour déclarer une variable modifiable en IniCode, on utilise le mot-clé `soit` :

```inicode
soit compteur: entier = 0
soit message: texte = "Bonjour le monde"
soit estValide: booleen = vrai
```

### Déclaration d'une Constante avec `constante`
Pour fixer une valeur immuable, on utilise `constante` :

```inicode
constante PI: réel = 3.14159
constante SEUIL_REUSSITE: entier = 10
```

---

## 🎨 Les Types de Données Primitifs

IniCode supporte un typage explicite ou inféré :

| Type IniCode | Description | Exemple en IniCode | Équivalent TypeScript |
| :--- | :--- | :--- | :--- |
| **`entier`** | Nombres entiers positifs ou négatifs | `10`, `-5`, `0` | `number` |
| **`réel`** | Nombres à virgule flottante | `19.5`, `-0.01` | `number` |
| **`texte`** | Chaînes de caractères entoureés de guillemets | `"IniCode"` | `string` |
| **`booleen`** | Valeurs logiques bivalentes | `vrai`, `faux` | `boolean` |
| **`tableau`** | Collections d'éléments ordonnés | `[10, 20, 30]` | `any[]` |

---

## 📊 Manipulation des Tableaux

Les tableaux permettent d'emmagasiner plusieurs valeurs. L'indexation commence à **0** :

```inicode
soit notes: tableau = [12, 15, 18]

// Lecture du premier élément
affiche(notes[0]) // Affiche 12

// Modification d'un élément
notes[1] = 17
affiche(notes[1]) // Affiche 17
```

---

## 🔄 Recommandations Pédagogiques

1. **Donnez des noms explicites** : Préférez `soit moyenneEtudiant: réel` plutôt que `soit m: réel`.
2. **Initialisez toujours vos variables** lors de la déclaration pour éviter les comportements indéterminés.
3. **Respectez le typage** : Ne tentez pas d'affecter du texte à une variable de type `entier`.
