const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// 1. Hide theme selector on mobile in App.tsx
appCode = appCode.replace('<div className="flex items-center gap-2">', '<div className="hidden sm:flex items-center gap-2">');

// 2. Add theme selector to Sidebar (top section)
// First, update Sidebar props
sidebarCode = sidebarCode.replace(
  '  setIntersectionConditions: (v: {cond: string, str: string, count?: number}[]) => void;\n};',
  '  setIntersectionConditions: (v: {cond: string, str: string, count?: number}[]) => void;\n  theme?: string;\n  setTheme?: (v: string) => void;\n};'
);

sidebarCode = sidebarCode.replace(
  '  intersectionConditions, setIntersectionConditions\n}: SidebarProps) {',
  '  intersectionConditions, setIntersectionConditions,\n  theme, setTheme\n}: SidebarProps) {'
);

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
      )}`;

sidebarCode = sidebarCode.replace(
  '<section>\n        <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Transformation</label>',
  themeSection + '\n      <section>\n        <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-3">Transformation</label>'
);

// 3. Pass theme to Sidebar in App.tsx
appCode = appCode.replace(
  '        <Sidebar \n           transformation={transformation}',
  '        <Sidebar \n           theme={theme} setTheme={setTheme}\n           transformation={transformation}'
);

fs.writeFileSync('src/App.tsx', appCode);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);
