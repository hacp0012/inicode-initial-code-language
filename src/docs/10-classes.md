# Classes et Objets

IniCode supporte la programmation orientée objet avec une syntaxe inspirée du français et de la lisibilité pédagogique. Les classes permettent de modéliser des objets avec des propriétés, un constructeur et des méthodes.

---

## 1. Syntaxe de base

```inicode
classe Personne
    proprietes
        nom: texte
        age: entier
    finproprietes

    constructeur(nom: texte, age: entier)
        soit this.nom = nom
        soit this.age = age
    finconstructeur

    fonction saluer(): texte
        retourner "Bonjour, je m'appelle " + this.nom
    finfonction
finclasse
```

### Signification

- `classe` commence une définition de classe.
- `proprietes` déclare les attributs de l'objet.
- `constructeur(...)` initialise l'instance.
- `fonction ...` définit une méthode.
- `finclasse` termine la déclaration.

---

## 2. Instanciation

```inicode
soit p = nouveau Personne("Ada", 20)
affiche p.saluer()
```

Le mot-clé `nouveau` crée une instance de la classe, puis on peut accéder aux méthodes et aux propriétés avec le point (`.`).

---

## 3. Accès aux propriétés et méthodes

```inicode
affiche p.nom
affiche p.age
p.age = 21
affiche p.saluer()
```

### Equivalent JavaScript / TypeScript

```ts
class Personne {
  nom: string;
  age: number;

  constructor(nom: string, age: number) {
    this.nom = nom;
    this.age = age;
  }

  saluer(): string {
    return `Bonjour, je m'appelle ${this.nom}`;
  }
}

const p = new Personne("Ada", 20);
console.log(p.saluer());
```

---

## 4. Exemple complet

```inicode
classe Compte
    proprietes
        solde: entier
    finproprietes

    constructeur(soldeInitial: entier)
        soit this.solde = soldeInitial
    finconstructeur

    fonction deposer(montant: entier): entier
        soit this.solde = this.solde + montant
        retourner this.solde
    finfonction
finclasse

soit compte = nouveau Compte(100)
affiche compte.deposer(50)
```

➡️ Ici, la classe `Compte` encapsule l'état (`solde`) et expose une méthode `deposer` pour modifier cet état en sécurité.

### Exemple concret : un objet `Voiture`

```inicode
classe Voiture
    proprietes
        marque: texte
        vitesse: entier
    finproprietes

    constructeur(marque: texte)
        soit this.marque = marque
        soit this.vitesse = 0
    finconstructeur

    fonction accelerer(): entier
        soit this.vitesse = this.vitesse + 10
        retourner this.vitesse
    finfonction
finclasse

soit maVoiture = nouveau Voiture("Renault")
affiche maVoiture.accelerer()
affiche maVoiture.marque
```

➡️ Ce programme crée une voiture, accélère sa vitesse puis affiche sa marque et sa valeur actuelle.

---

## 5. Bonnes pratiques

- Utilisez une classe pour représenter un concept précis : `Personne`, `Compte`, `Voiture`, `Carte`.
- Gardez les propriétés centrées sur l'état de l'objet.
- Placez les comportements dans des méthodes.
- Préférez des noms explicites.

---

## 6. Quand utiliser une classe ?

Une classe est utile quand vous avez plusieurs objets liés au même modèle et que vous souhaitez :

- stocker des données structurées,
- partager un comportement commun,
- créer plusieurs instances différentes à partir du même plan.

Pour des tâches très simples, une variable ou une fonction suffit. Pour des objets plus structurés, la classe est le bon outil.
