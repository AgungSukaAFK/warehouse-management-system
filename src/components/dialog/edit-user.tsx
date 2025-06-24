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
import type { UserDb } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { updateUser } from "@/services/user";
import type { Dispatch, SetStateAction } from "react";
import { LokasiList } from "@/types/enum";

interface MyDialogProps {
  onSubmit?: () => void;
  user: UserDb;
  refresh: Dispatch<SetStateAction<boolean>>;
}

export function EditUserDialog({ user, refresh }: MyDialogProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nama = formData.get("nama") as string;
    const role = formData.get("role") as string;
    const lokasi = formData.get("lokasi") as string;
    console.log(formData);
    if (!nama) {
      toast.warning("Nama tidak boleh kosong");
      return;
    }
    if (!role) {
      toast.warning("Nama tidak boleh kosong");
      return;
    }
    if (!lokasi) {
      toast.warning("Lokasi tidak boleh kosong");
      return;
    }

    if (nama === user.nama && role === user.role && lokasi === user.lokasi) {
      toast.warning("Tidak ada perubahan yang dilakukan");
      return;
    }

    // Update user
    try {
      const res = await updateUser({
        nama,
        role,
        lokasi,
        id: user.id,
      });
      if (res) {
        toast.success("User berhasil diupdate");
        refresh((prev) => !prev);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal mengupdate user: ${error.message}`);
      } else {
        toast.error("Gagal mengupdate user");
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Ubah informasi user seperti role dan lokasi
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="edit-user-form">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="nama" defaultValue={user.nama} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                disabled
                defaultValue={user.email}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select name="role" required>
                <SelectTrigger className="w-full" name="role" id="role">
                  <SelectValue placeholder={user.role} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Daftar Role</SelectLabel>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="purchasing">Purchasing</SelectItem>
                    <SelectItem value="logistik">Logistik</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Select required name="lokasi">
                <SelectTrigger className="w-full" name="lokasi" id="lokasi">
                  <SelectValue placeholder={user.lokasi} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Daftar Lokasi</SelectLabel>
                    {LokasiList.map((lokasi) => (
                      <SelectItem value={lokasi.nama}>{lokasi.nama}</SelectItem>
                    ))}
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
