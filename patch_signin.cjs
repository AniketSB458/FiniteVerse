const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// Replace signInWithGoogle implementation
const oldSignInRegex = /export const signInWithGoogle = async \(\) => \{[\s\S]*?\n\};\n\nexport const completeRedirectSignIn/m;
const newSignIn = `export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) await saveUserToFirestore(result.user);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const completeRedirectSignIn`;

code = code.replace(oldSignInRegex, newSignIn);

fs.writeFileSync('src/lib/firebase.ts', code);
