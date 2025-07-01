// components/dialog/AddItemMRDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { MasterPart, Stock } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LokasiList } from "@/types/enum";

interface AddItemMRDialogProps {
  selectedPart: MasterPart | undefined;
  onAddItem: (part: MasterPart, qty: number, lokasi: string) => void; // Callback untuk menambahkan item ke daftar di parent
  triggerButton: React.ReactNode; // Tombol yang memicu dialog
  stocks: Stock[];
}

export function AddItemMRDialog({
  selectedPart,
  onAddItem,
  triggerButton,
  stocks = [],
}: AddItemMRDialogProps) {
  const [qty, setQty] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false); // State untuk mengontrol buka/tutup dialog
  const [selectedLokasi, setSelectedLokasi] = useState<string>("");
  const [stockData, setStockData] = useState<string>("");

  const handleSaveItem = () => {
    if (!selectedPart || qty <= 0) {
      toast.error(
        "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
      );
      return;
    }

    onAddItem(selectedPart, qty, selectedLokasi);

    // Reset form dan tutup dialog
    setQty(1);
    setIsOpen(false);
  };

  useEffect(() => {
    getStockData();
  }, [selectedLokasi]);

  function getStockData() {
    const data = stocks.find(
      (stock) =>
        stock.part_number === selectedPart?.part_number &&
        stock.lokasi === selectedLokasi
    );

    if (data) {
      setStockData(`${data.qty} (${data.min} | ${data.max})`);
      return;
    }
    setStockData("-");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Item Material Request</DialogTitle>
          <DialogDescription>
            Masukkan detail untuk item material request yang baru.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="partNo">Part No</Label>
            <Input
              id="partNo"
              placeholder="Part number"
              value={selectedPart?.part_number}
              disabled
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="partName">Nama Part</Label>
            <Input
              id="partName"
              placeholder="Nama part"
              value={selectedPart?.part_name}
              disabled
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="satuan">Satuan</Label>
            <Input
              id="satuan"
              placeholder="Satuan (contoh: Pcs, Kg)"
              value={selectedPart?.satuan}
              disabled
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="satuan">Ambil dari gudang</Label>
            <Select onValueChange={(setLokasi) => setSelectedLokasi(setLokasi)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih gudang" />
              </SelectTrigger>
              <SelectContent>
                {LokasiList.map((lokasi) => (
                  <SelectItem key={lokasi.nama} value={lokasi.nama}>
                    {lokasi.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="satuan">Stok (min | max)</Label>
            <Input id="satuan" value={stockData} disabled required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="qty">Jumlah</Label>
            <Input
              id="qty"
              type="number"
              placeholder="Jumlah"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              min="1"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveItem}>
            Tambahkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
