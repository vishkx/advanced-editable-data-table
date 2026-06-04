import { Table2, Keyboard } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import { useTableStore } from "@/store/useTableStore";

function HeaderBar() {
  const total = useTableStore((s) => s.rows.length);
  return (
    <header className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Table2 className="size-5" />
      </div>
      <h1 className="text-lg font-semibold tracking-tight">
        Editable Data Table
      </h1>
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {total.toLocaleString()} rows · inline editing · virtual scrolling ·
        sort · filter · CSV export
      </span>
    </header>
  );
}

function Tips() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        <Keyboard className="size-3.5" /> Tips
      </span>
      <span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
          Double-click
        </kbd>{" "}
        a cell to edit
      </span>
      <span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
          Enter
        </kbd>{" "}
        to save
      </span>
      <span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
          Esc
        </kbd>{" "}
        to cancel
      </span>
      <span>Click a header to sort · again to flip · third clears</span>
      <span>
        Numeric filters accept <code>&gt;100</code>, <code>&lt;50</code>,{" "}
        <code>50-90</code>
      </span>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <HeaderBar />
        <DataTable />
        <Tips />
      </div>
    </div>
  );
}
