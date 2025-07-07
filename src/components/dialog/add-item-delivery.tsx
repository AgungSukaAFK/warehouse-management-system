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
import type { MRItem } from "@/types";

interface AddDeliveryItemDialogProps {
  mr_item: MRItem | undefined;
  dari: string;
  onAddItem: (part: MRItem, qty: number) => void; // Callback untuk menambahkan item ke daftar di parent
  triggerButton: React.ReactNode;
}

export function AddItemDeliveryDialog({
  mr_item,
  onAddItem,
  dari,
  triggerButton,
}: AddDeliveryItemDialogProps) {
  const [qty, setQty] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveItem = () => {
    if (!mr_item || qty <= 0) {
      toast.error(
        "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
      );
      return;
    }

    onAddItem(mr_item, qty);

    // Reset form dan tutup dialog
    setQty(1);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Item Delivery</DialogTitle>
          <DialogDescription>
            Masukkan detail untuk item yang akan dikirim.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="partNo">Part No</Label>
            <Input
              id="partNo"
              placeholder="Part number"
              value={mr_item?.part_number}
              disabled
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="partName">Nama Part</Label>
            <Input
              id="partName"
              placeholder="Nama part"
              value={mr_item?.part_name}
              disabled
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="satuan">Satuan</Label>
            <Input
              id="satuan"
              placeholder="Satuan (contoh: Pcs, Kg)"
              value={mr_item?.satuan}
              disabled
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="qty">Jumlah yg diminta</Label>
            <Input
              id="qty"
              type="number"
              placeholder="Jumlah"
              value={mr_item?.qty}
              required
              disabled
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="qty">Gudang dipilih untuk mengirim</Label>
            <Input id="qty" type="text" value={dari} required disabled />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="qty">Jumlah yg akan dikirim</Label>
            <Input
              id="qty_delivery"
              type="number"
              placeholder="Jumlah yang akan dikirim"
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
