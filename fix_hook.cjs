const fs = require('fs');
let code = fs.readFileSync('src/components/MainArea.tsx', 'utf8');

const earlyReturn = `  if (transformation === 'PUMPING_LEMMA' && plState) {
    return (
      <main className="flex-1 relative bg-[radial-gradient(var(--border-subtle)_1px,transparent_1px)] bg-[size:32px_32px] overflow-y-auto flex flex-col">
        <PumpingLemmaProof plState={plState} />
      </main>
    );
  }`;

code = code.replace(earlyReturn, "");

const insertTarget = "}, [isPlaying, currentStepIndex, simulationSteps.length, playbackSpeed, setCurrentStepIndex]);";
code = code.replace(insertTarget, insertTarget + "\n\n" + earlyReturn);

fs.writeFileSync('src/components/MainArea.tsx', code);
