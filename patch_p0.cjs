const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace('p: 5,', 'p: 0,');
fs.writeFileSync('src/App.tsx', appCode);

// Patch Sidebar.tsx
let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace('min="1"\\n                value={plState.p}', 'min="0"\\n                value={plState.p}');
sidebarCode = sidebarCode.replace('p: parseInt(e.target.value) || 1', 'p: parseInt(e.target.value) || 0');
sidebarCode = sidebarCode.replace('min="1"', 'min="0"'); // Try a general replacement if the specific one fails

fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);
