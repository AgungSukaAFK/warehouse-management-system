/**
 * TODO
 * 1. Create Delivery : Warehouse
 * 2. Update Delivery : Warehouse, Logistik
 * 3. Get all Delivery : All
 * 4. Get Delivery by id : All
 */

import { DeliveryCollection, StockCollection } from "@/lib/firebase";
import type { Delivery, Item } from "@/types";
import {
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export async function getAllDelivery(): Promise<Delivery[]> {
  try {
    const snapshots = await getDocs(
      query(DeliveryCollection, orderBy("status", "desc"))
    );
    return snapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Delivery[];
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    throw new Error("Failed to fetch deliveries data");
  }
}

export async function getDeliveryByKode(
  kode: string
): Promise<Delivery | null> {
  try {
    const q = query(DeliveryCollection, where("kode_it", "==", kode));
    const snapshots = await getDocs(q);
    if (snapshots.empty) {
      return null; // Tidak ditemukan
    }
    const doc = snapshots.docs[0];
    return { id: doc.id, ...doc.data() } as Delivery;
  } catch (error) {
    console.error("Error fetching delivery by kode:", error);
    throw new Error("Failed to fetch delivery by kode");
  }
}

export async function updateDelivery(
  kode_it: string,
  data: Partial<Delivery>
): Promise<boolean> {
  try {
    const docRef = await getDocs(
      query(DeliveryCollection, where("kode_it", "==", kode_it))
    );
    await updateDoc(docRef.docs[0].ref, data);
    return true;
  } catch (error) {
    console.error("Error updating delivery:", error);
    throw new Error("Failed to update delivery");
  }
}

export async function createDelivery(
  data: Delivery,
  mr_items: Item[]
): Promise<boolean> {
  const from = data.dari_gudang;
  const to = data.ke_gudang;
  try {
    // Cek kode IT
    const q = query(DeliveryCollection, where("kode_it", "==", data.kode_it));
    const snapshots = await getDocs(q);
    if (!snapshots.empty) {
      throw new Error(`Kode IT ${data.kode_it} sudah ada.`);
    }

    // Kurangi stok di gudang penerima, tambah stok gudang pengirim
    mr_items.forEach(async (item) => {
      const qFrom = query(
        StockCollection,
        where("part_number", "==", item.part_number),
        where("lokasi", "==", from)
      );

      const fromSnapshots = await getDocs(qFrom);
      if (fromSnapshots.empty) {
        throw new Error(
          `Stok tidak ditemukan untuk ${item.part_name} di gudang ${from}.`
        );
      }

      const qTo = query(
        StockCollection,
        where("part_number", "==", item.part_number),
        where("lokasi", "==", to)
      );

      const toSnapshots = await getDocs(qTo);
      if (toSnapshots.empty) {
        throw new Error(
          `Stok tidak ditemukan untuk ${item.part_name} di gudang ${to}.`
        );
      }

      if (fromSnapshots.empty || toSnapshots.empty) {
        throw new Error(
          `Stok tidak ditemukan untuk ${item.part_name} di gudang ${from} atau  ${to}.`
        );
      }

      const fromDoc = fromSnapshots.docs[0];
      const newQtyFrom = (fromDoc.data().qty || 0) - item.qty;
      if (newQtyFrom < 0) {
        throw new Error(
          `Stok tidak cukup di gudang ${from} untuk mengirim ${item.qty} ${item.part_name}.`
        );
      }
      await updateDoc(fromDoc.ref, { qty: newQtyFrom });

      const toDoc = toSnapshots.docs[0];
      const newQtyTo = (toDoc.data().qty || 0) + item.qty;
      await updateDoc(toDoc.ref, { qty: newQtyTo });
    });

    // Buat dokumen delivery baru
    await addDoc(DeliveryCollection, {
      ...data,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error creating delivery:", error);
    throw new Error("Failed to create delivery");
  }
}
