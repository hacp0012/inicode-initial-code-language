import {
  ASTNode,
  ExpressionNode,
  ProgramNode,
} from './types';

export function mapFrenchTypeToTS(typeStr?: string): string {
  if (!typeStr) return 'any';
  const lower = typeStr.toLowerCase().trim();
  if (['entier', 'réel', 'reel', 'nombre', 'num', 'float', 'int', 'double'].includes(lower)) return 'number';
  if (['texte', 'chaine', 'chaîne', 'string', 'str'].includes(lower)) return 'string';
  if (['booleen', 'booléen', 'boolean', 'bool'].includes(lower)) return 'boolean';
  if (['tableau', 'liste', 'array'].includes(lower)) return 'any[]';
  if (['void', 'vide'].includes(lower)) return 'void';
  if (['tout', 'any'].includes(lower)) return 'any';
  return typeStr;
}

export class CodeGenerator {
  private ast: ProgramNode;
  private indentLevel: number = 0;
  private isStepByStep: boolean = false;
  private targetLanguage: 'js' | 'ts' = 'js';

  constructor(
    ast: ProgramNode,
    isStepByStep: boolean = false,
    targetLanguage: 'js' | 'ts' = 'js'
  ) {
    this.ast = ast;
    this.isStepByStep = isStepByStep;
    this.targetLanguage = targetLanguage;
  }

  public generate(): string {
    const lines: string[] = [];

    if (this.isStepByStep) {
      lines.push(`// Code instrumenté pour l'exécution pas-à-pas (${this.targetLanguage.toUpperCase()})`);
    } else if (this.targetLanguage === 'ts') {
      lines.push('// Code TypeScript typé généré depuis le pseudo-code IniCode');
    } else {
      lines.push('// Code JavaScript (ES6) transpilié depuis le pseudo-code IniCode');
    }

    for (const stmt of this.ast.body) {
      lines.push(this.generateNode(stmt));
    }

    return lines.join('\n');
  }

  private indent(): string {
    return '  '.repeat(this.indentLevel);
  }

  private generateNode(node: ASTNode): string {
    let stepInjection = '';
    if (this.isStepByStep && node.line) {
      stepInjection = `${this.indent()}await __step__(${node.line});\n`;
    }

    switch (node.type) {
      case 'VarDecl': {
        const keyword = node.kind === 'constante' ? 'const' : 'let';
        const val = this.generateExpression(node.value);
        const varTypeArg = node.varType ? JSON.stringify(node.varType) : 'null';
        const track = this.isStepByStep ? `\n${this.indent()}__var__(${JSON.stringify(node.name)}, ${node.name}, ${varTypeArg});` : '';
        if (this.targetLanguage === 'ts') {
          const tsType = mapFrenchTypeToTS(node.varType);
          return `${stepInjection}${this.indent()}${keyword} ${node.name}: ${tsType} = ${val};${track}`;
        }
        return `${stepInjection}${this.indent()}${keyword} ${node.name} = ${val};${track}`;
      }

      case 'Assignment': {
        const val = this.generateExpression(node.value);

        if (node.index) {
          const idx = this.generateExpression(node.index);
          const targetName = node.name ?? this.generateExpression(node.target ?? { type: 'Identifier', name: 'undefined', line: node.line });
          const trackArr = this.isStepByStep ? `\n${this.indent()}__var__(${JSON.stringify(targetName)}, ${targetName});` : '';
          return `${stepInjection}${this.indent()}${targetName}[${idx}] = ${val};${trackArr}`;
        }

        if (node.target) {
          const targetExpr = this.generateExpression(node.target);
          const track = this.isStepByStep && node.name ? `\n${this.indent()}__var__(${JSON.stringify(node.name)}, ${node.name});` : '';
          return `${stepInjection}${this.indent()}${targetExpr} = ${val};${track}`;
        }

        const targetName = node.name ?? 'undefined';
        const track = this.isStepByStep ? `\n${this.indent()}__var__(${JSON.stringify(targetName)}, ${targetName});` : '';
        return `${stepInjection}${this.indent()}${targetName} = ${val};${track}`;
      }

      case 'Print': {
        const exprs = node.expressions.map((e) => this.generateExpression(e));
        return `${stepInjection}${this.indent()}await __affiche__(${exprs.join(', ')});`;
      }

      case 'Input': {
        const prompt = node.promptText
          ? JSON.stringify(node.promptText)
          : `"${node.variableName}"`;
        const track = this.isStepByStep ? `\n${this.indent()}__var__(${JSON.stringify(node.variableName)}, ${node.variableName});` : '';
        if (this.targetLanguage === 'ts') {
          return `${stepInjection}${this.indent()}const ${node.variableName}: any = await __lire__(${prompt});${track}`;
        }
        return `${stepInjection}${this.indent()}var ${node.variableName} = await __lire__(${prompt});${track}`;
      }

      case 'If': {
        const cond = this.generateExpression(node.condition);
        let code = `${stepInjection}${this.indent()}if (${cond}) {\n`;
        this.indentLevel++;
        code += node.thenBranch.map((s) => this.generateNode(s)).join('\n');
        this.indentLevel--;
        code += `\n${this.indent()}}`;

        for (const elseIfBranch of node.elseIfBranches) {
          const elseIfCond = this.generateExpression(elseIfBranch.condition);
          code += ` else if (${elseIfCond}) {\n`;
          this.indentLevel++;
          code += elseIfBranch.body.map((s) => this.generateNode(s)).join('\n');
          this.indentLevel--;
          code += `\n${this.indent()}}`;
        }

        if (node.elseBranch && node.elseBranch.length > 0) {
          code += ` else {\n`;
          this.indentLevel++;
          code += node.elseBranch.map((s) => this.generateNode(s)).join('\n');
          this.indentLevel--;
          code += `\n${this.indent()}}`;
        }

        return code;
      }

      case 'Switch': {
        const expr = this.generateExpression(node.expression);
        let code = `${stepInjection}${this.indent()}switch (${expr}) {\n`;
        this.indentLevel++;
        for (const switchCase of node.cases) {
          const caseExpr = this.generateExpression(switchCase.value);
          code += `${this.indent()}case ${caseExpr}:\n`;
          this.indentLevel++;
          code += switchCase.body.map((s) => this.generateNode(s)).join('\n');
          this.indentLevel--;
          code += `\n`;
        }
        if (node.defaultBranch && node.defaultBranch.length > 0) {
          code += `${this.indent()}default:\n`;
          this.indentLevel++;
          code += node.defaultBranch.map((s) => this.generateNode(s)).join('\n');
          this.indentLevel--;
          code += `\n`;
        }
        this.indentLevel--;
        code += `${this.indent()}}`;
        return code;
      }

      case 'For': {
        const start = this.generateExpression(node.start);
        const end = this.generateExpression(node.end);
        const step = node.step ? this.generateExpression(node.step) : '1';

        const varDecl = this.targetLanguage === 'ts' ? `let ${node.variable}: number` : `let ${node.variable}`;
        let code = `${stepInjection}${this.indent()}for (${varDecl} = ${start}; ${node.variable} <= ${end}; ${node.variable} += ${step}) {\n`;
        this.indentLevel++;
        code += node.body.map((s) => this.generateNode(s)).join('\n');
        this.indentLevel--;
        code += `\n${this.indent()}}`;
        return code;
      }

      case 'While': {
        const cond = this.generateExpression(node.condition);
        let code = `${stepInjection}${this.indent()}while (${cond}) {\n`;
        this.indentLevel++;
        code += node.body.map((s) => this.generateNode(s)).join('\n');
        this.indentLevel--;
        code += `\n${this.indent()}}`;
        return code;
      }

      case 'FunctionDecl': {
        const formattedParams = node.params.map((p) => {
          const pType = node.paramTypes?.[p] ? mapFrenchTypeToTS(node.paramTypes[p]) : 'any';
          const defaultValue = node.paramDefaultValues?.[p];
          const typePart = this.targetLanguage === 'ts' ? `: ${pType}` : '';
          const defaultPart = defaultValue ? ` = ${this.generateExpression(defaultValue)}` : '';
          return `${p}${typePart}${defaultPart}`;
        });

        if (this.targetLanguage === 'ts') {
          const retTypeRaw = node.returnType ? mapFrenchTypeToTS(node.returnType) : 'any';
          const retType = retTypeRaw.startsWith('Promise') ? retTypeRaw : `Promise<${retTypeRaw}>`;
          let code = `${this.indent()}async function ${node.name}(${formattedParams.join(', ')}): ${retType} {\n`;
          this.indentLevel++;
          code += node.body.map((s) => this.generateNode(s)).join('\n');
          this.indentLevel--;
          code += `\n${this.indent()}}`;
          return code;
        } else {
          let code = `${this.indent()}async function ${node.name}(${formattedParams.join(', ')}) {\n`;
          this.indentLevel++;
          code += node.body.map((s) => this.generateNode(s)).join('\n');
          this.indentLevel--;
          code += `\n${this.indent()}}`;
          return code;
        }
      }

      case 'ClassDecl': {
        const classIndent = this.indent();
        const propLines = node.properties.map((prop) => `${classIndent}  ${prop.name};`).join('\n');

        let code = `${classIndent}class ${node.name} {\n`;
        if (propLines) {
          code += `${propLines}\n`;
        }

        if (node.constructor) {
          const constructorParams = node.constructor.params.map((p) => {
            const pType = node.constructor?.paramTypes?.[p] ? mapFrenchTypeToTS(node.constructor.paramTypes[p]) : 'any';
            const defaultValue = node.constructor?.paramDefaultValues?.[p];
            const typePart = this.targetLanguage === 'ts' ? `: ${pType}` : '';
            const defaultPart = defaultValue ? ` = ${this.generateExpression(defaultValue)}` : '';
            return `${p}${typePart}${defaultPart}`;
          });
          code += `${classIndent}  constructor(${constructorParams.join(', ')}) {\n`;
          this.indentLevel++;
          code += node.constructor.body.map((s) => this.generateNode(s)).join('\n');
          this.indentLevel--;
          code += `\n${classIndent}  }\n`;
        }

        for (const method of node.methods) {
          const methodParams = method.params.map((p) => {
            const pType = method.paramTypes?.[p] ? mapFrenchTypeToTS(method.paramTypes[p]) : 'any';
            const defaultValue = method.paramDefaultValues?.[p];
            const typePart = this.targetLanguage === 'ts' ? `: ${pType}` : '';
            const defaultPart = defaultValue ? ` = ${this.generateExpression(defaultValue)}` : '';
            return `${p}${typePart}${defaultPart}`;
          });
          const methodRet = method.returnType ? mapFrenchTypeToTS(method.returnType) : 'any';
          const methodSignature = this.targetLanguage === 'ts'
            ? `${method.name}(${methodParams.join(', ')}): ${methodRet}`
            : `${method.name}(${methodParams.join(', ')})`;

          code += `${classIndent}  ${methodSignature} {\n`;
          this.indentLevel++;
          code += method.body.map((s) => this.generateNode(s)).join('\n');
          this.indentLevel--;
          code += `\n${classIndent}  }\n`;
        }

        code += `${classIndent}}`;
        return code;
      }

      case 'ProcedureDecl': {
        const formattedParams = node.params.map((p) => {
          const pType = node.paramTypes?.[p] ? mapFrenchTypeToTS(node.paramTypes[p]) : 'any';
          const defaultValue = node.paramDefaultValues?.[p];
          const typePart = this.targetLanguage === 'ts' ? `: ${pType}` : '';
          const defaultPart = defaultValue ? ` = ${this.generateExpression(defaultValue)}` : '';
          return `${p}${typePart}${defaultPart}`;
        });
        let code = `${this.indent()}async function ${node.name}(${formattedParams.join(', ')}) {\n`;
        this.indentLevel++;
        code += node.body.map((s) => this.generateNode(s)).join('\n');
        this.indentLevel--;
        code += `\n${this.indent()}}`;
        return code;
      }

      case 'Import': {
        const moduleVar = `__module__${Math.random().toString(36).slice(2, 8)}`;
        return `${this.indent()}const ${moduleVar} = await import(${JSON.stringify(node.modulePath)});`;
      }

      case 'Export': {
        return `${this.indent()}export { ${node.name} };`;
      }

      case 'Return': {
        const val = node.value ? ` ${this.generateExpression(node.value)}` : '';
        return `${stepInjection}${this.indent()}return${val};`;
      }

      case 'ExpressionStmt': {
        const expr = this.generateExpression(node.expression);
        return `${stepInjection}${this.indent()}${expr};`;
      }

      default:
        return '';
    }
  }

  private generateExpression(expr: ExpressionNode): string {
    switch (expr.type) {
      case 'Literal':
        if (expr.rawType === 'string') {
          return JSON.stringify(expr.value);
        }
        if (expr.rawType === 'boolean') {
          return expr.value ? 'true' : 'false';
        }
        if (expr.rawType === 'null') {
          return 'null';
        }
        return String(expr.value);

      case 'Identifier':
        return expr.name;

      case 'BinaryOp': {
        const left = this.generateExpression(expr.left);
        const right = this.generateExpression(expr.right);
        let op = expr.operator;

        // Conversion des opérateurs français en JS
        if (op === '==' || op === '=' || op.includes('égal')) op = '===';
        if (op === '!=' || op.includes('différent')) op = '!==';
        if (op === 'et' || op === '&&') op = '&&';
        if (op === 'ou' || op === '||') op = '||';

        return `(${left} ${op} ${right})`;
      }

      case 'UnaryOp': {
        const operand = this.generateExpression(expr.operand);
        let op = expr.operator;
        if (op === 'non' || op === '!') op = '!';
        return `(${op}${operand})`;
      }

      case 'Call': {
        const args = expr.args.map((a) => this.generateExpression(a));
        const callee = typeof expr.callee === 'string' ? expr.callee : this.generateExpression(expr.callee);
        return `await ${callee}(${args.join(', ')})`;
      }

      case 'MemberAccess': {
        const object = this.generateExpression(expr.object);
        return `${object}.${expr.property}`;
      }

      case 'New': {
        const args = expr.args.map((a) => this.generateExpression(a));
        return `new ${expr.callee}(${args.join(', ')})`;
      }

      case 'Array': {
        const elems = expr.elements.map((e) => this.generateExpression(e));
        return `[${elems.join(', ')}]`;
      }

      case 'IndexAccess': {
        const arr = this.generateExpression(expr.array);
        const idx = this.generateExpression(expr.index);
        return `${arr}[${idx}]`;
      }
    }
  }
}
