const fs = require('fs');
let code = fs.readFileSync('src/lib/automata.ts', 'utf-8');

const convertLangIntersectionCode = `
export function convertLangIntersection(conds: {cond: string, str: string}[]): ConversionStep[] {
    const steps: ConversionStep[] = [];
    const activeConds = conds.filter(c => c.cond !== 'none');
    if (activeConds.length === 0) activeConds.push({cond: 'starts_with', str: 'a'});

    const allChars: string[] = [];
    activeConds.forEach(c => {
        allChars.push(...c.str.split('').filter(ch => ch.trim() !== ''));
    });
    let alphabet = Array.from(new Set(allChars));
    if (alphabet.length === 0) alphabet = ['a', 'b'];

    const dfas = activeConds.map((c, i) => buildLangDFA(c.cond, c.str, alphabet, String.fromCharCode(65 + i)));

    const startState = dfas.map(d => d.startState).join(',');
    const productStates = new Set([startState]);
    const queue = [startState];
    const productTransitions: {from: string[], symbol: string, to: string[]}[] = [];
    const dfaStates: string[][] = [[startState]];

    steps.push({
        type: 'init',
        message: \`Building Product Automaton (Intersection) for \${activeConds.length} languages...\`,
        dfaStates: [[startState]],
        dfaTransitions: [],
        highlightDfaState: [startState],
        dfaStartState: [startState],
        dfaAcceptStates: []
    });

    while (queue.length > 0) {
        const curr = queue.shift()!;
        const currStates = curr.split(',');

        for (const sym of alphabet) {
            const nextStates = currStates.map((q, i) => {
                const dfa = dfas[i];
                const t = dfa.transitions.find(t => t.from === q && t.symbol === sym);
                return t ? t.to : q; // Should always find a transition in DFA
            });
            const nextState = nextStates.join(',');

            productTransitions.push({ from: [curr], symbol: sym, to: [nextState] });
            if (!productStates.has(nextState)) {
                productStates.add(nextState);
                dfaStates.push([nextState]);
                queue.push(nextState);
                
                const acceptStates = Array.from(productStates).filter(s => {
                    const sStates = s.split(',');
                    return dfas.every((dfa, i) => dfa.acceptStates.includes(sStates[i]));
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
    
    const acceptStates = Array.from(productStates).filter(s => {
        const sStates = s.split(',');
        return dfas.every((dfa, i) => dfa.acceptStates.includes(sStates[i]));
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

const startIndex = code.indexOf('export function convertLangIntersection');
code = code.substring(0, startIndex) + convertLangIntersectionCode;

fs.writeFileSync('src/lib/automata.ts', code);
