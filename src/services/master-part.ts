import { MasterPartCollection, StockCollection } from "@/lib/firebase";
import type { MasterPart, Stock } from "@/types";
import { LokasiList } from "@/types/enum";
import {
  addDoc,
  deleteDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export async function createMasterPart(data: MasterPart): Promise<boolean> {
  const { part_number, part_name, satuan } = data;
  if (!part_number || !part_name || !satuan) {
    throw new Error("Part number, part name, and satuan are required.");
  }

  // Cek jika part number sudah ada
  const q = query(
    MasterPartCollection,
    where("part_number", "==", part_number)
  );
  const existingPart = await getDocs(q);
  if (!existingPart.empty) {
    return false;
  }

  // Simpan data baru
  await addDoc(MasterPartCollection, {
    part_name,
    part_number,
    satuan,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  } as MasterPart);

  // Simpan stok untuk semua lokasi
  LokasiList.map(async (lokasi) => {
    if (lokasi.nama === "unassigned") {
      return;
    }

    const stockData: Stock = {
      part_number,
      part_name,
      satuan,
      lokasi: lokasi.nama,
      max: 100,
      min: 0,
      qty: 0,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    // Simpan stok untuk setiap lokasi
    await addDoc(StockCollection, stockData);
  });

  return true;
}

export async function getMasterParts(): Promise<MasterPart[]> {
  const snapShot = await getDocs(MasterPartCollection);
  return snapShot.docs.map((doc) => {
    return doc.data() as MasterPart;
  });
}

export async function updateMasterPart(
  data: Partial<MasterPart>
): Promise<boolean> {
  const { id, part_number, part_name, satuan } = data;
  if (!id || !part_number || !part_name || !satuan) {
    throw new Error("ID, part number, part name, and satuan are required.");
  }

  // Cek jika part number sudah ada
  const q = query(
    MasterPartCollection,
    where("part_number", "==", part_number)
  );
  const existingPart = await getDocs(q);
  if (existingPart.empty) {
    return false;
  }

  const docRef = existingPart.docs[0].ref;

  // Update data
  await updateDoc(docRef, data);
  return true;
}

export async function deleteMasterPart(id: string): Promise<boolean> {
  if (!id) {
    throw new Error("ID is required.");
  }

  const q = query(MasterPartCollection, where("id", "==", id));
  const existingPart = await getDocs(q);
  if (existingPart.empty) {
    return false;
  }

  const docRef = existingPart.docs[0].ref;

  // Hapus data Master Part
  await deleteDoc(docRef);

  // Hapus semua stok terkait
  const stockQuery = query(
    StockCollection,
    where("part_no", "==", existingPart.docs[0].data().part_number)
  );
  const stockSnapshot = await getDocs(stockQuery);
  stockSnapshot.forEach(async (stockDoc) => {
    await deleteDoc(stockDoc.ref);
  });
  return true;
}
