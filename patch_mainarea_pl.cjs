const fs = require('fs');
let code = fs.readFileSync('src/components/MainArea.tsx', 'utf8');

// Import PumpingLemmaProof and PumpingLemmaState
code = code.replace(
  "import { GraphCanvas } from './GraphCanvas';",
  "import { GraphCanvas } from './GraphCanvas';\nimport { PumpingLemmaProof } from './PumpingLemmaProof';\nimport { PumpingLemmaState } from '../types';"
);

// Add plState to props
code = code.replace(
  "onReset: () => void;",
  "onReset: () => void;\n  plState?: PumpingLemmaState;"
);

// Inside the component, check if transformation === 'PUMPING_LEMMA' and render it immediately
const plBlock = `
  if (transformation === 'PUMPING_LEMMA' && plState) {
    return (
      <main className="flex-1 relative bg-[radial-gradient(var(--border-subtle)_1px,transparent_1px)] bg-[size:32px_32px] overflow-y-auto flex flex-col">
        <PumpingLemmaProof plState={plState} />
      </main>
    );
  }
`;

code = code.replace(
  "export const MainArea = ({",
  "export const MainArea = ({\n  plState,"
);

code = code.replace(
  "const [isPlaying, setIsPlaying] = useState(false);",
  "const [isPlaying, setIsPlaying] = useState(false);\n" + plBlock
);

fs.writeFileSync('src/components/MainArea.tsx', code);
