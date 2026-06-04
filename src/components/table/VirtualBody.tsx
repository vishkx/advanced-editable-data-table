import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { EmployeeRow } from "@/types/table";
import { TableRow } from "./TableRow";
import { ROW_HEIGHT } from "./constants";
import { EmptyState } from "./EmptyState";

interface VirtualBodyProps {
  rows: EmployeeRow[];
  scrollRef: RefObject<HTMLDivElement | null>;
}

// Renders only the rows near the viewport. scrollMargin offsets the list by
// the sticky header height, since the header lives in the same scroll container.
export function VirtualBody({ rows, scrollRef }: VirtualBodyProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    if (listRef.current) setScrollMargin(listRef.current.offsetTop);
  }, []);

  // eslint-disable-next-line react-hooks/incompatible-library -- useVirtualizer isn't React-Compiler memoizable
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
    scrollMargin,
  });

  if (rows.length === 0) return <EmptyState />;

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={listRef}
      role="rowgroup"
      style={{
        height: virtualizer.getTotalSize(),
        width: "100%",
        position: "relative",
      }}
    >
      {items.map((vi) => {
        const row = rows[vi.index];
        return (
          <TableRow
            key={row.id}
            row={row}
            zebra={vi.index % 2 === 1}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: ROW_HEIGHT,
              transform: `translateY(${vi.start - scrollMargin}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
