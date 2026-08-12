const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  "  setIntersectionConditions: (v: {cond: string, str: string, count?: number}[]) => void;",
  "  setIntersectionConditions: (v: {cond: string, str: string, count?: number}[]) => void;\n  langOutputType?: 'DFA' | 'NFA';\n  setLangOutputType?: (v: 'DFA' | 'NFA') => void;"
);

code = code.replace(
  "  intersectionConditions, setIntersectionConditions,",
  "  intersectionConditions, setIntersectionConditions,\n  langOutputType = 'DFA', setLangOutputType,"
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
