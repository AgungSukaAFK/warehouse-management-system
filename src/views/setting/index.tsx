import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";

// 1. Impor hook, komponen, dan ikon yang dibutuhkan
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function Setting() {
  // 2. Panggil hook useTheme untuk mendapatkan state tema saat ini dan fungsi untuk mengubahnya
  const { theme, setTheme } = useTheme();

  return (
    <WithSidebar>
      {/* Pengaturan Tampilan */}
      <SectionContainer span={12}>
        <SectionHeader>Pengaturan Tampilan</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          {/* 3. Ganti konten placeholder dengan UI pilihan tema */}
          <div className="col-span-12 p-4">
            <div className="max-w-md space-y-4">
              <div>
                <h3 className="text-lg font-medium">Tema Aplikasi</h3>
                <p className="text-sm text-muted-foreground">
                  Pilih antara tema terang atau gelap untuk kenyamanan visual
                  Anda.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Sun className="h-5 w-5" />
                  Terang
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Moon className="h-5 w-5" />
                  Gelap
                </Button>
              </div>
            </div>
          </div>
        </SectionBody>
        <SectionFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Perubahan akan disimpan secara otomatis untuk kunjungan Anda
            berikutnya.
          </p>
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
