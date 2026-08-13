const fs = require('fs');
let code = fs.readFileSync('src/components/MainArea.tsx', 'utf8');

code = code.replace(
  "<PumpingLemmaProof plState={plState} />",
  "<PumpingLemmaProof plState={plState} isSimulating={simulationSteps.length > 0} />"
);

fs.writeFileSync('src/components/MainArea.tsx', code);
