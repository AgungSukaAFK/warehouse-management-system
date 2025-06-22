import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { getAllUsersWithCursor } from "@/services/user";
import type { UserDb } from "@/types";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState<UserDb[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [lastDocs, setLastDocs] = useState<
    Record<number, QueryDocumentSnapshot<DocumentData>>
  >({});
  const [hasNext, setHasNext] = useState<boolean>(true);

  useEffect(() => {
    async function getUsers() {
      const cursor = page > 1 ? lastDocs[page - 1] : undefined;
      const result = await getAllUsersWithCursor(pageSize, cursor);

      if (result) {
        setUsers(result.data);

        if (result.lastDoc) {
          setLastDocs((prev) => ({
            ...prev,
            [page]: result.lastDoc!,
          }));
        }

        // Disable "Next" button if data returned is less than pageSize
        setHasNext(result.data.length === pageSize);
      }
    }

    getUsers();
  }, [page]);

  function handleEdit(user: UserDb) {
    console.log("Edit user:", user);
    // Arahkan ke halaman edit atau buka modal
  }

  function handleDelete(userId: string) {
    console.log("Delete user:", userId);
    // Konfirmasi & hapus user dari Firestore/Auth
  }

  return (
    <WithSidebar>
      {/* Data User */}
      <SectionContainer span={12}>
        <SectionHeader>Daftar Pengguna</SectionHeader>
        <SectionBody className="grid grid-cols-12 gap-2">
          <div className="col-span-12 border border-border rounded-sm p-2 overflow-x-auto">
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
                {users?.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-accent">
                    <td className="p-2">{(page - 1) * pageSize + index + 1}</td>
                    <td className="p-2">{user.nama}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{user.lokasi}</td>
                    <td className="p-2">
                      {user.email_verified ? "Verified" : "Not Verified"}
                    </td>
                    <td className="p-2">{user.auth_provider}</td>
                    <td className="p-2">
                      <button
                        className="text-primary underline mr-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 underline"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
