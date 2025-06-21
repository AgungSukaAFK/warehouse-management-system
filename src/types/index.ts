import type { FieldValue, Timestamp } from "firebase/firestore";
import type { AuthProvider, LogCategory } from "./enum";

export interface User {
  email: string;
  nama: string;
  role: string;
  lokasi: string;
  email_verified: boolean;
  auth_provider: AuthProvider;
  created_at?: Timestamp | FieldValue;
  updated_at?: Timestamp | FieldValue;
}

export interface MR {
  kode: string;
  tanggal_estimasi: Timestamp;
  lokasi: string;
  pic: string;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;

  barang: Item[];
}

export interface PR {
  kode: string;
  kode_mr: string;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;

  mrs: MR[];
}

export interface PO {
  kode: string;
  kode_pr: string;
  kode_mr: string;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface RI {
  kode_po: string;
  tanggal: Timestamp;
  gudang_penerima: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Delivery {
  kode_it: string;
  kode_mr: string;
  ekspedisi: string;
  resi_pengiriman: string;
  status: string;
  jumlah_koli: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Item {
  part_no: string;
  part_name: string;
  satuan: string;
}

export interface Stock {
  part_no: string;
  gudang: string;
  max: number;
  min: number;
  stok: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Transaction {
  kode_mr: string;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SystemLog {
  category: LogCategory;
  title: string;
  description: string;
}
