import { clsx, type ClassValue } from "clsx";
import { isValid, parse } from "date-fns";
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

  let date: Date | null = null;

  if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else if (typeof timestamp === "string") {
    // Coba parse ISOString terlebih dahulu
    const isoDate = new Date(timestamp);
    if (isValid(isoDate)) {
      date = isoDate;
    } else {
      // Jika bukan ISOString, parse dengan format d/M/yyyy
      const parsed = parse(timestamp, "d/M/yyyy", new Date());
      if (isValid(parsed)) {
        date = parsed;
      }
    }
  } else if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  }

  if (date && isValid(date)) {
    const hariNama = hari[date.getDay()];
    const tanggal = date.getDate();
    const bulanNama = bulan[date.getMonth()];
    const tahun = date.getFullYear();
    return `${hariNama}, ${tanggal} ${bulanNama} ${tahun}`;
  }

  return "Tanggal tidak valid";
}

export function generateAvatarUrl(name: string): string {
  const encodedName = encodeURIComponent(name.trim());
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true`;
}
