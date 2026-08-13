const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  "setCurrentStepIndex(0);\n      else if (transformation === 'FA_EQUIVALENCE') {",
  "setCurrentStepIndex(0);\n     } else if (transformation === 'FA_EQUIVALENCE') {"
);
fs.writeFileSync('src/App.tsx', code);
