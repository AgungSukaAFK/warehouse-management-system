import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";

export default function ReceiveItem() {
  return (
    <WithSidebar>
      {/* Data Receive Item */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Receive Item</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 text-center">
            Tabel Data Receive Item
          </div>
        </SectionBody>
        <SectionFooter>
          <MyPagination />
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
