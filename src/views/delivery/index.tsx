import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import CreateDeliveryForm from "@/components/form/create-delivery";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // <-- Impor
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
} from "@/components/ui/select"; // <-- Impor
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/services/auth";
import { getAllDelivery } from "@/services/delivery";
import type { Delivery, UserComplete } from "@/types";
import { PagingSize } from "@/types/enum";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function DeliveryPage() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [user, setUser] = useState<UserComplete | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
  const [deliveriesToShow, setDeliveriesToShow] = useState<Delivery[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // --- State untuk Filtering ---
  const [kodeIt, setKodeIt] = useState<string>("");
  const [kodeMr, setKodeMr] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dariGudang, setDariGudang] = useState<string>("");
  const [keGudang, setKeGudang] = useState<string>("");
  const [resi, setResi] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchAllDeliveries() {
      try {
        const deliveryResult = await getAllDelivery();
        setDeliveries(deliveryResult);
      } catch (error) {
        toast.error(
          `Gagal mengambil data Delivery: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    fetchAllDeliveries();
  }, [refresh]);

  // --- useEffect untuk Filtering Otomatis ---
  useEffect(() => {
    let filtered = deliveries;

    if (kodeIt) {
      filtered = filtered.filter((d) =>
        d.kode_it.toLowerCase().includes(kodeIt.toLowerCase())
      );
    }
    if (kodeMr) {
      filtered = filtered.filter((d) =>
        d.kode_mr.toLowerCase().includes(kodeMr.toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter((d) => d.status === status);
    }
    if (dariGudang) {
      filtered = filtered.filter((d) =>
        d.dari_gudang.toLowerCase().includes(dariGudang.toLowerCase())
      );
    }
    if (keGudang) {
      filtered = filtered.filter((d) =>
        d.ke_gudang.toLowerCase().includes(keGudang.toLowerCase())
      );
    }
    if (resi) {
      filtered = filtered.filter((d) =>
        d.resi_pengiriman.toLowerCase().includes(resi.toLowerCase())
      );
    }

    setFilteredDeliveries(filtered);
    setCurrentPage(1);
  }, [deliveries, kodeIt, kodeMr, status, dariGudang, keGudang, resi]);

  // --- useEffect untuk Mengatur Paginasi ---
  useEffect(() => {
    const startIndex = (currentPage - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setDeliveriesToShow(filteredDeliveries.slice(startIndex, endIndex));
  }, [filteredDeliveries, currentPage]);

  function resetFilters() {
    setKodeIt("");
    setKodeMr("");
    setStatus("");
    setDariGudang("");
    setKeGudang("");
    setResi("");
    toast.success("Filter telah direset.");
  }

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
      {/* Data Delivery */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Delivery</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* Filtering */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-6 lg:col-span-7">
              <Input
                id="search-kode-it"
                placeholder="Ketik kode IT untuk memfilter..."
                value={kodeIt}
                onChange={(e) => setKodeIt(e.target.value)}
              />
            </div>

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
                      Saring data pengiriman.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="filter-kode-mr">Kode MR</Label>
                      <Input
                        id="filter-kode-mr"
                        placeholder="Cari kode MR..."
                        value={kodeMr}
                        onChange={(e) => setKodeMr(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-resi">No. Resi Pengiriman</Label>
                      <Input
                        id="filter-resi"
                        placeholder="Cari no. resi..."
                        value={resi}
                        onChange={(e) => setResi(e.target.value)}
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
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-dari-gudang">Dari Gudang</Label>
                      <Input
                        id="filter-dari-gudang"
                        placeholder="Cari gudang asal..."
                        value={dariGudang}
                        onChange={(e) => setDariGudang(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filter-ke-gudang">Ke Gudang</Label>
                      <Input
                        id="filter-ke-gudang"
                        placeholder="Cari gudang tujuan..."
                        value={keGudang}
                        onChange={(e) => setKeGudang(e.target.value)}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

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
                  <TableHead className="p-2 border">Kode IT</TableHead>
                  <TableHead className="p-2 border">Kode MR</TableHead>
                  <TableHead className="p-2 border">Dari Gudang</TableHead>
                  <TableHead className="p-2 border">Ke Gudang</TableHead>
                  <TableHead className="p-2 border">Ekspedisi</TableHead>
                  <TableHead className="p-2 border">Jumlah Koli</TableHead>
                  <TableHead className="p-2 border">Status</TableHead>
                  <TableHead className="p-2 border">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveriesToShow.length > 0 ? (
                  deliveriesToShow.map((deliv, index) => (
                    <TableRow key={deliv.id}>
                      <TableCell className="p-2 border">
                        {PagingSize * (currentPage - 1) + (index + 1)}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {deliv.kode_it}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {deliv.kode_mr}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {deliv.dari_gudang}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {deliv.ke_gudang}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {deliv.ekspedisi}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {deliv.jumlah_koli}
                      </TableCell>
                      <TableCell className="p-2 border">
                        {deliv.status}
                      </TableCell>
                      <TableCell className="p-2 border">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/delivery/${encodeURIComponent(
                              deliv.kode_it
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
                      colSpan={9}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Tidak ada data pengiriman ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBody>

        <SectionFooter>
          <MyPagination
            data={filteredDeliveries}
            triggerNext={nextPage}
            triggerPageChange={pageChange}
            triggerPrevious={previousPage}
            currentPage={currentPage}
          />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah */}
      {user?.role === "warehouse" || user?.role === "purchasing" ? (
        <SectionContainer span={12}>
          <SectionHeader>Tambah Delivery Baru</SectionHeader>
          <SectionBody>
            <div className="col-span-12 border border-border rounded-sm p-2 text-center">
              <CreateDeliveryForm setRefresh={setRefresh} user={user} />
            </div>
          </SectionBody>
          <SectionFooter>
            <Button
              className="w-full flex gap-4"
              type="submit"
              form="create-delivery-form"
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
