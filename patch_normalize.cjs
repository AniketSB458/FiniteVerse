const fs = require('fs');
let code = fs.readFileSync('src/components/PumpingLemmaProof.tsx', 'utf8');

code = code.replace(
  "const normalize = (val: string) => val.trim() === 'ε' ? '' : val.trim();",
  "const normalize = (val: string) => { const t = val.trim(); return (t === 'ε' || t === 'e' || t === 'E') ? '' : t; };"
);

fs.writeFileSync('src/components/PumpingLemmaProof.tsx', code);
