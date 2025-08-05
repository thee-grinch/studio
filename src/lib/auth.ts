
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";

// Re-export the User type for convenience
export type { User };

// Simplified wrapper functions
export const signUp = async (email, password, fullName) => {
  if (!auth) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: fullName });
  return userCredential;
};

export const logIn = (email, password) => {
  if (!auth) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
    if (!auth) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  return signOut(auth);
};

export const resetPassword = (email) => {
    if (!auth) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  return sendPasswordResetEmail(auth, email);
};

export const onAuthChange = (callback) => {
    if (!auth) {
        // If firebase is not configured, call the callback with null
        // to prevent the app from hanging in a loading state.
        callback(null);
        return () => {};
    }
  return onAuthStateChanged(auth, callback);
};
