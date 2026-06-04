import { useMemo } from "react";
import { useTableStore } from "@/store/useTableStore";
import { COLUMNS } from "@/data/columns";
import { filterAndSort } from "@/lib/filterSort";
import type { EmployeeRow } from "@/types/table";

// Filtered + sorted rows, memoized so the full pass only re-runs when the
// data, filters or sort actually change (not while editing a cell).
export function useProcessedRows(): EmployeeRow[] {
  const rows = useTableStore((s) => s.rows);
  const columnFilters = useTableStore((s) => s.columnFilters);
  const numericFilters = useTableStore((s) => s.numericFilters);
  const globalFilter = useTableStore((s) => s.globalFilter);
  const sorting = useTableStore((s) => s.sorting);

  return useMemo(
    () =>
      filterAndSort(
        rows,
        COLUMNS,
        columnFilters,
        numericFilters,
        globalFilter,
        sorting
      ),
    [rows, columnFilters, numericFilters, globalFilter, sorting]
  );
}
