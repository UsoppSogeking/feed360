import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useFirestoreUser = (uid) => {
    const [firestoreUser, setFirestoreUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!uid) {
            setLoading(false);
            return;
        }

        const fetchFirestoreUser = async () => {
            setLoading(true);
            try {
                const userDoc = await getDoc(doc(db, 'users', uid));
                if (userDoc.exists()) {
                    setFirestoreUser(userDoc.data());
                } else {
                    setError('User not found in Firestore');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFirestoreUser();
    }, [uid]);

    return { firestoreUser, loading, error };
};

export default useFirestoreUser;
