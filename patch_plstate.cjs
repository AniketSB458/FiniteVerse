const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldPlState = `  const [plState, setPlState] = useState<PumpingLemmaState>({
    language: 'anbn',
    p: 4,
    w: 'aaaabbbb',
    x: 'a',
    y: 'aa',
    z: 'abbbb',
    i: 2
  });`;

const newPlState = `  const [plState, setPlState] = useState<PumpingLemmaState>({
    language: '0n1n',
    p: 5,
    w: '0000011111',
    x: 'ε',
    y: '0',
    z: '000011111',
    i: 2
  });`;

code = code.replace(oldPlState, newPlState);
fs.writeFileSync('src/App.tsx', code);
