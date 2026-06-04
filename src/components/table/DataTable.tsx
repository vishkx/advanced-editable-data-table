import { useRef } from "react";
import { useProcessedRows } from "@/hooks/useProcessedRows";
import { useUnsavedChangesPrompt } from "@/hooks/useUnsavedChangesPrompt";
import { useTableStore } from "@/store/useTableStore";
import { TOTAL_WIDTH } from "@/data/columns";
import { VIEWPORT_HEIGHT } from "./constants";
import { Toolbar } from "./Toolbar";
import { TableHeader } from "./TableHeader";
import { FilterRow } from "./FilterRow";
import { VirtualBody } from "./VirtualBody";
import { PaginatedBody } from "./PaginatedBody";
import { Pagination } from "./Pagination";

export function DataTable() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rows = useProcessedRows();
  const totalRows = useTableStore((s) => s.rows.length);
  const view = useTableStore((s) => s.view);
  const hasUnsaved = useTableStore((s) => Object.keys(s.drafts).length > 0);

  useUnsavedChangesPrompt(hasUnsaved);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Toolbar rows={rows} totalRows={totalRows} />

      <div
        ref={scrollRef}
        className="scrollbar-slim overflow-auto"
        style={{ height: VIEWPORT_HEIGHT }}
      >
        {/* Full grid width so header and rows scroll together horizontally.
            position:relative makes this the offsetParent for the virtual list. */}
        <div style={{ width: TOTAL_WIDTH, minWidth: "100%", position: "relative" }}>
          <div className="sticky top-0 z-20 bg-background shadow-sm">
            <TableHeader />
            <FilterRow />
          </div>

          {view === "virtual" ? (
            <VirtualBody rows={rows} scrollRef={scrollRef} />
          ) : (
            <PaginatedBody rows={rows} />
          )}
        </div>
      </div>

      {view === "pagination" && <Pagination total={rows.length} />}
    </div>
  );
}
