const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  "const isGrammarSource = transformation === 'RG_TO_FA' || transformation === 'CFG_TO_PDA';",
  "const isGrammarSource = transformation === 'RG_TO_FA';"
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
