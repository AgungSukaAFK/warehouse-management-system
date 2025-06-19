import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PurchaseRequest() {
  return (
    <WithSidebar>
      {/* Data PR */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar PR</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Tabel Data PR
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah */}
      <SectionContainer span={12}>
        <SectionHeader>Tambah PR Baru</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Form Tambah PR
          </div>
        </SectionBody>
        <SectionFooter>
          <Button className="w-full flex gap-4">
            Tambah <Plus />
          </Button>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
