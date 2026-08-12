const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const targetSnippet = `        {isLangSource && (
          <motion.section 
            key="lang-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col gap-4"
          >`;

const insertSnippet = `        {isLangSource && (
          <motion.section 
            key="lang-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col gap-4"
          >
            {setLangOutputType && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Output Type</label>
                <select
                  value={langOutputType}
                  onChange={(e) => setLangOutputType(e.target.value as 'DFA' | 'NFA')}
                  disabled={isSimulating}
                  className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
                >
                  <option value="DFA">Deterministic Finite Automaton (DFA)</option>
                  <option value="NFA">Non-Deterministic Finite Automaton (NFA)</option>
                </select>
              </div>
            )}`;

code = code.replace(targetSnippet, insertSnippet);

fs.writeFileSync('src/components/Sidebar.tsx', code);
