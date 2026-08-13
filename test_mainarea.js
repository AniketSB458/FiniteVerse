const fs = require('fs');
let code = fs.readFileSync('src/components/MainArea.tsx', 'utf8');
console.log(code.includes("onReset,\n  plState\n}: MainAreaProps) {"));
