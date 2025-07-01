import { StockCollection } from "@/lib/firebase";
import type { Stock } from "@/types";
import { doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";

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
