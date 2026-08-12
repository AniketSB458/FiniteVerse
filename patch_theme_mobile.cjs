const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldThemeSection = `<div className="hidden sm:flex items-center gap-2">
            <Palette className="w-4 h-4 text-text-muted hidden md:block" />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-bg-tertiary border border-border-subtle rounded-md px-1 md:px-3 py-1.5 text-xs md:text-sm text-text-main focus:ring-2 focus:ring-accent-main outline-none cursor-pointer w-24 md:w-auto"
            >
              <option value="theme-dark">Sleek Dark</option>
              <option value="theme-bw">Black &amp; White</option>
              <option value="theme-gp">Golden Pink</option>
            </select>
          </div>`;

const newThemeSection = `<div className="relative flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:gap-2">
            <Palette className="w-5 h-5 text-text-main sm:w-4 sm:h-4 sm:text-text-muted" />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 sm:opacity-100 sm:static bg-bg-tertiary sm:border sm:border-border-subtle rounded-md sm:px-3 sm:py-1.5 text-xs sm:text-sm text-text-main focus:ring-2 focus:ring-accent-main outline-none cursor-pointer"
            >
              <option value="theme-dark">Sleek Dark</option>
              <option value="theme-bw">Black &amp; White</option>
              <option value="theme-gp">Golden Pink</option>
            </select>
          </div>`;

code = code.replace(oldThemeSection, newThemeSection);

fs.writeFileSync('src/App.tsx', code);
