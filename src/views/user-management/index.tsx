import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import { EditUserDialog } from "@/components/dialog/edit-user";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllUsers } from "@/services/user";
import type { UserDb } from "@/types";
import { PagingSize } from "@/types/enum";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState<UserDb[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDb[]>([]);
  const [tableUsers, setTableUsers] = useState<UserDb[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [refresh, setRefresh] = useState<boolean>(false);

  // Filtering
  const [email, setEmail] = useState<string>("");
  const [nama, setNama] = useState<string>("");
  const [lokasi, setLokasi] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [provider, setProvider] = useState<string>("");

  useEffect(() => {
    async function fetchUsers() {
      const result = await getAllUsers();
      if (result) {
        setUsers(result);
        setFilteredUsers(result);
        setTableUsers(result.slice(0, PagingSize));
        resetFilter();
      } else {
        toast.error("Gagal memuat data pengguna");
      }
    }

    fetchUsers();
  }, [refresh]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * PagingSize;
    const endIndex = startIndex + PagingSize;
    setTableUsers(filteredUsers.slice(startIndex, endIndex));
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    let data = users;

    if (email) {
      data = data.filter((user) =>
        user.email.toLowerCase().includes(email.toLowerCase())
      );
    }
    if (nama) {
      data = data.filter((user) =>
        user.nama.toLowerCase().includes(nama.toLowerCase())
      );
    }
    if (lokasi) {
      data = data.filter((user) =>
        user.lokasi.toLowerCase().includes(lokasi.toLowerCase())
      );
    }
    if (role) {
      data = data.filter((user) =>
        user.role.toLowerCase().includes(role.toLowerCase())
      );
    }
    if (provider) {
      data = data.filter((user) =>
        user.auth_provider.toLowerCase().includes(provider.toLowerCase())
      );
    }

    setFilteredUsers(data);
    setTableUsers(data.slice(0, PagingSize));
    setCurrentPage(1);
  }, [users, email, nama, lokasi, role, provider]);

  function resetFilter() {
    setEmail("");
    setNama("");
    setLokasi("");
    setRole("");
    setProvider("");
  }

  return (
    <WithSidebar>
      <SectionContainer span={12}>
        <SectionHeader>Daftar Pengguna</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="flex flex-col gap-4 col-span-12 border border-border rounded-sm p-2 overflow-x-auto">
            {/* Filtering */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-end">
              {/* Search by email */}
              <div className="col-span-12 md:col-span-4 lg:col-span-5">
                <Input
                  placeholder="Cari berdasarkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Filter popover */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Filter Tambahan
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 space-y-4">
                    {/* nama */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nama
                      </label>
                      <Input
                        placeholder="nama"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                      />
                    </div>
                    {/* role */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Role
                      </label>
                      <Input
                        placeholder="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>
                    {/* Lokasi */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Lokasi
                      </label>
                      <Input
                        placeholder="lokasi"
                        value={lokasi}
                        onChange={(e) => setLokasi(e.target.value)}
                      />
                    </div>
                    {/* Provider */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Login Provider
                      </label>
                      <Input
                        placeholder="provider"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Clear filter button */}
              <div className="col-span-12 md:col-span-4 lg:col-span-2">
                <Button
                  className="w-full"
                  variant={"destructive"}
                  onClick={resetFilter}
                >
                  Hapus Filter
                </Button>
              </div>
            </div>

            <table className="min-w-full text-sm text-left border-collapse table-auto">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b">
                  <th className="p-2">No</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Lokasi</th>
                  <th className="p-2">Email Verified</th>
                  <th className="p-2">Provider</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableUsers?.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-accent">
                    <td className="p-2">
                      {(currentPage - 1) * PagingSize + index + 1}
                    </td>
                    <td className="p-2">{user.nama}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{user.lokasi}</td>
                    <td className="p-2">
                      {user.email_verified ? "Verified" : "Not Verified"}
                    </td>
                    <td className="p-2">{user.auth_provider}</td>
                    <td className="p-2 flex gap-2 items-center">
                      <EditUserDialog user={user} refresh={setRefresh} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBody>

        <SectionFooter>
          <MyPagination
            data={filteredUsers}
            currentPage={currentPage}
            triggerNext={() => {
              setCurrentPage((prev) => prev + 1);
            }}
            triggerPrevious={() => {
              setCurrentPage((prev) => prev - 1);
            }}
            triggerPageChange={(page: number) => {
              setCurrentPage(page);
            }}
          />
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
