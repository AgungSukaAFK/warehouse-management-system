/**
 * TODO
 * 1. Create MR : Warehouse - done
 * 2. Update MR : Warehouse - done
 * 3. Get all MR : All - done
 * 4. Get MR by id : All - done
 */

import { MRCollection } from "@/lib/firebase";
import type { MR, UserComplete, UserDb } from "@/types";
import { LokasiList } from "@/types/enum";
import {
  addDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

// --- MR Service Functions ---

export async function generateKodeMR(
  user: UserDb | UserComplete
): Promise<string> {
  // Contoh GMI/JKT/25/4/00005
  const locationShort =
    LokasiList.find((loc) => loc.nama === user.lokasi)?.kode || "UNK";
  const tahunShort = new Date().getFullYear().toString().slice(-2);
  const bulanShort = (new Date().getMonth() + 1).toString();
  try {
    const templateKode = `GMI/${locationShort}/${tahunShort}/`;
    const q = query(
      MRCollection,
      where("kode", ">=", templateKode),
      where("kode", "<", templateKode + "99999"),
      orderBy("kode", "desc"),
      limit(1)
    );
    const getLatestKodeInCollection = await getDocs(q);
    if (getLatestKodeInCollection.empty) {
      return templateKode + bulanShort + "/00001";
    }
    const latestDoc = getLatestKodeInCollection.docs[0];
    const latestKode = latestDoc.data().kode as string;
    const latestNumber = parseInt(latestKode.split("/").pop() || "0", 10);
    const nextNumber = latestNumber + 1;
    const nextKode = nextNumber.toString().padStart(5, "0");
    return `${templateKode}${bulanShort}/${nextKode}`;
  } catch (error) {
    throw error;
  }
}

export async function createMR(
  newMRData: Omit<MR, "id" | "created_at" | "updated_at">
): Promise<boolean> {
  try {
    // check mr with same kode
    const q = query(MRCollection, where("kode", "==", newMRData.kode));
    const existingSnap = await getDocs(q);

    if (!existingSnap.empty) {
      throw new Error(
        `MR dengan kode ${newMRData.kode} sudah ada, ganti dengan yang lain.`
      );
    }

    const timestamp = Timestamp.now();
    const mrToAdd = {
      ...newMRData,
      created_at: timestamp,
      updated_at: timestamp,
    };
    await addDoc(MRCollection, mrToAdd);

    return true;
  } catch (error) {
    console.error("Error creating MR:", error);
    throw error;
  }
}

export async function getAllMr(): Promise<MR[]> {
  try {
    const q = query(MRCollection, orderBy("kode", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MR[];
  } catch (error) {
    console.error("Error fetching all MR:", error);
    throw error;
  }
}

export async function getMrByKode(kode: string): Promise<MR | null> {
  try {
    const q = query(MRCollection, where("kode", "==", kode));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as MR;
  } catch (error) {
    console.error(`Error fetching MR by kode ${kode}:`, error);
    throw error;
  }
}

export async function updateMR(
  mrid: string,
  updatedData: Partial<MR>
): Promise<boolean> {
  try {
    const docref = doc(MRCollection, mrid);
    await updateDoc(docref, {
      ...updatedData,
      updated_at: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating MR with id ${mrid}:`, error);
    throw error;
  }
}
