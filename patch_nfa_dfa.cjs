const fs = require('fs');

let code = fs.readFileSync('src/lib/automata.ts', 'utf8');

const oldLogic = `      const U = getEpsilonClosure(Array.from(reachable), nfa.transitions);
      
      if (U.length > 0) {
        let existing = dfaStates.find(s => s.join(',') === U.join(','));`;

const newLogic = `      const U = getEpsilonClosure(Array.from(reachable), nfa.transitions);
      if (U.length === 0) U.push('∅');
      
      if (U.length > 0) {
        let existing = dfaStates.find(s => s.join(',') === U.join(','));`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/lib/automata.ts', code);
