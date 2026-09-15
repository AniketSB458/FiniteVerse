const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace('<option value="FA_TO_RG">Finite Automaton → Regular Grammar</option>', '');
code = code.replace('<option value="CFG_TO_PDA">CFG → PDA</option>', '');
code = code.replace('<option value="PDA_TO_CFG">PDA → CFG</option>', '');

fs.writeFileSync('src/components/Sidebar.tsx', code);
