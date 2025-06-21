// src/contexts/AuthContext.js (Contoh dengan React Context API)
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Import from firebase/auth
import { auth, db } from "@/lib/firebase"; // Asumsi ini file config Firebase Anda
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions

// Definisi type User jika Anda menggunakan TypeScript
// type User = {
//   // ... properti user Anda
//   email: string;
//   emailVerified: boolean;
//   id: string;
// };

type AuthContextType = {
  currentUser: any;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Logika redirect di sini atau setelah fetch data dari Firestore
        if (user.emailVerified === false) {
          window.location.href = "/verify-email";
          setLoading(false); // Penting untuk menghentikan loading state jika redirect
          return;
        }

        // Ambil data tambahan dari Firestore
        try {
          const userRef = collection(db, "users"); // Ganti "users" dengan nama koleksi Anda
          const q = query(userRef, where("email", "==", user.email));
          const userDoc = await getDocs(q);

          if (userDoc.empty) {
            // Jika user ada di Auth tapi tidak di Firestore
            window.location.href = "/login";
            setLoading(false);
            return;
          }

          const userData = userDoc.docs[0].data();
          setCurrentUser(userData);
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          window.location.href = "/login";
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children once loading is false */}
      {loading && <div>Loading user data...</div>}{" "}
      {/* Opsional: Loading state */}
    </AuthContext.Provider>
  );
}
