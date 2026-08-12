const fs = require('fs');
let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// 1. Remove isLangSource logic
sidebarCode = sidebarCode.replace(
  "const isLangSource = transformation === 'LANG_TO_FA' || transformation === 'LANG_INTERSECTION';",
  "const isLangSource = transformation === 'LANG_INTERSECTION';"
);

// 2. Remove LANG_TO_FA option
sidebarCode = sidebarCode.replace(
  '<option value="LANG_TO_FA">Language → Finite Automaton</option>\n',
  ''
);

// 3. Remove LANG_TO_FA condition UI
const targetConditionUi = `            {transformation === 'LANG_TO_FA' && (
              <>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Condition</label>
                  <select
                    value={langCondition}
                    onChange={(e) => setLangCondition(e.target.value)}
                    disabled={isSimulating}
                    className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
                  >
                    <option value="none">None (Ignore condition)</option>
                    <option value="starts_with">Starts with</option>
                    <option value="ends_with">Ends with</option>
                    <option value="substring">Contains substring</option>
                    <option value="not_contain">Does not contain</option>
                    <option value="exact">Exact match</option>
                    <option value="even_count">Even count of target char</option>
                    <option value="odd_count">Odd count of target char</option>
                    <option value="exact_count">Exactly N occurrences</option>
                    <option value="length_div_by">Length divisible by N</option>
                    <option value="binary_div_by">Binary value divisible by N</option>
                  </select>
                </div>
                {langCondition === 'exact_count' && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Number of Occurrences (N)</label>
                    <input
                      type="number"
                      min="0"
                      value={langCount}
                      onChange={(e) => setLangCount(parseInt(e.target.value) || 0)}
                      disabled={isSimulating}
                      className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">
                    {langCondition === 'length_div_by' || langCondition === 'binary_div_by' ? 'Divisor (N)' : 'Target String/Char'}
                  </label>
                  <input
                    type={langCondition === 'length_div_by' || langCondition === 'binary_div_by' ? 'number' : 'text'}
                    min={langCondition === 'length_div_by' || langCondition === 'binary_div_by' ? '1' : undefined}
                    value={langString}
                    onChange={(e) => setLangString(e.target.value)}
                    disabled={isSimulating}
                    placeholder="ab"
                    className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
                  />
                </div>
              </>
            )}`;

sidebarCode = sidebarCode.replace(targetConditionUi, '');

fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const targetAppSimLogic = `     } else if (transformation === 'LANG_TO_FA') {
         const steps = convertLangToFa(langCondition, langString, langCount, langOutputType === 'NFA');
         setSimulationSteps(steps);
         setCurrentStepIndex(0);`;

appCode = appCode.replace(targetAppSimLogic, '');

fs.writeFileSync('src/App.tsx', appCode);
