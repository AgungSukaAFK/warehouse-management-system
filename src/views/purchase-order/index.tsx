import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";

export default function PurchaseOrder() {
  return (
    <WithSidebar>
      {/* Data PO */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar PO</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Tabel Data PO
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah */}
      <SectionContainer span={12}>
        <SectionHeader>Tambah PO Baru</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Form Tambah PO
          </div>
        </SectionBody>
        <SectionFooter>
          <Button className="w-full flex gap-4">
            Tambah <FilePlus2 />
          </Button>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
