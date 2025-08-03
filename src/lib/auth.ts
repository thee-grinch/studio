import { auth } from "./firebase"; // Assuming you are keeping firebase for now
// import {
// signOut,
// sendPasswordResetEmail,
// onAuthStateChanged,
//   sendPasswordResetEmail,
//   onAuthStateChanged,
//   type User,
// } from "firebase/auth";

import { fetchBackend } from "./api";


export const signUp = async (email: string, password: string, fullName: string, phoneNumber: string, location: string, language: string) => {
  const response = await fetchBackend('/register', 'POST', {
    email,
    password,
    full_name: fullName, // Assuming your backend expects 'full_name'
    phone_number: phoneNumber, // Assuming your backend expects 'phone_number'
    // Assuming your backend expects 'location' and 'language'
    location,
    language,
  });
  // Handle the response as needed, e.g., check for success status
  if (!response.ok) { // Assuming fetchBackend doesn't throw for non-OK status
      const errorData = await response.json(); // Assuming backend returns error details
      throw new Error(errorData.detail || 'Failed to sign up');
  }
  return response.json(); // Return the response data (e.g., user info, tokens)
};

export const logIn = async (email: string, password: string) => {
  const response = await fetchBackend('/login', 'POST', { email, password });
   // Handle the response as needed
    if (!response.ok) { // Assuming fetchBackend doesn't throw for non-OK status
      const errorData = await response.json(); // Assuming backend returns error details
      throw new Error(errorData.detail || 'Failed to log in');
  }
  return response.json(); // Return the response data (e.g., auth token)
};

// // You may still need these functions if you are using Firebase for other things
export const logOut = async () => {
  // If using token-based auth, you might clear the token from storage here
  // If using Firebase auth, keep the line below:
  return signOut(auth);
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

