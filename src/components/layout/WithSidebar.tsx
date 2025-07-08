import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/auth";
import type { UserComplete } from "@/types";

type WithSidebarProps = { children?: React.ReactNode };

export default function WithSidebar({ children }: WithSidebarProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserComplete>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserData() {
      const user = await getCurrentUser();
      if (user) {
        setUserData(user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    }

    getUserData();
  }, [navigate]);

  function urlToBreadcrumb(urlPath: string) {
    const parts = urlPath.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const isLast = index === parts.length - 1;
      const readablePart = part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (s) => s.toUpperCase());

      return (
        <BreadcrumbItem key={index}>
          {isLast ? (
            <BreadcrumbPage>{decodeURIComponent(readablePart)}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={`/${parts.slice(0, index + 1).join("/")}`}>
              {readablePart}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      );
    });
  }

  useEffect(() => {}, [loading, userData]);

  return (
    <>
      {!loading && userData ? (
        <SidebarProvider>
          {/* Pastikan AppSidebar menerima prop user dengan tipe yang sesuai */}
          <AppSidebar
            user={{
              nama: userData.nama,
              avatar: userData.image_url,
              email: userData.email || "",
              role: userData.role,
            }}
            className="shadow-lg"
          />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 print:hidden" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard">
                        Warehouse Management System
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {urlToBreadcrumb(location.pathname)}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min grid-cols-12 gap-4 md:gap-6">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <SkeletonContent />
      )}
    </>
  );
}

function SkeletonContent() {
  return (
    <SidebarProvider>
      {/* Sesuaikan prop user di SkeletonContent agar sesuai dengan AppSidebar */}
      <AppSidebar
        user={{ email: "", avatar: "", nama: "loading..." }}
        className="shadow-lg"
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Warehouse Management System
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {/* Skeleton untuk Breadcrumb Path */}
                <BreadcrumbItem>
                  <Skeleton className="h-4 w-24" />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min grid-cols-12 gap-4 md:gap-6">
            {/* Skeleton untuk konten utama */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-[120px] w-full rounded-lg" />
              <Skeleton className="h-[120px] w-full rounded-lg" />
              <Skeleton className="h-[120px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full col-span-full rounded-lg" />
              <Skeleton className="h-[40px] w-full rounded-md" />
              <Skeleton className="h-[40px] w-full rounded-md" />
              <Skeleton className="h-[250px] w-full col-span-full rounded-lg" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
