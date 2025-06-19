export type UserRole =
  | "warehouse"
  | "purchasing"
  | "logistik"
  | "user"
  | "admin";

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
