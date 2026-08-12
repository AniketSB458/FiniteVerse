const fs = require('fs');
let code = fs.readFileSync('src/lib/automata.ts', 'utf-8');

const newDfa = `
function buildLangDFA(condition: string, str: string, alphabet: string[], prefix: string) {
    const chars = str.split('').filter(c => c.trim() !== '');
    const m = chars.length;
    if (m === 0 && condition !== 'length_div_by' && condition !== 'binary_div_by') chars.push('a');

    const states: string[] = [];
    const transitions: {from: string, symbol: string, to: string}[] = [];
    const acceptStates: string[] = [];
    const deadState = \`\${prefix}d\`;
    let usesDeadState = false;

    if (condition === 'even_count' || condition === 'odd_count') {
        const targetChar = chars[0] || 'a';
        states.push(\`\${prefix}0\`, \`\${prefix}1\`);
        for (const sym of alphabet) {
            if (sym === targetChar) {
                transitions.push({ from: \`\${prefix}0\`, symbol: sym, to: \`\${prefix}1\` });
                transitions.push({ from: \`\${prefix}1\`, symbol: sym, to: \`\${prefix}0\` });
            } else {
                transitions.push({ from: \`\${prefix}0\`, symbol: sym, to: \`\${prefix}0\` });
                transitions.push({ from: \`\${prefix}1\`, symbol: sym, to: \`\${prefix}1\` });
            }
        }
        if (condition === 'even_count') acceptStates.push(\`\${prefix}0\`);
        else acceptStates.push(\`\${prefix}1\`);
        return { states, transitions, startState: \`\${prefix}0\`, acceptStates };
    }

    if (condition === 'length_div_by') {
        let n = parseInt(str.trim());
        if (isNaN(n) || n <= 0) n = 2;
        for (let i = 0; i < n; i++) states.push(\`\${prefix}\${i}\`);
        for (let i = 0; i < n; i++) {
            for (const sym of alphabet) {
                transitions.push({ from: \`\${prefix}\${i}\`, symbol: sym, to: \`\${prefix}\${(i + 1) % n}\` });
            }
        }
        acceptStates.push(\`\${prefix}0\`);
        return { states, transitions, startState: \`\${prefix}0\`, acceptStates };
    }

    if (condition === 'binary_div_by') {
        let n = parseInt(str.trim());
        if (isNaN(n) || n <= 0) n = 2;
        for (let i = 0; i < n; i++) states.push(\`\${prefix}\${i}\`);
        for (let i = 0; i < n; i++) {
            for (const sym of alphabet) {
                if (sym === '0') {
                    transitions.push({ from: \`\${prefix}\${i}\`, symbol: sym, to: \`\${prefix}\${(i * 2) % n}\` });
                } else if (sym === '1') {
                    transitions.push({ from: \`\${prefix}\${i}\`, symbol: sym, to: \`\${prefix}\${(i * 2 + 1) % n}\` });
                } else {
                    transitions.push({ from: \`\${prefix}\${i}\`, symbol: sym, to: deadState });
                    usesDeadState = true;
                }
            }
        }
        if (usesDeadState) {
            states.push(deadState);
            for (const sym of alphabet) {
                transitions.push({ from: deadState, symbol: sym, to: deadState });
            }
        }
        acceptStates.push(\`\${prefix}0\`);
        return { states, transitions, startState: \`\${prefix}0\`, acceptStates };
    }

    for(let i=0; i<=m; i++) states.push(\`\${prefix}\${i}\`);

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

const startIndex = code.indexOf('function buildLangDFA');
const endIndex = code.indexOf('export function convertLangIntersection');
code = code.substring(0, startIndex) + newDfa + '\n' + code.substring(endIndex);

fs.writeFileSync('src/lib/automata.ts', code);
