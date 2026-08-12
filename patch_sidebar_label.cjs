const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  '<label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Regular Expression</label>',
  '<label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">{transformation === \\\'FA_EQUIVALENCE\\\' ? \\\'Target Regular Expression\\\' : \\\'Regular Expression\\\'}</label>'
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
