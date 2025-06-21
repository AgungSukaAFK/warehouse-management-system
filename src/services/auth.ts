import { auth, db } from "@/lib/firebase";
import type { User } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
} from "firebase/auth";
import {
  addDoc,
  collection,
  FieldValue,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

interface Register {
  email: string;
  nama: string;
  role: string;
  lokasi: string;
  password: string;
}

interface SignIn {
  email: string;
  password: string;
}

interface GetUser {
  id: string;
}

const userCollection = "users";

export async function registerUser(dto: Register) {
  const { email, nama, role, lokasi, password } = dto;
  if (!email || !nama || !role || !lokasi || !password) {
    throw new Error("All fields are required");
  }

  // Cek email di DB
  const ref = collection(db, userCollection);
  const q = query(ref, where("email", "==", email));
  const userDoc = await getDocs(q);
  if (!userDoc.empty) {
    throw new Error("Email sudah terdaftar");
  }

  await createUserWithEmailAndPassword(auth, email, password).then(
    async (userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user);

      // Simpan data user ke Firestore
      const userData: User = {
        email,
        nama,
        role,
        lokasi,
        email_verified: user.emailVerified,
        auth_provider: "credential",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      const userRef = collection(db, userCollection);
      await addDoc(userRef, userData);
    }
  );

  // Create User di DB
}

export async function getCurrentUser() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "/login";
  }
  if (user?.emailVerified === false) {
    window.location.href = "/verify-email";
  }

  // Fetch user data from Firestore
  const userRef = collection(db, userCollection);
  const q = query(userRef, where("email", "==", user?.email));
  const userDoc = await getDocs(q);
  if (userDoc.empty) {
    window.location.href = "/login";
  }
  const completedUser = userDoc.docs[0].data() as User;

  return {
    ...completedUser,
    id: userDoc.docs[0].id,
  };
}

export async function signIn(dto: SignIn) {
  const { email, password } = dto;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    // Use signInWithEmailAndPassword for email/password authentication
    const userCredential = await import("firebase/auth").then(
      ({ signInWithEmailAndPassword }) =>
        signInWithEmailAndPassword(auth, email, password)
    );
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userRef = collection(db, userCollection);
    const q = query(userRef, where("email", "==", user.email));
    const userDoc = await getDocs(q);
    if (userDoc.empty) {
      throw new Error("User not found");
    }
    const completedUser = userDoc.docs[0].data() as User;

    return {
      ...completedUser,
      id: userDoc.docs[0].id,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Sign in failed");
  }
}
