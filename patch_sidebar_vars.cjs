const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  'const isAutomatonSource = !isRegexSource && !isGrammarSource && !isLangSource;',
  "const isAutomatonSource = (!isRegexSource && !isGrammarSource && !isLangSource) || transformation === 'FA_EQUIVALENCE';\n  const showRegexInput = isRegexSource || transformation === 'FA_EQUIVALENCE';"
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
