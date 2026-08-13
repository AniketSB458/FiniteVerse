import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  signOut,
  User,
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = import.meta.env.VITE_FIREBASE_DATABASE_ID
  ? getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID)
  : getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn("Failed to set auth persistence, falling back to session:", err);
  setPersistence(auth, browserSessionPersistence).catch((err2) => {
    console.warn("Session persistence failed, falling back to in-memory:", err2);
    setPersistence(auth, inMemoryPersistence).catch((err3) => {
      console.error("All persistence setups failed:", err3);
    });
  });
});

const provider = new GoogleAuthProvider();

const isEmbeddedInIframe = () => {
  try {
    return window.top !== window.self;
  } catch {
    return true;
  }
};

const saveUserToFirestore = async (user: User) => {
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastSignInTime: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (firestoreError) {
    console.error("Firestore error (ignoring for login):", firestoreError);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) await saveUserToFirestore(result.user);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const completeRedirectSignIn = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await saveUserToFirestore(result.user);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error completing redirect sign-in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
