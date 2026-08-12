const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I need to wrap the entire right side in one flex container, or just change the header to not use space-between if it has three items, OR wrap the right two in one container.
// The easiest is just wrap the right two in one container: `<div className="flex items-center gap-2 md:gap-4">`

const oldHeader = `        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
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
          </div>
          <button 
             onClick={handleRunSimulator}
             className={\`px-3 md:px-6 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg \${isSimulating ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-accent-main hover:bg-accent-hover text-white shadow-accent-main/20'}\`}
          >
             {isSimulating ? <SquareTerminal className="w-4 h-4" /> : <Play className="w-4 h-4" />}
             <span className="hidden sm:inline">
               {isSimulating 
                 ? 'Stop Simulation' 
                 : transformation.endsWith('_TO_REGEX')
                   ? 'Extract Expression'
                   : transformation.startsWith('REGEX_') 
                     ? 'Convert Expression' 
                     : transformation.includes('_TO_FA') || transformation.includes('CFG_') 
                       ? 'Convert Grammar'
                       : 'Run Simulator'}
             </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <button 
              onClick={logout}
              className="px-4 py-2 bg-bg-tertiary border border-border-subtle hover:bg-bg-primary rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="px-4 py-2 bg-accent-main text-white hover:bg-accent-hover rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
        </div>`;

// Wait, looking at the code I see `        </div>\n        </div>\n      </header>`
// I can just replace the middle `</div>\n        <div className="flex items-center gap-2">` with nothing!
code = code.replace('</button>\n        </div>\n        <div className="flex items-center gap-2">', '</button>\n          <div className="w-px h-6 bg-border-subtle hidden md:block mx-2"></div>');

// Remove the extra closing div at the end if it exists.
code = code.replace('        </div>\n        </div>\n      </header>', '        </div>\n      </header>');

fs.writeFileSync('src/App.tsx', code);
