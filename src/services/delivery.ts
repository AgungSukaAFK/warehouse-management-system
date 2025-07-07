/**
 * TODO
 * 1. Create Delivery : Warehouse
 * 2. Update Delivery : Warehouse, Logistik
 * 3. Get all Delivery : All
 * 4. Get Delivery by id : All
 */

import {
  DeliveryCollection,
  MRCollection,
  StockCollection,
} from "@/lib/firebase";
import type { Delivery, DeliveryItem, MR } from "@/types";
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
      query(
        DeliveryCollection,
        orderBy("status", "desc"),
        orderBy("kode_it", "desc")
      )
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

    if (docRef.empty) {
      throw new Error(`Delivery dengan kode IT ${kode_it} tidak ditemukan.`);
    }

    if (!data.kode_mr) {
      throw new Error("Kode MR tidak ditemukan dalam data delivery.");
    }

    if (data.status === "completed") {
      const mrRef = await getDocs(
        query(MRCollection, where("kode", "==", data.kode_mr))
      );
      const mrDoc = mrRef.docs[0];
      let mrItems = (mrDoc.data() as MR).barang;
      console.log(mrItems);
      // update barang di MR
      data.items?.forEach((item: DeliveryItem) => {
        mrItems = mrItems.map((mr_item) => {
          if (mr_item.part_number === item.part_number) {
            return {
              ...mr_item,
              qty_delivered: (mr_item.qty_delivered += item.qty),
            };
          } else {
            return mr_item;
          }
        });
      });

      // update MR masih open
      let isMrDone: boolean = false;
      mrItems.forEach((item) => {
        if (item.qty_delivered >= item.qty) {
          isMrDone = true;
        }
      });
      await updateDoc(mrDoc.ref, {
        barang: mrItems,
        status: isMrDone ? "close" : "open",
        updated_at: Timestamp.now(),
      });

      // Pindah qty delivery ke qty delivered
      data.items?.forEach((item: DeliveryItem) => {
        item.qty_delivered += item.qty_on_delivery;
        item.qty_on_delivery = 0; // reset qty on delivery
      });
    }

    if (data.status === "on delivery") {
      // Kurangi stok di gudang pengirim
      console.log(data.items);
      data.items?.forEach(async (item: DeliveryItem) => {
        const stockQuery = query(
          StockCollection,
          where("part_number", "==", item.part_number),
          where("lokasi", "==", item.dari_gudang)
        );
        const stockSnapshot = await getDocs(stockQuery);
        if (stockSnapshot.empty) {
          throw new Error(
            `Stok untuk part ${item.part_number} di lokasi ${item.dari_gudang} tidak ditemukan.`
          );
        }
        const stockDoc = stockSnapshot.docs[0];
        console.log("data");
        console.log(stockDoc.data());
        const currentStock = stockDoc.data().qty as number;

        if (currentStock < item.qty) {
          throw new Error(
            `Stok tidak cukup untuk part ${item.part_number} di lokasi ${item.dari_gudang}.`
          );
        }

        // Update stok
        await updateDoc(stockDoc.ref, {
          qty: currentStock - item.qty,
          updated_at: Timestamp.now(),
        });
      });
      // pindah qty pending ke qty on delivery
      data.items?.forEach((item: DeliveryItem) => {
        item.qty_on_delivery += item.qty_pending;
        item.qty_pending = 0; // reset qty pending
      });
    }

    await updateDoc(docRef.docs[0].ref, {
      ...data,
      items: data.items,
      updated_at: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error updating delivery:", error);
    throw new Error("Failed to update delivery");
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
