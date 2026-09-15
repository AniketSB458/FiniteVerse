const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "convertLangIntersection, checkFaEquivalence, minimizeDfa, simulatePumpingLemma } from './lib/automata';",
  "convertLangIntersection, checkFaEquivalence, minimizeDfa, simulatePumpingLemma, convertEnfaToNfa, convertDfaToNfa } from './lib/automata';"
);

const oldElseIf = `     } else if (transformation === 'FA_EQUIVALENCE') {
         const steps = checkFaEquivalence(automata, regexInput);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);
     } else {`;

const newElseIf = `     } else if (transformation === 'FA_EQUIVALENCE') {
         const steps = checkFaEquivalence(automata, regexInput);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);
     } else if (transformation === 'ENFA_TO_NFA') {
         const steps = convertEnfaToNfa(automata);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);
     } else if (transformation === 'DFA_TO_NFA') {
         const steps = convertDfaToNfa(automata);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);
     } else {`;

code = code.replace(oldElseIf, newElseIf);
fs.writeFileSync('src/App.tsx', code);
