import { Token, TokenType, TranspilerError } from './types';

interface LexerRule {
  type: TokenType;
  pattern: RegExp;
  valueTransform?: (match: string) => string;
}

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(input: string) {
    this.input = input;
  }

  public tokenize(): { tokens: Token[]; errors: TranspilerError[] } {
    const tokens: Token[] = [];
    const errors: TranspilerError[] = [];

    while (this.position < this.input.length) {
      const char = this.input[this.position];

      // Gestion des espaces simples (sauf saut de ligne)
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
        continue;
      }

      // Saut de ligne
      if (char === '\n') {
        tokens.push({
          type: TokenType.NEWLINE,
          value: '\n',
          line: this.line,
          column: this.column,
          position: this.position,
        });
        this.line++;
        this.column = 1;
        this.position++;
        continue;
      }

      // Commentaires // ou #
      if (
        (char === '/' && this.input[this.position + 1] === '/') ||
        char === '#'
      ) {
        while (
          this.position < this.input.length &&
          this.input[this.position] !== '\n'
        ) {
          this.advance();
        }
        continue;
      }

      // Commentaires multi-lignes /* ... */
      if (char === '/' && this.input[this.position + 1] === '*') {
        const startLine = this.line;
        const startCol = this.column;
        this.advance();
        this.advance();
        while (this.position < this.input.length) {
          if (
            this.input[this.position] === '*' &&
            this.input[this.position + 1] === '/'
          ) {
            this.advance();
            this.advance();
            break;
          }
          if (this.input[this.position] === '\n') {
            this.line++;
            this.column = 1;
            this.position++;
          } else {
            this.advance();
          }
        }
        continue;
      }

      // Traitement des expressions multi-mots clés et opérateurs en français
      const slice = this.input.slice(this.position);

      // Mots clés structurels simplifiés
      if (/^sinonsi\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.SINON_SI, 'sinonsi', 7));
        continue;
      }
      if (/^finsi\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_SI, 'finsi', 5));
        continue;
      }
      if (/^finpour\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_POUR, 'finpour', 7));
        continue;
      }
      if (/^tantque\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.TANT_QUE, 'tantque', 7));
        continue;
      }
      if (/^fintantque\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_TANT_QUE, 'fintantque', 10));
        continue;
      }
      if (/^finselon\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_SELON, 'finselon', 8));
        continue;
      }
      if (/^selon\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.SELON, 'selon', 5));
        continue;
      }
      if (/^cas\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.CAS, 'cas', 3));
        continue;
      }
      if (/^defaut\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.DEFAUT, 'defaut', 6));
        continue;
      }
      if (/^finfonction\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_FONCTION, 'finfonction', 11));
        continue;
      }
      if (/^finprocedure\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_PROCEDURE, 'finprocedure', 12));
        continue;
      }
      if (/^procedure\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.PROCEDURE, 'procedure', 9));
        continue;
      }
      if (/^importer\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.IMPORTER, 'importer', 8));
        continue;
      }
      if (/^exporter\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.EXPORTER, 'exporter', 8));
        continue;
      }
      if (/^classe\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.CLASSE, 'classe', 6));
        continue;
      }
      if (/^finclasse\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_CLASSE, 'finclasse', 9));
        continue;
      }
      if (/^proprietes\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.PROPRIETES, 'proprietes', 10));
        continue;
      }
      if (/^finproprietes\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_PROPRIETES, 'finproprietes', 13));
        continue;
      }
      if (/^constructeur\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.CONSTRUCTEUR, 'constructeur', 12));
        continue;
      }
      if (/^finconstructeur\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.FIN_CONSTRUCTEUR, 'finconstructeur', 15));
        continue;
      }
      if (/^nouveau\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.NOUVEAU, 'nouveau', 7));
        continue;
      }
      if (/^(this|ceci)\b/i.test(slice)) {
        tokens.push(this.createToken(TokenType.THIS, 'this', 4));
        continue;
      }

      // Opérateurs textuels compactés en un seul mot (prioritaires)
      const compactComparisonMatch = slice.match(/^(?:egal_a|equivalent_a|different_de|superieur_a|inferieur_a|superieur_ou_egal_a|inferieur_ou_egal_a)\b/i);
      if (compactComparisonMatch) {
        const word = compactComparisonMatch[0].toLowerCase();

        switch (word) {
          case 'egal_a':
          case 'equivalent_a':
            tokens.push(this.createToken(TokenType.DOUBLE_EGAL, '==', word.length));
            continue;
          case 'different_de':
            tokens.push(this.createToken(TokenType.DIFFERENT, '!=', word.length));
            continue;
          case 'superieur_a':
            tokens.push(this.createToken(TokenType.SUPERIEUR, '>', word.length));
            continue;
          case 'inferieur_a':
            tokens.push(this.createToken(TokenType.INFERIEUR, '<', word.length));
            continue;
          case 'superieur_ou_egal_a':
            tokens.push(this.createToken(TokenType.SUPERIEUR_EGAL, '>=', word.length));
            continue;
          case 'inferieur_ou_egal_a':
            tokens.push(this.createToken(TokenType.INFERIEUR_EGAL, '<=', word.length));
            continue;
        }
      }

      // Compatibilité avec les anciennes formes en français (tolérées)
      const legacyComparisonMatch = slice.match(/^(?:est\s+(?:egal|égal)(?:\s+(?:a|à))?|est\s+(?:superieur|supérieur)(?:\s+(?:a|à))?|est\s+(?:inferieur|inférieur)(?:\s+(?:a|à))?|est\s+(?:superieur|supérieur)\s+ou\s+(?:egal|égal)\s+(?:a|à)|est\s+(?:inferieur|inférieur)\s+ou\s+(?:egal|égal)\s+(?:a|à)|est\s+(?:different|différent)(?:\s+de)?|sup_egal|inf_egal|egal|diff|sup|inf)\b/i);
      if (legacyComparisonMatch) {
        const word = legacyComparisonMatch[0].toLowerCase();

        switch (word.replace(/\s+/g, '')) {
          case 'egal':
          case 'égal':
          case 'estegala':
          case 'estégalà':
          case 'estégal':
            tokens.push(this.createToken(TokenType.DOUBLE_EGAL, '==', legacyComparisonMatch[0].length));
            continue;
          case 'diff':
          case 'estdifferent':
          case 'estdifférent':
          case 'estdifferentde':
          case 'estdifférentde':
            tokens.push(this.createToken(TokenType.DIFFERENT, '!=', legacyComparisonMatch[0].length));
            continue;
          case 'sup':
          case 'estsuperieur':
          case 'estsupérieur':
          case 'estsuperieura':
          case 'estsupérieura':
            tokens.push(this.createToken(TokenType.SUPERIEUR, '>', legacyComparisonMatch[0].length));
            continue;
          case 'inf':
          case 'estinferieur':
          case 'estinférieur':
          case 'estinferieura':
          case 'estinférieurea':
            tokens.push(this.createToken(TokenType.INFERIEUR, '<', legacyComparisonMatch[0].length));
            continue;
          case 'sup_egal':
          case 'estsuperieurouegal':
          case 'estsupérieurouégal':
          case 'estsuperieurouegala':
          case 'estsupérieurouégala':
            tokens.push(this.createToken(TokenType.SUPERIEUR_EGAL, '>=', legacyComparisonMatch[0].length));
            continue;
          case 'inf_egal':
          case 'estinferieurouegal':
          case 'estinférieurouégal':
          case 'estinferieurouegala':
          case 'estinférieurouégala':
            tokens.push(this.createToken(TokenType.INFERIEUR_EGAL, '<=', legacyComparisonMatch[0].length));
            continue;
        }
      }

      // Opérateurs symboliques de 2 caractères
      if (slice.startsWith('==')) {
        tokens.push(this.createToken(TokenType.DOUBLE_EGAL, '==', 2));
        continue;
      }
      if (slice.startsWith('!=')) {
        tokens.push(this.createToken(TokenType.DIFFERENT, '!=', 2));
        continue;
      }
      if (slice.startsWith('>=')) {
        tokens.push(this.createToken(TokenType.SUPERIEUR_EGAL, '>=', 2));
        continue;
      }
      if (slice.startsWith('<=')) {
        tokens.push(this.createToken(TokenType.INFERIEUR_EGAL, '<=', 2));
        continue;
      }
      if (slice.startsWith('&&')) {
        tokens.push(this.createToken(TokenType.ET, '&&', 2));
        continue;
      }
      if (slice.startsWith('||')) {
        tokens.push(this.createToken(TokenType.OU, '||', 2));
        continue;
      }
      if (slice.startsWith('.')) {
        tokens.push(this.createToken(TokenType.DOT, '.', 1));
        continue;
      }

      // Nombres (décimaux et entiers)
      const numberMatch = slice.match(/^[0-9]+(\.[0-9]+)?/);
      if (numberMatch) {
        const val = numberMatch[0];
        tokens.push(this.createToken(TokenType.NUMBER, val, val.length));
        continue;
      }

      // Chaines de caractères "..." ou '...'
      if (char === '"' || char === "'") {
        const quote = char;
        let strVal = '';
        let len = 1;
        let closed = false;

        while (this.position + len < this.input.length) {
          const c = this.input[this.position + len];
          if (c === quote && this.input[this.position + len - 1] !== '\\') {
            closed = true;
            len++;
            break;
          }
          strVal += c;
          len++;
        }

        if (!closed) {
          errors.push({
            message: `Chaîne de caractères non fermée (guillemet '${quote}' manquant)`,
            line: this.line,
            column: this.column,
            suggestion: `Ajoutez un guillemet de fermeture '${quote}' à la fin du texte.`,
          });
        }

        tokens.push(this.createToken(TokenType.STRING, strVal, len));
        continue;
      }

      // Mots clés simples, identifiants (support des lettres accentuées)
      const identMatch = slice.match(/^[a-zA-Zà-ÿÀ-Ÿ_][a-zA-Z0-9à-ÿÀ-Ÿ_]*/);
      if (identMatch) {
        const word = identMatch[0];
        const lowerWord = word.toLowerCase();

        let type = TokenType.IDENTIFIER;

        switch (lowerWord) {
          case 'soit':
          case 'var':
          case 'variable':
            type = TokenType.SOIT;
            break;
          case 'constante':
          case 'const':
            type = TokenType.CONSTANTE;
            break;
          case 'affiche':
          case 'afficher':
          case 'ecrire':
          case 'écrire':
            type = TokenType.AFFICHE;
            break;
          case 'lire':
          case 'demander':
          case 'saisir':
            type = TokenType.LIRE;
            break;
          case 'si':
            type = TokenType.SI;
            break;
          case 'alors':
            type = TokenType.ALORS;
            break;
          case 'sinon':
            type = TokenType.SINON;
            break;
          case 'selon':
          case 'switch':
            type = TokenType.SELON;
            break;
          case 'cas':
          case 'case':
            type = TokenType.CAS;
            break;
          case 'defaut':
          case 'default':
            type = TokenType.DEFAUT;
            break;
          case 'finselon':
            type = TokenType.FIN_SELON;
            break;
          case 'pour':
            type = TokenType.POUR;
            break;
          case 'de':
            type = TokenType.DE;
            break;
          case 'à':
          case 'a':
            // Si c'est un 'a' dans un contexte 'de X à Y'
            type = TokenType.A;
            break;
          case 'pas':
            type = TokenType.PAS;
            break;
          case 'faire':
            type = TokenType.FAIRE;
            break;
          case 'fonction':
            type = TokenType.FONCTION;
            break;
          case 'procedure':
            type = TokenType.PROCEDURE;
            break;
          case 'importer':
            type = TokenType.IMPORTER;
            break;
          case 'exporter':
            type = TokenType.EXPORTER;
            break;
          case 'finprocedure':
            type = TokenType.FIN_PROCEDURE;
            break;
          case 'classe':
            type = TokenType.CLASSE;
            break;
          case 'finclasse':
            type = TokenType.FIN_CLASSE;
            break;
          case 'proprietes':
            type = TokenType.PROPRIETES;
            break;
          case 'finproprietes':
            type = TokenType.FIN_PROPRIETES;
            break;
          case 'constructeur':
            type = TokenType.CONSTRUCTEUR;
            break;
          case 'finconstructeur':
            type = TokenType.FIN_CONSTRUCTEUR;
            break;
          case 'nouveau':
            type = TokenType.NOUVEAU;
            break;
          case 'this':
            type = TokenType.THIS;
            break;
          case 'retourner':
          case 'renvoyer':
            type = TokenType.RETOURNER;
            break;
          case 'vrai':
          case 'true':
            type = TokenType.VRAI;
            break;
          case 'faux':
          case 'false':
            type = TokenType.FAUX;
            break;
          case 'null':
          case 'nil':
            type = TokenType.NULL;
            break;
          case 'et':
            type = TokenType.ET;
            break;
          case 'ou':
            type = TokenType.OU;
            break;
          case 'non':
            type = TokenType.NON;
            break;
        }

        tokens.push(this.createToken(type, word, word.length));
        continue;
      }

      // Opérateurs et symboles à 1 caractère
      switch (char) {
        case '+':
          tokens.push(this.createToken(TokenType.PLUS, '+', 1));
          break;
        case '-':
          tokens.push(this.createToken(TokenType.MOINS, '-', 1));
          break;
        case '*':
          tokens.push(this.createToken(TokenType.FOIS, '*', 1));
          break;
        case '/':
          tokens.push(this.createToken(TokenType.DIVISE, '/', 1));
          break;
        case '%':
          tokens.push(this.createToken(TokenType.MODULO, '%', 1));
          break;
        case '=':
          tokens.push(this.createToken(TokenType.EGAL, '=', 1));
          break;
        case '>':
          tokens.push(this.createToken(TokenType.SUPERIEUR, '>', 1));
          break;
        case '<':
          tokens.push(this.createToken(TokenType.INFERIEUR, '<', 1));
          break;
        case '!':
          tokens.push(this.createToken(TokenType.NON, '!', 1));
          break;
        case '(':
          tokens.push(this.createToken(TokenType.LPAREN, '(', 1));
          break;
        case ')':
          tokens.push(this.createToken(TokenType.RPAREN, ')', 1));
          break;
        case '[':
          tokens.push(this.createToken(TokenType.LBRACKET, '[', 1));
          break;
        case ']':
          tokens.push(this.createToken(TokenType.RBRACKET, ']', 1));
          break;
        case ',':
          tokens.push(this.createToken(TokenType.COMMA, ',', 1));
          break;
        case ':':
          tokens.push(this.createToken(TokenType.COLON, ':', 1));
          break;
        default:
          errors.push({
            message: `Caractère non reconnu '${char}'`,
            line: this.line,
            column: this.column,
            suggestion: `Vérifiez que vous n'avez pas saisi une faute de frappe ou un symbole invalide.`,
          });
          this.advance();
          break;
      }
    }

    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
      position: this.position,
    });

    return { tokens, errors };
  }

  private createToken(type: TokenType, value: string, length: number): Token {
    const token: Token = {
      type,
      value,
      line: this.line,
      column: this.column,
      position: this.position,
    };
    for (let i = 0; i < length; i++) {
      this.advance();
    }
    return token;
  }

  private advance() {
    this.position++;
    this.column++;
  }
}
