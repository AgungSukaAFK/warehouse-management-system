import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function UserManagement() {
  return (
    <WithSidebar>
      {/* Data User */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Pengguna</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Tabel Data Pengguna
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination />
        </SectionFooter>
      </SectionContainer>

      {/* Tambah Pengguna */}
      <SectionContainer span={12}>
        <SectionHeader>Tambah Pengguna Baru</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Form Tambah Pengguna
          </div>
        </SectionBody>
        <SectionFooter>
          <Button className="w-full flex gap-4">
            Tambah <UserPlus />
          </Button>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
