const fs = require('fs');
let code = fs.readFileSync('src/components/PumpingLemmaProof.tsx', 'utf8');

code = code.replace(
  "const { language, p, w, x, y, z, i } = plState;",
  "const { language, p, w, x, y, z, i } = plState;\n  const pNum = typeof p === 'number' ? p : 0;\n  const iNum = typeof i === 'number' ? i : 0;"
);

// Replace usages of p and i with pNum and iNum in math / displays
code = code.replace(/wVal\.length >= p;/g, "wVal.length >= pNum;");
code = code.replace(/\(xVal \+ yVal\)\.length <= p;/g, "(xVal + yVal).length <= pNum;");
code = code.replace(/yVal\.repeat\(i\)/g, "yVal.repeat(iNum)");
code = code.replace(/>= p \(\$\{p\}\)/g, ">= p (${pNum})");
code = code.replace(/<= p \(\$\{p\}\)/g, "<= p (${pNum})");
code = code.replace(/≥ \$\{p\}/g, "≥ ${pNum}");
code = code.replace(/≤ \$\{p\}/g, "≤ ${pNum}");
code = code.replace(/The Pump \(i = \{i\}\)/g, "The Pump (i = {iNum})");
code = code.replace(/<sup className="text-accent-main">\{i\}<\/sup>/g, "<sup className=\"text-accent-main\">{iNum}</sup>");

fs.writeFileSync('src/components/PumpingLemmaProof.tsx', code);
