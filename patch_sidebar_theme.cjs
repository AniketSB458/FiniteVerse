const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const themeSection = `      {theme && setTheme && (
        <section className="sm:hidden">
          <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Theme</label>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-bg-secondary border border-border-subtle rounded p-2 text-sm text-text-main outline-none focus:border-accent-main"
          >
            <option value="theme-dark">Sleek Dark</option>
            <option value="theme-bw">Black & White</option>
            <option value="theme-gp">Golden Pink</option>
          </select>
        </section>
      )}
`;

code = code.replace(themeSection, '');
fs.writeFileSync('src/components/Sidebar.tsx', code);
