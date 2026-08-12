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
console.log(buildLangNfa('substring', 'ab', ['a', 'b'], 'A_'));
