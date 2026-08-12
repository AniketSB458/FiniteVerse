const fs = require('fs');
let code = fs.readFileSync('src/lib/automata.ts', 'utf8');

code = code.replace(
  "export function convertLangToFa(condition: string, str: string, count: number = 1): ConversionStep[] {",
  "export function convertLangToFa(condition: string, str: string, count: number = 1, asNFA: boolean = false): ConversionStep[] {"
);

code = code.replace(
  "const dfa = buildLangDFA(condition, str, alphabet, 'q', count);",
  "const dfa = buildLangDFA(condition, str, alphabet, 'q', count, asNFA);"
);

// For convertLangIntersection
code = code.replace(
  "export function convertLangIntersection(conds: {cond: string, str: string, count?: number}[]): ConversionStep[] {",
  "export function convertLangIntersection(conds: {cond: string, str: string, count?: number}[], asNFA: boolean = false): ConversionStep[] {"
);

code = code.replace(
  "const dfas = activeConds.map((c, i) => buildLangDFA(c.cond, c.str, alphabet, String.fromCharCode(65 + i), c.count || 1));",
  "const dfas = activeConds.map((c, i) => buildLangDFA(c.cond, c.str, alphabet, String.fromCharCode(65 + i), c.count || 1, asNFA));"
);

fs.writeFileSync('src/lib/automata.ts', code);
