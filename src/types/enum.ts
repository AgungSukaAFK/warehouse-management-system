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
  { nama: "TANJUNG ENIM", kode: "ENIM" },
  { nama: "BALIKPAPAN", kode: "BPN" },
  { nama: "SITE BA", kode: "BA" },
  { nama: "SITE TAL", kode: "TAL" },
  { nama: "SITE MIP", kode: "MIP" },
  { nama: "SITE MIFA", kode: "MIFA" },
  { nama: "SITE BIB", kode: "BIB" },
  { nama: "SITE AMI", kode: "AMI" },
  { nama: "SITE TABANG", kode: "TAB" },
  { nama: "unassigned", kode: "unassigned" },
];

export type LogCategory =
  | "User Activity"
  | "Material Request"
  | "Purchase Request"
  | "Purchase Order"
  | "Receive Item"
  | "Delivery";

export const PagingSize = 25;
