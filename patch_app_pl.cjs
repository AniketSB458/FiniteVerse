const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to add the plState state, and pass it to Sidebar and MainArea.
// First, import PumpingLemmaState
code = code.replace(
  "import { Automata, Transition, ConversionStep } from './types';",
  "import { Automata, Transition, ConversionStep, PumpingLemmaState } from './types';"
);

// Add the state inside App
const stateAddition = `
  const [plState, setPlState] = useState<PumpingLemmaState>({
    language: 'anbn',
    p: 4,
    w: 'aaaabbbb',
    x: 'a',
    y: 'aa',
    z: 'abbbb',
    i: 2
  });
`;

code = code.replace(
  "const [intersectionConditions, setIntersectionConditions] = useState<{cond: string, str: string, count?: number}[]>([",
  stateAddition + "\n  const [intersectionConditions, setIntersectionConditions] = useState<{cond: string, str: string, count?: number}[]>(["
);

// We need to pass plState and setPlState to Sidebar
code = code.replace(
  "langOutputType={langOutputType} setLangOutputType={setLangOutputType}",
  "langOutputType={langOutputType} setLangOutputType={setLangOutputType}\n           plState={plState} setPlState={setPlState}"
);

// And to MainArea
code = code.replace(
  "onReset={() => setSimulationSteps([])}",
  "onReset={() => setSimulationSteps([])}\n           plState={plState}"
);

// Remove the old simulatePumpingLemma from the simulate action
code = code.replace(
  `} else if (transformation === 'PUMPING_LEMMA') {
         const steps = simulatePumpingLemma(automata);
         setSimulationSteps(steps);
         setCurrentStepIndex(0);
     }`,
  "" // Remove it entirely since it's now an interactive module inside MainArea
);

fs.writeFileSync('src/App.tsx', code);
