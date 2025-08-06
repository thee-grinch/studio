

import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Re-export the User type for convenience
export type { User };

export const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';

export const signInWithGoogle = async () => {
    if (!auth?.currentUser) {
        throw new Error("User must be logged in to link a Google Account.");
    }
    const provider = new GoogleAuthProvider();
    provider.addScope(CALENDAR_SCOPE);
    
    // Check if the user already has a Google credential linked
    const isGoogleLinked = auth.currentUser.providerData.some(
        (pd) => pd.providerId === GoogleAuthProvider.PROVIDER_ID
    );

    if (isGoogleLinked) {
         // If already linked, we can just re-authenticate to get a fresh token if needed
        return signInWithPopup(auth, provider);
    } else {
        // If not linked, link the new credential
        return linkWithPopup(auth.currentUser, provider);
    }
};

// Simplified wrapper functions
export const signUp = async (email, password, fullName) => {
  if (!auth) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update Firebase Auth profile
  await updateProfile(user, { displayName: fullName });
  
  // Create user document in Firestore
  if (db) {
      console.log("Creating user document in Firestore...");
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: user.email,
        createdAt: new Date(),
        // Add any other initial data you want to store
      });
      console.log("User document created.");
  }
  
  // Send verification email
  await sendEmailVerification(user);
  console.log("Verification email sent.");

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

export const updateUserProfile = async (data: { displayName?: string; dueDate?: string; weight?: number; }) => {
    if (!auth?.currentUser) {
        throw new Error("No user is currently signed in.");
    }
    const user = auth.currentUser;
    const updates: { displayName?: string; dueDate?: string; weight?: number } = {};

    if (data.displayName) {
        updates.displayName = data.displayName;
    }
    if (data.dueDate) {
        updates.dueDate = data.dueDate;
    }
    if (data.weight) {
        updates.weight = data.weight;
    }

    
    // Update Firebase Auth profile
    if (updates.displayName) {
        await updateProfile(user, { displayName: updates.displayName });
        console.log("Firebase Auth profile updated.");
    }

    // Update Firestore document
    if (db) {
        const userDocRef = doc(db, "users", user.uid);
        // Use setDoc with merge:true to create or update the document.
        await setDoc(userDocRef, {
            ...updates,
            updatedAt: new Date()
        }, { merge: true });
        console.log("Firestore user document created or updated.");
    }
};
