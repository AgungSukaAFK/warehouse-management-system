import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { getAllMr } from "@/services/material-request";
import type {
  Delivery,
  DeliveryItem,
  MR,
  MRItem,
  Stock,
  UserComplete,
  UserDb,
} from "@/types";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { DeliveryEkspedisi, LokasiList } from "@/types/enum";
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
import { createDelivery } from "@/services/delivery";
import { getAllStocks } from "@/services/stock";
import { AddItemDeliveryDialog } from "../dialog/add-item-delivery";

interface CreateDeliveryFormProps {
  user: UserComplete | UserDb;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export default function CreateDeliveryForm({
  user,
  setRefresh,
}: CreateDeliveryFormProps) {
  const [key, setKey] = useState(+new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [mr, setMR] = useState<MR[]>([]);
  const [filteredMr, setFilteredMR] = useState<MR[]>([]);
  const [selectedMr, setSelectedMr] = useState<MR>();
  const [selectedFrom, setSelectedFrom] = useState<string>("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);

  useEffect(() => {
    if (!selectedMr) {
      setDeliveryItems([]);
      return;
    }
  }, [selectedMr]);

  // Fetch Mr
  useEffect(() => {
    async function fetchMR() {
      try {
        const mr = await getAllMr();
        setMR(mr);
        setFilteredMR(mr);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data MR: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data MR.");
        }
      }
    }

    fetchMR();
  }, []);

  // Fetch Stocks
  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await getAllStocks();
        setStocks(res);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data Stocks: ${error.message}`);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data Stocks.");
        }
      }
    }

    fetchStock();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!selectedMr) {
      toast.error("Silakan pilih MR terlebih dahulu.");
      return;
    }
    if (selectedMr?.barang.length === 0) {
      toast.error("MR yg dipilih tidak memiliki daftar barang.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const kode_it = formData.get("kode_it") as string;
    const ekspedisi = formData.get("ekspedisi") as string;
    const dari = formData.get("dari") as string;
    const tujuan = selectedMr.lokasi;
    const koli = formData.get("koli") as string;
    const resi = formData.get("resi") as string;

    if (dari === "" || tujuan === "") {
      toast.error("Lokasi pengirim dan tujuan tidak boleh kosong.");
      return;
    }

    if (dari === tujuan) {
      toast.error("Lokasi pengirim dan tujuan tidak boleh sama.");
      return;
    }

    const data: Delivery = {
      kode_it,
      ekspedisi,
      dari_gudang: dari,
      ke_gudang: tujuan,
      status: "pending",
      pic: user.nama,
      resi_pengiriman: resi,
      jumlah_koli: koli ? parseInt(koli) : 0,
      kode_mr: selectedMr.kode,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      items: deliveryItems,
    };

    try {
      const res = await createDelivery(data);
      if (res) {
        toast.success("Delivery berhasil dibuat.");
        setRefresh((prev) => !prev);
        form.reset();
        setSelectedMr(undefined);
        setKey(+new Date());
        setSelectedFrom("");
      } else {
        toast.error("Gagal membuat Purchase Request. Silakan coba lagi.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal membuat PR: ${error.message}`);
      } else {
        toast.error("Terjadi kesalahan saat membuat PR.");
      }
      return;
    }
  }

  function handleAddItem(mr_item: MRItem, qty: number) {
    if (!selectedFrom) {
      toast.error("Silakan pilih lokasi pengirim terlebih dahulu.");
      return;
    }
    if (!selectedMr) {
      toast.error("Silakan pilih MR terlebih dahulu.");
      return;
    }
    if (qty <= 0) {
      toast.error("Jumlah yang dimasukkan tidak valid.");
      return;
    }
    const existingItem = deliveryItems.find(
      (item) => item.part_number === mr_item.part_number
    );
    if (existingItem) {
      toast.error("Item dengan part number ini sudah ada di daftar delivery.");
      return;
    }
    const stock = stocks.find(
      (s) => s.part_number === mr_item.part_number && selectedFrom === s.lokasi
    );
    if (!stock || stock.qty < qty) {
      toast.error(
        `Stok tidak mencukupi untuk part number ${mr_item.part_number}.`
      );
      return;
    }
    const newItem: DeliveryItem = {
      part_number: mr_item.part_number,
      part_name: mr_item.part_name,
      satuan: mr_item.satuan,
      dari_gudang: selectedFrom,
      ke_gudang: selectedMr.lokasi,
      qty,
      qty_pending: qty,
      qty_on_delivery: 0,
      qty_delivered: 0,
    };
    setDeliveryItems((prev) => [...prev, newItem]);
    toast.success(
      `Item ${mr_item.part_number} berhasil ditambahkan ke delivery.`
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="create-delivery-form"
      className="grid grid-cols-12 gap-4"
    >
      <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
        {/* Kode IT */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="kode_it">Kode IT</Label>
          <Input name="kode_it" className="lg:tracking-wider" required />
        </div>

        {/* Combobox Referensi MR */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="kodePR">Delivery untuk MR</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("col-span-12 lg:col-span-4 justify-between")}
              >
                {selectedMr
                  ? mr.find((mr: MR) => mr.kode === selectedMr?.kode)?.kode
                  : "Cari kode mr..."}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="Cari kode mr..." />
                <CommandList>
                  <CommandEmpty>Tidak ada.</CommandEmpty>
                  <CommandGroup>
                    {filteredMr?.map((m) => (
                      <CommandItem
                        key={m.kode}
                        value={m.kode}
                        onSelect={(currentValue) => {
                          setSelectedMr(
                            mr.find((m) => m.kode === currentValue)
                          );
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMr?.kode === m.kode
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

        {/* Pilih ekspedisi */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="ekspedisi">Pilih Ekspedisi</Label>
          <div className="flex items-center">
            <Select required name="ekspedisi">
              <SelectTrigger className="w-full" name="ekspedisi" id="ekspedisi">
                <SelectValue placeholder="Pilih ekspedisi yang digunakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Daftar Ekspedisi</SelectLabel>
                  {DeliveryEkspedisi?.map((eks, index) => (
                    <SelectItem key={index} value={eks}>
                      {eks}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nomor Resi */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="resi">Nomor Resi (opsional)</Label>
          <Input name="resi" className="lg:tracking-wider" />
        </div>
      </div>

      <div className="flex flex-col col-span-12 lg:col-span-6 gap-4">
        {/* Dari gudang */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="dari">Dari Gudang</Label>
          <div className="flex items-center">
            <Select
              key={key}
              required
              name="dari"
              onValueChange={(val) => setSelectedFrom(val)}
            >
              <SelectTrigger className="w-full" name="dari" id="dari">
                <SelectValue placeholder="Pilih lokasi pengirim" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Daftar Lokasi</SelectLabel>
                  {LokasiList?.map((lokasi) => {
                    if (lokasi.kode === "unassigned") {
                      return;
                    } else {
                      return (
                        <SelectItem key={lokasi.kode} value={lokasi.nama}>
                          {lokasi.nama}
                        </SelectItem>
                      );
                    }
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ke gudang */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="tujuan">Ke Gudang</Label>
          <div className="flex items-center">
            <Select
              key={key}
              required
              name="tujuan"
              disabled
              value={selectedMr?.lokasi}
            >
              <SelectTrigger className="w-full" name="tujuan" id="tujuan">
                <SelectValue placeholder="Pilih lokasi tujuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Daftar Lokasi</SelectLabel>
                  {LokasiList?.map((lokasi) => {
                    if (lokasi.kode === "unassigned") {
                      return;
                    } else {
                      return (
                        <SelectItem key={lokasi.kode} value={lokasi.nama}>
                          {lokasi.nama}
                        </SelectItem>
                      );
                    }
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status */}
        {/* <div className="flex flex-col gap-2">
          <Label htmlFor="status">Pilih pengiriman</Label>
          <div className="flex items-center">
            <Select required name="status">
              <SelectTrigger className="w-full" name="status" id="status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Daftar Status</SelectLabel>
                  {DeliveryStatus.map((stats, index) => (
                    <SelectItem key={index} value={stats}>
                      {stats}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div> */}

        {/* Jumlah Koli */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="koli">Jumlah Koli (opsional)</Label>
          <Input
            name="koli"
            type="number"
            min={0}
            className="lg:tracking-wider"
          />
        </div>
      </div>

      {/* Item dari MR */}
      <div className="col-span-12 flex flex-col gap-2">
        <Table>
          <TableCaption>Tabel Daftar Barang di MR</TableCaption>
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
              <TableHead className="font-semibold text-center">
                Jumlah
              </TableHead>
              <TableHead className="font-semibold text-center">
                Jumlah dikirim
              </TableHead>
              <TableHead className="font-semibold text-center">
                Stock {selectedFrom}
              </TableHead>
              <TableHead className="font-semibold text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedMr && selectedMr.barang.length > 0 ? (
              selectedMr.barang.map((item, index) => (
                <TableRow key={index} className="border [&>*]:border">
                  <TableCell className="w-[50px]">{index + 1}</TableCell>
                  <TableCell className="text-start">
                    {item.part_number}
                  </TableCell>
                  <TableCell className="text-start">{item.part_name}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.qty_delivered}</TableCell>
                  <TableCell>
                    {
                      stocks.find(
                        (i) =>
                          i.part_number === item.part_number &&
                          selectedFrom === i.lokasi
                      )?.qty
                    }
                  </TableCell>
                  <TableCell>
                    <AddItemDeliveryDialog
                      mr_item={item}
                      dari={selectedFrom}
                      onAddItem={handleAddItem}
                      triggerButton={
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          type="button"
                          disabled={!selectedFrom}
                        >
                          Tambah Ke Delivery
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada item MR.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Item untuk delivery */}
      <div className="col-span-12 flex flex-col gap-2">
        <Table>
          <TableCaption>Tabel Daftar Untuk Delivery Ini</TableCaption>
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
                Stock {selectedFrom}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveryItems.length > 0 ? (
              deliveryItems.map((item, index) => (
                <TableRow key={index} className="border [&>*]:border">
                  <TableCell className="w-[50px]">{index + 1}</TableCell>
                  <TableCell className="text-start">
                    {item.part_number}
                  </TableCell>
                  <TableCell className="text-start">{item.part_name}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>
                    {
                      stocks.find(
                        (i) =>
                          i.part_number === item.part_number &&
                          selectedFrom === i.lokasi
                      )?.qty
                    }
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
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
