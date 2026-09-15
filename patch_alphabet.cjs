const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const oldLogic = `                 alphabet: alphabet.split(',').map(s => s.trim()).filter(s => s.length > 0),`;
const newLogic = `                 alphabet: Array.from(new Set(lastStep.dfaTransitions.map(t => t.symbol).filter(s => s !== 'ε' && s !== 'e' && s !== ''))),`;

appCode = appCode.replace(oldLogic, newLogic);
fs.writeFileSync('src/App.tsx', appCode);
