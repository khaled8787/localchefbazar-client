import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase.init";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const serverURL = import.meta.env.VITE_SERVER_URL;

  const saveUserToDB = async (firebaseUser) => {
    try {
      await axios.post(`${serverURL}/users`, {
        name: firebaseUser.displayName || "No Name",
        email: firebaseUser.email,
        role: "user",
      });
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const registerUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await saveUserToDB(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (!currentUser?.email) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${serverURL}/users/${currentUser.email}`
        );

        setUser({
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          role: res.data?.role || "user",
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);

        setUser({
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          role: "user",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unSubscribe();
  }, [serverURL]);

  const authInfo = {
    user,
    loading,
    registerUser,
    signInUser,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
