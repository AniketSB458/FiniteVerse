const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  "transitions: lastStep.dfaTransitions.map(t => ({from: t.from[0], symbol: t.symbol, to: t.to[0]})),",
  "transitions: lastStep.dfaTransitions.map((t, idx) => ({id: 't' + idx, from: t.from[0], symbol: t.symbol, to: t.to[0]})),"
);

fs.writeFileSync('src/App.tsx', appCode);
