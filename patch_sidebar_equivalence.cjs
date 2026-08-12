const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Update conditions
code = code.replace(
  "const isAutomatonSource = !isRegexSource && !isGrammarSource && !isLangSource;",
  "const isAutomatonSource = !isRegexSource && !isGrammarSource && !isLangSource || transformation === 'FA_EQUIVALENCE';\n  const showRegexInput = isRegexSource || transformation === 'FA_EQUIVALENCE';"
);

// Add option to dropdown
code = code.replace(
  '<option value="NFA_TO_REGEX">NFA → Regular Expression</option>',
  '<option value="NFA_TO_REGEX">NFA → Regular Expression</option>\n          <option value="FA_EQUIVALENCE">Automaton Equivalence (Compare with Regex)</option>'
);

// Update isRegexSource condition check for rendering Regex input
code = code.replace(
  '{isRegexSource && (\\n          <motion.section \\n            key="regex-input"',
  '{showRegexInput && (\\n          <motion.section \\n            key="regex-input"'
);

// Oh wait, my string replace for the rendering condition might not match due to newlines. Let's use regex.
