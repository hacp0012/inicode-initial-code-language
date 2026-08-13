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
