
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
