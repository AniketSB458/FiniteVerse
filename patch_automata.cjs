const fs = require('fs');
let code = fs.readFileSync('src/lib/automata.ts', 'utf-8');

// The new DFA builder
const newHelpers = `
function buildLangDFA(condition: string, str: string, alphabet: string[], prefix: string) {
    const chars = str.split('').filter(c => c.trim() !== '');
    const m = chars.length;
    if (m === 0) chars.push('a');

    const states = [];
    for(let i=0; i<=m; i++) states.push(\`\${prefix}\${i}\`);
    const deadState = \`\${prefix}d\`;
    let usesDeadState = false;

    const transitions: {from: string, symbol: string, to: string}[] = [];
    const acceptStates: string[] = [];

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
                transitions.push({ from: \`\${prefix}\${i}\`, symbol: sym, to: deadState });
                usesDeadState = true;
            } else {
                transitions.push({ from: \`\${prefix}\${i}\`, symbol: sym, to: \`\${prefix}\${nextIdx}\` });
            }
        }
    }

    if (usesDeadState) {
        states.push(deadState);
        for (const sym of alphabet) {
            transitions.push({ from: deadState, symbol: sym, to: deadState });
        }
    }

    if (condition === 'exact') acceptStates.push(\`\${prefix}\${m}\`);
    else if (condition === 'starts_with') acceptStates.push(\`\${prefix}\${m}\`);
    else if (condition === 'ends_with') acceptStates.push(\`\${prefix}\${m}\`);
    else if (condition === 'substring') acceptStates.push(\`\${prefix}\${m}\`);
    else if (condition === 'not_contain') {
        for (let i = 0; i < m; i++) acceptStates.push(\`\${prefix}\${i}\`);
    }

    return {
        states,
        transitions,
        startState: \`\${prefix}0\`,
        acceptStates
    };
}
`;

const convertLangIntersectionCode = `
export function convertLangIntersection(cond1: string, str1: string, cond2: string, str2: string): ConversionStep[] {
    const steps: ConversionStep[] = [];
    const chars1 = str1.split('').filter(c => c.trim() !== '');
    const chars2 = str2.split('').filter(c => c.trim() !== '');
    let alphabet = Array.from(new Set([...chars1, ...chars2]));
    if (alphabet.length === 0) alphabet = ['a', 'b'];

    const dfa1 = buildLangDFA(cond1, str1, alphabet, 'A');
    const dfa2 = buildLangDFA(cond2, str2, alphabet, 'B');

    const startState = \`\${dfa1.startState},\${dfa2.startState}\`;
    const productStates = new Set([startState]);
    const queue = [startState];
    const productTransitions: {from: string[], symbol: string, to: string[]}[] = [];
    const dfaStates: string[][] = [[startState]];

    steps.push({
        type: 'init',
        message: \`Building Product Automaton (Intersection) for languages...\`,
        dfaStates: [[startState]],
        dfaTransitions: [],
        highlightDfaState: [startState],
        dfaStartState: [startState],
        dfaAcceptStates: []
    });

    while (queue.length > 0) {
        const curr = queue.shift()!;
        const [qA, qB] = curr.split(',');

        for (const sym of alphabet) {
            const nextA = dfa1.transitions.filter(t => t.from === qA && t.symbol === sym).map(t => t.to);
            const nextB = dfa2.transitions.filter(t => t.from === qB && t.symbol === sym).map(t => t.to);

            for (const nA of nextA) {
                for (const nB of nextB) {
                    const nextState = \`\${nA},\${nB}\`;
                    productTransitions.push({ from: [curr], symbol: sym, to: [nextState] });
                    if (!productStates.has(nextState)) {
                        productStates.add(nextState);
                        dfaStates.push([nextState]);
                        queue.push(nextState);
                        
                        const acceptStates = Array.from(productStates).filter(s => {
                            const [sA, sB] = s.split(',');
                            return dfa1.acceptStates.includes(sA) && dfa2.acceptStates.includes(sB);
                        }).map(s => [s]);

                        steps.push({
                            type: 'process_state',
                            message: \`Found product state {\${nextState}} on symbol '\${sym}'\`,
                            dfaStates: [...dfaStates],
                            dfaTransitions: [...productTransitions],
                            highlightDfaState: [nextState],
                            dfaStartState: [startState],
                            dfaAcceptStates: acceptStates
                        });
                    }
                }
            }
        }
    }
    
    const acceptStates = Array.from(productStates).filter(s => {
        const [qA, qB] = s.split(',');
        return dfa1.acceptStates.includes(qA) && dfa2.acceptStates.includes(qB);
    }).map(s => [s]);

    steps.push({
        type: 'done',
        message: \`Product Automaton generation complete.\`,
        dfaStates: [...dfaStates],
        dfaTransitions: [...productTransitions],
        highlightDfaState: [],
        dfaStartState: [startState],
        dfaAcceptStates: acceptStates
    });

    return steps;
}
`;

const convertLangToFaCode = `
export function convertLangToFa(condition: string, str: string): ConversionStep[] {
    const steps: ConversionStep[] = [];
    const chars = str.split('').filter(c => c.trim() !== '');
    if (chars.length === 0) chars.push('a');
    
    let alphabet = Array.from(new Set([...chars]));
    if (alphabet.length === 0) alphabet = ['a', 'b'];
    if (alphabet.length === 1) {
        alphabet.push(alphabet[0] === 'a' ? 'b' : 'a');
    }

    const dfa = buildLangDFA(condition, str, alphabet, 'q');

    const dfaStates = dfa.states.map(s => [s]);
    const dfaTransitions = dfa.transitions.map(t => ({ from: [t.from], symbol: t.symbol, to: [t.to] }));
    const dfaAcceptStates = dfa.acceptStates.map(s => [s]);

    steps.push({
        type: 'init',
        message: \`Generated Deterministic Finite Automaton for Language: \${condition.replace('_', ' ')} '\${str}'\`,
        dfaStates: [...dfaStates],
        dfaTransitions: [...dfaTransitions],
        highlightDfaState: [dfa.startState],
        dfaStartState: [dfa.startState],
        dfaAcceptStates: [...dfaAcceptStates]
    });

    return steps;
}
`;

// we need to replace convertLangToFa and convertLangIntersection and buildLangNfa
const startIndex1 = code.indexOf('export function convertLangToFa');
const endIndex1 = code.indexOf('export function convertNfaToDfa');
code = code.substring(0, startIndex1) + convertLangToFaCode + '\n\n' + code.substring(endIndex1);

const startIndex2 = code.indexOf('function buildLangNfa');
code = code.substring(0, startIndex2) + newHelpers + '\n\n' + convertLangIntersectionCode;

fs.writeFileSync('src/lib/automata.ts', code);
