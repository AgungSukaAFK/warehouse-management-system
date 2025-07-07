import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { PO, PR, RI, UserComplete, UserDb } from "@/types";
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
import { Button } from "../ui/button";
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
import { Timestamp } from "firebase/firestore";
import { getPrByKode } from "@/services/purchase-request";
import { getAllPo } from "@/services/purchase-order";
import { Textarea } from "../ui/textarea";
import { createRI } from "@/services/receive-item";
import { LokasiList } from "@/types/enum";
import { DatePicker } from "../date-picker";

interface CreatePOFormProps {
  user: UserComplete | UserDb;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreateRIForm({ user, setRefresh }: CreatePOFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [po, setPO] = useState<PO[]>([]);
  const [filteredPO, setFilteredPO] = useState<PO[]>([]);
  const [selectedPO, setSelectedPO] = useState<PO>();
  const [selectedPR, setSelectedPR] = useState<PR>();
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date());

  // Fetch PR
  useEffect(() => {
    async function fetchPR(kode: string) {
      try {
        const res = await getPrByKode(kode);
        if (!res) {
          toast.error(`PR dengan kode ${kode} tidak ditemukan.`);
          return;
        }
        setSelectedPR(res);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data PR: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data PR.");
        }
      }
    }

    if (!selectedPO) return;
    fetchPR(selectedPO.kode_pr);
  }, [selectedPO]);

  // Fetch PR
  useEffect(() => {
    async function fetchPR() {
      try {
        const res = await getAllPo();
        setPO(res);
        setFilteredPO(res);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data PO: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data PO.");
        }
      }
    }

    fetchPR();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!selectedPO) {
      toast.error("Referensi PR tidak boleh kosong.");
      return;
    }

    if (!selectedPR) {
      toast.error(
        "Referensi PR tidak ditemukan. Silakan pilih PO terlebih dahulu."
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const kode = formData.get("kode") as string;
    const penerima = formData.get("penerima") as string;
    const keterangan = formData.get("keterangan") as string;

    if (!kode) {
      toast.error("Kode RI tidak boleh kosong.");
      return;
    }

    if (!penerima) {
      toast.error("Gudang penerima tidak boleh kosong.");
      return;
    }

    if (!tanggal) {
      toast.error("Tanggal RI tidak boleh kosong.");
      return;
    }

    const data: RI = {
      kode,
      kode_po: selectedPO.kode,
      tanggal: tanggal.toISOString(),
      gudang_penerima: penerima,
      pic: user.nama,
      keterangan,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    try {
      const res = await createRI(data, selectedPR);
      if (res) {
        toast.success("Receive item berhasil dibuat.");
        setRefresh((prev) => !prev);
        form.reset();
        setSelectedPO(undefined);
      } else {
        toast.error("Gagal membuat RI. Silakan coba lagi.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal membuat RI: ${error.message}`);
      } else {
        toast.error("Terjadi kesalahan saat membuat RI.");
      }
      return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="create-ri-form"
      className="grid grid-cols-12 gap-4"
    >
      <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
        {/* Kode PO */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="kode">Kode RI</Label>
          <Input name="kode" className="lg:tracking-wider" required />
        </div>

        {/* Combobox Referensi PO */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="kodePO">Receive item dari PO</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("col-span-12 lg:col-span-4 justify-between")}
              >
                {selectedPO
                  ? po.find((po: PO) => po.kode === selectedPO?.kode)?.kode
                  : "Cari kode PO..."}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Cari kode PO..." />
                <CommandList>
                  <CommandEmpty>Tidak ada.</CommandEmpty>
                  <CommandGroup>
                    {filteredPO?.map((m) => (
                      <CommandItem
                        key={m.kode}
                        value={m.kode}
                        onSelect={(currentValue) => {
                          setSelectedPO(
                            po.find((m) => m.kode === currentValue)
                          );
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPO?.kode === m.kode
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {`${m.kode}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
        {/* Gudang Penerima */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="penerima">PO diterima di gudang</Label>
          <div className="flex items-center">
            <Select required name="penerima">
              <SelectTrigger className="w-full" name="penerima" id="penerima">
                <SelectValue placeholder="Pilih penerima" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lokasi</SelectLabel>
                  {LokasiList.map((lokasi) => {
                    if (lokasi.nama === "unassigned") return null;
                    return (
                      <SelectItem key={lokasi.kode} value={lokasi.nama}>
                        {lokasi.nama}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Tanggal RI</Label>
          <DatePicker value={tanggal} onChange={setTanggal} />
        </div>
      </div>

      {/* Keterangan */}
      <div className="col-span-12 flex flex-col gap-2">
        <Label htmlFor="keterangan">Keterangan</Label>
        <div className="flex items-center">
          <Textarea
            placeholder="Masukkan keterangan..."
            name="keterangan"
            id="keterangan"
          />
        </div>
      </div>

      {/* Item dari PR */}
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
              <TableHead className="font-semibold text-center">
                Untuk MR
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedPR && selectedPR.order_item.length > 0 ? (
              selectedPR.order_item.map((item, index) => (
                <TableRow key={index} className="border [&>*]:border">
                  <TableCell className="w-[50px]">{index + 1}</TableCell>
                  <TableCell className="text-start">
                    {item.part_number}
                  </TableCell>
                  <TableCell className="text-start">{item.part_name}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.kode_mr}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada item PR.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </form>
  );
}
