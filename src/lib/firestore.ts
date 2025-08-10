

import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Adds a new document to a subcollection of the currently authenticated user.
 * The document will automatically receive a `createdAt` server timestamp and the `userId`.
 * @param {string} subcollection - The name of the subcollection (e.g., 'appointments', 'symptoms').
 * @param {object} data - The data for the new document.
 * @returns {Promise<void>} A promise that resolves when the document has been successfully added.
 * @throws {Error} Throws an error if the user is not authenticated or Firebase is not initialized.
 */
export const addUserSubcollectionDoc = async (subcollection: string, data: object) => {
    if (!auth?.currentUser || !db) {
        throw new Error("User is not authenticated or Firebase is not initialized.");
    }

    const userId = auth.currentUser.uid;
    const subcollectionRef = collection(db, "users", userId, subcollection);

    await addDoc(subcollectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        userId: userId,
    });
};
