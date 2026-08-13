# Structures Répétitives (Boucles)

Les boucles permettent d'exécuter un ensemble d'instructions **plusieurs fois d'affilée** sans avoir à dupliquer le code. IniCode offre les deux types fondamentaux de boucles : la boucle itérative (`pour`) et la boucle conditionnelle (`tantque`).

---

## 🔁 1. La Boucle Itérative : `pour ... de ... à`

Utilisez la boucle `pour` lorsque vous **connaissez à l'avance** le nombre d'itérations à effectuer.

### Syntaxe Générale

```inicode
pour variable de début à fin pas pas_increment faire
    // Instructions à répéter
finpour
```

_(Si le `pas` n'est pas spécifié, il vaut `1` par défaut)._

### Exemple : Table de Multiplication de 7

```inicode
affiche("--- Table de Multiplication de 7 ---")

pour i de 1 à 10 pas 1 faire
    soit resultat: entier = 7 * i
    affiche("7 x " + i + " = " + resultat)
finpour
```

---

## ⏳ 2. La Boucle Conditionnelle : `tantque`

Utilisez la boucle `tantque` lorsque le nombre d'itérations dépend d'une **condition dynamique** qui évolue pendant l'exécution.

### Syntaxe Générale

```inicode
tantque condition faire
    // Instructions à répéter
    // (Pensez à faire évoluer la condition pour éviter une boucle infinie !)
fintantque
```

### Exemple : Saisie Sécurisée d'une Valeur Positive

```inicode
soit valeur: entier = -1

tantque valeur inferieur_a 0 faire
    valeur = demander("Veuillez saisir un nombre positif ou nul :")
fintantque

affiche("Merci ! Valeur valide reçue : " + valeur)
```

---

## 💡 Algorithme Classique : Somme des N premiers Entiers

```inicode
soit N: entier = 5
soit somme: entier = 0

pour i de 1 à N faire
    somme = somme + i
finpour

affiche("La somme des entiers de 1 à " + N + " vaut : " + somme)
// Résultat : 1 + 2 + 3 + 4 + 5 = 15
```
