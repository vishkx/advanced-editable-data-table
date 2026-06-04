import { memo } from "react";
import type { ColumnDef, EmployeeRow, EmployeeStatus } from "@/types/table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusPill } from "./StatusPill";

interface EditableCellProps {
  column: ColumnDef;
  row: EmployeeRow;
  draftValue: string | number | undefined;
  editing: boolean;
  onChange: (value: string | number) => void;
  onCommit: () => void;
  onCancel: () => void;
  onRequestEdit: () => void; // double-click a cell to start editing
}

function CellInner({
  column,
  row,
  draftValue,
  editing,
  onChange,
  onCommit,
  onCancel,
  onRequestEdit,
}: EditableCellProps) {
  const alignClass =
    column.align === "right"
      ? "justify-end text-right"
      : column.align === "center"
        ? "justify-center text-center"
        : "justify-start text-left";

  if (editing && column.editable) {
    const value = draftValue ?? row[column.key];

    if (column.type === "select" && column.options) {
      return (
        <div className="flex h-full w-full items-center px-2">
          <Select value={String(value)} onValueChange={onChange}>
            <SelectTrigger size="sm" className="w-full" aria-label={column.header}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {column.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div className="flex h-full w-full items-center px-2">
        <Input
          aria-label={column.header}
          type={column.type === "number" ? "number" : "text"}
          value={String(value)}
          autoFocus={column.key === "name"}
          onChange={(e) =>
            onChange(
              column.type === "number"
                ? e.target.value === ""
                  ? 0
                  : Number(e.target.value)
                : e.target.value
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommit();
            else if (e.key === "Escape") onCancel();
          }}
          className={cn("h-7 text-sm", column.align === "right" && "text-right")}
        />
      </div>
    );
  }

  const raw = row[column.key];
  const display = column.format ? column.format(raw) : String(raw);

  return (
    <div
      className={cn(
        "flex h-full w-full items-center gap-2 truncate px-3 text-sm",
        alignClass,
        column.editable && "cursor-text"
      )}
      title={column.editable ? "Double-click to edit" : undefined}
      onDoubleClick={column.editable ? onRequestEdit : undefined}
    >
      {column.key === "status" ? (
        <StatusPill status={raw as EmployeeStatus} />
      ) : (
        <span
          className={cn(
            "truncate",
            (column.type === "number" || column.key === "id") && "tabular-nums",
            column.key === "id" && "text-muted-foreground"
          )}
        >
          {display}
        </span>
      )}
    </div>
  );
}

export const EditableCell = memo(CellInner);
