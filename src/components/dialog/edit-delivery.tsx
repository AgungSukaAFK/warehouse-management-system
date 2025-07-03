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
import type { Delivery } from "@/types";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateDelivery } from "@/services/delivery";
import { DeliveryEkspedisi, DeliveryStatus } from "@/types/enum";

interface MyDialogProps {
  onSubmit?: () => void;
  delivery: Delivery;
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditDeliveryDialog({ delivery, refresh }: MyDialogProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const status = formData.get("status") as string;
    const ekspedisi = formData.get("ekspedisi") as string;
    const resi_pengiriman = formData.get("resi_pengiriman") as string;

    if (!delivery.kode_it) {
      toast.error("Kode IT tidak ditemukan");
      return;
    }
    const data: Partial<Delivery> = {
      status,
      ekspedisi,
      resi_pengiriman,
    };
    // Update MR
    try {
      const res = await updateDelivery(delivery.kode_it, data);
      if (res) {
        toast.success("Data MR berhasil diupdate");
        refresh((prev) => !prev);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal mengupdate delivery: ${error.message}`);
      } else {
        toast.error("Gagal mengupdate delivery");
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Edit Cepat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Delivery</DialogTitle>
          <DialogDescription>
            Ubah informasi delivery yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="edit-user-form">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="kode">Kode IT</Label>
              <Input
                id="kode"
                name="kode"
                defaultValue={delivery.kode_it}
                disabled
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="ekspedisi">Ekspedisi yang digunakan</Label>
              <Select name="ekspedisi" required>
                <SelectTrigger
                  className="w-full"
                  name="ekspedisi"
                  id="ekspedisi"
                >
                  <SelectValue placeholder={delivery.ekspedisi} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Ekspedisi</SelectLabel>
                    {DeliveryEkspedisi.map((status, index) => {
                      return (
                        <SelectItem value={status} key={index}>
                          {status}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="resi_pengiriman">Nomor resi</Label>
              <Input
                id="resi_pengiriman"
                name="resi_pengiriman"
                defaultValue={delivery.resi_pengiriman}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select name="status" required>
                <SelectTrigger className="w-full" name="status" id="status">
                  <SelectValue placeholder={delivery.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {DeliveryStatus.map((status, index) => {
                      return (
                        <SelectItem value={status} key={index}>
                          {status}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batalkan</Button>
          </DialogClose>
          <Button type="submit" form="edit-user-form">
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
