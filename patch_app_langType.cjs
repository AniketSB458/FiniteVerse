const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = "  const [langCount, setLangCount] = useState(1);";
const insertState = "  const [langCount, setLangCount] = useState(1);\n  const [langOutputType, setLangOutputType] = useState<'DFA' | 'NFA'>('DFA');";
code = code.replace(targetState, insertState);

const targetConvertLang = "const steps = convertLangToFa(langCondition, langString, langCount);";
const insertConvertLang = "const steps = convertLangToFa(langCondition, langString, langCount, langOutputType === 'NFA');";
code = code.replace(targetConvertLang, insertConvertLang);

const targetConvertIntersection = "const steps = convertLangIntersection(intersectionConditions);";
const insertConvertIntersection = "const steps = convertLangIntersection(intersectionConditions, langOutputType === 'NFA');";
code = code.replace(targetConvertIntersection, insertConvertIntersection);

const targetSidebarProps = "intersectionConditions={intersectionConditions} setIntersectionConditions={setIntersectionConditions}";
const insertSidebarProps = "intersectionConditions={intersectionConditions} setIntersectionConditions={setIntersectionConditions}\n           langOutputType={langOutputType} setLangOutputType={setLangOutputType}";
code = code.replace(targetSidebarProps, insertSidebarProps);

fs.writeFileSync('src/App.tsx', code);
