# Guide de l'IDE & Fonctionnalités Avancées

L'environnement de développement **IniCode** associe la puissance des éditeurs professionnels (comme VS Code) à des outils pédagogiques dédiés à l'apprentissage des algorithmes.

---

## ⌨️ 1. Éditeur Intelligent Monaco & Auto-complétion

L'éditeur d'IniCode est propulsé par la même technologie que Microsoft VS Code :
- **Suggestions Dynamiques (IntelliSense)** : Tapez `so` pour voir apparaître `soit`, tapez `po` pour insérer une structure de boucle `pour...de...à`.
- **Analyse des Variables en Temps Réel** : Vos propres fonctions et variables déclarées apparaissent dans le menu de suggestion au fil de la frappe.
- **Bulles d'Informations au Survol (Hover)** : Passez votre curseur sur un mot-clé ou une variable pour afficher sa documentation, sa définition et son type.

---

## 🔴 2. Linter & Soulignement d'Erreurs en Direct

Plus besoin d'attendre l'exécution pour découvrir des fautes de frappe ou des erreurs de syntaxe :
- L'analyseur linguistique vérifie le code à chaque modification.
- Si une erreur est détectée (mot-clé manquant, parenthèse non fermée), un **soulignement ondulé rouge** apparaît directement dans l'éditeur.
- En survolant la zone rouge, une info-bulle détaillée explique la nature de l'erreur et suggère une correction.

---

## 🐞 3. Débogueur Visuel Pas-à-Pas & Inspecteur Mémoire

Pour suivre le fil d'exécution de votre programme :
1. Cliquez sur le bouton **"Pas-à-Pas"** dans la barre d'outils.
2. L'éditeur surligne en couleur la ligne actuellement examinée.
3. Le panneau **"Inspecteur de Mémoire"** affiche la liste des variables déclarées avec leur nom, leur type et leur valeur actualisée en direct.
4. Cliquez sur **"Pas Suivant"** pour avancer d'une instruction.

---

## 💾 4. Raccourcis Clavier & Gestion de Fichiers

- **`Ctrl + S` / `Cmd + S`** : Intercepte la sauvegarde par défaut pour vous proposer un modal d'exportation du fichier `.ic` directement sur votre disque local.
- **Menu Contextuel à 3 points (`...`)** : Un clic droit sur un fichier dans l'explorateur (ou un clic sur les 3 petits points) ouvre le menu d'actions rapides (Exporter, Renommer, Supprimer).
- **Importation** : Glissez-déposez un fichier `.ic` dans l'explorateur ou cliquez sur le bouton d'importation pour ouvrir un algorithme enregistré précédemment.

---

## 📱 5. Utilisation PWA & Hors-Ligne

IniCode est une **Progressive Web App** complète :
- Vous pouvez l'installer sur votre ordinateur ou tablette comme une application native.
- L'ensemble du transpileur et de l'éditeur fonctionne **100% hors-ligne**, sans aucune connexion internet requise.
