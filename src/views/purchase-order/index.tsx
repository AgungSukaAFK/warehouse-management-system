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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [pos, SetPos] = useState<PO[]>([]);

  // Filtering
  const [filteredPos, setFilteredPos] = useState<PO[]>([]);
  const [poToShow, setPoToShow] = useState<PO[]>([]);
  const [kode, setKode] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchUserDataAndPOs() {
      try {
        const mrResult = await getAllPo();
        SetPos(mrResult);
        setFilteredPos(mrResult);
        setPoToShow(mrResult.slice(0, PagingSize));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data: ${error.message}`);
        } else {
          toast.error("Gagal mengambil data PO.");
        }
        setUser(null);
      }
    }

    fetchUserDataAndPOs();
  }, [refresh]);

  function filterPos() {
    let filtered = pos;

    if (kode) {
      filtered = filtered.filter((pr) =>
        pr.kode.toLowerCase().includes(kode.toLowerCase())
      );
    }

    setFilteredPos(filtered);
    setCurrentPage(1); // Reset to first page after filtering
    setPoToShow(filtered.slice(0, PagingSize));
    if (filtered.length === 0) {
      toast.info("Tidak ada Purchase Request yang sesuai dengan filter.");
    } else {
      toast.success("Filter berhasil diterapkan.");
    }
  }

  function resetFilters() {
    setKode("");
    setFilteredPos(pos);
    setCurrentPage(1);
    setPoToShow(pos.slice(0, PagingSize));
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
      {/* Data PO */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Purchase Order</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* Filtering */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            {/* Search by kode */}
            <div className="col-span-12 md:col-span-4 lg:col-span-5">
              <Input
                placeholder="Cari berdasarkan kode"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
              />
            </div>

            {/* Search button */}
            <div className="col-span-12 md:col-span-4 lg:col-span-2">
              <Button className="w-full" onClick={filterPos}>
                Cari
              </Button>
            </div>

            {/* Filter popover */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filter Tambahan
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4"></PopoverContent>
              </Popover>
            </div>

            {/* Clear filter button */}
            <div className="col-span-12 md:col-span-4 lg:col-span-2">
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
                      colSpan={8}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Tidak ada Material Request ditemukan.
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
            triggerPageChange={(e) => {
              pageChange(e);
            }}
            triggerPrevious={previousPage}
            currentPage={currentPage}
          />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah */}
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
