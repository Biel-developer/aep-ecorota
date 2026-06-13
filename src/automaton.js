// Este módulo implementa o conceito de AFD conforme SIPSER (2012), aplicado
// ao controle de estados de navegação do usuário no aplicativo.
//
// Definição formal de um AFD: M = (Q, Σ, δ, q0, F)
//   Q  = conjunto de estados
//   Σ  = alfabeto (eventos possíveis)
//   δ  = função de transição δ: Q × Σ → Q
//   q0 = estado inicial
//   F  = conjunto de estados de aceitação (finais)


// --------------------------------------------------
// Q – Conjunto de estados do sistema
// --------------------------------------------------
export const STATES = {
  IDLE:           'idle',           // Aguardando interação
  SCANNING:       'scanning',       // Câmera aberta, escaneando resíduo
  CLASSIFYING:    'classifying',    // IA processando a imagem capturada
  RESULT_SHOWN:   'result_shown',   // Resultado da classificação exibido
  ROUTE_PLANNING: 'route_planning', // Calculando rota para ecoponto
  NAVIGATING:     'navigating',     // Usuário a caminho do ecoponto
  COMPLETED:      'completed',      // Descarte concluído
  ERROR:          'error',          // Estado de erro (falha na câmera/rede)
};


// Σ – Alfabeto (eventos que disparam transições)
export const EVENTS = {
  OPEN_CAMERA:       'OPEN_CAMERA',
  CAPTURE_IMAGE:     'CAPTURE_IMAGE',
  CLASSIFICATION_OK: 'CLASSIFICATION_OK',
  CLASSIFICATION_FAIL: 'CLASSIFICATION_FAIL',
  REQUEST_ROUTE:     'REQUEST_ROUTE',
  START_NAVIGATION:  'START_NAVIGATION',
  CONFIRM_DISPOSAL:  'CONFIRM_DISPOSAL',
  RESET:             'RESET',
  ERROR_OCCURRED:    'ERROR_OCCURRED',
};


// δ – Tabela de transição de estados
// Estrutura: transitionTable[estado_atual][evento] = proximo_estado
const transitionTable = {
  [STATES.IDLE]: {
    [EVENTS.OPEN_CAMERA]:   STATES.SCANNING,
    [EVENTS.ERROR_OCCURRED]: STATES.ERROR,
  },
  [STATES.SCANNING]: {
    [EVENTS.CAPTURE_IMAGE]:  STATES.CLASSIFYING,
    [EVENTS.RESET]:          STATES.IDLE,
    [EVENTS.ERROR_OCCURRED]: STATES.ERROR,
  },
  [STATES.CLASSIFYING]: {
    [EVENTS.CLASSIFICATION_OK]:   STATES.RESULT_SHOWN,
    [EVENTS.CLASSIFICATION_FAIL]: STATES.ERROR,
  },
  [STATES.RESULT_SHOWN]: {
    [EVENTS.REQUEST_ROUTE]: STATES.ROUTE_PLANNING,
    [EVENTS.RESET]:         STATES.IDLE,
  },
  [STATES.ROUTE_PLANNING]: {
    [EVENTS.START_NAVIGATION]: STATES.NAVIGATING,
    [EVENTS.RESET]:            STATES.IDLE,
    [EVENTS.ERROR_OCCURRED]:   STATES.ERROR,
  },
  [STATES.NAVIGATING]: {
    [EVENTS.CONFIRM_DISPOSAL]: STATES.COMPLETED,
    [EVENTS.RESET]:            STATES.IDLE,
  },
  [STATES.COMPLETED]: {
    [EVENTS.RESET]: STATES.IDLE,
  },
  [STATES.ERROR]: {
    [EVENTS.RESET]: STATES.IDLE,
  },
};


// Função de transição δ(estado_atual, evento) → próximo_estado
// Retorna null se a transição não for definida (transição inválida)
export function transition(currentState, event) {
  const stateTransitions = transitionTable[currentState];
  if (!stateTransitions) return null;
  return stateTransitions[event] ?? null;
}

// F – Estados de aceitação (fluxo completado com sucesso)
export const ACCEPTING_STATES = new Set([STATES.COMPLETED]);

export function isAcceptingState(state) {
  return ACCEPTING_STATES.has(state);
}

// Classe AFD – encapsula estado atual e histórico
// Usada pelos componentes React para controlar fluxo de telas
export class AFD {
  constructor() {
    this.currentState = STATES.IDLE; // q0 – estado inicial
    this.history      = [STATES.IDLE];
  }

  // Aplica um evento e avança para o próximo estado
  dispatch(event) {
    const nextState = transition(this.currentState, event);
    if (nextState === null) {
      console.warn(`[AFD] Transição inválida: δ(${this.currentState}, ${event})`);
      return false;
    }
    this.history.push(nextState);
    this.currentState = nextState;
    return true;
  }

  getState() {
    return this.currentState;
  }

  isCompleted() {
    return isAcceptingState(this.currentState);
  }

  // Reinicia o autômato para o estado inicial q0
  reset() {
    this.currentState = STATES.IDLE;
    this.history      = [STATES.IDLE];
  }
}
