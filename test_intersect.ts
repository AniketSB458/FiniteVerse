function buildLangNfa(condition: string, str: string, alphabet: string[], prefix: string) {
    const chars = str.split('').filter(c => c.trim() !== '');
    if (chars.length === 0) chars.push('a');
    
    const states = [];
    for(let i=0; i<=chars.length; i++) states.push(`${prefix}${i}`);
    
    const transitions: {from: string, symbol: string, to: string}[] = [];
    if (condition === 'substring' || condition === 'ends_with') {
        for (const sym of alphabet) {
            transitions.push({ from: `${prefix}0`, symbol: sym, to: `${prefix}0` });
        }
    }
    
    for(let i=0; i<chars.length; i++) {
        transitions.push({ from: `${prefix}${i}`, symbol: chars[i], to: `${prefix}${i+1}` });
    }
    
    if (condition === 'substring' || condition === 'starts_with') {
        for (const sym of alphabet) {
            transitions.push({ from: `${prefix}${chars.length}`, symbol: sym, to: `${prefix}${chars.length}` });
        }
    }
    
    return {
        states,
        transitions,
        startState: `${prefix}0`,
        acceptStates: [`${prefix}${chars.length}`]
    };
}

function computeIntersection(cond1: string, str1: string, cond2: string, str2: string) {
    const chars1 = str1.split('').filter(c => c.trim() !== '');
    const chars2 = str2.split('').filter(c => c.trim() !== '');
    let alphabet = Array.from(new Set([...chars1, ...chars2]));
    if (alphabet.length === 0) alphabet = ['a', 'b'];

    const nfa1 = buildLangNfa(cond1, str1, alphabet, 'A');
    const nfa2 = buildLangNfa(cond2, str2, alphabet, 'B');

    const startState = `${nfa1.startState},${nfa2.startState}`;
    const productStates = new Set([startState]);
    const queue = [startState];
    const productTransitions: {from: string, symbol: string, to: string}[] = [];

    while (queue.length > 0) {
        const curr = queue.shift()!;
        const [qA, qB] = curr.split(',');

        for (const sym of alphabet) {
            const nextA = nfa1.transitions.filter(t => t.from === qA && t.symbol === sym).map(t => t.to);
            const nextB = nfa2.transitions.filter(t => t.from === qB && t.symbol === sym).map(t => t.to);

            for (const nA of nextA) {
                for (const nB of nextB) {
                    const nextState = `${nA},${nB}`;
                    productTransitions.push({ from: curr, symbol: sym, to: nextState });
                    if (!productStates.has(nextState)) {
                        productStates.add(nextState);
                        queue.push(nextState);
                    }
                }
            }
        }
    }
    
    const acceptStates = Array.from(productStates).filter(s => {
        const [qA, qB] = s.split(',');
        return nfa1.acceptStates.includes(qA) && nfa2.acceptStates.includes(qB);
    });

    return {
        states: Array.from(productStates),
        transitions: productTransitions,
        startState,
        acceptStates
    };
}

console.log(computeIntersection('substring', 'ab', 'starts_with', 'a'));
