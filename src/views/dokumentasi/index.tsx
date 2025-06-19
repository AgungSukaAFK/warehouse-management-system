import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";

export default function Dokumentasi() {
  return (
    <WithSidebar>
      {/* Coming Soon */}
      <SectionContainer span={12}>
        <SectionHeader>Coming Soon</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
            🚧 Fitur ini sedang dalam pengembangan.
          </div>
        </SectionBody>
        <SectionFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Silakan cek kembali nanti.
          </p>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
