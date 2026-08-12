const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Find where we messed up
const badStart = code.indexOf('    if (authLoading) {\n    return (');
const badEnd = code.indexOf('  return () => unsubscribe();\n  }, []);', badStart);

if (badStart !== -1 && badEnd !== -1) {
  // Extract the inserted block
  let block = code.substring(badStart, badEnd);
  // Remove the `  return (` that was left over at the end of block by our replace
  // Wait, our block ends with `  return (` in the loginScreen string.
  
  // Actually, let's just restore the useEffect correctly:
  const goodUseEffect = `  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (u) => {\n      setUser(u);\n      setAuthLoading(false);\n    });\n    return () => unsubscribe();\n  }, []);`;
  
  // Replace the whole bad useEffect with goodUseEffect
  const useEffectStart = code.lastIndexOf('  useEffect(() => {', badStart);
  const useEffectEnd = code.indexOf('  }, []);', badStart) + 9;
  
  code = code.substring(0, useEffectStart) + goodUseEffect + code.substring(useEffectEnd);
  
  // Now, we need to insert the loginScreen before the MAIN return.
  const mainReturnIdx = code.lastIndexOf('  return (');
  
  const loginScreen = `  if (authLoading) {
    return (
      <div className={\`h-screen w-screen flex items-center justify-center bg-bg-primary text-text-main \${theme}\`}>
        <Activity className="w-8 h-8 animate-spin text-accent-main" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={\`h-screen w-screen flex items-center justify-center bg-bg-primary text-text-main \${theme}\`}>
        <div className="text-center p-8 bg-bg-secondary rounded-xl border border-border-subtle shadow-lg max-w-md w-full mx-4">
          <div className="w-16 h-16 rounded-2xl bg-bg-tertiary flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">
            🐼
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to FiniteVerse</h1>
          <p className="text-text-muted mb-8">Please sign in to access the automata simulator workspace.</p>
          <button
            onClick={signInWithGoogle}
            className="w-full py-3 bg-accent-main text-white hover:bg-accent-hover rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (`;

  code = code.substring(0, mainReturnIdx) + loginScreen + code.substring(mainReturnIdx + 10);
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed successfully.");
} else {
  console.log("Could not find the bad block.");
}
