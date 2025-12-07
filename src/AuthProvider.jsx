import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from './firebase.init';
import axios from 'axios';

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- SAVE USER IN DB ----------------
  const saveUserToDB = async (user) => {
    console.log("Saving user to DB:", user); 
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/users`, {
        name: user.displayName || "No Name",
        email: user.email,
      });
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };
  console.log("SERVER_URL =", import.meta.env.VITE_SERVER_URL);


  // ---------------- JWT ----------------
  const getJWT = async (email) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_server_url}/jwt`, { email });
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("JWT fetch failed:", err);
      localStorage.removeItem("token");
    }
  };

  // ---------------- Register ----------------
  const registerUser = async (email, password) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Save to DB
    await saveUserToDB(result.user);

    // JWT Issue
    await getJWT(result.user.email);

    return result;
  };

  // ---------------- Sign In ----------------
  const signInUser = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);

    // JWT Issue
    await getJWT(email);

    return result;
  };

  // ---------------- Log Out ----------------
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("token");
    return signOut(auth);
  };

  // ---------------- Update Profile ----------------
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // ---------------- Observer ----------------
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
