const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  "const isAutomatonSource = ((!isRegexSource && !isGrammarSource && !isLangSource && !isPumpingLemma) || transformation === 'FA_EQUIVALENCE');",
  "const isAutomatonSource = (!isRegexSource && !isGrammarSource && !isLangSource && !isPumpingLemma);"
);

// We need to see line 182 logic. Let's just find `transformation === 'LANG_TO_FA'` and replace it, maybe it's inside `if (isLangSource)`?
code = code.replace(
  "{transformation === 'LANG_TO_FA' && (",
  "{(transformation as string) === 'LANG_TO_FA' && ("
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
