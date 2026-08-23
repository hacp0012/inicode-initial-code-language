import test from 'node:test';
import assert from 'node:assert/strict';

import { Lexer } from './lexer';
import { Parser } from './parser';
import { TokenType } from './types';
import { INI_STD_LIB } from './stdlib';
import { CodeGenerator } from './generator';

test('supports importer/exporter syntax and stdlib base functions', () => {
    const code = `importer "maths.ic"
exporter score
soit total = aleatoire(1, 10)
affiche longueur("bonjour")
`;

    const { tokens, errors } = new Lexer(code).tokenize();
    assert.equal(errors.length, 0, 'Le lexer ne doit pas signaler d’erreur sur la syntaxe module/stdlib');
    assert.ok(tokens.some((token) => token.type === TokenType.IMPORTER), 'Le mot-clé importer doit être reconnu');
    assert.ok(tokens.some((token) => token.type === TokenType.EXPORTER), 'Le mot-clé exporter doit être reconnu');

    const { ast, errors: parseErrors } = new Parser(tokens).parse();
    assert.equal(parseErrors.length, 0, 'Le parseur ne doit pas signaler d’erreur sur les modules');
    assert.equal(ast.body.length >= 3, true, 'Le programme doit contenir les instructions interprétées');

    assert.ok(INI_STD_LIB.aleatoire, 'La stdlib expose aleatoire');
    assert.ok(INI_STD_LIB.longueur, 'La stdlib expose longueur');
});

test('awaits async function calls inside expressions', () => {
    const code = `fonction factorielle(n: entier): entier
    si n inferieur_ou_egal_a 1 alors
        retourner 1
    sinon
        retourner n * factorielle(n - 1)
    finsi
finfonction

affiche "Factorielle de 5 : " + factorielle(5)`;

    const { tokens, errors } = new Lexer(code).tokenize();
    assert.equal(errors.length, 0, 'Le lexer ne doit pas signaler d’erreur');

    const { ast, errors: parseErrors } = new Parser(tokens).parse();
    assert.equal(parseErrors.length, 0, 'Le parseur ne doit pas signaler d’erreur');

    const generated = new CodeGenerator(ast).generate();
    assert.match(generated, /await factorielle\(\(n - 1\)\)/, 'Une fonction récursive doit être appelée avec await');
    assert.match(generated, /await __affiche__\(\("Factorielle de 5 : " \+ await factorielle\(5\)\)\)/, 'L’appel à factorielle dans une expression doit aussi être await');
    assert.doesNotMatch(generated, /__affiche__\(\("Factorielle de 5 : " \+ factorielle\(5\)\)\)/, 'L’expression ne doit pas contenir d’appel sans await');
});

test('supports optional parameters in function declarations', () => {
    const code = `fonction deposer(montant: entier, veleur: entier = 123): entier
    retourner montant + veleur
finfonction

affiche deposer(10)`;

    const { tokens, errors } = new Lexer(code).tokenize();
    assert.equal(errors.length, 0, 'Le lexer ne doit pas signaler d’erreur sur les paramètres optionnels');

    const { ast, errors: parseErrors } = new Parser(tokens).parse();
    assert.equal(parseErrors.length, 0, 'Le parseur doit accepter un paramètre optionnel avec valeur par défaut');

    const generated = new CodeGenerator(ast).generate();
    assert.match(generated, /async function deposer\(montant, veleur = 123\)/, 'Le générateur doit produire une valeur par défaut JS');
    assert.match(generated, /return \(montant \+ veleur\);/, 'Le corps de fonction doit rester correct');
});

test('parses a minimal class declaration and generates JS class syntax', () => {
    const code = `classe Personne
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

soit p = nouveau Personne("Ada", 20)
affiche p.saluer()`;

    const { tokens, errors } = new Lexer(code).tokenize();
    assert.equal(errors.length, 0, 'Le lexer ne doit pas signaler d’erreur sur la syntaxe de classe');

    const { ast, errors: parseErrors } = new Parser(tokens).parse();
    assert.equal(parseErrors.length, 0, 'Le parseur ne doit pas signaler d’erreur sur la déclaration de classe');
    assert.equal(ast.body.some((node) => node.type === 'ClassDecl'), true, 'Le AST doit contenir une déclaration de classe');

    const generated = new CodeGenerator(ast).generate();
    assert.match(generated, /class Personne\s*\{/, 'Le générateur doit produire une déclaration de classe JS');
    assert.match(generated, /constructor\(nom, age\)/, 'Le constructeur doit être généré');
    assert.match(generated, /this\.nom = nom/, 'L’assignation de propriété à this doit rester explicite');
    assert.match(generated, /this\.age = age/, 'L’assignation de propriété à this doit rester explicite');
    assert.match(generated, /new Personne\("Ada", 20\)/, 'L’instanciation doit être générée');
});

test('generates assignment when variable is declared before demander/lire', () => {
    const code = `soit ville: texte
demander ville "Dans quelle ville habitez-vous ?"
affiche ville`;

    const { tokens, errors } = new Lexer(code).tokenize();
    assert.equal(errors.length, 0, 'Le lexer ne doit pas signaler d’erreur');

    const { ast, errors: parseErrors } = new Parser(tokens).parse();
    assert.equal(parseErrors.length, 0, 'Le parseur ne doit pas signaler d’erreur');

    const generated = new CodeGenerator(ast).generate();
    assert.match(generated, /let ville = null;/, 'La variable doit être déclarée initialement');
    assert.match(generated, /ville = await __lire__\("Dans quelle ville habitez-vous \?"\);/, 'demander doit être une réassignation et non une redéclaration');
    assert.doesNotMatch(generated, /var ville = await __lire__/, 'Ne doit pas utiliser var ville pour éviter le conflit Identifier has already been declared');
});

test('supports template strings, $var interpolation and string concatenation', () => {
    const code = `soit nom = "IniCode"
soit version = 2
soit msg1 = \`Bienvenue sur \${nom} v\${version}\`
soit msg2 = "Nom : $nom, version : $version"
soit msg3 = "Hello " + nom + " !"
affiche msg1, msg2, msg3`;

    const { tokens, errors } = new Lexer(code).tokenize();
    assert.equal(errors.length, 0, 'Le lexer doit accepter les backticks et interpolations sans erreur');

    const { ast, errors: parseErrors } = new Parser(tokens).parse();
    assert.equal(parseErrors.length, 0, 'Le parseur doit parser les template strings sans erreur');

    const generated = new CodeGenerator(ast).generate();
    assert.match(generated, /let msg1 = `Bienvenue sur \${nom} v\${version}`;/, 'Génère un template literal JS pour les backticks');
    assert.match(generated, /let msg2 = `Nom : \${nom}, version : \${version}`;/, 'Génère un template literal JS pour l’interpolation $var');
    assert.match(generated, /let msg3 = \(\("Hello " \+ nom\) \+ " !"\);/, 'Génère une concaténation JS classique avec +');
});

test('supports standard library Math, Texte, Tableau, DateHeure and eval/js calls', () => {
    const code = `soit racine25 = Math.racine(25)
soit maj = Texte.majuscule("bonjour")
soit tab = [3, 1, 2]
Tableau.trier(tab)
soit d = DateHeure.aujourdhui()
soit cal = eval("5 * 5")
soit jsv = js("Math.hypot(3, 4)")
affiche racine25, maj, tab, d, cal, jsv`;

    const { tokens, errors } = new Lexer(code).tokenize();
    assert.equal(errors.length, 0, 'Le lexer ne doit pas signaler d’erreur sur les classes stdlib');

    const { ast, errors: parseErrors } = new Parser(tokens).parse();
    assert.equal(parseErrors.length, 0, 'Le parseur doit parser les appels de membres stdlib sans erreur');

    const generated = new CodeGenerator(ast).generate();
    assert.match(generated, /Math\.racine\(25\)/, 'Génère l’appel à Math.racine');
    assert.match(generated, /Texte\.majuscule\("bonjour"\)/, 'Génère l’appel à Texte.majuscule');
    assert.match(generated, /Tableau\.trier\(tab\)/, 'Génère l’appel à Tableau.trier');
    assert.match(generated, /DateHeure\.aujourdhui\(\)/, 'Génère l’appel à DateHeure.aujourdhui');
    assert.match(generated, /eval\("5 \* 5"\)/, 'Génère l’appel à eval');
    assert.match(generated, /js\("Math\.hypot\(3, 4\)"\)/, 'Génère l’appel à js');
});


