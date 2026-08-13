const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  "setLangOutputType?: (v: 'DFA' | 'NFA') => void;\n  theme?: string;",
  "setLangOutputType?: (v: 'DFA' | 'NFA') => void;\n  plState?: any;\n  setPlState?: (st: any) => void;\n  theme?: string;"
);

code = code.replace(
  "langOutputType = 'DFA', setLangOutputType,\n  theme, setTheme\n}: SidebarProps) {",
  "langOutputType = 'DFA', setLangOutputType,\n  plState, setPlState,\n  theme, setTheme\n}: SidebarProps) {"
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
