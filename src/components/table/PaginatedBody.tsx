import type { EmployeeRow } from "@/types/table";
import { useTableStore } from "@/store/useTableStore";
import { TableRow } from "./TableRow";
import { ROW_HEIGHT } from "./constants";
import { EmptyState } from "./EmptyState";

export function PaginatedBody({ rows }: { rows: EmployeeRow[] }) {
  const page = useTableStore((s) => s.page);
  const pageSize = useTableStore((s) => s.pageSize);

  if (rows.length === 0) return <EmptyState />;

  const start = page * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <div role="rowgroup">
      {pageRows.map((row, i) => (
        <TableRow
          key={row.id}
          row={row}
          zebra={(start + i) % 2 === 1}
          style={{ position: "relative", width: "100%", height: ROW_HEIGHT }}
        />
      ))}
    </div>
  );
}
