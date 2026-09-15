const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  "if (transformation === 'NFA_TO_DFA') {",
  "if (transformation === 'NFA_TO_DFA' || transformation === 'ENFA_TO_DFA') {"
);

appCode = appCode.replace(
  "const steps = checkFaEquivalence(automata, regexInput);",
  "const steps = checkFaEquivalence(automata, regexInput);"
); // just a check

fs.writeFileSync('src/App.tsx', appCode);
