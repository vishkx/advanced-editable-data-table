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
  const numericFilters = useTableStore((s) => s.numericFilters);
  const setNumericFilter = useTableStore((s) => s.setNumericFilter);

  return (
    <div
      role="row"
      className="grid border-b border-border bg-background"
      style={{ gridTemplateColumns: GRID_TEMPLATE }}
    >
      {COLUMNS.map((col) => (
        <div key={col.key} className="px-2 py-1.5">
          {!col.filterable ? null : col.type === "select" && col.options ? (
            <Select
              value={columnFilters[col.key] || ALL}
              onValueChange={(v) => setColumnFilter(col.key, v === ALL ? "" : v)}
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
          ) : col.type === "number" ? (
            <div className="flex items-center gap-1">
              <Input
                aria-label={`Minimum ${col.header}`}
                inputMode="numeric"
                value={numericFilters[col.key]?.min ?? ""}
                onChange={(e) =>
                  setNumericFilter(col.key, "min", e.target.value)
                }
                placeholder="Min"
                className="h-7 px-2 text-right text-xs"
              />
              <span className="text-xs text-muted-foreground">–</span>
              <Input
                aria-label={`Maximum ${col.header}`}
                inputMode="numeric"
                value={numericFilters[col.key]?.max ?? ""}
                onChange={(e) =>
                  setNumericFilter(col.key, "max", e.target.value)
                }
                placeholder="Max"
                className="h-7 px-2 text-right text-xs"
              />
            </div>
          ) : (
            <Input
              aria-label={`Search ${col.header}`}
              value={columnFilters[col.key] ?? ""}
              onChange={(e) => setColumnFilter(col.key, e.target.value)}
              placeholder={
                col.type === "date"
                  ? "e.g. 2024"
                  : `Search ${col.header.toLowerCase()}…`
              }
              className="h-7 text-xs"
            />
          )}
        </div>
      ))}
      <div className="px-2 py-1.5" />
    </div>
  );
}
