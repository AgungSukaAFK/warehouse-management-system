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
import { Button } from "../ui/button";

export function EditPRDialog() {
  // async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  // const formData = new FormData(event.currentTarget);
  // const status = formData.get("status") as string;
  // const priority = formData.get("priority") as string;
  // console.log(formData);
  // if (!mr.id) {
  //   toast.error("MR tidak ditemukan");
  //   return;
  // }
  // if (!status) {
  //   toast.warning("Status tidak boleh kosong");
  //   return;
  // }
  // if (!priority) {
  //   toast.warning("Prioritas tidak boleh kosong");
  //   return;
  // }

  // if (status === mr.status && priority === mr.priority) {
  //   toast.warning("Tidak ada perubahan yang dilakukan");
  //   return;
  // }

  // // Update MR
  // try {
  //   const res = await updateMR(mr.id, {
  //     status,
  //     priority,
  //   });
  //   if (res) {
  //     toast.success("Data MR berhasil diupdate");
  //     refresh((prev) => !prev);
  //   }
  // } catch (error) {
  //   if (error instanceof Error) {
  //     toast.error(`Gagal mengupdate nr: ${error.message}`);
  //   } else {
  //     toast.error("Gagal mengupdate nr");
  //   }
  // }
  // }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Edit Cepat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit MR</DialogTitle>
          <DialogDescription>Ubah informasi mr yang dipilih.</DialogDescription>
        </DialogHeader>
        {/* <form onSubmit={handleSubmit} id="edit-user-form">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="kode">Kode MR</Label>
              <Input id="kode" name="kode" defaultValue={mr.kode} disabled />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="priority">Prioritas</Label>
              <Select name="priority" required>
                <SelectTrigger className="w-full" name="priority" id="priority">
                  <SelectValue placeholder={mr.priority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Prioritas</SelectLabel>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select name="status" required>
                <SelectTrigger className="w-full" name="status" id="status">
                  <SelectValue placeholder={mr.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Prioritas</SelectLabel>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Close</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form> */}
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
