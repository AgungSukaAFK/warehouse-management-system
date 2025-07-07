/**
 * TODO
 * 1. Create RI : System
 * 2. Update RI : Warehouse
 * 3. Get all RI : All
 * 4. Get RI by id : All
 */

import { POCollection, RICollection, StockCollection } from "@/lib/firebase";
import type { PR, RI } from "@/types";
import {
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export async function getAllRi(): Promise<RI[]> {
  try {
    const q = query(RICollection, orderBy("kode", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RI[];
  } catch (error) {
    console.error("Error fetching all PO:", error);
    throw error;
  }
}

export async function getRiByKode(kode: string): Promise<RI | null> {
  try {
    const q = query(RICollection, where("kode", "==", kode));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as RI;
  } catch (error) {
    console.error(`Error fetching RI by kode ${kode}:`, error);
    throw error;
  }
}

export async function createRI(newRIData: RI, prTerkait: PR): Promise<boolean> {
  try {
    const q = query(RICollection, where("kode", "==", newRIData.kode));
    const existingSnap = await getDocs(q);
    if (!existingSnap.empty) {
      throw new Error(
        `RI kode ${newRIData.kode} already exists. Please use a different code.`
      );
    }

    // Update stocks di gudang penerima
    prTerkait.order_item.forEach(async (item) => {
      const q = query(
        StockCollection,
        where("part_number", "==", item.part_number),
        where("lokasi", "==", newRIData.gudang_penerima)
      );
      const stockRef = await getDocs(q);

      await updateDoc(stockRef.docs[0].ref, {
        qty: stockRef.docs[0].data().qty + item.qty,
        updated_at: Timestamp.now(),
      });
    });

    // Update status po jadi received
    const poRef = await getDocs(
      query(POCollection, where("kode", "==", newRIData.kode_po))
    );

    await updateDoc(poRef.docs[0].ref, {
      status: "received",
    });

    // Insert new RI
    await addDoc(RICollection, newRIData);

    return true;
  } catch (error) {
    console.error("Error creating RI:", error);
    throw error;
  }
}
