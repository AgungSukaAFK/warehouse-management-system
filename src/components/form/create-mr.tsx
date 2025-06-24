import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createMR, generateKodeMR } from "@/services/material-request";
import type { Item, MR, UserComplete, UserDb } from "@/types";
import { DatePicker } from "../date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AddItemMRDialog } from "../dialog/add-item-mr";
import { Button } from "../ui/button";
import { serverTimestamp } from "firebase/firestore";
import { LokasiList } from "@/types/enum";

interface CreateMRFormProps {
  user: UserComplete | UserDb;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreateMRForm({ user, setRefresh }: CreateMRFormProps) {
  const [kodeMR, setKodeMR] = useState<string>("Loading...");
  const [duedate, setDueDate] = useState<Date | undefined>();
  const [tanggalMR, setTanggalMR] = useState<Date | undefined>(new Date());
  const [mrItems, setMRItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchKodeMR() {
      try {
        const kode = await generateKodeMR(user);
        setKodeMR(kode);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal menghasilkan Kode MR: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat menghasilkan Kode MR.");
        }
      }
    }

    fetchKodeMR();
  }, [kodeMR]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const lokasi = formData.get("lokasi") as string;
    const status = "open";
    const numberMR = formData.get("numberMR") as string;
    const priority = formData.get("priority") as string;

    if (
      !numberMR ||
      !duedate ||
      !tanggalMR ||
      !lokasi ||
      !status ||
      mrItems.length === 0 ||
      !kodeMR ||
      !user ||
      !priority
    ) {
      toast.warning("Data belum lengkap.");
      console.log(
        "Data belum lengkap:",
        numberMR,
        duedate,
        tanggalMR,
        lokasi,
        status,
        mrItems.length,
        kodeMR,
        user,
        priority
      );
      return;
    }

    const data: MR = {
      kode: `${kodeMR}${numberMR.padStart(5, "0")}`,
      tanggal_mr: tanggalMR.toLocaleDateString("id-ID"),
      due_date: duedate.toLocaleDateString("id-ID"),
      lokasi: lokasi,
      pic: user.nama,
      status: status,
      barang: mrItems,
      priority: priority,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    try {
      const res = await createMR(data);
      if (res) {
        toast.success("Material Request berhasil dibuat.");
        setRefresh((prev) => !prev);
        setMRItems([]);
        setTanggalMR(new Date());
        setDueDate(undefined);
      } else {
        toast.error("Gagal membuat Material Request. Silakan coba lagi.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal membuat MR: ${error.message}`);
      } else {
        toast.error("Terjadi kesalahan saat membuat MR.");
      }
      return;
    }
  }

  function handleAddItem(item: Item) {
    if (!item.part_no || !item.part_name || !item.satuan || item.qty <= 0) {
      toast.error(
        "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
      );
      return;
    }

    setMRItems((prevItems) => [...prevItems, item]);
    toast.success("Item berhasil ditambahkan ke daftar.");
  }
  return (
    <form
      onSubmit={handleSubmit}
      id="create-mr-form"
      className="grid grid-cols-12 gap-4"
    >
      <div className="flex flex-col col-span-12 lg:col-span-4 gap-4">
        {/* Kode MR */}
        <div className="flex flex-col gap-2">
          <Label>Kode MR</Label>
          <div className="flex items-center">
            <Input
              value={kodeMR}
              disabled
              className="outline-none border-none w-fit lg:tracking-wider"
            />
            <Input name="numberMR" placeholder="Input nomor MR" />
          </div>
        </div>

        {/* PIC */}
        <div className="flex flex-col gap-2">
          <Label>Person in Charge</Label>
          <div className="flex items-center">
            <Input value={user.nama} name="pic" disabled />
          </div>
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-4 gap-4">
        {/* Tanggal MR */}
        <div className="flex flex-col gap-2">
          <Label>Tanggal MR</Label>
          <div className="flex items-center">
            <DatePicker value={tanggalMR} onChange={setTanggalMR} />
          </div>
        </div>

        {/* Tanggal duedate */}
        <div className="flex flex-col gap-2">
          <Label>Tanggal duedate</Label>
          <div className="flex items-center">
            <DatePicker value={duedate} onChange={setDueDate} />
          </div>
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-4 gap-4">
        {/* Lokasi */}
        <div className="flex flex-col gap-2">
          <Label>Lokasi</Label>
          <div className="flex items-center">
            <Select required name="lokasi">
              <SelectTrigger className="w-full" name="lokasi" id="lokasi">
                <SelectValue placeholder={user.lokasi} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Daftar Lokasi</SelectLabel>
                  {LokasiList.map((lokasi) => (
                    <SelectItem key={lokasi.kode} value={lokasi.nama}>
                      {lokasi.nama}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <Label>Prioritas</Label>
          <div className="flex items-center">
            <Select required name="priority">
              <SelectTrigger className="w-full" name="status" id="status">
                <SelectValue placeholder={"Pilih status MR"} />
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
        </div>
      </div>

      {/* Tambah Item MR */}
      <AddItemMRDialog
        onAddItem={handleAddItem}
        triggerButton={<Button className="w-fit">Tambah Barang</Button>}
      />

      <div className="col-span-12">
        <Table>
          <TableHeader>
            <TableRow className="border [&>*]:border">
              <TableHead className="w-[50px] font-semibold text-center">
                No
              </TableHead>
              <TableHead className="font-semibold text-center">
                Part No
              </TableHead>
              <TableHead className="font-semibold text-center">
                Part Name
              </TableHead>
              <TableHead className="font-semibold text-center">
                Satuan
              </TableHead>
              <TableHead className="font-semibold text-center">Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mrItems.length > 0 ? (
              mrItems.map((item, index) => (
                <TableRow key={index} className="border [&>*]:border">
                  <TableCell className="w-[50px]">{index + 1}</TableCell>
                  <TableCell className="text-start">{item.part_no}</TableCell>
                  <TableCell className="text-start">{item.part_name}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada item MR.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </form>
  );
}
