/**
 * TODO
 * 1. Create user : Admin
 * 2. Update full user data : Admin
 * 3. Update partial user data : All
 * 4. Soft delete user : Admin
 * 5. Get user by id : All
 * 6. Get all users : Admin DONE
 *
 */

import { db } from "@/lib/firebase";
import type { UserDb } from "@/types";
import {
  collection,
  doc,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";

const userRef = collection(db, "users");

interface PaginationOptions {
  limit?: number;
  startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null;
  endBeforeDoc?: QueryDocumentSnapshot<DocumentData> | null;
}

interface PaginatedUsersResult {
  users: UserDb[];
  nextPageDoc: QueryDocumentSnapshot<DocumentData> | null;
  prevPageDoc: QueryDocumentSnapshot<DocumentData> | null;
  totalUsersCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export async function getAllUsers({
  limit: pageSize = 25,
  startAfterDoc = null,
  endBeforeDoc = null,
}: PaginationOptions = {}): Promise<PaginatedUsersResult> {
  let q;

  if (startAfterDoc) {
    q = query(
      userRef,
      orderBy("created_at", "desc"),
      startAfter(startAfterDoc),
      limit(pageSize)
    );
  } else if (endBeforeDoc) {
    // Untuk 'previous page' dengan orderBy 'desc', kita perlu membalik urutan kueri
    // dan membalik hasilnya nanti.
    q = query(
      userRef,
      orderBy("created_at", "asc"),
      startAfter(endBeforeDoc),
      limit(pageSize)
    );
  } else {
    q = query(userRef, orderBy("created_at", "desc"), limit(pageSize));
  }

  const snap = await getDocs(q);
  let users = snap.docs.map((doc) => ({
    ...(doc.data() as UserDb),
    id: doc.id,
  }));

  // Jika ini adalah kueri 'previous page', kita harus membalik urutan hasil
  if (endBeforeDoc) {
    users = users.reverse();
  }

  const firstVisible = snap.docs.length > 0 ? snap.docs[0] : null;
  const lastVisible =
    snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

  // Mendapatkan total hitungan dokumen dari server
  const countSnap = await getCountFromServer(userRef);
  const totalUsersCount = countSnap.data().count;

  // Mengecek apakah ada halaman berikutnya
  let hasNext = false;
  if (lastVisible) {
    const nextQueryCheck = query(
      userRef,
      orderBy("created_at", "desc"),
      startAfter(lastVisible),
      limit(1)
    );
    const nextSnapCheck = await getDocs(nextQueryCheck);
    hasNext = !nextSnapCheck.empty;
  }

  // Mengecek apakah ada halaman sebelumnya
  let hasPrevious = false;
  // Jika tidak ada startAfterDoc dan ada dokumen yang diambil, berarti kita bisa punya halaman sebelumnya.
  // Atau jika kita memang berada di halaman berikutnya (ada startAfterDoc) dan halaman itu bukan halaman pertama.
  if (firstVisible && !startAfterDoc) {
    const prevQueryCheck = query(
      userRef,
      orderBy("created_at", "desc"),
      endBefore(firstVisible),
      limit(1)
    );
    const prevSnapCheck = await getDocs(prevQueryCheck);
    hasPrevious = !prevSnapCheck.empty;
  } else if (startAfterDoc && users.length > 0) {
    // Jika kita berada di halaman tengah (ada startAfterDoc), kita pasti bisa mundur
    hasPrevious = true;
  }

  return {
    users,
    nextPageDoc: lastVisible,
    prevPageDoc: firstVisible,
    totalUsersCount,
    hasNext,
    hasPrevious,
  };
}

export async function updateUser(user: Partial<UserDb>): Promise<boolean> {
  try {
    const docRef = doc(db, "users", user.id!);
    await updateDoc(docRef, {
      nama: user.nama,
      role: user.role,
      lokasi: user.lokasi,
      updated_at: serverTimestamp(),
    } as Partial<UserDb>);
    return true;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user: ${error.message}`);
    } else {
      throw new Error("Failed to update user due to an unexpected error.");
    }
  }
}
