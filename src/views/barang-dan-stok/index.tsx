import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import CreateMasterPartForm from "@/components/form/create-master-part";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { QuickTable } from "@/components/quick-table";
import { Button } from "@/components/ui/button";
import { formatTanggal } from "@/lib/utils";
import { getMasterParts } from "@/services/master-part";
import { getAllStocks } from "@/services/stock";
import type { MasterPart, Stock } from "@/types";
import { HousePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BarangDanStok() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [masterParts, setMasterParts] = useState<MasterPart[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

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

    fetchMasterPart();
  }, [refresh]);

  useEffect(() => {
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

    fetchStocks();
  }, []);

  return (
    <WithSidebar>
      {/* Data  */}
      <DataStokBarangSection stocks={stocks} />

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
  ];
}

function DataMasterPartSection({ masterParts }: { masterParts: MasterPart[] }) {
  return (
    <SectionContainer span={12}>
      <SectionHeader>Daftar Barang</SectionHeader>
      <SectionBody className="grid grid-cols-12 gap-2">
        <div className="col-span-12 rounded-sm text-center">
          <QuickTable
            data={masterParts}
            columns={MasterPartCollumnsGenerator()}
          />
        </div>
      </SectionBody>
      <SectionFooter>
        <MyPagination />
      </SectionFooter>
    </SectionContainer>
  );
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
  ];
}

function DataStokBarangSection({ stocks }: { stocks: Stock[] }) {
  return (
    <SectionContainer span={12}>
      <SectionHeader>Daftar Stok Barang</SectionHeader>
      <SectionBody className="grid grid-cols-12 gap-2">
        <div className="col-span-12 border border-border rounded-sm p-2 text-center">
          <QuickTable data={stocks} columns={StockCollumnsGenerator()} />
        </div>
      </SectionBody>
      <SectionFooter>
        <MyPagination data={stocks} />
      </SectionFooter>
    </SectionContainer>
  );
}
