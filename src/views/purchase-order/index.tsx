import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import CreatePOForm from "@/components/form/create-po";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // <-- Impor Label
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // <-- Impor Select
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Diasumsikan Anda memiliki komponen DatePicker, jika tidak, Anda perlu membuatnya.
// import { DatePicker } from "@/components/ui/date-picker";
import { formatTanggal } from "@/lib/utils";
import { getCurrentUser } from "@/services/auth";
import { getAllPo } from "@/services/purchase-order";
import type { PO, UserComplete } from "@/types";
import { PagingSize } from "@/types/enum";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function PurchaseOrder() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [user, setUser] = useState<UserComplete | null>(null);
  const [pos, setPos] = useState<PO[]>([]);
  const [filteredPos, setFilteredPos] = useState<PO[]>([]);
  const [poToShow, setPoToShow] = useState<PO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // --- State untuk Filtering ---
  const [kodePo, setKodePo] = useState<string>("");
  const [kodePr, setKodePr] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  // Contoh state untuk filter tanggal, jika diperlukan
  // const [tanggalAwal, setTanggalAwal] = useState<Date | undefined>();
  // const [tanggalAkhir, setTanggalAkhir] = useState<Date | undefined>();

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchAllPOs() {
      try {
        const poResult = await getAllPo();
        setPos(poResult);
        setFilteredPos(poResult); // Awalnya, data yang difilter sama dengan data asli
      } catch (error) {
        toast.error(
          `Gagal mengambil data PO: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    fetchAllPOs();
  }, [refresh]);

  // --- useEffect untuk Filtering Otomatis ---
  useEffect(() => {
    let filtered = pos;

    // Filter berdasarkan Kode PO
    if (kodePo) {
      filtered = filtered.filter((po) =>
        po.kode.toLowerCase().includes(kodePo.toLowerCase())
      );
    }

    // Filter berdasarkan Kode PR
    if (kodePr) {
      filtered = filtered.filter((po) =>
        po.kode_pr?.toLowerCase().includes(kodePr.toLowerCase())
      );
    }

    // Filter berdasarkan Status
    if (status) {
      filtered = filtered.filter((po) => po.status === status);
    }

    // // Contoh filter berdasarkan rentang tanggal
    // if (tanggalAwal) {
    //   filtered = filtered.filter(po => new Date(po.created_at) >= tanggalAwal);
    // }
    // if (tanggalAkhir) {
    //   const endOfDay = new Date(tanggalAkhir);
    //   endOfDay.setHours(23, 59, 59, 999); // Set ke akhir hari
    //   filtered = filtered.filter(po => new Date(po.created_at) <= endOfDay);
    // }

    setFilteredPos(filtered);
    setCurrentPage(1); // Selalu reset ke halaman pertama setelah filter berubah
  }, [pos, kodePo, kodePr, status /*, tanggalAwal, tanggalAkhir */]); // <-- Tambahkan semua state filter di sini

  // --- useEffect untuk Mengatur Paginasi ---
  useEffect(() => {
    const startIndex = (currentPage - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setPoToShow(filteredPos.slice(startIndex, endIndex));
  }, [filteredPos, currentPage]);

  function resetFilters() {
    setKodePo("");
    setKodePr("");
    setStatus("");
    // setTanggalAwal(undefined);
    // setTanggalAkhir(undefined);
    toast.success("Filter telah direset.");
  }

  // Fungsi paginasi tidak perlu diubah
  function nextPage() {
    setCurrentPage((prev) => prev + 1);
  }

  function previousPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function pageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <WithSidebar>
      {/* Data PO */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Purchase Order</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* Filtering */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            {/* Search by kode PO */}
            <div className="col-span-12 md:col-span-6 lg:col-span-7">
              <Input
                id="search-kode-po"
                placeholder="Ketik kode PO untuk memfilter..."
                value={kodePo}
                onChange={(e) => setKodePo(e.target.value)}
              />
            </div>

            {/* Filter popover */}
            <div className="col-span-6 md:col-span-3 lg:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filter Tambahan
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Filter Lanjutan
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Saring data berdasarkan kriteria lain.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="filter-kode-pr">Kode PR</Label>
                      <Input
                        id="filter-kode-pr"
                        placeholder="Cari kode PR..."
                        value={kodePr}
                        onChange={(e) => setKodePr(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="purchased">Purchased</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* // Contoh jika ingin menambahkan filter tanggal
                        <div className="grid gap-2">
                           <Label>Tanggal PO</Label>
                           <div className="flex gap-2">
                              <DatePicker date={tanggalAwal} setDate={setTanggalAwal} placeholder="Dari Tanggal" />
                              <DatePicker date={tanggalAkhir} setDate={setTanggalAkhir} placeholder="Sampai Tanggal" />
                           </div>
                        </div> 
                        */}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear filter button */}
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
              <Button
                className="w-full"
                variant={"destructive"}
                onClick={resetFilters}
              >
                Hapus Filter
              </Button>
            </div>
          </div>
          <div className="col-span-12 border rounded-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 border">No</TableHead>
                  <TableHead className="p-2 border">Kode PO</TableHead>
                  <TableHead className="p-2 border">Kode PR</TableHead>
                  <TableHead className="p-2 border">Tanggal PO</TableHead>
                  <TableHead className="p-2 border">Tanggal Estimasi</TableHead>
                  <TableHead className="p-2 border">Status</TableHead>
                  <TableHead className="p-2 border">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poToShow.length > 0 ? (
                  poToShow.map((po, index) => (
                    <TableRow key={po.id}>
                      <TableCell className="p-2 border">
                        {PagingSize * (currentPage - 1) + (index + 1)}
                      </TableCell>
                      <TableCell className="p-2 border">{po.kode}</TableCell>
                      <TableCell className="p-2 border">{po.kode_pr}</TableCell>
                      <TableCell className="p-2 border">
                        {formatTanggal(po.created_at)}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {formatTanggal(po.tanggal_estimasi)}
                      </TableCell>
                      <TableCell className="p-2 border">{po.status}</TableCell>
                      <TableCell className="p-2 border">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/purchase-order/${encodeURIComponent(
                              po.kode
                            )}`}
                          >
                            Detail
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7} // <-- Disesuaikan menjadi 7
                      className="p-4 text-center text-muted-foreground"
                    >
                      Tidak ada Purchase Order ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBody>

        <SectionFooter>
          <MyPagination
            data={filteredPos}
            triggerNext={nextPage}
            triggerPageChange={pageChange}
            triggerPrevious={previousPage}
            currentPage={currentPage}
          />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah PO (tidak ada perubahan di sini) */}
      {user?.role === "warehouse" || user?.role === "purchasing" ? (
        <SectionContainer span={12}>
          <SectionHeader>Tambah PO Baru</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 border border-border rounded-sm p-2 text-center">
              <CreatePOForm setRefresh={setRefresh} user={user} />
            </div>
          </SectionBody>
          <SectionFooter>
            <Button
              className="w-full flex gap-4"
              type="submit"
              form="create-po-form"
            >
              Tambah <Plus />
            </Button>
          </SectionFooter>
        </SectionContainer>
      ) : (
        ""
      )}
    </WithSidebar>
  );
}
