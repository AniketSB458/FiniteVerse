const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add LogOut to imports
code = code.replace(
  "import { Activity, Palette, Play, SquareTerminal, Github, Linkedin, X, Mail } from 'lucide-react';",
  "import { Activity, Palette, Play, SquareTerminal, Github, Linkedin, X, Mail, LogOut } from 'lucide-react';"
);

// Update Sign Out button
const oldButton = `<button 
              onClick={logout}
              className="px-4 py-2 bg-bg-tertiary border border-border-subtle hover:bg-bg-primary rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>`;

const newButton = `<button 
              onClick={logout}
              className="px-3 sm:px-4 py-2 bg-bg-tertiary border border-border-subtle hover:bg-bg-primary rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>`;

code = code.replace(oldButton, newButton);

fs.writeFileSync('src/App.tsx', code);
