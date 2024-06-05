import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getFirestore, setDoc } from 'firebase/firestore';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const register = async (name, email, password) => {
        setError(null);
        setLoading(true);
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            const userId = user.uid;

            const db = getFirestore();
            await setDoc(doc(db, 'users', userId), {
                userId,
                name,
                email,
                photoUrl: ""
            });

            await updateProfile(user, {
                displayName: name,
            });

            setLoading(false);
            setError(null);
            return true;
        } catch (err) {
            console.log(err.message);
            setLoading(false);
            setError(err.message);
            return false;
        }
    }

    const login = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError("Usuário ou senha inválido.");
        }
        setLoading(false);
    }

    const logout = async () => {
        setError(null);

        try {
            await signOut(auth);
            setUser(null);
        } catch (err) {
            console.log(err.message);
        }
        setLoading(false);
    }

    return { user, register, login, logout, loading, error  }

}