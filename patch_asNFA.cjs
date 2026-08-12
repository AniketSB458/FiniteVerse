const fs = require('fs');
let code = fs.readFileSync('src/lib/automata.ts', 'utf8');

code = code.replace(
  "function buildLangDFA(condition: string, str: string, alphabet: string[], prefix: string, count: number = 1) {",
  "function buildLangDFA(condition: string, str: string, alphabet: string[], prefix: string, count: number = 1, asNFA: boolean = false) {"
);

code = code.replace(
  "transitions.push({ from: `${prefix}${i}`, symbol: sym, to: deadState });\n                    usesDeadState = true;",
  "if (!asNFA) {\n                    transitions.push({ from: `${prefix}${i}`, symbol: sym, to: deadState });\n                    usesDeadState = true;\n                }"
);

code = code.replace(
  "if (usesDeadState) {",
  "if (usesDeadState && !asNFA) {"
);

code = code.replace(
  "transitions.push({ from: `${prefix}${i}`, symbol: sym, to: deadState });\n                usesDeadState = true;",
  "if (!asNFA) {\n                transitions.push({ from: `${prefix}${i}`, symbol: sym, to: deadState });\n                usesDeadState = true;\n                }"
);

// We need to be careful with global replacements. Let's make sure it matches properly.
fs.writeFileSync('src/lib/automata.ts', code);
