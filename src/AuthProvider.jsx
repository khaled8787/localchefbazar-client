import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from './firebase.init';
import axios from 'axios';

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ---------------- Register ----------------
    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // ---------------- JWT Token ----------------
    const getJWT = async (email) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_server_url}/jwt`, { email });
            localStorage.setItem("token", res.data.token); // save token
        } catch (err) {
            console.error("JWT fetch failed:", err);
            localStorage.removeItem("token");
        }
    };

    // ---------------- Sign In ----------------
    const signInUser = async (email, password) => {
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, email, password);
        await getJWT(email); // get JWT after login
        return result;
    };

    // ---------------- Log Out ----------------
    const logOut = () => {
        setLoading(true);
        localStorage.removeItem("token"); // remove JWT on logout
        return signOut(auth);
    };

    // ---------------- Update Profile ----------------
    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };

    // ---------------- Auth State Observer ----------------
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unSubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        registerUser,
        signInUser,
        logOut,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
