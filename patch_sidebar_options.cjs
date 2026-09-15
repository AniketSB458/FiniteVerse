const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace('<option value="PDA_TO_TM">PDA → TM</option>', '');
code = code.replace('<option value="TM_TO_PDA">TM → PDA</option>', '');

fs.writeFileSync('src/components/Sidebar.tsx', code);
