const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const oldLangInput = `            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">
                {transformation === 'LANG_INTERSECTION' ? 'Language A Condition' : 'Condition'}
              </label>
              <select
                value={langCondition}
                onChange={(e) => setLangCondition(e.target.value)}
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
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">
                {transformation === 'LANG_INTERSECTION' ? 'Language A Sequence' : 'String Sequence'}
              </label>
              <input
                type="text"
                value={langString}
                onChange={(e) => setLangString(e.target.value)}
                disabled={isSimulating}
                placeholder="e.g. ab"
                className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
              />
            </div>`;

const newLangInput = `            {transformation === 'LANG_TO_FA' && (
              <>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Condition</label>
                  <select
                    value={langCondition}
                    onChange={(e) => setLangCondition(e.target.value)}
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
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">String Sequence</label>
                  <input
                    type="text"
                    value={langString}
                    onChange={(e) => setLangString(e.target.value)}
                    disabled={isSimulating}
                    placeholder="e.g. ab"
                    className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
                  />
                </div>
              </>
            )}`;

code = code.replace(oldLangInput, newLangInput);
fs.writeFileSync('src/components/Sidebar.tsx', code);
