import { useMemo } from "react";
import {
  Search,
  X,
  Download,
  Rows3,
  LayoutList,
  Save,
  Undo2,
  TriangleAlert,
} from "lucide-react";
import type { EmployeeRow } from "@/types/table";
import { useTableStore } from "@/store/useTableStore";
import { COLUMNS } from "@/data/columns";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ToolbarProps {
  rows: EmployeeRow[]; // current filtered + sorted view, used for export + counts
  totalRows: number;
}

export function Toolbar({ rows, totalRows }: ToolbarProps) {
  const globalFilter = useTableStore((s) => s.globalFilter);
  const setGlobalFilter = useTableStore((s) => s.setGlobalFilter);
  const columnFilters = useTableStore((s) => s.columnFilters);
  const numericFilters = useTableStore((s) => s.numericFilters);
  const sorting = useTableStore((s) => s.sorting);
  const clearFilters = useTableStore((s) => s.clearFilters);
  const clearSort = useTableStore((s) => s.clearSort);
  const view = useTableStore((s) => s.view);
  const setView = useTableStore((s) => s.setView);
  const drafts = useTableStore((s) => s.drafts);
  const saveAll = useTableStore((s) => s.saveAll);
  const cancelAll = useTableStore((s) => s.cancelAll);

  const activeFilterCount = useMemo(
    () =>
      Object.values(columnFilters).filter((v) => v && v.trim()).length +
      Object.values(numericFilters).filter((r) => r.min.trim() || r.max.trim())
        .length +
      (globalFilter.trim() ? 1 : 0),
    [columnFilters, numericFilters, globalFilter]
  );

  const unsavedCount = Object.keys(drafts).length;
  const hasView = activeFilterCount > 0 || sorting.length > 0;

  return (
    <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: search + filter status */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search name, email, department…"
            className="pl-8"
            aria-label="Global search"
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {hasView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearFilters();
              clearSort();
            }}
            className="text-muted-foreground"
          >
            <X /> Clear filters &amp; sort
          </Button>
        )}

        <span className="text-sm text-muted-foreground tabular-nums">
          {rows.length.toLocaleString()}
          {rows.length !== totalRows && <> of {totalRows.toLocaleString()}</>}{" "}
          rows
        </span>
      </div>

      {/* Right: unsaved, view toggle, export */}
      <div className="flex flex-wrap items-center gap-2">
        {unsavedCount > 0 && (
          <div className="flex animate-in fade-in items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-1">
            <Badge variant="warning">
              <TriangleAlert className="size-3" />
              {unsavedCount} unsaved
            </Badge>
            <Button size="xs" onClick={saveAll}>
              <Save /> Save all
            </Button>
            <Button size="xs" variant="ghost" onClick={cancelAll}>
              <Undo2 /> Discard
            </Button>
          </div>
        )}

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-input bg-background p-0.5">
          <button
            onClick={() => setView("virtual")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              view === "virtual"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={view === "virtual"}
          >
            <Rows3 className="size-3.5" /> Virtual
          </button>
          <button
            onClick={() => setView("pagination")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              view === "pagination"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={view === "pagination"}
          >
            <LayoutList className="size-3.5" /> Pages
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            downloadCsv(rows, COLUMNS, `employees-${rows.length}.csv`)
          }
        >
          <Download /> Export CSV
        </Button>
      </div>
    </div>
  );
}
