import { memo } from "react";
import type { CSSProperties } from "react";
import { Pencil, Check, X, Undo2 } from "lucide-react";
import type { EmployeeRow } from "@/types/table";
import { COLUMNS, GRID_TEMPLATE } from "@/data/columns";
import { useTableStore } from "@/store/useTableStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditableCell } from "./EditableCell";

interface TableRowProps {
  row: EmployeeRow;
  style?: CSSProperties; // absolute positioning from the virtualizer
  zebra?: boolean;
}

function RowInner({ row, style, zebra }: TableRowProps) {
  const id = row.id;

  // Only this row's edit state. Editing one row won't re-render the others.
  const draft = useTableStore((s) => s.drafts[id]);
  const canUndo = useTableStore((s) => (s.undo[id]?.length ?? 0) > 0);

  const startEdit = useTableStore((s) => s.startEdit);
  const updateDraft = useTableStore((s) => s.updateDraft);
  const saveRow = useTableStore((s) => s.saveRow);
  const cancelEdit = useTableStore((s) => s.cancelEdit);
  const undoRow = useTableStore((s) => s.undoRow);

  const editing = Boolean(draft);

  return (
    <div
      role="row"
      id={`row-${id}`}
      data-row-id={id}
      style={{ ...style, gridTemplateColumns: GRID_TEMPLATE }}
      className={cn(
        "grid w-full items-center border-b border-border text-sm",
        editing
          ? "bg-accent/60 ring-1 ring-inset ring-ring/40"
          : zebra
            ? "bg-muted/40 hover:bg-accent/40"
            : "bg-background hover:bg-accent/40"
      )}
    >
      {COLUMNS.map((col) => (
        <div role="cell" key={col.key} className="h-full overflow-hidden">
          <EditableCell
            column={col}
            row={row}
            editing={editing}
            draftValue={draft ? (draft[col.key] as string | number) : undefined}
            onChange={(value) => updateDraft(id, col.key, value)}
            onCommit={() => saveRow(id)}
            onCancel={() => cancelEdit(id)}
            onRequestEdit={() => startEdit(id)}
          />
        </div>
      ))}

      {/* Actions */}
      <div role="cell" className="flex items-center justify-end gap-1 px-2">
        {editing ? (
          <>
            <Button size="xs" onClick={() => saveRow(id)} aria-label="Save row">
              <Check /> Save
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => cancelEdit(id)}
              aria-label="Cancel edit"
            >
              <X />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="xs"
              variant="outline"
              onClick={() => startEdit(id)}
              aria-label="Edit row"
            >
              <Pencil /> Edit
            </Button>
            {canUndo && (
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => undoRow(id)}
                aria-label="Undo last saved change"
                title="Undo last saved change"
              >
                <Undo2 />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Re-render only when the row data, position or zebra flag changes. Edit state
// comes from the store selectors, so it doesn't need to be compared here.
export const TableRow = memo(RowInner, (prev, next) => {
  return (
    prev.row === next.row &&
    prev.zebra === next.zebra &&
    prev.style?.transform === next.style?.transform &&
    prev.style?.height === next.style?.height
  );
});
