const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { convertNfaToDfa, convertRegexToEnfa, convertGrammarToFa, convertAutomataToRegex, convertLangToFa, convertLangIntersection, checkFaEquivalence } from './lib/automata';",
  "import { convertNfaToDfa, convertRegexToEnfa, convertGrammarToFa, convertAutomataToRegex, convertLangToFa, convertLangIntersection, checkFaEquivalence, minimizeDfa, simulatePumpingLemma } from './lib/automata';"
);

code = code.replace(
  "} else if (transformation === 'FA_EQUIVALENCE') {",
  `} else if (transformation === 'DFA_MINIMIZATION') {
         const steps = minimizeDfa(automata);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);
     } else if (transformation === 'PUMPING_LEMMA') {
         const steps = simulatePumpingLemma(automata);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);
     } else if (transformation === 'FA_EQUIVALENCE') {`
);

fs.writeFileSync(file, code);
