# Structures de Contrôle Conditionnelles

Les structures conditionnelles permettent à votre programme de **prendre des décisions** et d'exécuter différents blocs d'instructions en fonction du résultat de tests logiques.

---

## 🔀 La Condition `si ... alors ... sinon`

La structure fondamentale est le bloc `si ... alors ... finsi`.

### Syntaxe de Base

```inicode
soit note: réel = 14

si note superieur_ou_egal_a 10 alors
    affiche "Examen réussi !"
finsi
```

### Structure Complète avec `sinonsi` et `sinon`

```inicode
soit moyenne: réel = 15.5

si moyenne superieur_ou_egal_a 16 alors
    affiche "Mention Très Bien"
sinonsi moyenne superieur_ou_egal_a 14 alors
    affiche "Mention Bien"
sinonsi moyenne superieur_ou_egal_a 12 alors
    affiche "Mention Assez Bien"
sinonsi moyenne superieur_ou_egal_a 10 alors
    affiche "Admis"
sinon
    affiche "Ajourné"
finsi
```

---

## 🔀 La Structure de Sélection `selon ... cas ... defaut`

Quand une variable peut prendre plusieurs valeurs possibles, la structure `selon` est la plus claire.

### Syntaxe

```inicode
selon note
    cas 1
        affiche "Très faible"
    cas 2
        affiche "Faible"
    cas 3
        affiche "Moyen"
    defaut
        affiche "Autre cas"
finselon
```

### Exemple pratique

```inicode
soit niveau = 2

selon niveau
    cas 1
        affiche "Débutant"
    cas 2
        affiche "Intermédiaire"
    cas 3
        affiche "Avancé"
    defaut
        affiche "Niveau inconnu"
finselon
```

---

## ⚖️ Opérateurs de Comparaison

IniCode privilégie les opérateurs compacts en un seul mot :

| Comparateur           | Équivalent Symbolique | Exemple IniCode                            |
| :-------------------- | :-------------------: | :----------------------------------------- |
| `egal_a`              |         `==`          | `si x egal_a 10 alors`                     |
| `different_de`        |         `!=`          | `si nom different_de "" alors`             |
| `superieur_a`         |          `>`          | `si score superieur_a 100 alors`           |
| `inferieur_a`         |          `<`          | `si temp inferieur_a 0 alors`              |
| `superieur_ou_egal_a` |         `>=`          | `si age superieur_ou_egal_a 18 alors`      |
| `inferieur_ou_egal_a` |         `<=`          | `si prix inferieur_ou_egal_a budget alors` |

_Note : Les symboles classiques (`==`, `!=`, `>`, `<`, `>=`, `<=`) restent également valides pour assurer une transition vers d'autres langages._

---

## 🧩 Opérateurs Logiques : `et`, `ou`, `non`

Pour combiner plusieurs conditions :

- **`et`** : Vrai si **toutes** les conditions associées sont vraies.
- **`ou`** : Vrai si **au moins une** des conditions est vraie.
- **`non`** : Inverse la valeur logique d'une condition.

### Exemple Combiné

```inicode
soit age: entier = 22
soit aPermis: booleen = vrai

si age superieur_ou_egal_a 18 et aPermis egal_a vrai alors
    affiche("Accès autorisé à la location de véhicule.")
sinon
    affiche("Conditions non remplies.")
finsi
```
