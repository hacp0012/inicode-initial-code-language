import {
  ASTNode,
  ArrayNode,
  AssignmentNode,
  BinaryOpNode,
  CallNode,
  ClassDeclNode,
  ClassConstructorNode,
  ClassMethodNode,
  ExpressionNode,
  ExpressionStmtNode,
  ForNode,
  FunctionDeclNode,
  IdentifierNode,
  IfNode,
  ImportNode,
  IndexAccessNode,
  InputNode,
  LiteralNode,
  MemberAccessNode,
  NewNode,
  PrintNode,
  ProcedureDeclNode,
  ProgramNode,
  ReturnNode,
  SwitchNode,
  ExportNode,
  Token,
  TokenType,
  TranspilerError,
  UnaryOpNode,
  VarDeclNode,
  WhileNode,
} from './types';

export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: TranspilerError[] = [];

  constructor(tokens: Token[]) {
    // Filtrer les sauts de ligne multiples consécutifs ou initiaux pour simplifier
    this.tokens = tokens;
  }

  public parse(): { ast: ProgramNode; errors: TranspilerError[] } {
    const body: ASTNode[] = [];

    while (!this.isAtEnd()) {
      this.skipNewlines();
      if (this.isAtEnd()) break;

      try {
        const stmt = this.parseStatement();
        if (stmt) {
          body.push(stmt);
        }
      } catch (err: any) {
        // En cas d'erreur fatale sur une instruction, synchroniser sur la ligne suivante
        this.synchronize();
      }
    }

    return {
      ast: {
        type: 'Program',
        body,
        line: 1,
      },
      errors: this.errors,
    };
  }

  private parseStatement(): ASTNode | null {
    this.skipNewlines();
    if (this.isAtEnd()) return null;

    const token = this.peek();

    switch (token.type) {
      case TokenType.SOIT:
      case TokenType.CONSTANTE:
        return this.parseVarDecl();
      case TokenType.AFFICHE:
        return this.parsePrint();
      case TokenType.LIRE:
        return this.parseInput();
      case TokenType.SI:
        return this.parseIf();
      case TokenType.SELON:
        return this.parseSwitch();
      case TokenType.POUR:
        return this.parseFor();
      case TokenType.TANT_QUE:
        return this.parseWhile();
      case TokenType.FONCTION:
        return this.parseFunctionDecl();
      case TokenType.PROCEDURE:
        return this.parseProcedureDecl();
      case TokenType.CLASSE:
        return this.parseClassDecl();
      case TokenType.IMPORTER:
        return this.parseImport();
      case TokenType.EXPORTER:
        return this.parseExport();
      case TokenType.RETOURNER:
        return this.parseReturn();
      case TokenType.IDENTIFIER:
        // Soit une affectation x = ..., soit un appel de fonction ou index x[0] = ...
        return this.parseIdentifierStatement();
      default:
        // Expression seule
        const expr = this.parseExpression();
        this.consumeOptionalSemicolonOrNewline();
        return {
          type: 'ExpressionStmt',
          expression: expr,
          line: token.line,
        };
    }
  }

  private parseVarDecl(): VarDeclNode | AssignmentNode {
    const keywordToken = this.advance(); // SOIT ou CONSTANTE
    const isConst = keywordToken.type === TokenType.CONSTANTE;

    if (this.check(TokenType.THIS)) {
      const thisToken = this.advance();
      const target = this.parseMemberAccessTarget({
        type: 'Identifier',
        name: 'this',
        line: thisToken.line,
      });
      this.consume(TokenType.EGAL, `Symbole '=' attendu dans une affectation.`);
      const value = this.parseExpression();
      this.consumeOptionalSemicolonOrNewline();
      return {
        type: 'Assignment',
        target,
        value,
        line: keywordToken.line,
      };
    }

    const nameToken = this.consume(
      TokenType.IDENTIFIER,
      `Nom de variable attendu après '${keywordToken.value}'.`,
      `Exemple : ${keywordToken.value} x = 10`
    );

    let varType: string | undefined;
    if (this.match(TokenType.COLON)) {
      if (!this.check(TokenType.EGAL) && !this.check(TokenType.NEWLINE) && !this.check(TokenType.EOF)) {
        const typeToken = this.advance();
        varType = typeToken.value;
      }
    }

    let value: ExpressionNode;
    if (this.match(TokenType.EGAL)) {
      value = this.parseExpression();
    } else {
      // Valeur par défaut null si pas initialisé (sauf si constante)
      if (isConst) {
        this.addError(
          `Une constante '${nameToken.value}' doit obligatoirement être initialisée avec une valeur.`,
          nameToken.line,
          nameToken.column,
          `Exemple : constante ${nameToken.value} = 100`
        );
      }
      value = {
        type: 'Literal',
        value: null,
        rawType: 'null',
        line: nameToken.line,
      };
    }

    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'VarDecl',
      kind: isConst ? 'constante' : 'soit',
      name: nameToken.value,
      varType,
      value,
      line: keywordToken.line,
    };
  }

  private parsePrint(): PrintNode {
    const printToken = this.advance(); // AFFICHE
    const expressions: ExpressionNode[] = [];

    if (!this.check(TokenType.NEWLINE) && !this.check(TokenType.EOF)) {
      expressions.push(this.parseExpression());
      while (this.match(TokenType.COMMA)) {
        expressions.push(this.parseExpression());
      }
    }

    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'Print',
      expressions,
      line: printToken.line,
    };
  }

  private parseInput(): InputNode {
    const inputToken = this.advance(); // LIRE / DEMANDER / SAISIR
    let nameToken: Token;
    let promptText: string | undefined;

    if (this.check(TokenType.STRING)) {
      promptText = this.advance().value;
      nameToken = this.consume(
        TokenType.IDENTIFIER,
        `Nom de variable attendu après le texte de demande dans '${inputToken.value}'.`,
        `Exemple : ${inputToken.value} "Votre ville ?" ville`
      );
    } else {
      nameToken = this.consume(
        TokenType.IDENTIFIER,
        `Nom de variable attendu après '${inputToken.value}'.`,
        `Exemple : ${inputToken.value} ville "Votre ville ?"`
      );
      if (this.match(TokenType.STRING)) {
        promptText = this.previous().value;
      }
    }

    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'Input',
      variableName: nameToken.value,
      promptText,
      line: inputToken.line,
    };
  }

  private parseIf(): IfNode {
    const ifToken = this.advance(); // SI
    const condition = this.parseExpression();

    this.consume(
      TokenType.ALORS,
      `Mot-clé 'alors' attendu après la condition du 'si'.`,
      `Exemple : si x > 5 alors ... finsi`
    );

    this.consumeOptionalSemicolonOrNewline();

    const thenBranch: ASTNode[] = [];
    while (
      !this.check(TokenType.SINON_SI) &&
      !this.check(TokenType.SINON) &&
      !this.check(TokenType.FIN_SI) &&
      !this.isAtEnd()
    ) {
      this.skipNewlines();
      if (
        this.check(TokenType.SINON_SI) ||
        this.check(TokenType.SINON) ||
        this.check(TokenType.FIN_SI) ||
        this.isAtEnd()
      ) {
        break;
      }
      const stmt = this.parseStatement();
      if (stmt) thenBranch.push(stmt);
    }

    const elseIfBranches: { condition: ExpressionNode; body: ASTNode[] }[] = [];
    while (this.match(TokenType.SINON_SI)) {
      const elseIfCond = this.parseExpression();
      this.consume(
        TokenType.ALORS,
        `Mot-clé 'alors' attendu après la condition du 'sinonsi'.`
      );
      this.consumeOptionalSemicolonOrNewline();

      const elseIfBody: ASTNode[] = [];
      while (
        !this.check(TokenType.SINON_SI) &&
        !this.check(TokenType.SINON) &&
        !this.check(TokenType.FIN_SI) &&
        !this.isAtEnd()
      ) {
        this.skipNewlines();
        if (
          this.check(TokenType.SINON_SI) ||
          this.check(TokenType.SINON) ||
          this.check(TokenType.FIN_SI) ||
          this.isAtEnd()
        ) {
          break;
        }
        const stmt = this.parseStatement();
        if (stmt) elseIfBody.push(stmt);
      }

      elseIfBranches.push({ condition: elseIfCond, body: elseIfBody });
    }

    let elseBranch: ASTNode[] | undefined;
    if (this.match(TokenType.SINON)) {
      this.consumeOptionalSemicolonOrNewline();
      elseBranch = [];
      while (!this.check(TokenType.FIN_SI) && !this.isAtEnd()) {
        this.skipNewlines();
        if (this.check(TokenType.FIN_SI) || this.isAtEnd()) break;
        const stmt = this.parseStatement();
        if (stmt) elseBranch.push(stmt);
      }
    }

    this.consume(
      TokenType.FIN_SI,
      `Mot-clé 'finsi' attendu pour fermer la structure conditionnelle 'si'.`,
      `N'oubliez pas d'ajouter 'finsi' à la fin de votre bloc de condition.`
    );
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'If',
      condition,
      thenBranch,
      elseIfBranches,
      elseBranch,
      line: ifToken.line,
    };
  }

  private parseSwitch(): SwitchNode {
    const switchToken = this.advance(); // SELON
    const expression = this.parseExpression();

    this.consumeOptionalSemicolonOrNewline();

    const cases: { value: ExpressionNode; body: ASTNode[]; line: number }[] = [];
    let defaultBranch: ASTNode[] | undefined;

    while (!this.check(TokenType.FIN_SELON) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.FIN_SELON) || this.isAtEnd()) break;

      if (this.match(TokenType.CAS)) {
        const caseValue = this.parseExpression();
        this.consumeOptionalSemicolonOrNewline();

        const body: ASTNode[] = [];
        while (!this.check(TokenType.CAS) && !this.check(TokenType.DEFAUT) && !this.check(TokenType.FIN_SELON) && !this.isAtEnd()) {
          this.skipNewlines();
          if (this.check(TokenType.CAS) || this.check(TokenType.DEFAUT) || this.check(TokenType.FIN_SELON) || this.isAtEnd()) break;
          const stmt = this.parseStatement();
          if (stmt) body.push(stmt);
        }

        cases.push({ value: caseValue, body, line: caseValue.line });
        continue;
      }

      if (this.match(TokenType.DEFAUT)) {
        this.consumeOptionalSemicolonOrNewline();
        defaultBranch = [];
        while (!this.check(TokenType.FIN_SELON) && !this.isAtEnd()) {
          this.skipNewlines();
          if (this.check(TokenType.FIN_SELON) || this.isAtEnd()) break;
          const stmt = this.parseStatement();
          if (stmt) defaultBranch.push(stmt);
        }
        continue;
      }

      this.addError(
        `Bloc 'selon' inattendu : attendez 'cas ...' ou 'defaut'.`,
        this.peek().line,
        this.peek().column,
        `Exemple : selon x\n  cas 1\n    affiche 1\n  defaut\n    affiche 2\nfinselon`
      );
      this.advance();
    }

    this.consume(
      TokenType.FIN_SELON,
      `Mot-clé 'finselon' attendu pour fermer la structure 'selon'.`,
      `Exemple : selon expression\n  cas 1\n    affiche 1\nfinselon`
    );
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'Switch',
      expression,
      cases,
      defaultBranch,
      line: switchToken.line,
    };
  }

  private parseFor(): ForNode {
    const forToken = this.advance(); // POUR
    const varToken = this.consume(
      TokenType.IDENTIFIER,
      `Nom de variable de boucle attendu après 'pour'.`,
      `Exemple : pour i de 1 à 10 faire ... finpour`
    );

    this.consume(TokenType.DE, `Mot-clé 'de' attendu après le nom de variable.`);

    const start = this.parseExpression();

    this.consume(
      TokenType.A,
      `Mot-clé 'à' attendu dans la boucle 'pour'.`,
      `Exemple : pour i de 1 à 10 faire`
    );

    const end = this.parseExpression();

    let step: ExpressionNode | undefined;
    if (this.match(TokenType.PAS)) {
      step = this.parseExpression();
    }

    this.consume(
      TokenType.FAIRE,
      `Mot-clé 'faire' attendu pour démarrer le corps de la boucle 'pour'.`
    );
    this.consumeOptionalSemicolonOrNewline();

    const body: ASTNode[] = [];
    while (!this.check(TokenType.FIN_POUR) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.FIN_POUR) || this.isAtEnd()) break;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.consume(
      TokenType.FIN_POUR,
      `Mot-clé 'finpour' attendu pour fermer la boucle 'pour'.`
    );
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'For',
      variable: varToken.value,
      start,
      end,
      step,
      body,
      line: forToken.line,
    };
  }

  private parseWhile(): WhileNode {
    const whileToken = this.advance(); // TANT_QUE
    const condition = this.parseExpression();

    this.consume(
      TokenType.FAIRE,
      `Mot-clé 'faire' attendu après la condition de la boucle 'tantque'.`
    );
    this.consumeOptionalSemicolonOrNewline();

    const body: ASTNode[] = [];
    while (!this.check(TokenType.FIN_TANT_QUE) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.FIN_TANT_QUE) || this.isAtEnd()) break;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.consume(
      TokenType.FIN_TANT_QUE,
      `Mot-clé 'fintantque' attendu pour fermer la boucle 'tantque'.`
    );
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'While',
      condition,
      body,
      line: whileToken.line,
    };
  }

  private parseFunctionDecl(): FunctionDeclNode {
    const fnToken = this.advance(); // FONCTION
    const nameToken = this.consume(
      TokenType.IDENTIFIER,
      `Nom de fonction attendu après 'fonction'.`,
      `Exemple : fonction maFonction(x, y)`
    );

    this.consume(
      TokenType.LPAREN,
      `Parenthèse ouvrante '(' attendue après le nom de fonction.`
    );

    const params: string[] = [];
    const paramTypes: Record<string, string> = {};

    if (!this.check(TokenType.RPAREN)) {
      const p1 = this.consume(
        TokenType.IDENTIFIER,
        `Nom de paramètre attendu.`
      );
      params.push(p1.value);
      if (this.match(TokenType.COLON)) {
        if (!this.check(TokenType.RPAREN) && !this.check(TokenType.COMMA)) {
          const typeToken = this.advance();
          paramTypes[p1.value] = typeToken.value;
        }
      }

      while (this.match(TokenType.COMMA)) {
        const pNext = this.consume(
          TokenType.IDENTIFIER,
          `Nom de paramètre attendu après la virgule.`
        );
        params.push(pNext.value);
        if (this.match(TokenType.COLON)) {
          if (!this.check(TokenType.RPAREN) && !this.check(TokenType.COMMA)) {
            const typeToken = this.advance();
            paramTypes[pNext.value] = typeToken.value;
          }
        }
      }
    }

    this.consume(
      TokenType.RPAREN,
      `Parenthèse fermante ')' attendue après la liste des paramètres.`
    );

    let returnType: string | undefined;
    if (this.match(TokenType.COLON)) {
      if (!this.check(TokenType.NEWLINE) && !this.check(TokenType.EOF)) {
        const retToken = this.advance();
        returnType = retToken.value;
      }
    }

    this.consumeOptionalSemicolonOrNewline();

    const body: ASTNode[] = [];
    while (!this.check(TokenType.FIN_FONCTION) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.FIN_FONCTION) || this.isAtEnd()) break;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.consume(
      TokenType.FIN_FONCTION,
      `Mot-clé 'finfonction' attendu pour fermer la déclaration de fonction.`
    );
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'FunctionDecl',
      name: nameToken.value,
      params,
      paramTypes,
      returnType,
      body,
      line: fnToken.line,
    };
  }

  private parseProcedureDecl(): ProcedureDeclNode {
    const procToken = this.advance(); // PROCEDURE
    const nameToken = this.consume(
      TokenType.IDENTIFIER,
      `Nom de procédure attendu après 'procedure'.`,
      `Exemple : procedure maProcedure(x, y)`
    );

    this.consume(
      TokenType.LPAREN,
      `Parenthèse ouvrante '(' attendue après le nom de procédure.`
    );

    const params: string[] = [];
    const paramTypes: Record<string, string> = {};

    if (!this.check(TokenType.RPAREN)) {
      const p1 = this.consume(TokenType.IDENTIFIER, `Nom de paramètre attendu.`);
      params.push(p1.value);
      if (this.match(TokenType.COLON)) {
        if (!this.check(TokenType.RPAREN) && !this.check(TokenType.COMMA)) {
          const typeToken = this.advance();
          paramTypes[p1.value] = typeToken.value;
        }
      }

      while (this.match(TokenType.COMMA)) {
        const pNext = this.consume(TokenType.IDENTIFIER, `Nom de paramètre attendu après la virgule.`);
        params.push(pNext.value);
        if (this.match(TokenType.COLON)) {
          if (!this.check(TokenType.RPAREN) && !this.check(TokenType.COMMA)) {
            const typeToken = this.advance();
            paramTypes[pNext.value] = typeToken.value;
          }
        }
      }
    }

    this.consume(TokenType.RPAREN, `Parenthèse fermante ')' attendue après la liste des paramètres.`);
    this.consumeOptionalSemicolonOrNewline();

    const body: ASTNode[] = [];
    while (!this.check(TokenType.FIN_PROCEDURE) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.FIN_PROCEDURE) || this.isAtEnd()) break;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.consume(
      TokenType.FIN_PROCEDURE,
      `Mot-clé 'finprocedure' attendu pour fermer la déclaration de procédure.`
    );
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'ProcedureDecl',
      name: nameToken.value,
      params,
      paramTypes,
      body,
      line: procToken.line,
    };
  }

  private parseClassDecl(): ClassDeclNode {
    const classToken = this.advance();
    const nameToken = this.consume(
      TokenType.IDENTIFIER,
      `Nom de classe attendu après 'classe'.`,
      `Exemple : classe Personne`
    );

    const properties: { type: 'ClassProperty'; name: string; typeName?: string; line: number }[] = [];
    let constructor: ClassConstructorNode | undefined;
    const methods: ClassMethodNode[] = [];

    this.consumeOptionalSemicolonOrNewline();

    if (this.match(TokenType.PROPRIETES)) {
      this.consumeOptionalSemicolonOrNewline();
      while (!this.check(TokenType.FIN_PROPRIETES) && !this.isAtEnd()) {
        this.skipNewlines();
        if (this.check(TokenType.FIN_PROPRIETES) || this.isAtEnd()) break;
        const propName = this.consume(TokenType.IDENTIFIER, `Nom de propriété attendu dans la classe ${nameToken.value}.`);
        let typeName: string | undefined;
        if (this.match(TokenType.COLON)) {
          const t = this.consume(TokenType.IDENTIFIER, `Type de propriété attendu pour '${propName.value}'.`);
          typeName = t.value;
        }
        properties.push({ type: 'ClassProperty', name: propName.value, typeName, line: propName.line });
        this.consumeOptionalSemicolonOrNewline();
      }
      this.consume(TokenType.FIN_PROPRIETES, `Mot-clé 'finproprietes' attendu pour terminer les propriétés de la classe.`);
      this.consumeOptionalSemicolonOrNewline();
    }

    while (!this.check(TokenType.FIN_CLASSE) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.FIN_CLASSE) || this.isAtEnd()) break;

      if (this.match(TokenType.CONSTRUCTEUR)) {
        this.consume(TokenType.LPAREN, `Parenthèse ouvrante '(' attendue après 'constructeur'.`);
        const params: string[] = [];
        const paramTypes: Record<string, string> = {};
        if (!this.check(TokenType.RPAREN)) {
          const p1 = this.consume(TokenType.IDENTIFIER, `Nom de paramètre attendu pour le constructeur.`);
          params.push(p1.value);
          if (this.match(TokenType.COLON)) {
            const t = this.consume(TokenType.IDENTIFIER, `Type de paramètre attendu pour '${p1.value}'.`);
            paramTypes[p1.value] = t.value;
          }
          while (this.match(TokenType.COMMA)) {
            const pNext = this.consume(TokenType.IDENTIFIER, `Nom de paramètre attendu après la virgule.`);
            params.push(pNext.value);
            if (this.match(TokenType.COLON)) {
              const t = this.consume(TokenType.IDENTIFIER, `Type de paramètre attendu pour '${pNext.value}'.`);
              paramTypes[pNext.value] = t.value;
            }
          }
        }
        this.consume(TokenType.RPAREN, `Parenthèse fermante ')' attendue après la liste du constructeur.`);
        this.consumeOptionalSemicolonOrNewline();

        const body: ASTNode[] = [];
        while (!this.check(TokenType.FIN_CONSTRUCTEUR) && !this.isAtEnd()) {
          this.skipNewlines();
          if (this.check(TokenType.FIN_CONSTRUCTEUR) || this.isAtEnd()) break;
          const stmt = this.parseStatement();
          if (stmt) body.push(stmt);
        }
        this.consume(TokenType.FIN_CONSTRUCTEUR, `Mot-clé 'finconstructeur' attendu pour fermer le constructeur.`);
        this.consumeOptionalSemicolonOrNewline();

        constructor = { type: 'ClassConstructor', params, paramTypes, body, line: classToken.line };
        continue;
      }

      const fnToken = this.peek();
      if (this.match(TokenType.FONCTION)) {
        const nameToken = this.consume(TokenType.IDENTIFIER, `Nom de méthode attendu après 'fonction'.`);
        this.consume(TokenType.LPAREN, `Parenthèse ouvrante '(' attendue après le nom de méthode.`);
        const params: string[] = [];
        const paramTypes: Record<string, string> = {};
        if (!this.check(TokenType.RPAREN)) {
          const p1 = this.consume(TokenType.IDENTIFIER, `Nom de paramètre attendu.`);
          params.push(p1.value);
          if (this.match(TokenType.COLON)) {
            const t = this.consume(TokenType.IDENTIFIER, `Type de paramètre attendu pour '${p1.value}'.`);
            paramTypes[p1.value] = t.value;
          }
          while (this.match(TokenType.COMMA)) {
            const pNext = this.consume(TokenType.IDENTIFIER, `Nom de paramètre attendu après la virgule.`);
            params.push(pNext.value);
            if (this.match(TokenType.COLON)) {
              const t = this.consume(TokenType.IDENTIFIER, `Type de paramètre attendu pour '${pNext.value}'.`);
              paramTypes[pNext.value] = t.value;
            }
          }
        }
        this.consume(TokenType.RPAREN, `Parenthèse fermante ')' attendue après la liste des paramètres.`);

        let returnType: string | undefined;
        if (this.match(TokenType.COLON)) {
          if (!this.check(TokenType.NEWLINE) && !this.check(TokenType.EOF)) {
            const retToken = this.advance();
            returnType = retToken.value;
          }
        }

        this.consumeOptionalSemicolonOrNewline();
        const body: ASTNode[] = [];
        while (!this.check(TokenType.FIN_FONCTION) && !this.isAtEnd()) {
          this.skipNewlines();
          if (this.check(TokenType.FIN_FONCTION) || this.isAtEnd()) break;
          const stmt = this.parseStatement();
          if (stmt) body.push(stmt);
        }
        this.consume(TokenType.FIN_FONCTION, `Mot-clé 'finfonction' attendu pour fermer la méthode.`);
        this.consumeOptionalSemicolonOrNewline();

        methods.push({ type: 'ClassMethod', name: nameToken.value, params, paramTypes, returnType, body, line: fnToken.line });
        continue;
      }

      this.addError(
        `Bloc de classe inattendu dans '${nameToken.value}'. Attendez 'proprietes', 'constructeur', ou une méthode.`,
        this.peek().line,
        this.peek().column,
        `Exemple : classe Personne ... finclasse`
      );
      this.advance();
    }

    this.consume(TokenType.FIN_CLASSE, `Mot-clé 'finclasse' attendu pour fermer la déclaration de classe.`);
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'ClassDecl',
      name: nameToken.value,
      properties,
      constructor,
      methods,
      line: classToken.line,
    };
  }

  private parseImport(): ImportNode {
    const importToken = this.advance();
    const moduleToken = this.consume(TokenType.STRING, `Chemin de module attendu après 'importer'.`, `Exemple : importer "maths.ic"`);
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'Import',
      modulePath: moduleToken.value,
      line: importToken.line,
    };
  }

  private parseExport(): ExportNode {
    const exportToken = this.advance();
    const nameToken = this.consume(TokenType.IDENTIFIER, `Nom exporté attendu après 'exporter'.`, `Exemple : exporter score`);
    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'Export',
      name: nameToken.value,
      line: exportToken.line,
    };
  }

  private parseReturn(): ReturnNode {
    const retToken = this.advance(); // RETOURNER
    let value: ExpressionNode | undefined;

    if (!this.check(TokenType.NEWLINE) && !this.check(TokenType.EOF)) {
      value = this.parseExpression();
    }

    this.consumeOptionalSemicolonOrNewline();

    return {
      type: 'Return',
      value,
      line: retToken.line,
    };
  }

  private parseIdentifierStatement(): ASTNode {
    const nameToken = this.peek();
    const isThisReference = nameToken.type === TokenType.THIS;

    // Regarder si c'est un tableau ou affectation x = ... ou x[index] = ...
    let indexExpr: ExpressionNode | undefined;
    let targetExpr: ExpressionNode | undefined;

    this.advance(); // Consommer l'identifiant

    if (this.match(TokenType.LBRACKET)) {
      indexExpr = this.parseExpression();
      this.consume(
        TokenType.RBRACKET,
        `Crochet fermant ']' attendu après l'indice du tableau.`
      );
    }

    const baseExpr: ExpressionNode = isThisReference
      ? { type: 'Identifier', name: 'this', line: nameToken.line }
      : { type: 'Identifier', name: nameToken.value, line: nameToken.line };

    targetExpr = this.parseMemberAccessTarget(baseExpr);

    if (this.match(TokenType.EGAL)) {
      const value = this.parseExpression();
      this.consumeOptionalSemicolonOrNewline();
      return {
        type: 'Assignment',
        name: !targetExpr || targetExpr.type === 'Identifier' ? (targetExpr?.type === 'Identifier' ? targetExpr.name : nameToken.value) : undefined,
        target: targetExpr,
        index: indexExpr,
        value,
        line: nameToken.line,
      };
    }

    // Appel de fonction : maFonction(...)
    if (this.match(TokenType.LPAREN)) {
      const args: ExpressionNode[] = [];
      if (!this.check(TokenType.RPAREN)) {
        args.push(this.parseExpression());
        while (this.match(TokenType.COMMA)) {
          args.push(this.parseExpression());
        }
      }
      this.consume(
        TokenType.RPAREN,
        `Parenthèse fermante ')' attendue après la liste des arguments.`
      );
      this.consumeOptionalSemicolonOrNewline();

      return {
        type: 'ExpressionStmt',
        expression: {
          type: 'Call',
          callee: targetExpr ?? baseExpr,
          args,
          line: nameToken.line,
        },
        line: nameToken.line,
      };
    }

    if (targetExpr && targetExpr.type !== 'Identifier') {
      return {
        type: 'ExpressionStmt',
        expression: targetExpr,
        line: nameToken.line,
      };
    }

    // Erreur d'affectation
    this.addError(
      `Instruction invalide commençant par '${nameToken.value}'. Attendiez-vous une affectation '${nameToken.value} = ...' ou un appel de fonction ?`,
      nameToken.line,
      nameToken.column,
      `Pour modifier une variable, écrivez : ${nameToken.value} = nouvelleValeur`
    );

    return {
      type: 'ExpressionStmt',
      expression: {
        type: 'Identifier',
        name: nameToken.value,
        line: nameToken.line,
      },
      line: nameToken.line,
    };
  }

  // --- ANAMORPHOSE & PRIORITÉ DES EXPRESSIONS ---

  private parseExpression(precedence: number = 0): ExpressionNode {
    let left = this.parsePrimary();

    while (true) {
      const token = this.peek();
      const currentPrecedence = this.getPrecedence(token.type);

      if (currentPrecedence <= precedence) {
        break;
      }

      this.advance(); // Consomme l'opérateur

      // Gestion spéciale de l'accès indexé tab[idx]
      if (token.type === TokenType.LBRACKET) {
        const index = this.parseExpression(0);
        this.consume(TokenType.RBRACKET, `Crochet fermant ']' attendu.`);
        left = {
          type: 'IndexAccess',
          array: left,
          index,
          line: token.line,
        };
        continue;
      }

      // Appel de fonction sur expression
      if (token.type === TokenType.LPAREN) {
        const args: ExpressionNode[] = [];
        if (!this.check(TokenType.RPAREN)) {
          args.push(this.parseExpression(0));
          while (this.match(TokenType.COMMA)) {
            args.push(this.parseExpression(0));
          }
        }
        this.consume(TokenType.RPAREN, `Parenthèse fermante ')' attendue.`);
        left = {
          type: 'Call',
          callee: left,
          args,
          line: token.line,
        };
        continue;
      }

      if (token.type === TokenType.DOT) {
        let target = left;
        while (true) {
          const property = this.consume(
            TokenType.IDENTIFIER,
            `Nom de propriété attendu après le point.`
          ).value;
          target = {
            type: 'MemberAccess',
            object: target,
            property,
            line: token.line,
          };

          if (!this.match(TokenType.DOT)) {
            break;
          }
        }
        left = target;
        continue;
      }

      const right = this.parseExpression(currentPrecedence);

      left = {
        type: 'BinaryOp',
        operator: token.value,
        left,
        right,
        line: token.line,
      };
    }

    return left;
  }

  private parsePrimary(): ExpressionNode {
    const token = this.peek();

    if (token.type === TokenType.NUMBER) {
      this.advance();
      return {
        type: 'Literal',
        value: Number(token.value),
        rawType: 'number',
        line: token.line,
      };
    }

    if (token.type === TokenType.STRING) {
      this.advance();
      return {
        type: 'Literal',
        value: token.value,
        rawType: 'string',
        line: token.line,
      };
    }

    if (token.type === TokenType.VRAI) {
      this.advance();
      return {
        type: 'Literal',
        value: true,
        rawType: 'boolean',
        line: token.line,
      };
    }

    if (token.type === TokenType.FAUX) {
      this.advance();
      return {
        type: 'Literal',
        value: false,
        rawType: 'boolean',
        line: token.line,
      };
    }

    if (token.type === TokenType.NULL) {
      this.advance();
      return {
        type: 'Literal',
        value: null,
        rawType: 'null',
        line: token.line,
      };
    }

    if (token.type === TokenType.IDENTIFIER) {
      this.advance();
      const identNode: IdentifierNode = {
        type: 'Identifier',
        name: token.value,
        line: token.line,
      };

      // Si suivi d'une parenthèse '('
      if (this.match(TokenType.LPAREN)) {
        const args: ExpressionNode[] = [];
        if (!this.check(TokenType.RPAREN)) {
          args.push(this.parseExpression(0));
          while (this.match(TokenType.COMMA)) {
            args.push(this.parseExpression(0));
          }
        }
        this.consume(TokenType.RPAREN, `Parenthèse fermante ')' attendue.`);
        return {
          type: 'Call',
          callee: token.value,
          args,
          line: token.line,
        };
      }

      return identNode;
    }

    if (token.type === TokenType.THIS) {
      this.advance();
      return {
        type: 'Identifier',
        name: 'this',
        line: token.line,
      };
    }

    if (token.type === TokenType.NOUVEAU) {
      this.advance();
      const callee = this.consume(TokenType.IDENTIFIER, `Nom de classe attendu après 'nouveau'.`).value;
      this.consume(TokenType.LPAREN, `Parenthèse ouvrante '(' attendue après le nom de classe.`);
      const args: ExpressionNode[] = [];
      if (!this.check(TokenType.RPAREN)) {
        args.push(this.parseExpression(0));
        while (this.match(TokenType.COMMA)) {
          args.push(this.parseExpression(0));
        }
      }
      this.consume(TokenType.RPAREN, `Parenthèse fermante ')' attendue après les arguments du constructeur.`);
      return {
        type: 'New',
        callee,
        args,
        line: token.line,
      };
    }

    if (token.type === TokenType.NON || token.type === TokenType.MOINS) {
      this.advance();
      const operand = this.parseExpression(7); // Priorité élevée pour unaire
      return {
        type: 'UnaryOp',
        operator: token.value,
        operand,
        line: token.line,
      };
    }

    if (token.type === TokenType.LPAREN) {
      this.advance();
      const expr = this.parseExpression(0);
      this.consume(
        TokenType.RPAREN,
        `Parenthèse fermante ')' attendue après l'expression.`
      );
      return expr;
    }

    if (token.type === TokenType.LBRACKET) {
      this.advance();
      const elements: ExpressionNode[] = [];
      if (!this.check(TokenType.RBRACKET)) {
        elements.push(this.parseExpression(0));
        while (this.match(TokenType.COMMA)) {
          elements.push(this.parseExpression(0));
        }
      }
      this.consume(TokenType.RBRACKET, `Crochet fermant ']' attendu.`);
      return {
        type: 'Array',
        elements,
        line: token.line,
      };
    }

    this.addError(
      `Expression inattendue '${token.value}'.`,
      token.line,
      token.column,
      `Attendu : nombre, texte, nom de variable ou parenthèse.`
    );
    this.advance();

    return {
      type: 'Literal',
      value: null,
      rawType: 'null',
      line: token.line,
    };
  }

  private parseMemberAccessTarget(object: ExpressionNode): ExpressionNode {
    let target: ExpressionNode = object;

    while (this.match(TokenType.DOT)) {
      const property = this.consume(TokenType.IDENTIFIER, `Nom de propriété attendu après le point.`).value;
      target = {
        type: 'MemberAccess',
        object: target,
        property,
        line: object.line,
      };
    }

    return target;
  }

  private getPrecedence(type: TokenType): number {
    switch (type) {
      case TokenType.OU:
        return 1;
      case TokenType.ET:
        return 2;
      case TokenType.DOUBLE_EGAL:
      case TokenType.DIFFERENT:
        return 3;
      case TokenType.SUPERIEUR:
      case TokenType.INFERIEUR:
      case TokenType.SUPERIEUR_EGAL:
      case TokenType.INFERIEUR_EGAL:
        return 4;
      case TokenType.PLUS:
      case TokenType.MOINS:
        return 5;
      case TokenType.FOIS:
      case TokenType.DIVISE:
      case TokenType.MODULO:
        return 6;
      case TokenType.LBRACKET:
      case TokenType.LPAREN:
        return 8;
      case TokenType.DOT:
        return 9;
      default:
        return 0;
    }
  }

  // --- OUTILS DE NAVIGATION DANS LES TOKENS ---

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string, suggestion?: string): Token {
    if (this.check(type)) {
      return this.advance();
    }
    const current = this.peek();
    this.addError(message, current.line, current.column, suggestion);
    return current;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return (
      this.current >= this.tokens.length ||
      this.tokens[this.current].type === TokenType.EOF
    );
  }

  private peek(): Token {
    return this.tokens[this.current] || this.tokens[this.tokens.length - 1];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private skipNewlines() {
    while (this.check(TokenType.NEWLINE)) {
      this.advance();
    }
  }

  private consumeOptionalSemicolonOrNewline() {
    if (this.check(TokenType.NEWLINE)) {
      this.advance();
    }
    this.skipNewlines();
  }

  private addError(
    message: string,
    line: number,
    column: number,
    suggestion?: string
  ) {
    this.errors.push({
      message,
      line,
      column,
      suggestion,
    });
  }

  private synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.NEWLINE) return;

      switch (this.peek().type) {
        case TokenType.SOIT:
        case TokenType.CONSTANTE:
        case TokenType.SI:
        case TokenType.POUR:
        case TokenType.TANT_QUE:
        case TokenType.FONCTION:
        case TokenType.AFFICHE:
        case TokenType.LIRE:
        case TokenType.RETOURNER:
          return;
      }

      this.advance();
    }
  }
}
