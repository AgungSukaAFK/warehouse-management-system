// components/dialog/AddItemMRDialog.tsx
import React, { useState } from "react";
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
import type { Item } from "@/types";

interface AddItemMRDialogProps {
  onAddItem: (item: Item) => void; // Callback untuk menambahkan item ke daftar di parent
  triggerButton: React.ReactNode; // Tombol yang memicu dialog
}

export function AddItemMRDialog({
  onAddItem,
  triggerButton,
}: AddItemMRDialogProps) {
  const [partNo, setPartNo] = useState("");
  const [partName, setPartName] = useState("");
  const [satuan, setSatuan] = useState("");
  const [qty, setQty] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false); // State untuk mengontrol buka/tutup dialog

  const handleSaveItem = () => {
    if (!partNo || !partName || !satuan || qty <= 0) {
      toast.error(
        "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
      );
      return;
    }

    const newItem: Item = {
      part_no: partNo,
      part_name: partName,
      satuan: satuan,
      qty: qty,
    };

    onAddItem(newItem);

    // Reset form dan tutup dialog
    setPartNo("");
    setPartName("");
    setSatuan("");
    setQty(1);
    setIsOpen(false);
  };

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
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="partName">Nama Part</Label>
            <Input
              id="partName"
              placeholder="Nama part"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="satuan">Satuan</Label>
            <Input
              id="satuan"
              placeholder="Satuan (contoh: Pcs, Kg)"
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              required
            />
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
