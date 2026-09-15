const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const oldLogic = `     } else if (transformation === 'REGEX_TO_ENFA' || transformation === 'REGEX_TO_DFA') {
         const steps = convertRegexToEnfa(regexInput);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);`;

const newLogic = `     } else if (transformation === 'REGEX_TO_ENFA' || transformation === 'REGEX_TO_DFA') {
         const enfaSteps = convertRegexToEnfa(regexInput);
         if (transformation === 'REGEX_TO_DFA') {
             const lastStep = enfaSteps[enfaSteps.length - 1];
             const nfa = {
                 states: lastStep.dfaStates.map(s => s[0]),
                 alphabet: alphabet.split(',').map(s => s.trim()).filter(s => s.length > 0),
                 transitions: lastStep.dfaTransitions.map(t => ({from: t.from[0], symbol: t.symbol, to: t.to[0]})),
                 startState: lastStep.dfaStartState[0],
                 acceptStates: lastStep.dfaAcceptStates.map(s => s[0])
             };
             const dfaSteps = convertNfaToDfa(nfa);
             setSimulationSteps([...enfaSteps, ...dfaSteps]);
         } else {
             setSimulationSteps(enfaSteps);
         }
         setCurrentStepIndex(0);`;

appCode = appCode.replace(oldLogic, newLogic);
fs.writeFileSync('src/App.tsx', appCode);
