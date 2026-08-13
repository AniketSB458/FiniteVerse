const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  "onChange={e => setPlState({...plState, language: e.target.value})}",
  "onChange={e => setPlState({...plState, language: e.target.value})}\n                disabled={isSimulating}"
);
code = code.replace(
  "onChange={e => setPlState({...plState, p: parseInt(e.target.value) || 1})}",
  "onChange={e => setPlState({...plState, p: parseInt(e.target.value) || 1})}\n                disabled={isSimulating}"
);
code = code.replace(
  "onChange={e => setPlState({...plState, w: e.target.value})}",
  "onChange={e => setPlState({...plState, w: e.target.value})}\n                disabled={isSimulating}"
);
code = code.replace(
  "onChange={e => setPlState({...plState, x: e.target.value})}",
  "onChange={e => setPlState({...plState, x: e.target.value})}\n                  disabled={isSimulating}"
);
code = code.replace(
  "onChange={e => setPlState({...plState, y: e.target.value})}",
  "onChange={e => setPlState({...plState, y: e.target.value})}\n                  disabled={isSimulating}"
);
code = code.replace(
  "onChange={e => setPlState({...plState, z: e.target.value})}",
  "onChange={e => setPlState({...plState, z: e.target.value})}\n                  disabled={isSimulating}"
);
code = code.replace(
  "onChange={e => setPlState({...plState, i: parseInt(e.target.value) || 0})}",
  "onChange={e => setPlState({...plState, i: parseInt(e.target.value) || 0})}\n                disabled={isSimulating}"
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
