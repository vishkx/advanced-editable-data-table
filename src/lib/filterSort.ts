import type { ColumnDef, EmployeeRow, SortRule } from "@/types/table";

// Builds a predicate for a numeric filter expression: >100, >=100, <100, <=100,
// =100, or a range like 100-200. Anything else falls back to a substring match.
function makeNumericPredicate(
  raw: string
): ((value: number) => boolean) | null {
  const expr = raw.trim();
  if (!expr) return null;

  const range = expr.match(/^(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)$/);
  if (range) {
    const lo = parseFloat(range[1]);
    const hi = parseFloat(range[2]);
    return (v) => v >= Math.min(lo, hi) && v <= Math.max(lo, hi);
  }

  const op = expr.match(/^(>=|<=|>|<|=)\s*(-?\d+(?:\.\d+)?)$/);
  if (op) {
    const n = parseFloat(op[2]);
    switch (op[1]) {
      case ">":
        return (v) => v > n;
      case ">=":
        return (v) => v >= n;
      case "<":
        return (v) => v < n;
      case "<=":
        return (v) => v <= n;
      case "=":
        return (v) => v === n;
    }
  }

  return (v) => String(v).includes(expr);
}

export function filterAndSort(
  rows: EmployeeRow[],
  columns: readonly ColumnDef[],
  columnFilters: Record<string, string>,
  globalFilter: string,
  sorting: SortRule[]
): EmployeeRow[] {
  const global = globalFilter.trim().toLowerCase();

  const predicates: Array<(row: EmployeeRow) => boolean> = [];

  for (const col of columns) {
    const raw = columnFilters[col.key];
    if (!raw || !raw.trim()) continue;

    if (col.type === "number") {
      const num = makeNumericPredicate(raw);
      if (num) predicates.push((row) => num(row[col.key] as number));
    } else {
      const needle = raw.trim().toLowerCase();
      predicates.push((row) =>
        String(row[col.key]).toLowerCase().includes(needle)
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
