const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexImportMatch = "import { convertNfaToDfa, convertRegexToEnfa, convertGrammarToFa, convertAutomataToRegex, convertLangToFa, convertLangIntersection } from './lib/automata';";
const newRegexImport = "import { convertNfaToDfa, convertRegexToEnfa, convertGrammarToFa, convertAutomataToRegex, convertLangToFa, convertLangIntersection, checkFaEquivalence } from './lib/automata';";

code = code.replace(regexImportMatch, newRegexImport);

const handleSimulationSnippet = `     } else if (transformation === 'LANG_INTERSECTION') {
         const steps = convertLangIntersection(intersectionConditions);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);`;

const newHandleSimulationSnippet = `     } else if (transformation === 'LANG_INTERSECTION') {
         const steps = convertLangIntersection(intersectionConditions);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);
     } else if (transformation === 'FA_EQUIVALENCE') {
         const steps = checkFaEquivalence(automata, regexInput);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);`;

code = code.replace(handleSimulationSnippet, newHandleSimulationSnippet);

const buttonLabelMatch = `: transformation.startsWith('REGEX_') 
                     ? 'Convert Expression'`;

const newButtonLabelMatch = `: transformation.startsWith('REGEX_') 
                     ? 'Convert Expression'
                     : transformation === 'FA_EQUIVALENCE'
                       ? 'Check Equivalence'`;

code = code.replace(buttonLabelMatch, newButtonLabelMatch);

fs.writeFileSync('src/App.tsx', code);
