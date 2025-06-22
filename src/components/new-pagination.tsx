import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SimplePaginationProps {
  page: number;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function NewPagination({
  page,
  hasNext,
  onPrevious,
  onNext,
}: SimplePaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="flex gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPrevious();
            }}
          />
        </PaginationItem>
        <span className="text-sm mt-1">Halaman {page}</span>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasNext) onNext();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
