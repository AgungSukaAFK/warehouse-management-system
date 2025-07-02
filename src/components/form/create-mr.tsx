import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createMR, generateKodeMR } from "@/services/material-request";
import type { Item, MasterPart, MR, UserComplete, UserDb } from "@/types";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { getMasterParts } from "@/services/master-part";

interface CreateMRFormProps {
  user: UserComplete | UserDb;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreateMRForm({ user, setRefresh }: CreateMRFormProps) {
  const [kodeMR, setKodeMR] = useState<string>("Loading...");
  const [duedate, setDueDate] = useState<Date | undefined>();
  const [tanggalMR, setTanggalMR] = useState<Date | undefined>(new Date());
  const [mrItems, setMRItems] = useState<Item[]>([]);

  // Pencarian master part
  const [open, setOpen] = useState<boolean>(false);
  const [masterParts, setMasterParts] = useState<MasterPart[]>([]);
  const [filteredParts, setFilteredParts] = useState<MasterPart[]>([]);
  const [selectedPart, setSelectedPart] = useState<MasterPart>();

  // Fetch master parts
  useEffect(() => {
    async function fetchMasterParts() {
      try {
        const parts = await getMasterParts();
        setMasterParts(parts);
        setFilteredParts(parts);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data master part: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data master part.");
        }
      }
    }

    fetchMasterParts();
  }, []);

  // Fetch kode MR
  async function fetchKodeMR() {
    toast.info("Menghasilkan Kode MR baru...");
    try {
      const kode = await generateKodeMR(user);
      setKodeMR(kode);
      toast.success("Kode MR sudah terbaru.");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal menghasilkan Kode MR: ${error.message}`);
      } else {
        toast.error("Terjadi kesalahan saat menghasilkan Kode MR.");
      }
    }
  }

  useEffect(() => {
    fetchKodeMR();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const lokasi = user.lokasi;
    const status = "open";
    const priority = formData.get("priority") as string;

    if (
      !kodeMR ||
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
        kodeMR,
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
      kode: kodeMR,
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

  function handleAddItem(part: MasterPart, qty: number) {
    if (!part || !qty || qty <= 0) {
      toast.error(
        "Mohon lengkapi semua detail item dan pastikan kuantitas valid."
      );
      return;
    }

    const newItem: Item = {
      part_name: part.part_name,
      part_number: part.part_number,
      satuan: part.satuan,
      qty: qty,
    };

    setMRItems((prevItems) => [...prevItems, newItem]);
    toast.success("Item berhasil ditambahkan ke daftar.");
  }

  function handleRemoveItem(index: number) {
    setMRItems((prevItems) => prevItems.filter((_, i) => i !== index));
    toast.success("Item berhasil dihapus dari daftar.");
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
          <div className="flex items-center gap-4">
            <Input
              name="numberMR"
              disabled
              value={kodeMR}
              className="lg:tracking-wider"
            />
            <Button
              variant={"outline"}
              type="button"
              onClick={async () => await fetchKodeMR()}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Tanggal MR */}
        <div className="flex flex-col gap-2">
          <Label>Tanggal MR</Label>
          <div className="flex items-center">
            <DatePicker value={tanggalMR} onChange={setTanggalMR} />
          </div>
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-4 gap-4">
        {/* PIC */}
        <div className="flex flex-col gap-2">
          <Label>Person in Charge</Label>
          <div className="flex items-center">
            <Input value={user.nama} name="pic" disabled />
          </div>
        </div>

        {/* Tanggal duedate */}
        <div className="flex flex-col gap-2">
          <Label>Tanggal due date</Label>
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
            <Select required name="lokasi" disabled>
              <SelectTrigger className="w-full" name="lokasi" id="lokasi">
                <SelectValue
                  placeholder={user.lokasi}
                  defaultValue={user.lokasi}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Daftar Lokasi</SelectLabel>
                  {LokasiList?.map((lokasi) => (
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
      <div className="col-span-12 grid grid-cols-12 gap-4">
        {/* Combobox */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("col-span-12 lg:col-span-8 justify-between")}
            >
              {selectedPart
                ? masterParts.find(
                    (part: MasterPart) =>
                      part.part_number === selectedPart.part_number
                  )?.part_number
                : "Cari part number..."}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command>
              <CommandInput placeholder="Cari part number..." />
              <CommandList>
                <CommandEmpty>Tidak ada.</CommandEmpty>
                <CommandGroup>
                  {filteredParts?.map((part) => (
                    <CommandItem
                      key={part.part_number}
                      value={part.part_number}
                      onSelect={(currentValue) => {
                        setSelectedPart(
                          masterParts.find(
                            (part) => part.part_number === currentValue
                          )
                        );
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedPart?.part_number === part.part_number
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {`${part.part_number} | ${part.part_name}`}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <AddItemMRDialog
          selectedPart={selectedPart}
          onAddItem={handleAddItem}
          triggerButton={
            <Button
              className="col-span-12 md:col-span-4"
              variant={"outline"}
              disabled={!selectedPart}
            >
              Tambah Barang
            </Button>
          }
        />
      </div>

      <div className="col-span-12">
        <Table>
          <TableHeader>
            <TableRow className="border [&>*]:border">
              <TableHead className="w-[50px] font-semibold text-center">
                No
              </TableHead>
              <TableHead className="font-semibold text-center">
                Part Number
              </TableHead>
              <TableHead className="font-semibold text-center">
                Part Name
              </TableHead>
              <TableHead className="font-semibold text-center">
                Satuan
              </TableHead>
              <TableHead className="font-semibold text-center">Qty</TableHead>
              <TableHead className="font-semibold text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mrItems.length > 0 ? (
              mrItems?.map((item, index) => (
                <TableRow key={index} className="border [&>*]:border">
                  <TableCell className="w-[50px]">{index + 1}</TableCell>
                  <TableCell className="text-start">
                    {item.part_number}
                  </TableCell>
                  <TableCell className="text-start">{item.part_name}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => handleRemoveItem(index)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
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
