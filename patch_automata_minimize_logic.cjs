const fs = require('fs');
const file = 'src/lib/automata.ts';
let code = fs.readFileSync(file, 'utf8');

// I will overwrite the placeholder minimizeDfa with a real implementation
const newMinimizeDfa = `
export function minimizeDfa(dfa: Automata): ConversionStep[] {
  const steps: ConversionStep[] = [];
  
  steps.push({
    type: 'init',
    message: 'Starting DFA Minimization (Partition Refinement).',
    dfaStates: dfa.states.map(s => [s]),
    dfaTransitions: dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [dfa.startState],
    dfaAcceptStates: dfa.acceptStates.map(s => [s])
  });

  // Step 1: Remove Unreachable States
  const reachable = new Set<string>();
  const queue = [dfa.startState];
  reachable.add(dfa.startState);
  while(queue.length > 0) {
    const curr = queue.shift()!;
    for (const sym of dfa.alphabet) {
      const trans = dfa.transitions.find(t => t.from === curr && t.symbol === sym);
      if (trans && !reachable.has(trans.to)) {
        reachable.add(trans.to);
        queue.push(trans.to);
      }
    }
  }

  const reachableStates = Array.from(reachable);
  const reachableAccept = dfa.acceptStates.filter(s => reachable.has(s));
  const reachableNonAccept = reachableStates.filter(s => !dfa.acceptStates.includes(s));

  steps.push({
    type: 'process_state',
    message: \`Step 1: Removed \${dfa.states.length - reachableStates.length} unreachable states.\`,
    dfaStates: reachableStates.map(s => [s]),
    dfaTransitions: dfa.transitions.filter(t => reachable.has(t.from) && reachable.has(t.to)).map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [dfa.startState],
    dfaAcceptStates: reachableAccept.map(s => [s])
  });

  // Step 2: Initial Partitions
  let P = [];
  if (reachableAccept.length > 0) P.push(new Set(reachableAccept));
  if (reachableNonAccept.length > 0) P.push(new Set(reachableNonAccept));
  
  steps.push({
    type: 'process_state',
    message: 'Step 2: Initial partitions: Accept states and Non-Accept states.',
    dfaStates: P.map(part => Array.from(part)),
    dfaTransitions: dfa.transitions.filter(t => reachable.has(t.from) && reachable.has(t.to)).map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [dfa.startState],
    dfaAcceptStates: [reachableAccept]
  });

  // Step 3: Refine Partitions
  let W = [...P];
  while (W.length > 0) {
    const A = W.shift()!;
    for (const c of dfa.alphabet) {
      // X = states that transition to A on c
      const X = new Set<string>();
      for (const s of reachableStates) {
        const trans = dfa.transitions.find(t => t.from === s && t.symbol === c);
        if (trans && A.has(trans.to)) {
          X.add(s);
        }
      }

      for (let i = 0; i < P.length; i++) {
        const Y = P[i];
        const Y1 = new Set([...Y].filter(s => X.has(s)));
        const Y2 = new Set([...Y].filter(s => !X.has(s)));
        
        if (Y1.size > 0 && Y2.size > 0) {
          P.splice(i, 1, Y1, Y2);
          
          const wIndex = W.findIndex(w => w === Y);
          if (wIndex !== -1) {
            W.splice(wIndex, 1, Y1, Y2);
          } else {
            if (Y1.size <= Y2.size) W.push(Y1);
            else W.push(Y2);
          }
          i++; // Skip newly inserted element to avoid infinite loops
        }
      }
    }
  }

  // Map partitions to states
  const stateMap = new Map<string, string>();
  const minimizedStates: string[][] = [];
  const minimizedAcceptStates: string[][] = [];
  const minimizedStartState: string[] = [];

  P.forEach((part, index) => {
    const arr = Array.from(part);
    minimizedStates.push(arr);
    if (arr.includes(dfa.startState)) {
      minimizedStartState.push(...arr);
    }
    if (arr.some(s => dfa.acceptStates.includes(s))) {
      minimizedAcceptStates.push(arr);
    }
    arr.forEach(s => {
      stateMap.set(s, arr.join(','));
    });
  });

  const minimizedTransitionsMap = new Map<string, { from: string[], symbol: string, to: string[] }>();
  for (const t of dfa.transitions) {
    if (reachable.has(t.from) && reachable.has(t.to)) {
      const fromArr = Array.from(P.find(p => p.has(t.from))!);
      const toArr = Array.from(P.find(p => p.has(t.to))!);
      const key = \`\${fromArr.join(',')}::\${t.symbol}::\${toArr.join(',')}\`;
      if (!minimizedTransitionsMap.has(key)) {
        minimizedTransitionsMap.set(key, { from: fromArr, symbol: t.symbol, to: toArr });
      }
    }
  }

  steps.push({
    type: 'done',
    message: 'Minimization Complete. Merged equivalent states.',
    dfaStates: minimizedStates,
    dfaTransitions: Array.from(minimizedTransitionsMap.values()),
    dfaStartState: minimizedStartState,
    dfaAcceptStates: minimizedAcceptStates
  });

  return steps;
}
`;

const regex = /export function minimizeDfa.*?return steps;\n}/s;
code = code.replace(regex, newMinimizeDfa);

fs.writeFileSync(file, code);
