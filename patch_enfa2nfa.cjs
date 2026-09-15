const fs = require('fs');
let code = fs.readFileSync('src/lib/automata.ts', 'utf8');

const newFunctions = `
export function convertEnfaToNfa(nfa: Automata): ConversionStep[] {
  const steps: ConversionStep[] = [];
  const nfaStates = nfa.states.map(s => [s]);
  const newTransitions: { from: string[]; symbol: string; to: string[] }[] = [];
  const alphabet = nfa.alphabet.filter(a => a !== '' && a !== 'e' && a !== 'ε');
  
  steps.push({
    type: 'init',
    message: 'Computing ε-closures for all states to remove ε-transitions.',
    dfaStates: nfaStates,
    dfaTransitions: [],
    dfaStartState: [nfa.startState],
    dfaAcceptStates: nfa.acceptStates.map(s => [s])
  });

  const newAcceptStates = new Set<string>(nfa.acceptStates);
  
  for (const state of nfa.states) {
    const closure = getEpsilonClosure([state], nfa.transitions);
    if (closure.some(s => nfa.acceptStates.includes(s))) {
      newAcceptStates.add(state);
    }
    
    for (const a of alphabet) {
      const reachable = new Set<string>();
      for (const cState of closure) {
        const trans = nfa.transitions.filter(t => t.from === cState && t.symbol === a);
        for (const t of trans) reachable.add(t.to);
      }
      const targetClosure = getEpsilonClosure(Array.from(reachable), nfa.transitions);
      for (const target of targetClosure) {
        newTransitions.push({ from: [state], symbol: a, to: [target] });
      }
    }
  }

  const uniqueTransitions: { from: string[]; symbol: string; to: string[] }[] = [];
  const seen = new Set<string>();
  for (const t of newTransitions) {
    const key = t.from[0] + ':' + t.symbol + ':' + t.to[0];
    if (!seen.has(key)) {
      seen.add(key);
      uniqueTransitions.push(t);
    }
  }

  steps.push({
    type: 'done',
    message: 'ε-transitions removed. Added direct transitions and updated accept states.',
    dfaStates: nfaStates,
    dfaTransitions: uniqueTransitions,
    dfaStartState: [nfa.startState],
    dfaAcceptStates: Array.from(newAcceptStates).map(s => [s])
  });

  return steps;
}

export function convertDfaToNfa(dfa: Automata): ConversionStep[] {
  return [{
    type: 'done',
    message: 'A DFA is already strictly a valid NFA by definition. No structural changes needed.',
    dfaStates: dfa.states.map(s => [s]),
    dfaTransitions: dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [dfa.startState],
    dfaAcceptStates: dfa.acceptStates.map(s => [s])
  }];
}
`;

code = code + newFunctions;
fs.writeFileSync('src/lib/automata.ts', code);
