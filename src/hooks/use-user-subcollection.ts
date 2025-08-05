
import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';

interface DocumentData {
  id: string;
  [key: string]: any;
}

export function useUserSubcollection(collectionName: string) {
  const { user } = useAuth();
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const subcollectionRef = collection(db, 'users', user.uid, collectionName);
    const q = query(subcollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(documents);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching subcollection ${collectionName}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, collectionName]);

  return { data, loading };
}
