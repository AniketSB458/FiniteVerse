const fs = require('fs');
const file = 'src/lib/automata.ts';
let code = fs.readFileSync(file, 'utf8');

const newPumpingLogic = `
export function simulatePumpingLemma(dfa: Automata): ConversionStep[] {
  const steps: ConversionStep[] = [];
  const p = dfa.states.length;
  
  steps.push({
    type: 'init',
    message: \`Pumping Lemma Analysis: Let pumping length p = \${p} (number of states).\`,
    dfaStates: dfa.states.map(s => [s]),
    dfaTransitions: dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [dfa.startState],
    dfaAcceptStates: dfa.acceptStates.map(s => [s])
  });

  // Find a cycle reachable from start state and leading to an accept state
  // DFS to find paths
  let foundPath: string[] | null = null;
  let loopStartIdx = -1;
  let loopEndIdx = -1;

  const visited = new Set<string>();
  const path: string[] = [];
  
  function dfs(curr: string) {
    if (foundPath) return;
    path.push(curr);
    
    // Check if we hit an accept state AND we have a loop in the path
    if (dfa.acceptStates.includes(curr)) {
      // Find the first repeating state in the path
      const stateSeen = new Map<string, number>();
      for (let i = 0; i < path.length; i++) {
        if (stateSeen.has(path[i])) {
          foundPath = [...path];
          loopStartIdx = stateSeen.get(path[i])!;
          loopEndIdx = i;
          return;
        }
        stateSeen.set(path[i], i);
      }
    }

    // Try to continue
    for (const c of dfa.alphabet) {
      if (foundPath) return;
      const trans = dfa.transitions.find(t => t.from === curr && t.symbol === c);
      if (trans) {
        // We allow visiting same state to detect loop, but prevent infinite recursion
        if (path.filter(x => x === trans.to).length < 2) {
           dfs(trans.to);
        }
      }
    }
    path.pop();
  }

  dfs(dfa.startState);

  if (!foundPath) {
    steps.push({
      type: 'done',
      message: \`Could not find a valid cycle leading to an accept state. The language might be finite, in which case the Pumping Lemma is vacuously true.\`,
      dfaStates: dfa.states.map(s => [s]),
      dfaTransitions: dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
      dfaStartState: [dfa.startState],
      dfaAcceptStates: dfa.acceptStates.map(s => [s])
    });
    return steps;
  }

  const loopState = foundPath[loopStartIdx];

  steps.push({
    type: 'process_state',
    message: \`Select a string w traversing the automaton. By Pigeonhole Principle, visiting > p states means a state repeats. State '\${loopState}' repeats.\`,
    dfaStates: dfa.states.map(s => [s]),
    dfaTransitions: dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [dfa.startState],
    dfaAcceptStates: dfa.acceptStates.map(s => [s]),
    highlightDfaState: [loopState]
  });

  steps.push({
    type: 'process_state',
    message: \`We partition w = xyz. 'x' reaches '\${loopState}'. 'y' is the cycle from '\${loopState}' back to itself. 'z' goes to the accept state.\`,
    dfaStates: dfa.states.map(s => [s]),
    dfaTransitions: dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [dfa.startState],
    dfaAcceptStates: dfa.acceptStates.map(s => [s]),
    highlightDfaState: [loopState]
  });

  steps.push({
    type: 'done',
    message: \`We can "pump" 'y' (xy^iz). Since the automaton loops on 'y' indefinitely, all pumped strings will still successfully reach the accept state.\`,
    dfaStates: dfa.states.map(s => [s]),
    dfaTransitions: dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [dfa.startState],
    dfaAcceptStates: dfa.acceptStates.map(s => [s]),
    highlightDfaState: [loopState]
  });

  return steps;
}
`;

const regex = /export function simulatePumpingLemma.*?return steps;\n}/s;
code = code.replace(regex, newPumpingLogic);

fs.writeFileSync(file, code);
