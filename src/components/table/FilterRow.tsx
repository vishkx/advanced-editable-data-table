import { COLUMNS, GRID_TEMPLATE } from "@/data/columns";
import { useTableStore } from "@/store/useTableStore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Radix Select disallows an empty-string item value, so "All" needs a sentinel.
const ALL = "__all__";

export function FilterRow() {
  const columnFilters = useTableStore((s) => s.columnFilters);
  const setColumnFilter = useTableStore((s) => s.setColumnFilter);

  return (
    <div
      role="row"
      className="grid border-b border-border bg-background"
      style={{ gridTemplateColumns: GRID_TEMPLATE }}
    >
      {COLUMNS.map((col) => (
        <div key={col.key} className="px-2 py-1.5">
          {col.filterable ? (
            col.type === "select" && col.options ? (
              <Select
                value={columnFilters[col.key] || ALL}
                onValueChange={(v) =>
                  setColumnFilter(col.key, v === ALL ? "" : v)
                }
              >
                <SelectTrigger
                  size="sm"
                  className="w-full text-xs"
                  aria-label={`Filter by ${col.header}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value={ALL}>All</SelectItem>
                  {col.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                aria-label={`Search ${col.header}`}
                value={columnFilters[col.key] ?? ""}
                onChange={(e) => setColumnFilter(col.key, e.target.value)}
                placeholder={
                  col.type === "number"
                    ? ">100"
                    : col.type === "date"
                      ? "e.g. 2024"
                      : `Search ${col.header.toLowerCase()}…`
                }
                className="h-7 text-xs"
              />
            )
          ) : null}
        </div>
      ))}
      <div className="px-2 py-1.5" />
    </div>
  );
}
