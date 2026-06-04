import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { COLUMNS, GRID_TEMPLATE } from "@/data/columns";
import { useTableStore } from "@/store/useTableStore";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/types/table";

function SortIcon({
  direction,
  priority,
}: {
  direction: SortDirection | undefined;
  priority: number | undefined;
}) {
  if (!direction) {
    return (
      <ChevronsUpDown className="size-3.5 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-foreground">
      {direction === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : (
        <ArrowDown className="size-3.5" />
      )}
      {priority !== undefined && priority >= 0 && (
        <span className="text-[10px] font-bold tabular-nums">
          {priority + 1}
        </span>
      )}
    </span>
  );
}

export function TableHeader() {
  const sorting = useTableStore((s) => s.sorting);
  const toggleSort = useTableStore((s) => s.toggleSort);

  return (
    <div
      role="row"
      className="grid border-b border-border bg-muted"
      style={{ gridTemplateColumns: GRID_TEMPLATE }}
    >
      {COLUMNS.map((col) => {
        const ruleIndex = sorting.findIndex((r) => r.key === col.key);
        const rule = ruleIndex >= 0 ? sorting[ruleIndex] : undefined;
        const ariaSort = rule
          ? rule.direction === "asc"
            ? "ascending"
            : "descending"
          : "none";

        return (
          <div
            key={col.key}
            role="columnheader"
            aria-sort={ariaSort}
            className={cn(
              "flex h-10 items-center px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
              col.align === "right" && "justify-end",
              col.align === "center" && "justify-center"
            )}
          >
            {col.sortable ? (
              <button
                type="button"
                onClick={() => toggleSort(col.key)}
                className="group inline-flex items-center gap-1.5 rounded transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                title={`Sort by ${col.header}`}
              >
                <span>{col.header}</span>
                <SortIcon
                  direction={rule?.direction}
                  priority={sorting.length > 1 ? ruleIndex : undefined}
                />
              </button>
            ) : (
              <span>{col.header}</span>
            )}
          </div>
        );
      })}

      <div
        role="columnheader"
        className="flex h-10 items-center justify-end px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        Actions
      </div>
    </div>
  );
}
