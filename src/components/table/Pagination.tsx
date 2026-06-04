import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTableStore } from "@/store/useTableStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZES = [25, 50, 100, 200];

export function Pagination({ total }: { total: number }) {
  const page = useTableStore((s) => s.page);
  const pageSize = useTableStore((s) => s.pageSize);
  const setPage = useTableStore((s) => s.setPage);
  const setPageSize = useTableStore((s) => s.setPageSize);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount - 1);
  const from = total === 0 ? 0 : current * pageSize + 1;
  const to = Math.min(total, (current + 1) * pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>Rows per page</span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => setPageSize(Number(v))}
        >
          <SelectTrigger size="sm" className="w-[72px]" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {PAGE_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-muted-foreground tabular-nums">
        {from.toLocaleString()}–{to.toLocaleString()} of {total.toLocaleString()}
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-2 text-muted-foreground tabular-nums">
          Page {current + 1} of {pageCount.toLocaleString()}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setPage(0)}
          disabled={current === 0}
          aria-label="First page"
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setPage(current - 1)}
          disabled={current === 0}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setPage(current + 1)}
          disabled={current >= pageCount - 1}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setPage(pageCount - 1)}
          disabled={current >= pageCount - 1}
          aria-label="Last page"
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
