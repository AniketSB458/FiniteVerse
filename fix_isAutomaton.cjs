const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
code = code.replace(
  "const isAutomatonSource = (!isRegexSource && !isGrammarSource && !isLangSource) || transformation === 'FA_EQUIVALENCE';",
  "const isPumpingLemma = transformation === 'PUMPING_LEMMA';\n  const isAutomatonSource = ((!isRegexSource && !isGrammarSource && !isLangSource && !isPumpingLemma) || transformation === 'FA_EQUIVALENCE');"
);
fs.writeFileSync('src/components/Sidebar.tsx', code);
