const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  '<option value="NFA_TO_REGEX">NFA → Regular Expression</option>',
  '<option value="NFA_TO_REGEX">NFA → Regular Expression</option>\n          <option value="FA_EQUIVALENCE">Automaton Equivalence (Compare with Regex)</option>'
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
