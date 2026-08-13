const fs = require('fs');

// Patch types.ts
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace('p: number;', 'p: number | \'\';');
code = code.replace('i: number;', 'i: number | \'\';');
fs.writeFileSync('src/types.ts', code);

// Patch Sidebar.tsx
let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  "onChange={e => setPlState({...plState, p: parseInt(e.target.value) || 0})}",
  "onChange={e => setPlState({...plState, p: e.target.value === '' ? '' : (parseInt(e.target.value) ?? 0)})}"
);
sidebarCode = sidebarCode.replace(
  "onChange={e => setPlState({...plState, i: parseInt(e.target.value) || 0})}",
  "onChange={e => setPlState({...plState, i: e.target.value === '' ? '' : (parseInt(e.target.value) ?? 0)})}"
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);
