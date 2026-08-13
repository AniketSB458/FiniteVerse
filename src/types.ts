export type Transition = {
  id: string;
  from: string;
  symbol: string;
  to: string;
};

export type Automata = {
  type?: 'DFA' | 'NFA';
  states: string[];
  alphabet: string[];
  transitions: Transition[];
  startState: string;
  acceptStates: string[];
};

export type ConversionStep = {
  type: 'init' | 'process_state' | 'add_transition' | 'done';
  message: string;
  dfaStates: string[][];
  dfaTransitions: { from: string[]; symbol: string; to: string[] }[];
  highlightNfaState?: string[];
  highlightDfaState?: string[];
  currentSymbol?: string;
  regexOutput?: string;
  dfaAcceptStates?: string[][];
  dfaStartState?: string[];
};

export type PumpingLemmaState = {
  language: string;
  p: number | '';
  w: string;
  x: string;
  y: string;
  z: string;
  i: number | '';
};
