import { TranspilerError } from './types';

export interface ConsoleLog {
  id: string;
  type: 'info' | 'output' | 'input' | 'warn' | 'error' | 'system';
  text: string;
  line?: number;
  timestamp: Date;
}

export interface VariableState {
  name: string;
  value: any;
  type: string;
}

export class CodeExecutor {
  private logs: ConsoleLog[] = [];
  private onLogCallback?: (logs: ConsoleLog[]) => void;
  private onLineHighlightCallback?: (line: number | null) => void;
  private onVariablesUpdateCallback?: (vars: VariableState[]) => void;
  private onInputRequestCallback?: (promptText: string, resolve: (val: string) => void) => void;
  private onStateChangeCallback?: (state: 'idle' | 'running' | 'paused' | 'finished' | 'error' | 'waiting_input') => void;

  private isStepByStep: boolean = false;
  private stepResolver: (() => void) | null = null;
  private isStopped: boolean = false;

  constructor(callbacks: {
    onLog?: (logs: ConsoleLog[]) => void;
    onLineHighlight?: (line: number | null) => void;
    onVariablesUpdate?: (vars: VariableState[]) => void;
    onInputRequest?: (promptText: string, resolve: (val: string) => void) => void;
    onStateChange?: (state: 'idle' | 'running' | 'paused' | 'finished' | 'error' | 'waiting_input') => void;
  }) {
    this.onLogCallback = callbacks.onLog;
    this.onLineHighlightCallback = callbacks.onLineHighlight;
    this.onVariablesUpdateCallback = callbacks.onVariablesUpdate;
    this.onInputRequestCallback = callbacks.onInputRequest;
    this.onStateChangeCallback = callbacks.onStateChange;
  }

  public clearLogs() {
    this.logs = [];
    if (this.onLogCallback) this.onLogCallback([...this.logs]);
  }

  public stop() {
    this.isStopped = true;
    if (this.stepResolver) {
      this.stepResolver();
      this.stepResolver = null;
    }
    if (this.onLineHighlightCallback) this.onLineHighlightCallback(null);
    if (this.onStateChangeCallback) this.onStateChangeCallback('idle');
  }

  public nextStep() {
    if (this.stepResolver) {
      const resolve = this.stepResolver;
      this.stepResolver = null;
      resolve();
    }
  }

  public async run(jsCode: string, isStepByStep: boolean = false): Promise<boolean> {
    this.clearLogs();
    this.isStopped = false;
    this.isStepByStep = isStepByStep;

    if (this.onStateChangeCallback) this.onStateChangeCallback('running');

    this.addLog('system', isStepByStep ? '▶ Démarrage de l\'exécution pas-à-pas...' : '▶ Démarrage de l\'exécution...');

    // Environnement de sandbox pour l'exécution
    const self = this;

    const __affiche__ = async (...args: any[]) => {
      if (self.isStopped) throw new Error('EXECUTION_STOPPED');
      const text = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      self.addLog('output', text);
    };

    const __lire__ = async (promptText: string): Promise<any> => {
      if (self.isStopped) throw new Error('EXECUTION_STOPPED');
      self.addLog('info', `📥 Demande de saisie : ${promptText}`);
      if (self.onStateChangeCallback) self.onStateChangeCallback('waiting_input');

      return new Promise((resolve) => {
        if (self.onInputRequestCallback) {
          self.onInputRequestCallback(promptText, (inputVal) => {
            if (self.onStateChangeCallback) self.onStateChangeCallback('running');
            self.addLog('input', `> ${inputVal}`);
            // Essayer de convertir en nombre si c'est un chiffre
            const num = Number(inputVal);
            if (!isNaN(num) && inputVal.trim() !== '') {
              resolve(num);
            } else if (inputVal.toLowerCase() === 'vrai') {
              resolve(true);
            } else if (inputVal.toLowerCase() === 'faux') {
              resolve(false);
            } else {
              resolve(inputVal);
            }
          });
        } else {
          // Fallback avec window.prompt
          const val = prompt(promptText) || '';
          if (self.onStateChangeCallback) self.onStateChangeCallback('running');
          self.addLog('input', `> ${val}`);
          const num = Number(val);
          resolve(!isNaN(num) && val.trim() !== '' ? num : val);
        }
      });
    };

    const trackedVarsMap = new Map<string, VariableState>();

    const __var__ = (name: string, value: any, explicitType?: string | null) => {
      let typeName = explicitType || 'any';
      if (!explicitType) {
        if (typeof value === 'number') typeName = Number.isInteger(value) ? 'entier' : 'réel';
        else if (typeof value === 'boolean') typeName = 'booleen';
        else if (typeof value === 'string') typeName = 'texte';
        else if (Array.isArray(value)) typeName = 'tableau';
      }
      trackedVarsMap.set(name, { name, value, type: typeName });
      if (self.onVariablesUpdateCallback) {
        self.onVariablesUpdateCallback(Array.from(trackedVarsMap.values()));
      }
    };

    const __step__ = async (line: number) => {
      if (self.isStopped) throw new Error('EXECUTION_STOPPED');

      if (self.onVariablesUpdateCallback) {
        self.onVariablesUpdateCallback(Array.from(trackedVarsMap.values()));
      }

      if (self.onLineHighlightCallback) {
        self.onLineHighlightCallback(line);
      }

      if (self.isStepByStep) {
        if (self.onStateChangeCallback) self.onStateChangeCallback('paused');
        await new Promise<void>((resolve) => {
          self.stepResolver = resolve;
        });
        if (self.onStateChangeCallback) self.onStateChangeCallback('running');
      }
    };

    try {
      // Construction de la fonction dynamique sécurisée
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const runner = new AsyncFunction('__affiche__', '__lire__', '__step__', '__var__', jsCode);

      await runner(__affiche__, __lire__, __step__, __var__);

      if (this.onLineHighlightCallback) this.onLineHighlightCallback(null);
      this.addLog('system', '✓ Exécution terminée avec succès.');
      if (this.onStateChangeCallback) this.onStateChangeCallback('finished');
      return true;
    } catch (err: any) {
      if (err.message === 'EXECUTION_STOPPED') {
        this.addLog('system', '⏹ Exécution interrompue par l\'utilisateur.');
      } else {
        this.addLog('error', `❌ Erreur d'exécution : ${err.message}`);
        if (this.onStateChangeCallback) this.onStateChangeCallback('error');
      }
      if (this.onLineHighlightCallback) this.onLineHighlightCallback(null);
      return false;
    }
  }

  private addLog(type: ConsoleLog['type'], text: string, line?: number) {
    const log: ConsoleLog = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      text,
      line,
      timestamp: new Date(),
    };
    this.logs.push(log);
    if (this.onLogCallback) {
      this.onLogCallback([...this.logs]);
    }
  }
}
