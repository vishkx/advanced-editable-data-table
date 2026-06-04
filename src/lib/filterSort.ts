import type { ColumnDef, EmployeeRow, SortRule } from "@/types/table";

type NumericRanges = Record<string, { min: string; max: string }>;

// Text/date columns filter by substring; numeric columns by min/max range.
// Then apply the global search and the multi-column sort.
export function filterAndSort(
  rows: EmployeeRow[],
  columns: readonly ColumnDef[],
  columnFilters: Record<string, string>,
  numericFilters: NumericRanges,
  globalFilter: string,
  sorting: SortRule[]
): EmployeeRow[] {
  const global = globalFilter.trim().toLowerCase();

  const predicates: Array<(row: EmployeeRow) => boolean> = [];

  for (const col of columns) {
    if (col.type === "number") {
      const range = numericFilters[col.key];
      if (!range) continue;
      const min = range.min.trim() === "" ? null : Number(range.min);
      const max = range.max.trim() === "" ? null : Number(range.max);
      const hasMin = min !== null && !Number.isNaN(min);
      const hasMax = max !== null && !Number.isNaN(max);
      if (!hasMin && !hasMax) continue;
      predicates.push((row) => {
        const v = row[col.key] as number;
        if (hasMin && v < min!) return false;
        if (hasMax && v > max!) return false;
        return true;
      });
    } else {
      const raw = columnFilters[col.key]?.trim().toLowerCase();
      if (!raw) continue;
      predicates.push((row) =>
        String(row[col.key]).toLowerCase().includes(raw)
      );
    }
  }

  const textKeys = columns
    .filter((c) => c.type !== "number")
    .map((c) => c.key);

  let result = rows;

  if (predicates.length || global) {
    result = rows.filter((row) => {
      for (const p of predicates) if (!p(row)) return false;
      if (global) {
        const hit = textKeys.some((k) =>
          String(row[k]).toLowerCase().includes(global)
        );
        if (!hit) return false;
      }
      return true;
    });
  }

  if (sorting.length) {
    // Copy before sorting so we don't mutate the store's array.
    result = result.slice().sort((a, b) => {
      for (const rule of sorting) {
        const av = a[rule.key];
        const bv = b[rule.key];
        let cmp: number;
        if (typeof av === "number" && typeof bv === "number") {
          cmp = av - bv;
        } else {
          cmp = String(av).localeCompare(String(bv), undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        if (cmp !== 0) return rule.direction === "asc" ? cmp : -cmp;
      }
      return 0;
    });
  }

  return result;
}
