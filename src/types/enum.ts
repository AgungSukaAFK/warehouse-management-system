export type UserRole =
  | "warehouse"
  | "purchasing"
  | "logistik"
  | "user"
  | "admin"
  | "unassigned";

export type AuthProvider = "credential" | "google";

export type Lokasi = {
  nama: string;
  kode: string;
};

export const LokasiList: Lokasi[] = [
  { nama: "JAKARTA", kode: "JKT" },
  { nama: "ENIM", kode: "ENIM" },
  { nama: "BPN", kode: "BPN" },
  { nama: "BIB", kode: "BIB" },
];

export type LogCategory =
  | "User Activity"
  | "Material Request"
  | "Purchase Request"
  | "Purchase Order"
  | "Receive Item"
  | "Delivery";
