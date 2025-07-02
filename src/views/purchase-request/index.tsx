import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import CreatePRForm from "@/components/form/create-pr";
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
import { getCurrentUser } from "@/services/auth";
import { getAllPr } from "@/services/purchase-request";
import type { PR, UserComplete } from "@/types";
import { PagingSize } from "@/types/enum";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function PurchaseRequest() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [user, setUser] = useState<UserComplete | null>(null);
  const [prs, SetPrs] = useState<PR[]>([]);

  // Filtering
  const [filteredPrs, setFilteredPrs] = useState<PR[]>([]);
  const [prToShow, setPrToShow] = useState<PR[]>([]);
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
    async function fetchUserDataAndMRs() {
      try {
        const mrResult = await getAllPr();
        SetPrs(mrResult);
        setFilteredPrs(mrResult);
        setPrToShow(mrResult.slice(0, PagingSize));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data: ${error.message}`);
        } else {
          toast.error("Gagal mengambil data PR.");
        }
        setUser(null);
      }
    }

    fetchUserDataAndMRs();
  }, [refresh]);

  function filterPrs() {
    let filtered = prs;

    if (kode) {
      filtered = filtered.filter((pr) =>
        pr.kode.toLowerCase().includes(kode.toLowerCase())
      );
    }

    setFilteredPrs(filtered);
    setCurrentPage(1); // Reset to first page after filtering
    setPrToShow(filtered.slice(0, PagingSize));
    if (filtered.length === 0) {
      toast.info("Tidak ada Purchase Request yang sesuai dengan filter.");
    } else {
      toast.success("Filter berhasil diterapkan.");
    }
  }

  function resetFilters() {
    setKode("");
    setFilteredPrs(prs);
    setCurrentPage(1);
    setPrToShow(prs.slice(0, PagingSize));
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
      {/* Data PR */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Purchase Request</SectionHeader>
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
              <Button className="w-full" onClick={filterPrs}>
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
                  <TableHead className="p-2 border">Kode</TableHead>
                  <TableHead className="p-2 border">Status</TableHead>
                  <TableHead className="p-2 border">Lokasi</TableHead>
                  <TableHead className="p-2 border">PIC</TableHead>
                  <TableHead className="p-2 border">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prToShow.length > 0 ? (
                  prToShow.map((mr, index) => (
                    <TableRow key={mr.id}>
                      <TableCell className="p-2 border">
                        {PagingSize * (currentPage - 1) + (index + 1)}
                      </TableCell>
                      <TableCell className="p-2 border">{mr.kode}</TableCell>
                      <TableCell className="p-2 border">{mr.status}</TableCell>
                      <TableCell className="p-2 border">{mr.lokasi}</TableCell>
                      <TableCell className="p-2 border">{mr.pic}</TableCell>
                      <TableCell className="p-2 border">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/purchase-request/${encodeURIComponent(
                              mr.kode
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
            data={filteredPrs}
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
          <SectionHeader>Tambah PR Baru</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 border border-border rounded-sm p-2 text-center">
              <CreatePRForm setRefresh={setRefresh} user={user} />
            </div>
          </SectionBody>
          <SectionFooter>
            <Button
              className="w-full flex gap-4"
              type="submit"
              form="create-pr-form"
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
