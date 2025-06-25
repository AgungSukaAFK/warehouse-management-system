import { StockCollection } from "@/lib/firebase";
import type { Stock } from "@/types";
import { getDocs } from "firebase/firestore";

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
