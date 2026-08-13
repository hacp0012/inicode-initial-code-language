export enum TokenType {
  // Mots-clés
  SOIT = 'SOIT',
  VARIABLE = 'VARIABLE',
  CONSTANTE = 'CONSTANTE',
  AFFICHE = 'AFFICHE',
  LIRE = 'LIRE',
  SI = 'SI',
  ALORS = 'ALORS',
  SINON_SI = 'SINON_SI',
  SINON = 'SINON',
  FIN_SI = 'FIN_SI',
  SELON = 'SELON',
  CAS = 'CAS',
  DEFAUT = 'DEFAUT',
  FIN_SELON = 'FIN_SELON',
  POUR = 'POUR',
  DE = 'DE',
  A = 'A',
  PAS = 'PAS',
  FAIRE = 'FAIRE',
  FIN_POUR = 'FIN_POUR',
  TANT_QUE = 'TANT_QUE',
  FIN_TANT_QUE = 'FIN_TANT_QUE',
  FONCTION = 'FONCTION',
  PROCEDURE = 'PROCEDURE',
  IMPORTER = 'IMPORTER',
  EXPORTER = 'EXPORTER',
  RETOURNER = 'RETOURNER',
  FIN_FONCTION = 'FIN_FONCTION',
  FIN_PROCEDURE = 'FIN_PROCEDURE',
  CLASSE = 'CLASSE',
  FIN_CLASSE = 'FIN_CLASSE',
  PROPRIETES = 'PROPRIETES',
  FIN_PROPRIETES = 'FIN_PROPRIETES',
  CONSTRUCTEUR = 'CONSTRUCTEUR',
  FIN_CONSTRUCTEUR = 'FIN_CONSTRUCTEUR',
  NOUVEAU = 'NOUVEAU',
  THIS = 'THIS',
  VRAI = 'VRAI',
  FAUX = 'FAUX',
  NULL = 'NULL',

  // Opérateurs
  PLUS = 'PLUS',
  MOINS = 'MOINS',
  FOIS = 'FOIS',
  DIVISE = 'DIVISE',
  MODULO = 'MODULO',
  EGAL = 'EGAL',
  DOUBLE_EGAL = 'DOUBLE_EGAL',
  DIFFERENT = 'DIFFERENT',
  SUPERIEUR = 'SUPERIEUR',
  INFERIEUR = 'INFERIEUR',
  SUPERIEUR_EGAL = 'SUPERIEUR_EGAL',
  INFERIEUR_EGAL = 'INFERIEUR_EGAL',
  ET = 'ET',
  OU = 'OU',
  NON = 'NON',
  DOT = 'DOT',

  // Délimiteurs
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',
  COMMA = 'COMMA',
  COLON = 'COLON',

  // Littéraux
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',

  // Structure
  NEWLINE = 'NEWLINE',
  EOF = 'EOF',
  UNKNOWN = 'UNKNOWN'
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  position: number;
}

export interface TranspilerError {
  message: string;
  line: number;
  column: number;
  suggestion?: string;
  codeSnippet?: string;
}

export type ASTNode =
  | ProgramNode
  | VarDeclNode
  | AssignmentNode
  | PrintNode
  | InputNode
  | IfNode
  | SwitchNode
  | ForNode
  | WhileNode
  | FunctionDeclNode
  | ProcedureDeclNode
  | ClassDeclNode
  | ClassConstructorNode
  | ClassMethodNode
  | ImportNode
  | ExportNode
  | ReturnNode
  | ExpressionStmtNode;

export interface ProgramNode {
  type: 'Program';
  body: ASTNode[];
  line: number;
}

export interface VarDeclNode {
  type: 'VarDecl';
  kind: 'soit' | 'constante';
  name: string;
  varType?: string;
  value: ExpressionNode;
  line: number;
}

export interface AssignmentNode {
  type: 'Assignment';
  name?: string;
  target?: ExpressionNode;
  index?: ExpressionNode;
  value: ExpressionNode;
  line: number;
}

export interface PrintNode {
  type: 'Print';
  expressions: ExpressionNode[];
  line: number;
}

export interface InputNode {
  type: 'Input';
  variableName: string;
  promptText?: string;
  line: number;
}

export interface IfNode {
  type: 'If';
  condition: ExpressionNode;
  thenBranch: ASTNode[];
  elseIfBranches: { condition: ExpressionNode; body: ASTNode[] }[];
  elseBranch?: ASTNode[];
  line: number;
}

export interface SwitchCaseNode {
  value: ExpressionNode;
  body: ASTNode[];
  line: number;
}

export interface SwitchNode {
  type: 'Switch';
  expression: ExpressionNode;
  cases: SwitchCaseNode[];
  defaultBranch?: ASTNode[];
  line: number;
}

export interface ForNode {
  type: 'For';
  variable: string;
  start: ExpressionNode;
  end: ExpressionNode;
  step?: ExpressionNode;
  body: ASTNode[];
  line: number;
}

export interface WhileNode {
  type: 'While';
  condition: ExpressionNode;
  body: ASTNode[];
  line: number;
}

export interface FunctionDeclNode {
  type: 'FunctionDecl';
  name: string;
  params: string[];
  paramTypes?: Record<string, string>;
  returnType?: string;
  body: ASTNode[];
  line: number;
}

export interface ClassPropertyNode {
  type: 'ClassProperty';
  name: string;
  typeName?: string;
  line: number;
}

export interface ClassConstructorNode {
  type: 'ClassConstructor';
  params: string[];
  paramTypes?: Record<string, string>;
  body: ASTNode[];
  line: number;
}

export interface ClassMethodNode {
  type: 'ClassMethod';
  name: string;
  params: string[];
  paramTypes?: Record<string, string>;
  returnType?: string;
  body: ASTNode[];
  line: number;
}

export interface ClassDeclNode {
  type: 'ClassDecl';
  name: string;
  properties: ClassPropertyNode[];
  constructor?: ClassConstructorNode;
  methods: ClassMethodNode[];
  line: number;
}

export interface ProcedureDeclNode {
  type: 'ProcedureDecl';
  name: string;
  params: string[];
  paramTypes?: Record<string, string>;
  body: ASTNode[];
  line: number;
}

export interface ImportNode {
  type: 'Import';
  modulePath: string;
  alias?: string;
  line: number;
}

export interface ExportNode {
  type: 'Export';
  name: string;
  line: number;
}

export interface ReturnNode {
  type: 'Return';
  value?: ExpressionNode;
  line: number;
}

export interface ExpressionStmtNode {
  type: 'ExpressionStmt';
  expression: ExpressionNode;
  line: number;
}

export type ExpressionNode =
  | LiteralNode
  | IdentifierNode
  | BinaryOpNode
  | UnaryOpNode
  | CallNode
  | MemberAccessNode
  | NewNode
  | ArrayNode
  | IndexAccessNode;

export interface LiteralNode {
  type: 'Literal';
  value: any;
  rawType: 'number' | 'string' | 'boolean' | 'null';
  line: number;
}

export interface IdentifierNode {
  type: 'Identifier';
  name: string;
  line: number;
}

export interface BinaryOpNode {
  type: 'BinaryOp';
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
  line: number;
}

export interface UnaryOpNode {
  type: 'UnaryOp';
  operator: string;
  operand: ExpressionNode;
  line: number;
}

export interface CallNode {
  type: 'Call';
  callee: string | ExpressionNode;
  args: ExpressionNode[];
  line: number;
}

export interface MemberAccessNode {
  type: 'MemberAccess';
  object: ExpressionNode;
  property: string;
  line: number;
}

export interface NewNode {
  type: 'New';
  callee: string;
  args: ExpressionNode[];
  line: number;
}

export interface ArrayNode {
  type: 'Array';
  elements: ExpressionNode[];
  line: number;
}

export interface IndexAccessNode {
  type: 'IndexAccess';
  array: ExpressionNode;
  index: ExpressionNode;
  line: number;
}
