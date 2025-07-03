import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { PO, PR, UserComplete, UserDb } from "@/types";
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
import { getAllPr } from "@/services/purchase-request";
import { createPO } from "@/services/purchase-order";
import { DatePicker } from "../date-picker";

interface CreatePOFormProps {
  user: UserComplete | UserDb;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreatePOForm({ user, setRefresh }: CreatePOFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [pr, setPR] = useState<PR[]>([]);
  const [filteredPR, setFilteredPR] = useState<PR[]>([]);
  const [selectedPR, setSelectedPR] = useState<PR>();
  const [estimasi, setEstimasi] = useState<Date | undefined>();

  // Fetch PR
  useEffect(() => {
    async function fetchPR() {
      try {
        const res = await getAllPr();
        setPR(res);
        setFilteredPR(res);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data PR: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data PR.");
        }
      }
    }

    fetchPR();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!estimasi) {
      toast.error("Tanggal estimasi tidak boleh kosong.");
      return;
    }

    if (!selectedPR) {
      toast.error("Referensi PR tidak boleh kosong.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const kode = formData.get("kode") as string;
    const kode_pr = selectedPR.kode;
    const pic = user.nama;
    const status = formData.get("status") as string;

    const data: PO = {
      kode,
      kode_pr,
      tanggal_estimasi: estimasi.toISOString(),
      pic,
      status,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    try {
      const res = await createPO(data);
      if (res) {
        toast.success("Purchase Order berhasil dibuat.");
        setRefresh((prev) => !prev);
        form.reset();
        setSelectedPR(undefined);
      } else {
        toast.error("Gagal membuat Purchase Order. Silakan coba lagi.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal membuat PO: ${error.message}`);
      } else {
        toast.error("Terjadi kesalahan saat membuat PO.");
      }
      return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="create-po-form"
      className="grid grid-cols-12 gap-4"
    >
      <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
        {/* Kode PO */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="kode">Kode PO</Label>
          <Input name="kode" className="lg:tracking-wider" required />
        </div>

        {/* Combobox Referensi PR */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="kodePR">Delivery untuk PR</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("col-span-12 lg:col-span-4 justify-between")}
              >
                {selectedPR
                  ? pr.find((pr: PR) => pr.kode === selectedPR?.kode)?.kode
                  : "Cari kode PR..."}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Cari kode mr..." />
                <CommandList>
                  <CommandEmpty>Tidak ada.</CommandEmpty>
                  <CommandGroup>
                    {filteredPR?.map((m) => (
                      <CommandItem
                        key={m.kode}
                        value={m.kode}
                        onSelect={(currentValue) => {
                          setSelectedPR(
                            pr.find((m) => m.kode === currentValue)
                          );
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPR?.kode === m.kode
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
        {/* Status */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Pilih status</Label>
          <div className="flex items-center">
            <Select required name="status">
              <SelectTrigger className="w-full" name="status" id="status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Daftar Status</SelectLabel>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="purchased">Purchased</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estimasi */}
        <div className="flex flex-col gap-2">
          <Label>Tanggal Estimasi</Label>
          <div className="flex items-center">
            <DatePicker value={estimasi} onChange={setEstimasi} />
          </div>
        </div>
      </div>

      {/* Item dari MR */}
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
