import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { MR, Stock } from "@/types";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import { updateStock } from "@/services/stock";

interface MyDialogProps {
  onSubmit?: () => void;
  stock: Stock;
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditStockDialog({ stock, refresh }: MyDialogProps) {
  console.log("EditStockDialog", stock);
  console.log("EditStockDialog", refresh);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const min = formData.get("min") as string;
    const max = formData.get("max") as string;
    const qty = formData.get("qty") as string;
    if (!stock.id) {
      toast.error("Stock tidak ditemukan");
      return;
    }

    // if (min === stock.min && max === stock.max && qty === stock.qty) {
    //   toast.warning("Tidak ada perubahan yang dilakukan");
    //   return;
    // }

    try {
      const res = await updateStock({
        ...stock,
        min: parseInt(min, 10),
        max: parseInt(max, 10),
        qty: parseInt(qty, 10),
      });
      if (res) {
        toast.success("Data MR berhasil diupdate");
        refresh((prev) => !prev);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal mengupdate nr: ${error.message}`);
      } else {
        toast.error("Gagal mengupdate nr");
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Edit Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Stock</DialogTitle>
          <DialogDescription>
            Ubah informasi stock yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="edit-stock-form">
          <div className="grid gap-4">
            {/* Part Number */}
            <div className="grid gap-3">
              <Label htmlFor="part_number">Part Number</Label>
              <Input
                id="part_number"
                name="part_number"
                defaultValue={stock.part_number}
                disabled
              />
            </div>
            {/* Part Nama */}
            <div className="grid gap-3">
              <Label htmlFor="part_name">Part Name</Label>
              <Input
                id="part_name"
                name="part_name"
                defaultValue={stock.part_name}
                disabled
              />
            </div>
            {/* lokasi */}
            <div className="grid gap-3">
              <Label htmlFor="lokasi">Lokasi gudang</Label>
              <Input
                id="lokasi"
                name="lokasi"
                defaultValue={stock.lokasi}
                disabled
              />
            </div>
            {/* min */}
            <div className="grid gap-3">
              <Label htmlFor="min">Min Stock</Label>
              <Input id="min" name="min" defaultValue={stock.min} />
            </div>
            {/* max */}
            <div className="grid gap-3">
              <Label htmlFor="max">Max Stock</Label>
              <Input id="max" name="max" defaultValue={stock.max} />
            </div>
            {/* Stock */}
            <div className="grid gap-3">
              <Label htmlFor="qty">Qty Stock</Label>
              <Input id="qty" name="qty" defaultValue={stock.qty} />
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batalkan</Button>
          </DialogClose>
          <Button type="submit" form="edit-stock-form">
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
