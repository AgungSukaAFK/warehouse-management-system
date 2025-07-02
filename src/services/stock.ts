import { StockCollection } from "@/lib/firebase";
import type { Stock } from "@/types";
import {
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export async function getAllStocks(): Promise<Stock[]> {
  try {
    const snapshot = await getDocs(StockCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Stock[];
  } catch (error) {
    console.error("Error fetching all stocks:", error);
    throw error;
  }
}

// ambil stock berdasarkan part_number dan lokasi
export async function getStockByPartAndLocation(
  part_number: string,
  lokasi: string
): Promise<Stock | null> {
  try {
    const q = query(
      StockCollection,
      where("part_number", "==", part_number),
      where("lokasi", "==", lokasi)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Stock;
  } catch (error) {
    console.error(
      `Error fetching stock for part ${part_number} at location ${lokasi}:`,
      error
    );
    throw error;
  }
}

export async function updateStock(stock: Stock): Promise<boolean> {
  try {
    if (!stock.id) {
      throw new Error("Stock ID is required for update");
    }
    const stockRef = doc(StockCollection, stock.id);
    await updateDoc(stockRef, {
      part_number: stock.part_number,
      part_name: stock.part_name,
      satuan: stock.satuan,
      lokasi: stock.lokasi,
      max: stock.max,
      min: stock.min,
      qty: stock.qty,
      updated_at: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}
