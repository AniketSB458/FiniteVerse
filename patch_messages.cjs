const fs = require('fs');
let code = fs.readFileSync('src/lib/automata.ts', 'utf8');

code = code.replace(
  "message: \`Generated Deterministic Finite Automaton for Language: ${condition.replace('_', ' ')} '${str}'\`,",
  "message: \`Generated ${asNFA ? 'Non-Deterministic' : 'Deterministic'} Finite Automaton for Language: ${condition.replace('_', ' ')} '${str}'\`,"
);

code = code.replace(
  "message: \`Product Automaton generation complete.\`,",
  "message: \`Product ${asNFA ? 'NFA' : 'DFA'} generation complete.\`,"
);

fs.writeFileSync('src/lib/automata.ts', code);
