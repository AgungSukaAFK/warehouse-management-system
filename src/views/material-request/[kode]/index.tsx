// pages/material-request/[kode].tsx atau sesuai routing Anda
import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type { MR } from "@/types"; // Pastikan path ini benar
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner"; // Import toast for user feedback
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label"; // Import Label
import { Timestamp } from "firebase/firestore";
import { formatTanggal } from "@/lib/utils";
import { parse } from "date-fns";
import { getMrByKode } from "@/services/material-request";

export function MaterialRequestDetail() {
  const { kode } = useParams<{ kode: string }>(); // Dapatkan 'kode' dari URL
  const [mr, setMr] = useState<MR | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMrDetail() {
      if (!kode) {
        toast.error("Kode Material Request tidak ditemukan di URL.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await getMrByKode(kode);
        if (res) {
          setMr(res);
        } else {
          toast.error(`Material Request dengan kode ${kode} tidak ditemukan.`);
          setMr(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail MR:", error);
        if (error instanceof Error) {
          toast.error(`Gagal mengambil detail MR: ${error.message}`);
        } else {
          toast.error(
            "Terjadi kesalahan saat mengambil detail Material Request."
          );
        }
        setMr(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMrDetail();
  }, [kode]); // Depend on 'kode' to refetch if URL param changes

  if (isLoading) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Material Request...</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              Memuat data...
            </div>
          </SectionBody>
        </SectionContainer>
      </WithSidebar>
    );
  }

  if (!mr) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Material Request Tidak Ditemukan</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              MR dengan kode "{kode}" tidak ditemukan.
            </div>
          </SectionBody>
          <SectionFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Pastikan kode yang Anda masukkan benar.
            </p>
          </SectionFooter>
        </SectionContainer>
      </WithSidebar>
    );
  }

  return (
    <WithSidebar>
      <SectionContainer span={12}>
        <SectionHeader>Detail Material Request: {mr.kode}</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Informasi Umum MR */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Informasi Umum
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Kode MR</Label>
                <p className="font-medium text-base">{mr.kode}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">PIC</Label>
                <p className="font-medium text-base">{mr.pic}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Lokasi</Label>
                <p className="font-medium text-base">{mr.lokasi}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-base">{mr.status}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Tanggal MR
                </Label>
                {/* Pastikan mr.tanggal_mr adalah Timestamp sebelum memanggil toDate() */}
                <p className="font-medium text-base">
                  {formatTanggal(
                    parse(mr.tanggal_mr, "d/M/yyyy", new Date()).getTime()
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Prioritas
                </Label>
                {/* Pastikan mr.tanggal_estimasi adalah Timestamp sebelum memanggil toDate() */}
                <p className="font-medium text-base">{mr.priority}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Due date
                </Label>
                {/* Pastikan mr.tanggal_estimasi adalah Timestamp sebelum memanggil toDate() */}
                <p className="font-medium text-base">
                  {formatTanggal(
                    parse(mr.due_date, "d/M/yyyy", new Date()).getTime()
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Diperbarui Pada
                </Label>
                <p className="font-medium text-base">
                  {mr.updated_at instanceof Timestamp
                    ? formatTanggal(mr.updated_at.toDate().getTime())
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Daftar Barang */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Daftar Barang
            </h3>
            <div className="border border-border rounded-sm overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Part No</TableHead>
                    <TableHead>Nama Part</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mr.barang && mr.barang.length > 0 ? (
                    mr.barang.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[50px]">{index + 1}</TableCell>
                        <TableCell>{item.part_no}</TableCell>
                        <TableCell>{item.part_name}</TableCell>
                        <TableCell>{item.satuan}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-4"
                      >
                        Tidak ada barang dalam Material Request ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </SectionBody>
        <SectionFooter>
          {/* Anda bisa menambahkan tombol aksi di sini, misalnya untuk Edit atau Cetak */}
          {/* <Button>Edit MR</Button> */}
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
