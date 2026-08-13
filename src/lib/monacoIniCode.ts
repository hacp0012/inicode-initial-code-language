import type { Monaco } from '@monaco-editor/react';

export const INICODE_LANGUAGE_ID = 'inicode';

export function registerIniCodeLanguage(monaco: Monaco) {
  // Check if already registered
  const languages = monaco.languages.getLanguages();
  if (languages.some((lang: { id: string; }) => lang.id === INICODE_LANGUAGE_ID)) {
    return;
  }

  // Register language ID
  monaco.languages.register({
    id: INICODE_LANGUAGE_ID,
    extensions: ['.ic', '.inicode'],
    aliases: ['IniCode', 'inicode', 'pseudo-code'],
  });

  // Language configuration (brackets, comments, auto-surround)
  monaco.languages.setLanguageConfiguration(INICODE_LANGUAGE_ID, {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });

  // Define Monarch tokens syntax highlighter for IniCode pseudo-code
  monaco.languages.setMonarchTokensProvider(INICODE_LANGUAGE_ID, {
    defaultToken: 'invalid',
    tokenPostfix: '.ic',

    keywords: [
      'soit',
      'var',
      'variable',
      'constante',
      'const',
      'si',
      'alors',
      'sinon',
      'sinonsi',
      'finsi',
      'selon',
      'cas',
      'defaut',
      'finselon',
      'pour',
      'de',
      'à',
      'a',
      'pas',
      'faire',
      'finpour',
      'tantque',
      'fintantque',
      'fonction',
      'procedure',
      'classe',
      'finclasse',
      'proprietes',
      'finproprietes',
      'constructeur',
      'finconstructeur',
      'nouveau',
      'this',
      'ceci',
      'importer',
      'exporter',
      'finprocedure',
      'finfonction',
      'retourner',
      'renvoyer',
      'affiche',
      'afficher',
      'ecrire',
      'écrire',
      'lire',
      'demander',
      'saisir',
    ],

    typeKeywords: [
      'entier',
      'réel',
      'reel',
      'nombre',
      'texte',
      'chaine',
      'chaîne',
      'booleen',
      'booléen',
      'tableau',
      'void',
      'vide',
      'tout',
      'any',
      'number',
      'string',
      'boolean',
    ],

    operators: [
      '=',
      '+',
      '-',
      '*',
      '/',
      '%',
      '==',
      '!=',
      '>',
      '<',
      '>=',
      '<=',
      '&&',
      '||',
      '!',
    ],

    booleans: ['vrai', 'faux', 'true', 'false'],
    constants: ['null', 'nil'],

    symbols: /[=><!~?:&|+\-*/^%]+/,

    // Tokenizer rules
    tokenizer: {
      root: [
        // Whitespace and comments first
        { include: '@whitespace' },

        // Identifiers and keywords
        [
          /[a-zA-Zà-ÿÀ-Ÿ_][a-zA-Z0-9à-ÿÀ-Ÿ_]*/,
          {
            cases: {
              'sinonsi': 'keyword',
              'finsi': 'keyword',
              'finpour': 'keyword',
              'tantque': 'keyword',
              'fintantque': 'keyword',
              'finfonction': 'keyword',
              '@typeKeywords': 'type.keyword',
              '@keywords': 'keyword',
              '@booleans': 'constant.boolean',
              '@constants': 'constant',
              '@default': 'identifier',
            },
          },
        ],

        // Multi-word french operators & keywords
        [/est\s+(?:egal|égal)(\s+(?:a|à))?/i, 'operator.french'],
        [/est\s+(?:superieur|supérieur)\s+ou\s+(?:egal|égal)\s+(?:a|à)/i, 'operator.french'],
        [/est\s+(?:inferieur|inférieur)\s+ou\s+(?:egal|égal)\s+(?:a|à)/i, 'operator.french'],
        [/est\s+(?:superieur|supérieur)(\s+(?:a|à))?/i, 'operator.french'],
        [/est\s+(?:inferieur|inférieur)(\s+(?:a|à))?/i, 'operator.french'],
        [/est\s+(?:different|différent)(\s+de)?/i, 'operator.french'],

        // Delimiters and operators
        [/[{}()[\]]/, '@brackets'],
        [
          /@symbols/,
          {
            cases: {
              '@operators': 'operator',
              '@default': '',
            },
          },
        ],

        // Numbers
        [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
        [/\d+/, 'number'],

        // Strings
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*/, 'comment'],
        [/#.*/, 'comment'],
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],
    },
  });

  // Define Auto-Complete / IntelliSense with Dynamic Symbol Scanning
  monaco.languages.registerCompletionItemProvider(INICODE_LANGUAGE_ID, {
    provideCompletionItems: (model: { getWordUntilPosition: (arg0: any) => any; getValue: () => any; }, position: { lineNumber: any; }) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const baseSuggestions: any[] = [
        // Keywords
        {
          label: 'soit',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'soit ${1:variable} = ${2:valeur}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Variable mutable**\n\nDéclare une variable réassignable.\n\n*Exemple:* `soit x = 10` ou `soit age: entier = 25`' },
          range,
        },
        {
          label: 'soit (typé)',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'soit ${1:nom}: ${2|entier,texte,booleen,réel,tableau|} = ${3:valeur}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Variable typée**\n\nDéclare une variable avec type explicite pour la transpilation TypeScript.' },
          range,
        },
        {
          label: 'constante',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'constante ${1:NOM} = ${2:valeur}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Constante immuable**\n\nDéclare une valeur constante immuable.' },
          range,
        },
        {
          label: 'affiche',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'affiche ${1:"Message :"}, ${2:valeur}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Afficher dans la console**\n\nAffiche un message ou des variables dans la console.' },
          range,
        },
        {
          label: 'demander',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'demander ${1:variable} "${2:Saisissez une valeur :}"',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Saisie utilisateur**\n\nPose une question à l\'utilisateur et enregistre sa réponse.' },
          range,
        },
        {
          label: 'lire',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'lire ${1:variable} "${2:Entrez une valeur :}"',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Saisie utilisateur**\n\nLit la saisie interactive de l\'utilisateur.' },
          range,
        },

        // Structures
        {
          label: 'si ... alors ... sinon',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'si ${1:condition} alors\n\t${2:// instructions}\nsinon\n\t${3:// instructions}\nfinsi',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Structure conditionnelle**\n\nExécute du code selon une condition.' },
          range,
        },
        {
          label: 'si ... alors',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'si ${1:condition} alors\n\t${2:// instructions}\nfinsi',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Condition simple**' },
          range,
        },
        {
          label: 'pour ... de ... à ... faire',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'pour ${1:i} de ${2:1} à ${3:10} faire\n\t${4:affiche i}\nfinpour',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Boucle d\'itération numérique**\n\nRépète des instructions avec un compteur.' },
          range,
        },
        {
          label: 'tantque ... faire',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'tantque ${1:condition} faire\n\t${2:// instructions}\nfintantque',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Boucle tantque**\n\nRépète le bloc tantque la condition reste vraie.' },
          range,
        },
        {
          label: 'selon ... cas ... defaut',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'selon ${1:valeur}\n\tcas ${2:1}\n\t\t${3:// instructions}\n\tdefaut\n\t\t${4:// instructions}\nfinselon',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Structure de sélection**\n\nExécute un bloc selon la valeur d’une expression.' },
          range,
        },
        {
          label: 'fonction ... finfonction',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'fonction ${1:nomFonction}(${2:param1}, ${3:param2})\n\t${4:// code}\n\tretourner ${5:resultat}\nfinfonction',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Déclaration de fonction**\n\nCrée une fonction réutilisable.' },
          range,
        },
        {
          label: 'procedure ... finprocedure',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'procedure ${1:nomProcedure}(${2:param1}, ${3:param2})\n\t${4:// code}\nfinprocedure',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Déclaration de procédure**\n\nCrée une procédure exécutable sans valeur de retour.' },
          range,
        },
        {
          label: 'classe ... finclasse',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'classe ${1:Personne}\n\tproprietes\n\t\t${2:nom}: ${3|entier,texte,booleen,réel|}\n\tfinproprietes\n\n\tconstructeur(${4:param}: ${5|entier,texte,booleen,réel|})\n\t\tsoit this.${2:nom} = ${4:param}\n\tfinconstructeur\n\n\tfonction ${6:saluer}(): ${7|texte,entier,booleen|}\n\t\tretourner ${8:valeur}\n\tfinfonction\nfinclasse',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Déclaration de classe**\n\nCrée un objet avec propriétés, constructeur et méthodes.' },
          range,
        },
        {
          label: 'constructeur',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'constructeur(${1:param}: ${2|entier,texte,booleen,réel|})\n\t${3:// initialisation}\n\tsoit this.${4:propriete} = ${1:param}\nfinconstructeur',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Constructeur de classe**\n\nInitialise les propriétés d’une instance au moment de sa création.' },
          range,
        },
        {
          label: 'nouveau',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'nouveau ${1:Personne}(${2:arguments})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Instanciation**\n\nCrée une instance d’une classe avec ses arguments de constructeur.' },
          range,
        },
        {
          label: 'importer',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'importer "${1:module.ic}"',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Import de module**\n\nCharge un fichier `.ic` dans le programme courant.' },
          range,
        },
        {
          label: 'exporter',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'exporter ${1:nom}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Export de symbole**\n\nExpose un nom pour un fichier module.' },
          range,
        },
        {
          label: 'fonction typée',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'fonction ${1:calcul}(${2:x}: entier): ${3:entier}\n\tretourner ${2:x} * 2\nfinfonction',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Fonction avec typage TypeScript**' },
          range,
        },
        {
          label: 'retourner',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'retourner ${1:valeur}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: { value: '**Renvoi de valeur**\n\nTermine l\'exécution de la fonction et renvoie un résultat.' },
          range,
        },

        // Types
        { label: 'entier', kind: monaco.languages.CompletionItemKind.TypeParameter, insertText: 'entier', documentation: { value: 'Type nombre entier' }, range },
        { label: 'réel', kind: monaco.languages.CompletionItemKind.TypeParameter, insertText: 'réel', documentation: { value: 'Type nombre décimal' }, range },
        { label: 'texte', kind: monaco.languages.CompletionItemKind.TypeParameter, insertText: 'texte', documentation: { value: 'Type chaîne de caractères' }, range },
        { label: 'booleen', kind: monaco.languages.CompletionItemKind.TypeParameter, insertText: 'booleen', documentation: { value: 'Type logique (vrai/faux)' }, range },
        { label: 'tableau', kind: monaco.languages.CompletionItemKind.TypeParameter, insertText: 'tableau', documentation: { value: 'Type liste/tableau' }, range },

        // Comparison Operators (preferred compact single-word syntax)
        { label: 'egal_a', kind: monaco.languages.CompletionItemKind.Operator, insertText: 'egal_a ', range },
        { label: 'equivalent_a', kind: monaco.languages.CompletionItemKind.Operator, insertText: 'equivalent_a ', range },
        { label: 'different_de', kind: monaco.languages.CompletionItemKind.Operator, insertText: 'different_de ', range },
        { label: 'superieur_a', kind: monaco.languages.CompletionItemKind.Operator, insertText: 'superieur_a ', range },
        { label: 'inferieur_a', kind: monaco.languages.CompletionItemKind.Operator, insertText: 'inferieur_a ', range },
        { label: 'superieur_ou_egal_a', kind: monaco.languages.CompletionItemKind.Operator, insertText: 'superieur_ou_egal_a ', range },
        { label: 'inferieur_ou_egal_a', kind: monaco.languages.CompletionItemKind.Operator, insertText: 'inferieur_ou_egal_a ', range },

        // Booleans
        { label: 'vrai', kind: monaco.languages.CompletionItemKind.Value, insertText: 'vrai', range },
        { label: 'faux', kind: monaco.languages.CompletionItemKind.Value, insertText: 'faux', range },
        { label: 'aleatoire', kind: monaco.languages.CompletionItemKind.Function, insertText: 'aleatoire(${1:min}, ${2:max})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: { value: 'Fonction de la stdlib : génère un nombre entier aléatoire.' }, range },
        { label: 'longueur', kind: monaco.languages.CompletionItemKind.Function, insertText: 'longueur(${1:valeur})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: { value: 'Fonction de la stdlib : retourne la longueur d’un texte.' }, range },
        { label: 'arrondi', kind: monaco.languages.CompletionItemKind.Function, insertText: 'arrondi(${1:valeur})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: { value: 'Fonction de la stdlib : arrondit une valeur numérique.' }, range },
      ];

      // Dynamic document symbol scanning for variables & functions
      const fullText = model.getValue();
      const dynamicSuggestions: any[] = [];
      const seenNames = new Set<string>();

      // Scan for variables: soit x, constante Y, demander Z, lire W, pour i
      const varRegex = /\b(?:soit|constante|demander|lire|pour)\s+([a-zA-Zà-ÿÀ-Ÿ_][a-zA-Z0-9à-ÿÀ-Ÿ_]*)/gi;
      let match: RegExpExecArray | null;
      while ((match = varRegex.exec(fullText)) !== null) {
        const varName = match[1];
        if (varName && !seenNames.has(varName) && varName !== word.word) {
          seenNames.add(varName);
          dynamicSuggestions.push({
            label: varName,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: varName,
            documentation: { value: `**Variable locale** \`${varName}\` détectée dans le document.` },
            range,
          });
        }
      }

      // Scan for functions: fonction nomFunc(...)
      const fnRegex = /\bfonction\s+([a-zA-Zà-ÿÀ-Ÿ_][a-zA-Z0-9à-ÿÀ-Ÿ_]*)\s*\(([^)]*)\)/gi;
      while ((match = fnRegex.exec(fullText)) !== null) {
        const fnName = match[1];
        const params = match[2] || '';
        if (fnName && !seenNames.has(fnName) && fnName !== word.word) {
          seenNames.add(fnName);
          dynamicSuggestions.push({
            label: fnName,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `${fnName}($1)`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: { value: `**Fonction du document** \`${fnName}(${params})\`` },
            range,
          });
        }
      }

      return { suggestions: [...baseSuggestions, ...dynamicSuggestions] };
    },
  });

  // Dictionary for Keyword & Type Tooltip Documentation
  const KEYWORD_HOVERS: Record<string, { title: string; desc: string; example?: string; equivalent?: string }> = {
    soit: {
      title: '📌 Mot-clé `soit` (Variable Mutable)',
      desc: 'Déclare une nouvelle variable réassignable dont la valeur peut changer.',
      equivalent: 'let score = 0; ou let age = 20;',
      example: 'soit score = 0\nsoit age: entier = 20',
    },
    constante: {
      title: '🔒 Mot-clé `constante` (Valeur Immuable)',
      desc: 'Déclare une constante dont la valeur ne peut pas être modifiée après initialisation.',
      equivalent: 'const PI = 3.14159;',
      example: 'constante PI = 3.14159',
    },
    affiche: {
      title: '📺 Instruction `affiche` (Sortie Console)',
      desc: 'Affiche un ou plusieurs messages, variables ou expressions dans la console.',
      equivalent: 'console.log(message, valeur);',
      example: 'affiche "Résultat = ", total',
    },
    demander: {
      title: '💬 Instruction `demander` (Saisie Utilisateur)',
      desc: 'Demande une saisie interactive à l\'utilisateur et la stocke dans une variable.',
      equivalent: 'const nom = prompt("Quel est votre nom ?");',
      example: 'demander nom "Quel est votre nom ?"',
    },
    lire: {
      title: '💬 Instruction `lire` (Saisie Utilisateur)',
      desc: 'Lit une valeur saisie par l\'utilisateur à l\'exécution.',
      equivalent: 'const age = Number(prompt("Indiquez votre âge :"));',
      example: 'lire age "Indiquez votre âge :"',
    },
    si: {
      title: '🔀 Bloc `si` (Conditionnelle)',
      desc: 'Exécute le bloc d\'instructions si la condition spécifiée est évaluée à `vrai`.',
      equivalent: 'if (condition) { ... }',
      example: 'si age superieur_ou_egal_a 18 alors\n    affiche "Majeur"\nfinsi',
    },
    alors: {
      title: 'Mot-clé `alors`',
      desc: 'Marque le début des instructions à exécuter si la condition du `si` est vraie.',
      equivalent: 'après la condition dans un if',
    },
    sinon: {
      title: 'Bloc `sinon`',
      desc: 'Exécute les instructions alternatives lorsque la condition du `si` est évaluée à `faux`.',
      equivalent: 'else { ... }',
    },
    sinonsi: {
      title: 'Bloc `sinonsi`',
      desc: 'Teste une condition secondaire si la condition précédente était fausse.',
      equivalent: 'else if (condition) { ... }',
    },
    finsi: {
      title: 'Clôture `finsi`',
      desc: 'Marque la fin de la structure conditionnelle `si`.',
      equivalent: 'fermeture du bloc if',
    },
    selon: {
      title: '🔀 Structure `selon`',
      desc: 'Exécute un bloc selon la valeur d’une expression et ses cas.',
      equivalent: 'switch (valeur) { case ... }',
      example: 'selon note\n  cas 1\n    affiche "Faible"\n  defaut\n    affiche "Autre"\nfinselon',
    },
    cas: {
      title: '📦 Cas `cas`',
      desc: 'Définit un cas à tester dans la structure `selon`.',
      equivalent: 'case valeur:',
    },
    defaut: {
      title: '🧩 Cas `defaut`',
      desc: 'Exécute le bloc par défaut quand aucun `cas` ne correspond.',
      equivalent: 'default:',
    },
    finselon: {
      title: 'Clôture `finselon`',
      desc: 'Marque la fin de la structure `selon`.',
      equivalent: 'fermeture du bloc switch',
    },
    pour: {
      title: '🔄 Boucle `pour` (Compteur)',
      desc: 'Répète un bloc d\'instructions en incrémentant automatiquement un compteur d\'une valeur de début à une valeur de fin.',
      equivalent: 'for (let i = 1; i <= 10; i++) { ... }',
      example: 'pour i de 1 à 10 faire\n    affiche i\nfinpour',
    },
    de: {
      title: 'Mot-clé `de`',
      desc: 'Définit la borne initiale du compteur dans la boucle `pour`.',
      equivalent: 'dans la partie initialisation du for',
    },
    à: {
      title: 'Mot-clé `à`',
      desc: 'Définit la borne finale du compteur dans la boucle `pour`.',
      equivalent: 'condition de fin du for',
    },
    a: {
      title: 'Mot-clé `à`',
      desc: 'Définit la borne finale du compteur dans la boucle `pour`.',
      equivalent: 'condition de fin du for',
    },
    pas: {
      title: 'Mot-clé `pas`',
      desc: 'Définit le pas d\'incrémentation du compteur dans la boucle `pour` (par défaut 1).',
      equivalent: 'i += 2 dans le for',
      example: 'pour i de 0 à 20 pas 2 faire\n    affiche i\nfinpour',
    },
    faire: {
      title: 'Mot-clé `faire`',
      desc: 'Indique le début du corps d\'exécution d\'une boucle (`pour` ou `tantque`).',
      equivalent: '{ ... } après la condition',
    },
    finpour: {
      title: 'Clôture `finpour`',
      desc: 'Marque la fin du bloc de la boucle `pour`.',
      equivalent: 'fermeture du bloc for',
    },
    tant: {
      title: '🔄 Boucle `tantque`',
      desc: 'Répète les instructions tantque la condition reste vérifiée.',
      equivalent: 'while (condition) { ... }',
    },
    que: {
      title: 'Mot-clé `que`',
      desc: 'Fait partie du mot-clé compact `tantque`.',
      equivalent: 'partie de while (condition)',
    },
    tantque: {
      title: '🔄 Boucle `tantque`',
      desc: 'Répète un bloc d\'instructions tant que la condition donnée s\'évalue à `vrai`.',
      equivalent: 'while (condition) { ... }',
      example: 'tantque x inferieur_a 100 faire\n    x = x * 2\nfintantque',
    },
    fintantque: {
      title: 'Clôture `fintantque`',
      desc: 'Marque la fin de la boucle `tantque`.',
      equivalent: 'fermeture du bloc while',
    },
    fonction: {
      title: '⚙️ Déclaration `fonction`',
      desc: 'Définit une fonction réutilisable prenant des paramètres et pouvant retourner une valeur.',
      equivalent: 'function nom(param) { ... }',
      example: 'fonction carre(n: entier): entier\n    retourner n * n\nfinfonction',
    },
    procedure: {
      title: '⚙️ Déclaration `procedure`',
      desc: 'Définit une procédure exécutable sans valeur de retour.',
      equivalent: 'function nom(param) { ... } sans return',
      example: 'procedure afficherMessage(txt)\n    affiche txt\nfinprocedure',
    },
    classe: {
      title: '🏗️ Déclaration `classe`',
      desc: 'Définit une classe contenant des propriétés, un constructeur et des méthodes.',
      equivalent: 'class Nom { constructor(...) { ... } }',
      example: 'classe Personne\n    proprietes\n        nom: texte\n    finproprietes\n\n    constructeur(nom: texte)\n        soit this.nom = nom\n    finconstructeur\nfinclasse',
    },
    finclasse: {
      title: 'Clôture `finclasse`',
      desc: 'Marque la fin de la déclaration de classe.',
      equivalent: 'fermeture du bloc class',
    },
    proprietes: {
      title: '🧩 Bloc `proprietes`',
      desc: 'Déclare les attributs d’une instance de classe.',
      equivalent: 'class fields / properties',
      example: 'proprietes\n    nom: texte\n    age: entier\nfinproprietes',
    },
    finproprietes: {
      title: 'Clôture `finproprietes`',
      desc: 'Marque la fin du bloc de propriétés d’une classe.',
      equivalent: 'finition des propriétés de la classe',
    },
    constructeur: {
      title: '🛠️ Constructeur `constructeur`',
      desc: 'Initialise l’instance créée par `nouveau` et configure ses propriétés.',
      equivalent: 'constructor(...) { ... }',
      example: 'constructeur(nom: texte)\n    soit this.nom = nom\nfinconstructeur',
    },
    finconstructeur: {
      title: 'Clôture `finconstructeur`',
      desc: 'Marque la fin du constructeur d’une classe.',
      equivalent: 'fermeture du constructor',
    },
    nouveau: {
      title: '✨ Instanciation `nouveau`',
      desc: 'Crée une nouvelle instance d’une classe.',
      equivalent: 'new Classe(...)',
      example: 'soit p = nouveau Personne("Ada", 20)',
    },
    this: {
      title: '🧭 Référence `this`',
      desc: 'Désigne l’instance courante de la classe dans une méthode ou un constructeur.',
      equivalent: 'this',
      example: 'soit this.nom = nom',
    },
    ceci: {
      title: '🧭 Référence `ceci`',
      desc: 'Alias pédagogique de `this` pour désigner l’instance courante.',
      equivalent: 'this',
      example: 'soit ceci.nom = nom',
    },
    finprocedure: {
      title: 'Clôture `finprocedure`',
      desc: 'Marque la fin de la définition de la procédure.',
      equivalent: 'fermeture du bloc function',
    },
    finfonction: {
      title: 'Clôture `finfonction`',
      desc: 'Marque la fin de la définition de la fonction.',
      equivalent: 'fermeture du bloc function',
    },
    retourner: {
      title: '↵ Instruction `retourner`',
      desc: 'Termine l\'exécution de la fonction et renvoie le résultat au code appelant.',
      equivalent: 'return valeur;',
    },
    renvoyer: {
      title: '↵ Instruction `renvoyer`',
      desc: 'Termine l\'exécution de la fonction et renvoie le résultat au code appelant.',
      equivalent: 'return valeur;',
    },
    entier: {
      title: '🔢 Type `entier` (Number)',
      desc: 'Représente un nombre entier (ex: `10`, `-5`, `0`). Transpilié en `number` en JS/TS.',
      equivalent: 'number',
    },
    réel: {
      title: '🔢 Type `réel` (Number float)',
      desc: 'Représente un nombre décimal à virgule (ex: `3.14`, `-0.5`). Transpilié en `number` en JS/TS.',
      equivalent: 'number',
    },
    reel: {
      title: '🔢 Type `réel` (Number float)',
      desc: 'Représente un nombre décimal à virgule (ex: `3.14`, `-0.5`). Transpilié en `number` en JS/TS.',
      equivalent: 'number',
    },
    texte: {
      title: '🔤 Type `texte` (String)',
      desc: 'Représente une chaîne de caractères entre guillemets. Transpilié en `string` en JS/TS.',
      equivalent: 'string',
    },
    booleen: {
      title: '☯️ Type `booleen` (Boolean)',
      desc: 'Représente une valeur logique (`vrai` ou `faux`). Transpilié en `boolean` en JS/TS.',
      equivalent: 'boolean',
    },
    booléen: {
      title: '☯️ Type `booleen` (Boolean)',
      desc: 'Représente une valeur logique (`vrai` ou `faux`). Transpilié en `boolean` en JS/TS.',
      equivalent: 'boolean',
    },
    tableau: {
      title: '📦 Type `tableau` (Array)',
      desc: 'Représente une liste d\'éléments indexés. Transpilié en `any[]` en JS/TS.',
      equivalent: 'Array<T> ou any[]',
    },
    egal_a: {
      title: '⚖️ Opérateur `egal_a`',
      desc: 'Compare deux valeurs pour l’égalité. Équivalent à `==`.',
      equivalent: '===',
      example: 'si x egal_a 10 alors\n    affiche "égal"\nfinsi',
    },
    equivalent_a: {
      title: '⚖️ Opérateur `equivalent_a`',
      desc: 'Compare deux valeurs pour l’égalité. Équivalent à `==`.',
      equivalent: '===',
      example: 'si x equivalent_a 10 alors\n    affiche "égal"\nfinsi',
    },
    different_de: {
      title: '⚖️ Opérateur `different_de`',
      desc: 'Compare deux valeurs pour la différence. Équivalent à `!=`.',
      equivalent: '!==',
      example: 'si x different_de 0 alors\n    affiche "différent"\nfinsi',
    },
    superieur_a: {
      title: '⚖️ Opérateur `superieur_a`',
      desc: 'Vérifie si une valeur est strictement supérieure à une autre. Équivalent à `>`.',
      equivalent: '>',
      example: 'si score superieur_a 100 alors\n    affiche "Bravo"\nfinsi',
    },
    inferieur_a: {
      title: '⚖️ Opérateur `inferieur_a`',
      desc: 'Vérifie si une valeur est strictement inférieure à une autre. Équivalent à `<`.',
      equivalent: '<',
      example: 'si age inferieur_a 18 alors\n    affiche "mineur"\nfinsi',
    },
    superieur_ou_egal_a: {
      title: '⚖️ Opérateur `superieur_ou_egal_a`',
      desc: 'Vérifie si une valeur est supérieure ou égale à une autre. Équivalent à `>=`.',
      equivalent: '>=',
      example: 'si score superieur_ou_egal_a 50 alors\n    affiche "qualifié"\nfinsi',
    },
    inferieur_ou_egal_a: {
      title: '⚖️ Opérateur `inferieur_ou_egal_a`',
      desc: 'Vérifie si une valeur est inférieure ou égale à une autre. Équivalent à `<=`.',
      equivalent: '<=',
      example: 'si age inferieur_ou_egal_a 18 alors\n    affiche "majeur"\nfinsi',
    },
    vrai: {
      title: '✅ Valeur `vrai`',
      desc: 'Littéral booléen équivalent à `true`.',
      equivalent: 'true',
    },
    faux: {
      title: '❌ Valeur `faux`',
      desc: 'Littéral booléen équivalent à `false`.',
      equivalent: 'false',
    },
  };

  // Register Hover Provider (Tooltips on cursor hover for keywords, types, and variables)
  monaco.languages.registerHoverProvider(INICODE_LANGUAGE_ID, {
    provideHover: (model: { getWordAtPosition: (arg0: { lineNumber: any; }) => any; getLineContent: (arg0: any) => any; getLinesContent: () => any; }, position: { lineNumber: any; }) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const hoveredWord = word.word;
      const lowerWord = hoveredWord.toLowerCase();
      const lineContent = model.getLineContent(position.lineNumber);

      const range = new monaco.Range(
        position.lineNumber,
        word.startColumn,
        position.lineNumber,
        word.endColumn
      );

      const matchedKeyword = lowerWord;

      // 1. Check if hovering over a recognized keyword or type
      if (KEYWORD_HOVERS[matchedKeyword]) {
        const info = KEYWORD_HOVERS[matchedKeyword];
        const markdown = [
          `### ${info.title}`,
          `${info.desc}`,
        ];
        if (info.equivalent) {
          markdown.push(`**Équivalent JS/TS :** \`${info.equivalent}\``);
        }
        if (info.example) {
          markdown.push(`\`\`\`inicode\n${info.example}\n\`\`\``);
        }
        return {
          range,
          contents: markdown.map((m) => ({ value: m })),
        };
      }

      // 2. Check if hovering over a French comparison operator line
      if (/est\s+(?:egal|égal|superieur|supérieur|inferieur|inférieur|different|différent)/i.test(lineContent)) {
        if (['est', 'egal', 'égal', 'superieur', 'supérieur', 'inferieur', 'inférieur', 'different', 'différent'].includes(lowerWord)) {
          return {
            range,
            contents: [
              { value: '### ⚖️ Opérateur de comparaison en français' },
              { value: 'Permet de comparer deux valeurs (`est egal a`, `est superieur a`, `est inferieur a`, `est different de`). Transpilié en `==`, `>`, `<`, `!=` en JavaScript.' },
            ],
          };
        }
      }

      // 3. Hover over User Variables & Functions (symbol resolution in document)
      const lines = model.getLinesContent();
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Match variable declaration: soit x: type = val OR constante X = val
        const varMatch = line.match(new RegExp(`\\b(soit|constante|demander|lire)\\s+(${hoveredWord})\\b(?::\\s*([a-zA-Zà-ÿÀ-Ÿ_]+))?`, 'i'));
        if (varMatch) {
          const kind = varMatch[1].toLowerCase() === 'constante' ? 'Constante' : 'Variable';
          const typeInfo = varMatch[3] ? `: ${varMatch[3]}` : '';
          return {
            range,
            contents: [
              { value: `### 📌 **(${kind} IniCode)** \`${hoveredWord}${typeInfo}\`` },
              { value: `Déclarée à la **ligne ${i + 1}** :\n\`\`\`inicode\n${line.trim()}\n\`\`\`` },
            ],
          };
        }

        // Match function declaration: fonction nom(params): type
        const fnMatch = line.match(new RegExp(`\\bfonction\\s+(${hoveredWord})\\s*\\(([^)]*)\\)(?::\\s*([a-zA-Zà-ÿÀ-Ÿ_]+))?`, 'i'));
        if (fnMatch) {
          const params = fnMatch[2] || '';
          const returnType = fnMatch[3] ? `: ${fnMatch[3]}` : '';
          return {
            range,
            contents: [
              { value: `### ⚙️ **(Fonction IniCode)** \`${hoveredWord}(${params})${returnType}\`` },
              { value: `Définie à la **ligne ${i + 1}** :\n\`\`\`inicode\n${line.trim()}\n\`\`\`` },
            ],
          };
        }
      }

      return null;
    },
  });

  // VS Code Dark+ & Monokai Pro Inspired Themes for IniCode
  monaco.editor.defineTheme('inicode-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'f92672', fontStyle: 'bold' }, // Monokai Pink / VS Code Purple
      { token: 'type.keyword', foreground: '66d9ef', fontStyle: 'italic' }, // Monokai Cyan Type
      { token: 'operator.french', foreground: 'fd971f', fontStyle: 'bold' }, // Monokai Warm Orange
      { token: 'string', foreground: 'a6e22e' }, // Monokai Fresh Green
      { token: 'number', foreground: 'ae81ff' }, // Monokai Soft Purple
      { token: 'number.float', foreground: 'ae81ff' },
      { token: 'comment', foreground: '75715e', fontStyle: 'italic' }, // Monokai Khaki Grey
      { token: 'constant.boolean', foreground: '66d9ef', fontStyle: 'bold' }, // Monokai Cyan
      { token: 'identifier', foreground: 'f8f8f2' },
      { token: 'operator', foreground: 'f92672' },
    ],
    colors: {
      'editor.background': '#1e1e24', // Comfortable VS Code / Monokai Charcoal Soft Dark (not pitch black)
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#2a2a32',
      'editorCursor.foreground': '#ea580c', // IniCode Orange
      'editorWhitespace.foreground': '#3a3a44',
      'editorIndentGuide.background1': '#2d2d38',
      'editorIndentGuide.activeBackground1': '#ea580c',
      'editorLineNumber.foreground': '#62626e',
      'editorLineNumber.activeForeground': '#fd971f',
    },
  });

  monaco.editor.defineTheme('inicode-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'c2410c', fontStyle: 'bold' }, // Deep Orange
      { token: 'type.keyword', foreground: '0284c7', fontStyle: 'italic' }, // Sky Blue
      { token: 'operator.french', foreground: 'd97706', fontStyle: 'bold' },
      { token: 'string', foreground: '15803d' }, // Forest Green
      { token: 'number', foreground: '0284c7' }, // Blue
      { token: 'number.float', foreground: '0284c7' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'constant.boolean', foreground: '7e22ce', fontStyle: 'bold' },
      { token: 'identifier', foreground: '0f172a' },
      { token: 'operator', foreground: '9a3412' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#0f172a',
      'editor.lineHighlightBackground': '#fff7ed',
      'editorCursor.foreground': '#c2410c',
      'editorWhitespace.foreground': '#e2e8f0',
      'editorIndentGuide.background1': '#f1f5f9',
      'editorIndentGuide.activeBackground1': '#ea580c',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#c2410c',
    },
  });
}
