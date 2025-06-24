import SectionContainer, {
  SectionHeader,
  SectionBody,
  SectionFooter,
} from "@/components/content-container";
import { EditUserDialog } from "@/components/dialog/edit-user";
import WithSidebar from "@/components/layout/WithSidebar";
import { MyPagination } from "@/components/my-pagination";
import { getAllUsers } from "@/services/user";
import type { UserDb } from "@/types";
import { QueryDocumentSnapshot, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState<UserDb[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [nextPageDoc, setNextPageDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [prevPageDoc, setPrevPageDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const pageSize = 25; // Sesuaikan dengan limit di fungsi getAllUsers

  useEffect(() => {
    async function fetchUsers() {
      const result = await getAllUsers({
        limit: pageSize,
        startAfterDoc: currentPage === 1 ? null : nextPageDoc, // Gunakan nextPageDoc dari halaman sebelumnya
        endBeforeDoc: currentPage === 1 ? null : prevPageDoc, // Gunakan prevPageDoc dari halaman sebelumnya
        // Logika untuk startAfterDoc/endBeforeDoc akan diatur di `handlePageChange`
      });

      setUsers(result.users);
      setTotalUsersCount(result.totalUsersCount);
      setNextPageDoc(result.nextPageDoc);
      setPrevPageDoc(result.prevPageDoc);
      setHasNext(result.hasNext);
      setHasPrevious(result.hasPrevious);
    }

    fetchUsers();
  }, [currentPage, refresh]);

  async function handlePageChange(newPage: number) {
    if (newPage > currentPage && nextPageDoc) {
      const result = await getAllUsers({
        limit: pageSize,
        startAfterDoc: nextPageDoc,
      });
      setUsers(result.users);
      setNextPageDoc(result.nextPageDoc);
      setPrevPageDoc(result.prevPageDoc);
      setHasNext(result.hasNext);
      setHasPrevious(result.hasPrevious);
      setCurrentPage(newPage);
    } else if (newPage < currentPage && prevPageDoc) {
      const result = await getAllUsers({
        limit: pageSize,
        endBeforeDoc: prevPageDoc,
      });
      setUsers(result.users);
      setNextPageDoc(result.nextPageDoc);
      setPrevPageDoc(result.prevPageDoc);
      setHasNext(result.hasNext);
      setHasPrevious(result.hasPrevious);
      setCurrentPage(newPage);
    } else if (newPage === 1) {
      // Kembali ke halaman pertama, reset semua state pagination
      const result = await getAllUsers({ limit: pageSize });
      setUsers(result.users);
      setNextPageDoc(result.nextPageDoc);
      setPrevPageDoc(result.prevPageDoc);
      setHasNext(result.hasNext);
      setHasPrevious(result.hasPrevious);
      setCurrentPage(1);
    }
  }

  const totalPages = Math.ceil(totalUsersCount / pageSize);

  return (
    <WithSidebar>
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
                    <td className="p-2">
                      {(currentPage - 1) * pageSize + index + 1}
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />
        </SectionFooter>
      </SectionContainer>
    </WithSidebar>
  );
}
