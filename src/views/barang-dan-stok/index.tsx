import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import { EditStockDialog } from "@/components/dialog/edit-stock";
import CreateMasterPartForm from "@/components/form/create-master-part";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { QuickTable } from "@/components/quick-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatTanggal } from "@/lib/utils";
import { getCurrentUser } from "@/services/auth";
import { getMasterParts } from "@/services/master-part";
import { getAllStocks } from "@/services/stock";
import type { MasterPart, Stock, UserComplete } from "@/types";
import { PagingSize } from "@/types/enum";
import { HousePlus } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export default function BarangDanStok() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [masterParts, setMasterParts] = useState<MasterPart[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [user, setUser] = useState<UserComplete>();

  useEffect(() => {
    async function getUser() {
      try {
        const res = await getCurrentUser();
        if (res) {
          setUser(res);
        } else {
          toast.error("Gagal mendapatkan data pengguna saat ini.");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mendapatkan data pengguna: ${error.message}`);
        } else {
          toast.error(
            "Gagal mendapatkan data pengguna: Terjadi kesalahan yang tidak diketahui."
          );
        }
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    async function fetchMasterPart() {
      try {
        const res = await getMasterParts();
        if (res) {
          setMasterParts(res);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data master part: ${error.message}`);
        } else {
          toast.error(
            "Gagal mengambil data master part: Terjadi kesalahan yang tidak diketahui."
          );
        }
      }
    }

    async function fetchStocks() {
      try {
        const res = await getAllStocks();
        if (res) {
          setStocks(res);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal mengambil data stok barang: ${error.message}`);
        } else {
          toast.error(
            "Gagal mengambil data stok barang: Terjadi kesalahan yang tidak diketahui."
          );
        }
      }
    }
    if (user) {
      fetchMasterPart();
      fetchStocks();
    }
  }, [refresh, user]);

  return (
    <WithSidebar>
      {/* Data  */}
      <DataStokBarangSection
        setRefresh={setRefresh}
        stocks={stocks}
        lokasiUser={user ? user.lokasi : ""}
      />

      {/* Data Master Part */}
      <DataMasterPartSection masterParts={masterParts as MasterPart[]} />

      {/* Tambah */}
      <SectionContainer span={12}>
        <SectionHeader>Tambah Barang</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 rounded-sm text-center">
            <CreateMasterPartForm setRefresh={setRefresh} />
          </div>
        </SectionBody>
        <SectionFooter>
          <Button
            className="w-full flex gap-4"
            type="submit"
            form="create-master-part-form"
          >
            Tambah <HousePlus />
          </Button>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}

function MasterPartCollumnsGenerator() {
  return [
    {
      header: "Part Number",
      accessorKey: "part_number",
    },
    {
      header: "Part Name",
      accessorKey: "part_name",
    },
    {
      header: "Satuan",
      accessorKey: "satuan",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (value: any) => formatTanggal(value),
    },
    {
      header: "Updated At",
      accessorKey: "updated_at",
      cell: (value: any) => formatTanggal(value),
    },
    {
      header: "Aksi",
      accessorKey: "aksi",
      cell: () => (
        <Button variant="outline" size={"sm"}>
          Edit
        </Button>
      ),
    },
  ];
}

function DataMasterPartSection({ masterParts }: { masterParts: MasterPart[] }) {
  const [filteredMasterParts, setFilteredMasterParts] = useState<MasterPart[]>(
    []
  );
  const [tableMasterParts, setTableMasterParts] = useState<MasterPart[]>([]);

  // Pagination
  const pageSize = PagingSize;
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setFilteredMasterParts(masterParts);
    setTableMasterParts(masterParts.slice(0, pageSize));
  }, [masterParts]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setTableMasterParts(filteredMasterParts.slice(startIndex, endIndex));
  }, [currentPage, filteredMasterParts]);

  // Filtering
  const [pn, setPn] = useState<string>("");
  const [pnm, setPnm] = useState<string>("");
  const [uom, setUom] = useState<string>("");

  function filterMP() {
    let filtered = filteredMasterParts;

    if (pn) {
      filtered = filtered.filter((mp) =>
        mp.part_number.toLowerCase().includes(pn.toLowerCase())
      );
    }

    if (uom) {
      filtered = filtered.filter((mp) =>
        mp.satuan.toLowerCase().includes(uom.toLowerCase())
      );
    }

    if (pnm) {
      filtered = filtered.filter((mp) =>
        mp.part_name.toLowerCase().includes(pnm.toLowerCase())
      );
    }

    setFilteredMasterParts(filtered);
    setTableMasterParts(filtered.slice(0, PagingSize));
  }

  function resetFilters() {
    setPn("");
    setPnm("");
    setUom("");
    setFilteredMasterParts(masterParts);
    setTableMasterParts(masterParts.slice(0, pageSize));
    setCurrentPage(1);
  }

  return (
    <SectionContainer span={12}>
      <SectionHeader>Daftar Barang</SectionHeader>
      <SectionBody className="grid grid-cols-12 gap-2">
        <div className="flex flex-col gap-4 col-span-12 rounded-sm text-center">
          {/* Filtering */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            {/* Search by kode */}
            <div className="col-span-12 md:col-span-4 lg:col-span-5">
              <Input
                placeholder="Cari berdasarkan part number"
                value={pn}
                onChange={(e) => setPn(e.target.value)}
              />
            </div>

            {/* Search button */}
            <div className="col-span-12 md:col-span-4 lg:col-span-2">
              <Button className="w-full" onClick={filterMP}>
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
                <PopoverContent className="w-80 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Part Name
                    </label>
                    <Input
                      placeholder="part name"
                      value={pnm}
                      onChange={(e) => setPnm(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Satuan
                    </label>
                    <Input
                      placeholder="Uom"
                      value={uom}
                      onChange={(e) => setUom(e.target.value)}
                    />
                  </div>
                </PopoverContent>
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
          <QuickTable
            data={tableMasterParts}
            columns={MasterPartCollumnsGenerator()}
            page={currentPage}
          />
        </div>
      </SectionBody>
      <SectionFooter>
        <MyPagination
          data={filteredMasterParts}
          triggerNext={() => setCurrentPage((prev) => prev + 1)}
          triggerPrevious={() => setCurrentPage((prev) => prev - 1)}
          triggerPageChange={(page) => {
            setCurrentPage(page);
          }}
          currentPage={currentPage}
        />
      </SectionFooter>
    </SectionContainer>
  );
}

function DataStokBarangSection({
  stocks,
  lokasiUser,
  setRefresh,
}: {
  stocks: Stock[];
  lokasiUser: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}) {
  const [filteredStock, setFilteredStock] = useState<Stock[]>([]);
  const [tableStocks, setTableStocks] = useState<Stock[]>([]);
  const [semuaLokasi, setSemuaLokasi] = useState<boolean>(false);

  const [pn, setPn] = useState<string>("");
  const [pnm, setPnm] = useState<string>("");
  const [uom, setUom] = useState<string>("");
  const [lokasi, setLokasi] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const startIndex = (currentPage - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setTableStocks(filteredStock.slice(startIndex, endIndex));
  }, [currentPage, filteredStock]);

  useEffect(() => {
    // Mulai dari stocks penuh atau dibatasi lokasi user
    let data = semuaLokasi
      ? stocks
      : stocks.filter((stock) => stock.lokasi === lokasiUser);

    // Apply filters
    if (pn) {
      data = data.filter((stock) =>
        stock.part_number.toLowerCase().includes(pn.toLowerCase())
      );
    }

    if (pnm) {
      data = data.filter((stock) =>
        stock.part_name.toLowerCase().includes(pnm.toLowerCase())
      );
    }

    if (uom) {
      data = data.filter((stock) =>
        stock.satuan.toLowerCase().includes(uom.toLowerCase())
      );
    }

    if (lokasi) {
      data = data.filter((stock) =>
        stock.lokasi.toLowerCase().includes(lokasi.toLowerCase())
      );
    }

    setFilteredStock(data);
    setCurrentPage(1);
  }, [stocks, semuaLokasi, pn, pnm, uom, lokasi, lokasiUser]);

  function resetFilters() {
    setPn("");
    setPnm("");
    setUom("");
    setLokasi("");
    setSemuaLokasi(false);
    setCurrentPage(1);
  }

  function StockCollumnsGenerator() {
    return [
      {
        header: "Part Number",
        accessorKey: "part_number",
      },
      {
        header: "Part Name",
        accessorKey: "part_name",
      },
      {
        header: "Satuan",
        accessorKey: "satuan",
      },
      {
        header: "Lokasi",
        accessorKey: "lokasi",
      },
      {
        header: "Qty",
        accessorKey: "qty",
      },
      {
        header: "Min",
        accessorKey: "min",
      },
      {
        header: "Max",
        accessorKey: "max",
      },
      {
        header: "Aksi",
        accessorKey: "aksi",
        cell: (_: any, row: Stock) => (
          <EditStockDialog refresh={setRefresh} stock={row} />
        ),
      },
    ];
  }

  return (
    <SectionContainer span={12}>
      <SectionHeader>Daftar Stok Barang</SectionHeader>
      <SectionBody className="grid grid-cols-12 gap-2">
        <div className="flex flex-col gap-4 col-span-12 rounded-sm text-center">
          {/* Filtering */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
            {/* Search by kode */}
            <div className="col-span-12 md:col-span-4 lg:col-span-5">
              <Input
                placeholder="Cari berdasarkan part number"
                value={pn}
                onChange={(e) => setPn(e.target.value)}
              />
            </div>

            {/* Filter popover */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filter Tambahan
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4">
                  {/* PN */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Part Name
                    </label>
                    <Input
                      placeholder="part name"
                      value={pnm}
                      onChange={(e) => setPnm(e.target.value)}
                    />
                  </div>
                  {/* UOM */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Satuan
                    </label>
                    <Input
                      placeholder="uom"
                      value={uom}
                      onChange={(e) => setUom(e.target.value)}
                    />
                  </div>
                  {/* Lokasi */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Lokasi
                    </label>
                    <Input
                      placeholder="lokasi"
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                    />
                  </div>
                  {/* Checkbox semua lokasi */}
                  <div className="flex gap-2 items-center">
                    <Checkbox
                      id="semua-lokasi"
                      checked={semuaLokasi}
                      onCheckedChange={(checked) =>
                        setSemuaLokasi(checked === true)
                      }
                    />
                    <label
                      htmlFor="semua-lokasi"
                      className="text-sm font-medium"
                    >
                      Tampilkan semua lokasi
                    </label>
                  </div>
                </PopoverContent>
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

          <QuickTable
            data={tableStocks}
            columns={StockCollumnsGenerator()}
            page={currentPage}
          />
        </div>
      </SectionBody>
      <SectionFooter>
        <MyPagination
          data={filteredStock}
          currentPage={currentPage}
          triggerNext={() => setCurrentPage((page) => page + 1)}
          triggerPrevious={() => setCurrentPage((page) => page - 1)}
          triggerPageChange={(page) => setCurrentPage(page)}
        />
      </SectionFooter>
    </SectionContainer>
  );
}
