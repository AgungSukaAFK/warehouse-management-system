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
import type { Pagination, UserDb } from "@/types";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  type DocumentData,
} from "firebase/firestore";

const userRef = collection(db, "users");

export async function getAllUsersWithCursor(
  size: number,
  cursorDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  data: UserDb[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}> {
  let q = query(userRef, orderBy("created_at", "desc"), limit(size));
  if (cursorDoc) {
    q = query(
      userRef,
      orderBy("created_at", "desc"),
      startAfter(cursorDoc),
      limit(size)
    );
  }

  const snap = await getDocs(q);
  const data = snap.docs.map((doc) => ({
    ...(doc.data() as UserDb),
    id: doc.id,
  }));

  return {
    data,
    lastDoc: snap.docs[snap.docs.length - 1],
  };
}
