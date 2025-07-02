/**
 * TODO
 * 1. Create Delivery : Warehouse
 * 2. Update Delivery : Warehouse, Logistik
 * 3. Get all Delivery : All
 * 4. Get Delivery by id : All
 */

import { DeliveryCollection } from "@/lib/firebase";
import type { Delivery } from "@/types";
import { addDoc, getDocs, query, Timestamp, where } from "firebase/firestore";

export async function getAllDelivery(): Promise<Delivery[]> {
  try {
    const snapshots = await getDocs(DeliveryCollection);
    return snapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Delivery[];
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    throw new Error("Failed to fetch deliveries data");
  }
}

export async function createDelivery(data: Delivery): Promise<boolean> {
  try {
    // Cek kode IT
    const q = query(DeliveryCollection, where("kode_it", "==", data.kode_it));
    const snapshots = await getDocs(q);
    if (!snapshots.empty) {
      throw new Error(`Kode IT ${data.kode_it} sudah ada.`);
    }
    // Simpan data
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
