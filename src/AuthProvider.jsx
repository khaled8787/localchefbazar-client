import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from './firebase.init';
import axios from 'axios';

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUserToDB = async (user) => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/users`, {
        name: user.displayName || "No Name",
        email: user.email,
        role: 'user' 
      });
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const getJWT = async (email) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/jwt`, { email });
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("JWT fetch failed:", err);
      localStorage.removeItem("token");
    }
  };

  const registerUser = async (email, password) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await saveUserToDB(result.user);
    await getJWT(result.user.email);

    return result;
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);

    await getJWT(email);
    return result;
  };

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("token");
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const fetchUserRole = async (email) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/${email}`);
          console.log("🔥 ROLE API RESPONSE:", res.data);
      return res.data; 
    } catch (err) {
      console.log("Role fetch failed");
      return null;
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const roleInfo = await fetchUserRole(currentUser.email);
        console.log("🔥 ROLE API RESPONSE:", roleInfo);

        setUser({
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          role: roleInfo?.role 
        });
      } else {
        setUser(null);
      }

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
