import { clsx, type ClassValue } from "clsx";
import { parse } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTanggal(timestamp: number | string | Timestamp): string {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  if (typeof timestamp === "number") {
    const date = new Date(timestamp);
    const hariNama = hari[date.getDay()];
    const tanggal = date.getDate();
    const bulanNama = bulan[date.getMonth()];
    const tahun = date.getFullYear();
    return `${hariNama}, ${tanggal} ${bulanNama} ${tahun}`;
  } else if (typeof timestamp === "string") {
    const date = parse(timestamp, "d/M/yyyy", new Date());
    const hariNama = hari[date.getDay()];
    const tanggal = date.getDate();
    const bulanNama = bulan[date.getMonth()];
    const tahun = date.getFullYear();
    return `${hariNama}, ${tanggal} ${bulanNama} ${tahun}`;
  } else if (timestamp instanceof Timestamp) {
    const date = timestamp.toDate();
    const hariNama = hari[date.getDay()];
    const tanggal = date.getDate();
    const bulanNama = bulan[date.getMonth()];
    const tahun = date.getFullYear();
    return `${hariNama}, ${tanggal} ${bulanNama} ${tahun}`;
  } else {
    return "Tanggal tidak valid";
  }
}

export function generateAvatarUrl(name: string): string {
  const encodedName = encodeURIComponent(name.trim());
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true`;
}
