const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// 1. Add types to props
code = code.replace(
  "langOutputType: 'DFA' | 'NFA';",
  "langOutputType: 'DFA' | 'NFA';\n  plState: any;\n  setPlState: (st: any) => void;"
);

code = code.replace(
  "langOutputType, setLangOutputType",
  "langOutputType, setLangOutputType, plState, setPlState"
);

// 2. Adjust boolean flags
code = code.replace(
  "const isAutomatonSource = [",
  "const isPumpingLemma = transformation === 'PUMPING_LEMMA';\n  const isAutomatonSource = ["
);
code = code.replace(
  "'DFA_MINIMIZATION', 'PUMPING_LEMMA'",
  "'DFA_MINIMIZATION'" // Remove PUMPING_LEMMA from automaton sources
);
code = code.replace(
  "'FA_EQUIVALENCE', 'DFA_MINIMIZATION'",
  "'FA_EQUIVALENCE', 'DFA_MINIMIZATION'" // Just in case it was added this way
);

// 3. Add the Pumping Lemma UI
const plUI = `
        {isPumpingLemma && (
          <motion.div
            key="pl-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <section>
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Target Language</label>
              <select 
                value={plState.language} 
                onChange={e => setPlState({...plState, language: e.target.value})}
                className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
              >
                <option value="anbn">L = aⁿbⁿ (n ≥ 0)</option>
                <option value="wwR">L = wwᴿ (Palindromes)</option>
                <option value="prime">L = aᵖ (p is prime)</option>
              </select>
            </section>

            <section>
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Pumping Length (p)</label>
              <input 
                type="number"
                min="1"
                value={plState.p}
                onChange={e => setPlState({...plState, p: parseInt(e.target.value) || 1})}
                className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
              />
            </section>

            <section>
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">String (w ∈ L, |w| ≥ p)</label>
              <input 
                type="text"
                value={plState.w}
                onChange={e => setPlState({...plState, w: e.target.value})}
                className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
              />
            </section>

            <section>
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Partition (w = xyz)</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="text"
                  placeholder="x"
                  value={plState.x}
                  onChange={e => setPlState({...plState, x: e.target.value})}
                  className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
                />
                <input 
                  type="text"
                  placeholder="y (|y| > 0, |xy| ≤ p)"
                  value={plState.y}
                  onChange={e => setPlState({...plState, y: e.target.value})}
                  className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
                />
                <input 
                  type="text"
                  placeholder="z"
                  value={plState.z}
                  onChange={e => setPlState({...plState, z: e.target.value})}
                  className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
                />
              </div>
            </section>

            <section>
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Pump (i)</label>
              <input 
                type="number"
                min="0"
                value={plState.i}
                onChange={e => setPlState({...plState, i: parseInt(e.target.value) || 0})}
                className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main font-mono"
              />
            </section>
          </motion.div>
        )}
`;

code = code.replace(
  "{isAutomatonSource && (",
  plUI + "\n        {isAutomatonSource && ("
);

// We need to fix the case where `DFA_MINIMIZATION', 'PUMPING_LEMMA'` was exactly replaced
code = code.replace(
  "const isAutomatonSource = [\n        'NONE', 'NFA_TO_DFA', 'ENFA_TO_NFA', 'ENFA_TO_DFA', 'DFA_TO_NFA',\n        'DFA_TO_REGEX', 'NFA_TO_REGEX', 'FA_EQUIVALENCE', 'DFA_MINIMIZATION', 'PUMPING_LEMMA'",
  "const isAutomatonSource = [\n        'NONE', 'NFA_TO_DFA', 'ENFA_TO_NFA', 'ENFA_TO_DFA', 'DFA_TO_NFA',\n        'DFA_TO_REGEX', 'NFA_TO_REGEX', 'FA_EQUIVALENCE', 'DFA_MINIMIZATION'"
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
