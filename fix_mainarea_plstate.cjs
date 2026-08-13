const fs = require('fs');
let code = fs.readFileSync('src/components/MainArea.tsx', 'utf8');

code = code.replace(
  "setCurrentStepIndex,\n  onReset\n}: MainAreaProps) {",
  "setCurrentStepIndex,\n  onReset,\n  plState\n}: MainAreaProps) {"
);

fs.writeFileSync('src/components/MainArea.tsx', code);
