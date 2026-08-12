const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

// Replace lucide imports to add Plus and X
code = code.replace(/import {([^}]+)} from 'lucide-react';/, (match, group) => {
    return `import { \${group.replace(/, Plus|, X/g, '')}, Plus, X } from 'lucide-react';`;
});

// Update SidebarProps
const oldPropsStr = `  langCondition2: string;
  setLangCondition2: (v: string) => void;
  langString2: string;
  setLangString2: (v: string) => void;
  langCondition3: string;
  setLangCondition3: (v: string) => void;
  langString3: string;
  setLangString3: (v: string) => void;`;
  
const newPropsStr = `  intersectionConditions: {cond: string, str: string}[];
  setIntersectionConditions: (v: {cond: string, str: string}[]) => void;`;

code = code.replace(oldPropsStr, newPropsStr);

// Update Sidebar component arguments
const oldArgsStr = `  langCondition2, setLangCondition2,
  langString2, setLangString2,
  langCondition3, setLangCondition3,
  langString3, setLangString3`;

const newArgsStr = `  intersectionConditions, setIntersectionConditions`;

code = code.replace(oldArgsStr, newArgsStr);

// Replace the hardcoded conditions
const oldIntersectionJSX = `{transformation === 'LANG_INTERSECTION' && (
              <>
                <div className="pt-2 border-t border-border-subtle mt-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Language B Condition</label>
                  <select
                    value={langCondition2}
                    onChange={(e) => setLangCondition2(e.target.value)}
                    disabled={isSimulating}
                    className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
                  >
                    <option value="starts_with">Starts with</option>
                    <option value="ends_with">Ends with</option>
                    <option value="substring">Contains substring</option>
                    <option value="not_contain">Does not contain</option>
                    <option value="exact">Exact match</option>
<option value="even_count">Even count of target char</option>
<option value="odd_count">Odd count of target char</option>
<option value="length_div_by">Length divisible by N</option>
<option value="binary_div_by">Binary value divisible by N</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Language B Sequence</label>
                  <input
                    type="text"
                    value={langString2}
                    onChange={(e) => setLangString2(e.target.value)}
                    disabled={isSimulating}
                    placeholder="e.g. ba"
                    className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
                  />
                </div>
                <div className="pt-2 border-t border-border-subtle mt-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Language C Condition</label>
                  <select
                    value={langCondition3}
                    onChange={(e) => setLangCondition3(e.target.value)}
                    disabled={isSimulating}
                    className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
                  >
                    <option value="none">None / Not Applicable</option>
                    <option value="starts_with">Starts with</option>
                    <option value="ends_with">Ends with</option>
                    <option value="substring">Contains substring</option>
                    <option value="not_contain">Does not contain</option>
                    <option value="exact">Exact match</option>
<option value="even_count">Even count of target char</option>
<option value="odd_count">Odd count of target char</option>
<option value="length_div_by">Length divisible by N</option>
<option value="binary_div_by">Binary value divisible by N</option>
                  </select>
                </div>
                {langCondition3 !== 'none' && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Language C Sequence</label>
                    <input
                      type="text"
                      value={langString3}
                      onChange={(e) => setLangString3(e.target.value)}
                      disabled={isSimulating}
                      placeholder="e.g. aba"
                      className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
                    />
                  </div>
                )}
              </>
            )}`;

const newIntersectionJSX = `{transformation === 'LANG_INTERSECTION' && (
              <div className="pt-4 border-t border-border-subtle mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Intersection Rules</h3>
                  <button 
                    onClick={() => setIntersectionConditions([...intersectionConditions, {cond: 'starts_with', str: ''}])} 
                    disabled={isSimulating} 
                    className="p-1 rounded bg-bg-tertiary hover:bg-border-subtle transition-colors text-text-main disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {intersectionConditions.map((condition, index) => (
                    <div key={index} className="p-3 bg-bg-tertiary/50 border border-border-subtle rounded space-y-3 relative">
                      {intersectionConditions.length > 2 && (
                        <button 
                          onClick={() => setIntersectionConditions(intersectionConditions.filter((_, i) => i !== index))} 
                          className="absolute top-2 right-2 text-text-muted hover:text-red-400 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2">Condition {index + 1}</label>
                        <select
                          value={condition.cond}
                          onChange={(e) => {
                            const newConds = [...intersectionConditions];
                            newConds[index].cond = e.target.value;
                            setIntersectionConditions(newConds);
                          }}
                          disabled={isSimulating}
                          className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
                        >
                          <option value="starts_with">Starts with</option>
                          <option value="ends_with">Ends with</option>
                          <option value="substring">Contains substring</option>
                          <option value="not_contain">Does not contain</option>
                          <option value="exact">Exact match</option>
                          <option value="even_count">Even count of target char</option>
                          <option value="odd_count">Odd count of target char</option>
                          <option value="length_div_by">Length divisible by N</option>
                          <option value="binary_div_by">Binary value divisible by N</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={condition.str}
                          onChange={(e) => {
                            const newConds = [...intersectionConditions];
                            newConds[index].str = e.target.value;
                            setIntersectionConditions(newConds);
                          }}
                          disabled={isSimulating}
                          placeholder="Sequence"
                          className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}`;

code = code.replace(oldIntersectionJSX, newIntersectionJSX);

fs.writeFileSync('src/components/Sidebar.tsx', code);
