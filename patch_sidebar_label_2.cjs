const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  "{transformation === \\'FA_EQUIVALENCE\\' ? \\'Target Regular Expression\\' : \\'Regular Expression\\'}",
  "{transformation === 'FA_EQUIVALENCE' ? 'Target Regular Expression' : 'Regular Expression'}"
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
