const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// Replace browserLocalPersistence imports with browserLocalPersistence, browserSessionPersistence, inMemoryPersistence
code = code.replace(
  'browserLocalPersistence,',
  'browserLocalPersistence,\n  browserSessionPersistence,\n  inMemoryPersistence,'
);

// Replace the persistence logic
const oldPersistence = `setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Failed to set auth persistence:", err);
});`;

const newPersistence = `setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Failed to set auth persistence, falling back to session:", err);
  setPersistence(auth, browserSessionPersistence).catch((err2) => {
    console.warn("Session persistence failed, falling back to in-memory:", err2);
    setPersistence(auth, inMemoryPersistence).catch((err3) => {
      console.error("All persistence setups failed:", err3);
    });
  });
});`;

code = code.replace(oldPersistence, newPersistence);

// Replace signInWithGoogle logic to only use signInWithPopup
const oldSignIn = `export const signInWithGoogle = async () => {
  if (isEmbeddedInIframe()) {
    await signInWithRedirect(auth, provider);
    return null;
  }
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) await saveUserToFirestore(result.user);
    return result.user;
  } catch (error: any) {
    const code = error?.code || "";
    const message = error?.message || "";
    const shouldFallbackToRedirect =
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      message.includes("Cross-Origin-Opener-Policy") ||
      message.includes("closed");

    if (shouldFallbackToRedirect) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    console.error("Error signing in with Google:", error);
    throw error;
  }
};`;

const newSignIn = `export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) await saveUserToFirestore(result.user);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};`;

code = code.replace(oldSignIn, newSignIn);

fs.writeFileSync('src/lib/firebase.ts', code);
