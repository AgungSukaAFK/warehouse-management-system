export interface User {
  id: number;
  email: string;
  nama: string;
  role: string;
  lokasi: string;
  created_at: Date;
  updated_at: Date;
}

export interface MR {
  id: string;
  kode: string;
  tanggal_estimasi: Date;
  lokasi: string;
  pic: string;
  status: string;
  created_at: Date;
  updated_at: Date;

  barang: Item[];
}

export interface PR {
  id: string;
  kode: string;
  kode_mr: string;
  status: string;
  created_at: Date;
  updated_at: Date;

  mrs: MR[];
}

export interface PO {
  id: string;
  kode: string;
  kode_pr: string;
  kode_mr: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RI {
  id: string;
  kode_po: string;
  tanggal: Date;
  gudang_penerima: string;
  created_at: string;
  updated_at: string;
}

export interface Delivery {
  id: string;
  kode_it: string;
  kode_mr: string;
  ekspedisi: string;
  resi_pengiriman: string;
  status: string;
  jumlah_koli: number;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  part_no: string;
  part_name: string;
  satuan: string;
}

export interface Stock {
  id: string;
  part_no: string; // Dari Item
  gudang: string;
  max: number;
  min: number;
  stok: number;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: string;
  kode_mr: string;
  status: string;
  created_at: string;
  updated_at: string;
}
