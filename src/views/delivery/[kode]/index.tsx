// pages/material-request/[kode].tsx atau sesuai routing Anda
import SectionContainer, {
  SectionBody,
  SectionFooter,
  SectionHeader,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import type { Delivery, MR } from "@/types"; // Pastikan path ini benar
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
import { Label } from "@/components/ui/label";
import { formatTanggal } from "@/lib/utils";
import { getDeliveryByKode, updateDelivery } from "@/services/delivery";
import { getMrByKode } from "@/services/material-request";
import { EditDeliveryDialog } from "@/components/dialog/edit-delivery";
import { ConfirmDialog } from "@/components/dialog/edit-status-delivery";

export function DeliveryDetail() {
  const { kode } = useParams<{ kode: string }>();
  const [mr, setMr] = useState<MR | null>(null);
  const [dlvry, setdlvry] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    async function fetchDeliveryDetail(kode: string) {
      setIsLoading(true);
      try {
        const res = await getDeliveryByKode(kode);
        if (res) {
          setdlvry(res);
        } else {
          toast.error(`Delivery dengan kode ${kode} tidak ditemukan.`);
          setdlvry(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail Delivery:", error);
        if (error instanceof Error) {
          toast.error(`Gagal mengambil detail Delivery: ${error.message}`);
        } else {
          toast.error(
            "Terjadi kesalahan saat mengambil detail Material Request."
          );
        }
        setdlvry(null);
      } finally {
        setIsLoading(false);
      }
    }
    if (kode) {
      fetchDeliveryDetail(kode);
    }
  }, [kode, refresh]);

  useEffect(() => {
    async function fetchMrDetail(kode: string) {
      setIsLoading(true);
      try {
        const res = await getMrByKode(kode);
        if (res) {
          setMr(res);
        } else {
          toast.error(`MR dengan kode ${kode} tidak ditemukan.`);
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

    if (dlvry) {
      fetchMrDetail(dlvry.kode_mr);
    }
  }, [dlvry]);

  async function updateDeliveryStatus(status: "on delivery" | "completed") {
    if (!dlvry) {
      toast.error("Delivery tidak ditemukan.");
      return;
    }

    try {
      if (status === "on delivery") {
        const res = await updateDelivery(dlvry.kode_it, {
          status: "on delivery",
        });
        if (res) {
          toast.success(
            "Status delivery berhasil diperbarui ke 'on delivery'."
          );
          setRefresh((prev) => !prev);
        } else {
          toast.error("Gagal memperbarui status delivery.");
        }
      } else if (status === "completed") {
        const res = await updateDelivery(dlvry.kode_it, {
          status: "completed",
        });
        if (res) {
          toast.success(
            "Status delivery berhasil diperbarui ke 'on delivery'."
          );
          setRefresh((prev) => !prev);
        } else {
          toast.error("Gagal memperbarui status delivery.");
        }
      }
    } catch (error) {
      console.error("Gagal memperbarui status delivery:", error);
      if (error instanceof Error) {
        toast.error(`Gagal memperbarui status delivery: ${error.message}`);
      } else {
        toast.error("Terjadi kesalahan saat memperbarui status delivery.");
      }
    }
  }

  if (isLoading) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Memuat Detail Delivery...</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              Memuat data...
            </div>
          </SectionBody>
        </SectionContainer>
      </WithSidebar>
    );
  }

  if (!dlvry) {
    return (
      <WithSidebar>
        <SectionContainer span={12}>
          <SectionHeader>Delivery Tidak Ditemukan</SectionHeader>
          <SectionBody className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex items-center justify-center border border-dashed border-border rounded-sm p-8 text-muted-foreground text-lg">
              Delivery dengan kode "{kode}" tidak ditemukan.
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
      {/* Detail Delivery */}
      <SectionContainer span={12}>
        <SectionHeader>Detail Delivery: {dlvry.kode_it}</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Informasi Umum Delivery */}
          <div className="col-span-12 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              Informasi Umum
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Kode IT</Label>
                <p className="font-medium text-base">{dlvry.kode_it}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Referensi MR
                </Label>
                <p className="font-medium text-base">{dlvry.kode_mr}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-base">{dlvry.status}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Person in charge
                </Label>
                <p className="font-medium text-base">{dlvry.pic}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Dari gudang
                </Label>
                <p className="font-medium text-base">{dlvry.dari_gudang}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Ke gudang
                </Label>
                <p className="font-medium text-base">{dlvry.ke_gudang}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Ekspedisi yang digunakan
                </Label>
                <p className="font-medium text-base">{dlvry.ekspedisi}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  No. resi
                </Label>
                <p className="font-medium text-base">{dlvry.resi_pengiriman}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Dibuat pada
                </Label>
                {/* Pastikan mr.tanggal_mr adalah Timestamp sebelum memanggil toDate() */}
                <p className="font-medium text-base">
                  {formatTanggal(dlvry.created_at)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Diperbarui pada
                </Label>
                <p className="font-medium text-base">
                  {formatTanggal(dlvry.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </SectionBody>
        <SectionFooter className="flex gap-2">
          {/* {dlvry.status !== "completed" && (
            <EditDeliveryDialog delivery={dlvry} refresh={setRefresh} />
          )} */}
          <EditDeliveryDialog delivery={dlvry} refresh={setRefresh} />
          {dlvry.status === "pending" && (
            <ConfirmDialog
              text="Naikkan status ke on delivery"
              onClick={() => {
                updateDeliveryStatus("on delivery");
              }}
            />
          )}
          {dlvry.status === "on delivery" && (
            <ConfirmDialog
              text="Selesaikan delivery"
              onClick={() => {
                updateDeliveryStatus("completed");
              }}
            />
          )}
        </SectionFooter>
      </SectionContainer>

      <SectionContainer span={12}>
        <SectionHeader>Barang dari Referensi MR</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-6">
          {/* Daftar Barang */}
          <div className="col-span-12 space-y-4">
            <div className="w-full border border-border rounded-sm overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="[&>th]:border">
                    <TableHead className="w-[50px] text-center">No</TableHead>
                    <TableHead>Part Number</TableHead>
                    <TableHead>Nama Part</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Jumlah diminta</TableHead>
                    <TableHead>Jumlah diterima</TableHead>
                    <TableHead>Jumlah on delivery</TableHead>
                    <TableHead>Jumlah pending delivery</TableHead>
                    <TableHead>Dari gudang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mr?.barang && mr.barang.length > 0 ? (
                    mr.barang.map((item, index) => (
                      <TableRow key={index} className="[&>td]:border">
                        <TableCell className="w-[50px] text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>{item.part_number}</TableCell>
                        <TableCell>{item.part_name}</TableCell>
                        <TableCell>{item.satuan}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>{item.qty_delivered}</TableCell>
                        <TableCell>
                          {dlvry.items.find(
                            (e) => e.part_number === item.part_number
                          )?.qty_on_delivery || 0}
                        </TableCell>
                        <TableCell>
                          {dlvry.items.find(
                            (e) => e.part_number === item.part_number
                          )?.qty_pending || 0}
                        </TableCell>
                        <TableCell>
                          {dlvry.items.find(
                            (e) => e.part_number === item.part_number
                          )?.dari_gudang || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="[&>td]:border">
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
        <SectionFooter></SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
