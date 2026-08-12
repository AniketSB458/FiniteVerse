const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { Automata, Transition, ConversionStep } from './types';",
  "import { Automata, Transition, ConversionStep } from './types';\nimport { auth, signInWithGoogle, logout } from './lib/firebase';\nimport { onAuthStateChanged, User } from 'firebase/auth';"
);

code = code.replace(
  "const [showAboutModal, setShowAboutModal] = useState(false);",
  "const [showAboutModal, setShowAboutModal] = useState(false);\n  const [user, setUser] = useState<User | null>(null);"
);

code = code.replace(
  "  useEffect(() => {\n    document.documentElement.className = theme;",
  "  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (u) => {\n      setUser(u);\n    });\n    return () => unsubscribe();\n  }, []);\n\n  useEffect(() => {\n    document.documentElement.className = theme;"
);

code = code.replace(
  "</header>",
  `  <div className="flex items-center gap-4">\n          {user ? (\n            <div className="flex items-center gap-3">\n              <span className="text-sm text-text-muted hidden sm:inline-block">{user.email}</span>\n              <button \n                onClick={logout}\n                className="px-4 py-2 bg-bg-tertiary hover:bg-border-subtle rounded-md text-sm font-medium transition-colors"\n              >\n                Sign Out\n              </button>\n            </div>\n          ) : (\n            <button \n              onClick={signInWithGoogle}\n              className="px-4 py-2 bg-accent-main text-white hover:bg-accent-hover rounded-md text-sm font-medium transition-colors"\n            >\n              Sign In\n            </button>\n          )}\n        </div>\n      </header>`
);

fs.writeFileSync('src/App.tsx', code);
