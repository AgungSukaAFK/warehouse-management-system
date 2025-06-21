import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { getCurrentUser } from "@/services/auth";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    async function getUser() {
      await getCurrentUser();
    }
    getUser();
  }, []);
  return (
    <WithSidebar>
      {/* Overview */}
      <SectionContainer span={12}>
        <SectionHeader>Data Overview</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Tabel Data Overview
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination />
        </SectionFooter>
      </SectionContainer>

      {/* Material Request */}
      <SectionContainer span={12}>
        <SectionHeader>Material Request</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Tabel Data MR
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination />
        </SectionFooter>
      </SectionContainer>

      {/* Transaksi */}
      <SectionContainer span={12}>
        <SectionHeader>Transaksi</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Tabel Data Transaksi
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination />
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
