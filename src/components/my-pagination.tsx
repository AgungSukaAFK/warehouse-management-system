import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PagingSize } from "@/types/enum";

interface MyPaginationProps {
  data?: any[];
  triggerPrevious?: () => void;
  triggerNext?: () => void;
  triggerPageChange?: (page: number) => void;
  currentPage?: number;
}

export function MyPagination({
  data = [],
  triggerPrevious = () => {},
  triggerNext = () => {},
  triggerPageChange = () => {},
  currentPage = 0,
}: MyPaginationProps) {
  const totalPages = Math.ceil(data.length / PagingSize);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const maxVisiblePages = 5;

  const getPageNumbersToShow = () => {
    const pages: (number | string)[] = [];
    const totalPages = Math.ceil(data.length / PagingSize);

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const showLeftEllipsis = currentPage > 3;
    const showRightEllipsis = currentPage < totalPages - 2;

    if (!showLeftEllipsis) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (!showRightEllipsis) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("ellipsis");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbersToShow = getPageNumbersToShow();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={triggerPrevious}
            href="#"
            className={hasPrevious ? "" : "pointer-events-none opacity-50"}
          />
        </PaginationItem>

        {pageNumbersToShow.map((page, index) => {
          if (typeof page === "number") {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    triggerPageChange(page);
                  }}
                  href="#"
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          } else {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
        })}

        <PaginationItem>
          <PaginationNext
            onClick={triggerNext}
            href="#"
            className={hasNext ? "" : "pointer-events-none opacity-50"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
