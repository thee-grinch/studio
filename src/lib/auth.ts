

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

/**
 * Initiates Google Sign-In and links it to the current user's account.
 * This function requests the necessary scopes for Google Calendar.
 * If the user's account is not already linked to Google, it will link it.
 * If it is already linked, it will re-authenticate to get a fresh token.
 * @returns {Promise<import("firebase/auth").UserCredential | null>} A promise that resolves with the user credential on success, or null on failure.
 */
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

/**
 * Signs up a new user with email, password, and full name.
 * Creates a user document in Firestore and sends a verification email.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} fullName - The user's full name.
 * @returns {Promise<import("firebase/auth").UserCredential>} A promise that resolves with the user credential upon successful registration.
 */
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

/**
 * Logs in an existing user with their email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").UserCredential>} A promise that resolves with the user credential upon successful login.
 */
export const logIn = (email, password) => {
  if (!auth) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently authenticated user.
 * @returns {Promise<void>} A promise that resolves when the user has been logged out.
 */
export const logOut = () => {
    if (!auth) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  return signOut(auth);
};

/**
 * Sends a password reset email to the specified address.
 * @param {string} email - The email address to send the reset link to.
 * @returns {Promise<void>} A promise that resolves when the reset email has been sent.
 */
export const resetPassword = (email) => {
    if (!auth) {
    throw new Error("Firebase has not been initialized correctly.");
  }
  return sendPasswordResetEmail(auth, email);
};

/**
 * Sets up a listener for authentication state changes.
 * @param {(user: User | null) => void} callback - A callback function that is invoked when the auth state changes. It receives the user object or null.
 * @returns {import("firebase/auth").Unsubscribe} A function to unsubscribe the listener.
 */
export const onAuthChange = (callback) => {
    if (!auth) {
        // If firebase is not configured, call the callback with null
        // to prevent the app from hanging in a loading state.
        callback(null);
        return () => {};
    }
  return onAuthStateChanged(auth, callback);
};

/**
 * Updates the user's profile in both Firebase Auth and Firestore.
 * @param {object} data - An object containing the data to update.
 * @param {string} [data.displayName] - The user's new display name.
 * @param {string} [data.dueDate] - The user's estimated due date.
 * @param {number} [data.weight] - The user's current weight.
 * @returns {Promise<void>} A promise that resolves when the profile has been updated.
 */
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
