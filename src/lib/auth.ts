
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";


// Re-export the User type for convenience
export type { User };

// Simplified wrapper functions
export const signUp = async (email, password, fullName, dueDate) => {
  if (!auth || !db) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create a document for the user in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: fullName,
    dueDate: dueDate,
    createdAt: serverTimestamp(),
  });

  // Send verification email
  await sendEmailVerification(user);
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
