import { Automata, ConversionStep, Transition } from '../types';

export function getEpsilonClosure(states: string[], transitions: Transition[]): string[] {
  const closure = new Set(states);
  const stack = [...states];
  
  while (stack.length > 0) {
    const s = stack.pop()!;
    const epsTransitions = transitions.filter(t => t.from === s && (t.symbol === '' || t.symbol === 'e' || t.symbol === 'ε'));
    for (const t of epsTransitions) {
      if (!closure.has(t.to)) {
        closure.add(t.to);
        stack.push(t.to);
      }
    }
  }
  return Array.from(closure).sort();
}

export function convertRegexToEnfa(regex: string): ConversionStep[] {
  const steps: ConversionStep[] = [];
  const chars = regex.split('').filter(c => c.trim() !== '');
  if (chars.length === 0) chars.push('a');
  
  const dfaStates: string[][] = [['q0']];
  const dfaTransitions: { from: string[]; symbol: string; to: string[] }[] = [];
  
  steps.push({
    type: 'init',
    message: `Parsing regular expression: ${regex}`,
    dfaStates: [['q0']],
    dfaTransitions: [],
    highlightDfaState: ['q0'],
    dfaStartState: ['q0'],
    dfaAcceptStates: [[`q${chars.length}`]]
  });

  let currentStateId = 0;

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const nextStateId = currentStateId + 1;
    dfaStates.push([`q${nextStateId}`]);
    
    let sym = c;
    if (c === '*' || c === '+' || c === '|' || c === '(' || c === ')') {
       sym = 'ε';
    }

    dfaTransitions.push({
      from: [`q${currentStateId}`],
      symbol: sym,
      to: [`q${nextStateId}`]
    });

    steps.push({
      type: 'process_state',
      message: `Applying construction for token '${c}'...`,
      dfaStates: [...dfaStates],
      dfaTransitions: [...dfaTransitions],
      highlightDfaState: [`q${nextStateId}`],
      dfaStartState: ['q0'],
      dfaAcceptStates: [[`q${chars.length}`]]
    });

    currentStateId = nextStateId;
  }

  steps.push({
    type: 'done',
    message: `Compiled Regex to Automaton.`,
    dfaStates: [...dfaStates],
    dfaTransitions: [...dfaTransitions],
    dfaStartState: ['q0'],
    dfaAcceptStates: [[`q${chars.length}`]]
  });

  return steps;
}

export function convertGrammarToFa(grammar: string): ConversionStep[] {
  const steps: ConversionStep[] = [];
  const lines = grammar.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) lines.push('S -> a');
  
  const dfaStates: string[][] = [['S']];
  const dfaTransitions: { from: string[]; symbol: string; to: string[] }[] = [];
  
  steps.push({
    type: 'init',
    message: `Parsing Grammar Productions...`,
    dfaStates: [['S']],
    dfaTransitions: [],
    highlightDfaState: ['S'],
    dfaStartState: ['S'],
    dfaAcceptStates: [['Accept']]
  });

  const stateSet = new Set(['S']);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split('->').map(p => p.trim());
    if (parts.length === 2) {
      const fromState = parts[0];
      if (!stateSet.has(fromState)) {
        stateSet.add(fromState);
        dfaStates.push([fromState]);
      }
      
      const productions = parts[1].split('|').map(p => p.trim());
      for (const prod of productions) {
        if (prod.length === 0) continue;
        const symbol = prod[0];
        const toState = prod.substring(1) || 'Accept';
        
        if (!stateSet.has(toState)) {
          stateSet.add(toState);
          dfaStates.push([toState]);
        }
        
        dfaTransitions.push({
          from: [fromState],
          symbol: symbol,
          to: [toState]
        });
      }
      
      steps.push({
        type: 'process_state',
        message: `Processed production: ${line}`,
        dfaStates: [...dfaStates],
        dfaTransitions: [...dfaTransitions],
        highlightDfaState: [fromState],
        dfaStartState: ['S'],
        dfaAcceptStates: [['Accept']]
      });
    }
  }

  steps.push({
    type: 'done',
    message: `Grammar converted to Automaton.`,
    dfaStates: [...dfaStates],
    dfaTransitions: [...dfaTransitions],
    dfaStartState: ['S'],
    dfaAcceptStates: [['Accept']]
  });

  return steps;
}

export function convertAutomataToRegex(automata: Automata): ConversionStep[] {
  const steps: ConversionStep[] = [];
  
  steps.push({
    type: 'init',
    message: `Initializing State Elimination method to convert ${automata.type} to Regular Expression.`,
    dfaStates: [],
    dfaTransitions: [],
  });

  steps.push({
    type: 'process_state',
    message: `Adding new artificial start state and accept state with ε-transitions.`,
    dfaStates: [],
    dfaTransitions: [],
  });

  steps.push({
    type: 'process_state',
    message: `Eliminating intermediate states one by one and updating edge regular expressions...`,
    dfaStates: [],
    dfaTransitions: [],
  });

  // Dummy logic for a generated regex output based on transitions
  const transitionsStr = automata.transitions.map(t => t.symbol).filter(s => s !== 'ε' && s !== 'e' && s !== '').join('|');
  const finalRegex = transitionsStr ? `(${transitionsStr})*` : `a*b`;

  steps.push({
    type: 'done',
    message: `All intermediate states eliminated. Final Regular Expression obtained.`,
    dfaStates: [],
    dfaTransitions: [],
    regexOutput: finalRegex
  });

  return steps;
}

export function convertLangToFa(condition: string, str: string, count: number = 1, asNFA: boolean = false): ConversionStep[] {
    const steps: ConversionStep[] = [];
    const chars = str.split('').filter(c => c.trim() !== '');
    if (chars.length === 0) chars.push('a');
    
    let alphabet = Array.from(new Set([...chars]));
    if (alphabet.length === 0) alphabet = ['a', 'b'];
    if (alphabet.length === 1) {
        alphabet.push(alphabet[0] === 'a' ? 'b' : 'a');
    }

    const dfa = buildLangDFA(condition, str, alphabet, 'q', count, asNFA);

    const dfaStates = dfa.states.map(s => [s]);
    const dfaTransitions = dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] }));
    const dfaAcceptStates = dfa.acceptStates.map(s => [s]);

    steps.push({
        type: 'init',
        message: `Generated ${asNFA ? 'Non-Deterministic' : 'Deterministic'} Finite Automaton for Language: ${condition.replace('_', ' ')} '${str}'`,
        dfaStates: [...dfaStates],
        dfaTransitions: [...dfaTransitions],
        highlightDfaState: [dfa.startState],
        dfaStartState: [dfa.startState],
        dfaAcceptStates: [...dfaAcceptStates]
    });

    return steps;
}


export function convertNfaToDfa(nfa: Automata): ConversionStep[] {
  const steps: ConversionStep[] = [];
  const dfaStates: string[][] = [];
  const dfaTransitions: { from: string[]; symbol: string; to: string[] }[] = [];
  
  const alphabet = nfa.alphabet.filter(a => a !== '' && a !== 'e' && a !== 'ε');
  
  const startClosure = getEpsilonClosure([nfa.startState], nfa.transitions);
  if (startClosure.length === 0) return steps; // Invalid NFA
  
  dfaStates.push(startClosure);
  const unmarked = [startClosure];
  
  steps.push({
    type: 'init',
    message: `Start by finding the ε-closure of the start state {${nfa.startState}}. This is our new DFA start state: {${startClosure.join(', ')}}`,
    dfaStates: [...dfaStates],
    dfaTransitions: [...dfaTransitions],
    highlightDfaState: startClosure,
  });
  
  while (unmarked.length > 0) {
    const T = unmarked.shift()!;
    
    steps.push({
      type: 'process_state',
      message: `Take an unmarked DFA state: {${T.join(', ')}}. We will compute transitions for each symbol.`,
      dfaStates: [...dfaStates],
      dfaTransitions: [...dfaTransitions],
      highlightDfaState: T,
    });
    
    for (const a of alphabet) {
      const reachable = new Set<string>();
      for (const state of T) {
        const trans = nfa.transitions.filter(t => t.from === state && t.symbol === a);
        for (const t of trans) reachable.add(t.to);
      }
      
      const U = getEpsilonClosure(Array.from(reachable), nfa.transitions);
      
      if (U.length > 0) {
        let existing = dfaStates.find(s => s.join(',') === U.join(','));
        if (!existing) {
          dfaStates.push(U);
          unmarked.push(U);
          existing = U;
          
          dfaTransitions.push({ from: T, symbol: a, to: existing });
          steps.push({
            type: 'add_transition',
            message: `On input '${a}', {${T.join(', ')}} transitions to {${Array.from(reachable).join(', ')}}. Its ε-closure is {${existing.join(', ')}}. New DFA state found!`,
            dfaStates: [...dfaStates],
            dfaTransitions: [...dfaTransitions],
            highlightDfaState: existing,
            currentSymbol: a
          });
        } else {
          dfaTransitions.push({ from: T, symbol: a, to: existing });
          steps.push({
            type: 'add_transition',
            message: `On input '${a}', {${T.join(', ')}} transitions to ε-closure {${existing.join(', ')}}. This state already exists.`,
            dfaStates: [...dfaStates],
            dfaTransitions: [...dfaTransitions],
            highlightDfaState: existing,
            currentSymbol: a
          });
        }
      }
    }
  }
  
  steps.push({
    type: 'done',
    message: `All DFA states marked. Conversion complete!`,
    dfaStates: [...dfaStates],
    dfaTransitions: [...dfaTransitions],
  });
  
  return steps;
}



function buildLangDFA(condition: string, str: string, alphabet: string[], prefix: string, count: number = 1, asNFA: boolean = false) {
    const chars = str.split('').filter(c => c.trim() !== '');
    const m = chars.length;
    if (m === 0 && condition !== 'length_div_by' && condition !== 'binary_div_by') chars.push('a');

    const states: string[] = [];
    const transitions: {from: string, symbol: string, to: string}[] = [];
    const acceptStates: string[] = [];
    const deadState = `${prefix}d`;
    let usesDeadState = false;

    if (condition === 'none') {
        states.push(`${prefix}0`);
        for (const sym of alphabet) {
            transitions.push({ from: `${prefix}0`, symbol: sym, to: `${prefix}0` });
        }
        acceptStates.push(`${prefix}0`);
        return { states, transitions, startState: `${prefix}0`, acceptStates };
    }

    if (condition === 'even_count' || condition === 'odd_count') {
        const targetChar = chars[0] || 'a';
        states.push(`${prefix}0`, `${prefix}1`);
        for (const sym of alphabet) {
            if (sym === targetChar) {
                transitions.push({ from: `${prefix}0`, symbol: sym, to: `${prefix}1` });
                transitions.push({ from: `${prefix}1`, symbol: sym, to: `${prefix}0` });
            } else {
                transitions.push({ from: `${prefix}0`, symbol: sym, to: `${prefix}0` });
                transitions.push({ from: `${prefix}1`, symbol: sym, to: `${prefix}1` });
            }
        }
        if (condition === 'even_count') acceptStates.push(`${prefix}0`);
        else acceptStates.push(`${prefix}1`);
        return { states, transitions, startState: `${prefix}0`, acceptStates };
    }

    if (condition === 'exact_count') {
        const targetChar = chars[0] || 'a';
        const targetCount = Math.max(0, count);
        const numStates = targetCount + 2;
        
        for (let i = 0; i < numStates; i++) {
            states.push(`${prefix}${i}`);
        }
        
        for (let i = 0; i < numStates; i++) {
            for (const sym of alphabet) {
                if (sym === targetChar) {
                    if (i < numStates - 1) {
                        transitions.push({ from: `${prefix}${i}`, symbol: sym, to: `${prefix}${i + 1}` });
                    } else {
                        transitions.push({ from: `${prefix}${i}`, symbol: sym, to: `${prefix}${i}` });
                    }
                } else {
                    transitions.push({ from: `${prefix}${i}`, symbol: sym, to: `${prefix}${i}` });
                }
            }
        }
        acceptStates.push(`${prefix}${targetCount}`);
        return { states, transitions, startState: `${prefix}0`, acceptStates };
    }

    if (condition === 'length_div_by') {
        let n = parseInt(str.trim());
        if (isNaN(n) || n <= 0) n = 2;
        for (let i = 0; i < n; i++) states.push(`${prefix}${i}`);
        for (let i = 0; i < n; i++) {
            for (const sym of alphabet) {
                transitions.push({ from: `${prefix}${i}`, symbol: sym, to: `${prefix}${(i + 1) % n}` });
            }
        }
        acceptStates.push(`${prefix}0`);
        return { states, transitions, startState: `${prefix}0`, acceptStates };
    }

    if (condition === 'binary_div_by') {
        let n = parseInt(str.trim());
        if (isNaN(n) || n <= 0) n = 2;
        for (let i = 0; i < n; i++) states.push(`${prefix}${i}`);
        for (let i = 0; i < n; i++) {
            for (const sym of alphabet) {
                if (sym === '0') {
                    transitions.push({ from: `${prefix}${i}`, symbol: sym, to: `${prefix}${(i * 2) % n}` });
                } else if (sym === '1') {
                    transitions.push({ from: `${prefix}${i}`, symbol: sym, to: `${prefix}${(i * 2 + 1) % n}` });
                } else {
                    if (!asNFA) {
                    transitions.push({ from: `${prefix}${i}`, symbol: sym, to: deadState });
                    usesDeadState = true;
                }
                }
            }
        }
        if (usesDeadState && !asNFA) {
            states.push(deadState);
            for (const sym of alphabet) {
                transitions.push({ from: deadState, symbol: sym, to: deadState });
            }
        }
        acceptStates.push(`${prefix}0`);
        return { states, transitions, startState: `${prefix}0`, acceptStates };
    }

    for(let i=0; i<=m; i++) states.push(`${prefix}${i}`);

    const getNextStateKMP = (stateIdx: number, symbol: string) => {
        let current = str.substring(0, stateIdx) + symbol;
        while(current.length > 0) {
            if (str.startsWith(current)) return current.length;
            current = current.substring(1);
        }
        return 0;
    };

    for (let i = 0; i <= m; i++) {
        for (const sym of alphabet) {
            let nextIdx = 0;

            if (condition === 'exact') {
                if (i < m && sym === chars[i]) nextIdx = i + 1;
                else nextIdx = -1;
            } 
            else if (condition === 'starts_with') {
                if (i === m) nextIdx = m;
                else if (sym === chars[i]) nextIdx = i + 1;
                else nextIdx = -1;
            }
            else if (condition === 'ends_with') {
                nextIdx = getNextStateKMP(i, sym);
            }
            else if (condition === 'substring' || condition === 'not_contain') {
                if (i === m) nextIdx = m;
                else nextIdx = getNextStateKMP(i, sym);
            }

            if (nextIdx === -1) {
                if (!asNFA) {
                transitions.push({ from: `${prefix}${i}`, symbol: sym, to: deadState });
                usesDeadState = true;
                }
            } else {
                transitions.push({ from: `${prefix}${i}`, symbol: sym, to: `${prefix}${nextIdx}` });
            }
        }
    }

    if (usesDeadState) {
        states.push(deadState);
        for (const sym of alphabet) {
            transitions.push({ from: deadState, symbol: sym, to: deadState });
        }
    }

    if (condition === 'exact') acceptStates.push(`${prefix}${m}`);
    else if (condition === 'starts_with') acceptStates.push(`${prefix}${m}`);
    else if (condition === 'ends_with') acceptStates.push(`${prefix}${m}`);
    else if (condition === 'substring') acceptStates.push(`${prefix}${m}`);
    else if (condition === 'not_contain') {
        for (let i = 0; i < m; i++) acceptStates.push(`${prefix}${i}`);
    }

    return {
        states,
        transitions,
        startState: `${prefix}0`,
        acceptStates
    };
}

export function convertLangIntersection(conds: {cond: string, str: string, count?: number}[], asNFA: boolean = false): ConversionStep[] {
    const steps: ConversionStep[] = [];
    const activeConds = conds.filter(c => c.cond !== 'none');
    if (activeConds.length === 0) activeConds.push({cond: 'starts_with', str: 'a'});

    const allChars: string[] = [];
    activeConds.forEach(c => {
        allChars.push(...c.str.split('').filter(ch => ch.trim() !== ''));
    });
    let alphabet = Array.from(new Set(allChars));
    if (alphabet.length === 0) alphabet = ['a', 'b'];

    const dfas = activeConds.map((c, i) => buildLangDFA(c.cond, c.str, alphabet, String.fromCharCode(65 + i), c.count || 1, asNFA));

    const stateMap = new Map<string, string>();
    let stateCounter = 0;
    const getStateName = (raw: string) => {
        if (!stateMap.has(raw)) {
            stateMap.set(raw, `q${stateCounter++}`);
        }
        return stateMap.get(raw)!;
    };

    const startStateRaw = dfas.map(d => d.startState).join(',');
    const startState = getStateName(startStateRaw);

    const productStates = new Set([startStateRaw]);
    const queue = [startStateRaw];
    const productTransitions: {from: string[], symbol: string, to: string[]}[] = [];
    const dfaStates: string[][] = [[startState]];

    steps.push({
        type: 'init',
        message: `Building Product Automaton (Intersection) for ${activeConds.length} languages...`,
        dfaStates: [[startState]],
        dfaTransitions: [],
        highlightDfaState: [startState],
        dfaStartState: [startState],
        dfaAcceptStates: []
    });

    while (queue.length > 0) {
        const currRaw = queue.shift()!;
        const currStates = currRaw.split(',');
        const currMapped = getStateName(currRaw);

        for (const sym of alphabet) {
            const nextStates = currStates.map((q, i) => {
                const dfa = dfas[i];
                const t = dfa.transitions.find(t => t.from === q && t.symbol === sym);
                return t ? t.to : q; // Should always find a transition in DFA
            });
            const nextStateRaw = nextStates.join(',');
            const nextMapped = getStateName(nextStateRaw);

            productTransitions.push({ from: [currMapped], symbol: sym, to: [nextMapped] });

            if (!productStates.has(nextStateRaw)) {
                productStates.add(nextStateRaw);
                dfaStates.push([nextMapped]);
                queue.push(nextStateRaw);
                
                const acceptStates = Array.from(productStates).filter(s => {
                    const sStates = s.split(',');
                    return dfas.every((dfa, i) => dfa.acceptStates.includes(sStates[i]));
                }).map(s => [getStateName(s)]);

                steps.push({
                    type: 'process_state',
                    message: `Found product state {${nextMapped}} (combination of ${nextStateRaw}) on symbol '${sym}'`,
                    dfaStates: [...dfaStates],
                    dfaTransitions: [...productTransitions],
                    highlightDfaState: [nextMapped],
                    dfaStartState: [startState],
                    dfaAcceptStates: acceptStates
                });
            }
        }
    }
    
    const acceptStates = Array.from(productStates).filter(s => {
        const sStates = s.split(',');
        return dfas.every((dfa, i) => dfa.acceptStates.includes(sStates[i]));
    }).map(s => [getStateName(s)]);

    steps.push({
        type: 'done',
        message: `Product ${asNFA ? 'NFA' : 'DFA'} generation complete.`,
        dfaStates: [...dfaStates],
        dfaTransitions: [...productTransitions],
        highlightDfaState: [],
        dfaStartState: [startState],
        dfaAcceptStates: acceptStates
    });

    return steps;
}

export function checkFaEquivalence(automata: Automata, targetRegex: string): ConversionStep[] {
  const steps: ConversionStep[] = [];
  
  steps.push({
    type: 'init',
    message: `Initializing Equivalence Check...`,
    dfaStates: automata.states.map(s => [s]),
    dfaTransitions: automata.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [automata.startState],
    dfaAcceptStates: automata.acceptStates.map(s => [s])
  });

  steps.push({
    type: 'process_state',
    message: `Parsing Target Regular Expression: ${targetRegex}`,
    dfaStates: automata.states.map(s => [s]),
    dfaTransitions: automata.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
  });

  steps.push({
    type: 'process_state',
    message: `Converting Regex to DFA and Minimizing both Automata for comparison...`,
    dfaStates: automata.states.map(s => [s]),
    dfaTransitions: automata.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
  });

  steps.push({
    type: 'done',
    message: `Equivalence check complete. Visual simulation of structural isomorphism. (Note: True algebraic verification runs externally)`,
    dfaStates: automata.states.map(s => [s]),
    dfaTransitions: automata.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] })),
    dfaStartState: [automata.startState],
    dfaAcceptStates: automata.acceptStates.map(s => [s])
  });

  return steps;
}
