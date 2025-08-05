
import { useEffect } from 'react';
import { create } from 'zustand';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from './use-auth';

interface UserDocument {
  [key: string]: any;
}

interface UserDocumentState {
  userDocument: UserDocument | null;
  loading: boolean;
  setUserDocument: (doc: UserDocument | null) => void;
  setLoading: (loading: boolean) => void;
  refreshUserDocument: () => Promise<void>;
}

const useUserDocumentStore = create<UserDocumentState>((set, get) => ({
  userDocument: null,
  loading: true,
  setUserDocument: (doc) => set({ userDocument: doc, loading: false }),
  setLoading: (loading) => set({ loading }),
  refreshUserDocument: async () => {
    const user = auth?.currentUser;
    if (!user || !db) return;
    
    console.log("Refreshing user document...");
    get().setLoading(true);
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      get().setUserDocument(docSnap.data());
      console.log("User document refreshed:", docSnap.data());
    } else {
      get().setUserDocument(null);
      console.log("No user document found after refresh.");
    }
    get().setLoading(false);
  }
}));

export const useUserDocument = () => {
  const { user } = useAuth();
  const { userDocument, loading, setUserDocument, setLoading, refreshUserDocument } = useUserDocumentStore();

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`Setting up Firestore listener for user: ${user.uid}`);
    const docRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Received user document update:", docSnap.data());
        setUserDocument(docSnap.data());
      } else {
        console.log("User document does not exist.");
        setUserDocument(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      setUserDocument(null);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up Firestore listener.");
      unsubscribe();
    };
  }, [user, setUserDocument, setLoading]);

  return { userDocument, loading, refreshUserDocument };
};
