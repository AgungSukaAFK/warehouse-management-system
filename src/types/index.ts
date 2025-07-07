import type { FieldValue, Timestamp } from "firebase/firestore";
import type { AuthProvider, LogCategory } from "./enum";
import type { User } from "firebase/auth";

export interface UserDb {
  id: string;
  email: string;
  nama: string;
  role: string;
  lokasi: string;
  email_verified: boolean;
  auth_provider: AuthProvider;
  image_url: string;
  created_at?: Timestamp | FieldValue;
  updated_at?: Timestamp | FieldValue;
}

export interface UserComplete extends User {
  id: string;
  email: string | null;
  nama: string;
  role: string;
  lokasi: string;
  email_verified: boolean;
  auth_provider: AuthProvider;
  image_url: string;
  created_at?: Timestamp | FieldValue;
  updated_at?: Timestamp | FieldValue;
}

export interface MR {
  id?: string;
  kode: string;
  tanggal_mr: string;
  due_date: string;
  lokasi: string;
  pic: string;
  status: string;
  created_at: Timestamp | FieldValue;
  updated_at: Timestamp | FieldValue;

  barang: MRItem[];
}

export interface Item {
  part_number: string;
  part_name: string;
  satuan: string;
  qty: number;
}

export interface MRItem {
  part_number: string;
  part_name: string;
  satuan: string;
  priority: string;
  qty: number;
  qty_delivered: number;
}

export interface PRItem {
  part_number: string;
  part_name: string;
  satuan: string;
  kode_mr: string;
  qty: number;
}

export interface PR {
  id?: string;
  kode: string;
  status: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  lokasi: string;
  pic: string;
  order_item: PRItem[];

  mrs: string[];
}

export interface PO {
  id?: string;
  kode: string;
  kode_pr: string;
  tanggal_estimasi: string;
  status: string;
  pic: string;
  keterangan?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface RI {
  id?: string;
  kode: string;
  kode_po: string;
  tanggal: string;
  gudang_penerima: string;
  keterangan?: string;
  pic: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Delivery {
  id?: string;
  kode_it: string;
  kode_mr: string;
  ekspedisi: string;
  resi_pengiriman: string;
  status: string;
  dari_gudang: string;
  ke_gudang: string;
  tanggal_pengiriman?: Timestamp;
  pic: string;
  jumlah_koli: number;
  created_at: Timestamp;
  updated_at: Timestamp;

  items: DeliveryItem[];
}

export interface DeliveryItem {
  part_number: string;
  part_name: string;
  dari_gudang: string;
  ke_gudang: string;
  satuan: string;
  qty: number;
  qty_pending: number;
  qty_on_delivery: number;
  qty_delivered: number;
}

export interface MasterPart {
  id?: string;
  part_number: string;
  part_name: string;
  satuan: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Stock {
  id?: string;
  part_number: string;
  part_name: string;
  satuan: string;
  lokasi: string;
  max: number;
  min: number;
  qty: number;
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

export type Pagination<T> = {
  data: T;
  total: number;
  page: number;
  size: number;
};
