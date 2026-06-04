# Editable Data Table

An inline-editable data table that handles 10,000 rows with virtual scrolling,
multi-column sorting, filtering, per-row undo and CSV export.

## Stack

React 19 + TypeScript, Vite, Tailwind v4 with shadcn/ui components, Zustand for
state, and `@tanstack/react-virtual` for the virtualized list.

## Running it

This uses Bun, but npm works too (swap `bun` for `npm`).

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # type-check + production build
bun run preview
```

## What it does

- Inline editing of text, number and select cells. Click Edit on a row (or
  double-click a cell) to enter edit mode, then Save / Cancel. Enter saves and
  Esc cancels in text/number fields.
- Per-row Undo that steps back through previously saved values.
- 10,000 rows rendered with virtual scrolling, so the DOM only holds the rows in
  view. There's a Pages toggle for classic pagination as well.
- Multi-column sorting. Clicking a header cycles ascending, descending, off. When
  more than one column is sorted, a small number on each header shows its priority.
- Per-column filters plus a global search box. Number columns understand
  operators like `>100`, `<50`, `=42` and ranges like `50-90`. There's a button
  to clear filters and sorting.
- Export the current (filtered + sorted) view to CSV.
- A warning before leaving the page while a row is mid-edit, with a count of
  unsaved rows and bulk Save all / Discard.

## Notes on the approach

**State (Zustand).** The data, edit drafts, undo stacks, sort, filters and view
mode all live in one Zustand store. The reason I didn't use Context is
re-renders: with Context every consumer re-renders on any change, which is rough
with 10k rows. With Zustand each row subscribes only to its own draft/undo slice,
so editing one row doesn't touch the others. The filtered/sorted list is computed
once in a memoized selector and the virtualizer slices it.

**Virtualization.** Rows have a fixed height, which keeps the math simple and
stops the list from jumping when a row switches to inputs. The header and filter
row are sticky inside the same scroll container; the virtualizer's `scrollMargin`
is set to the header height so row offsets line up.

**Columns are config-driven.** `src/data/columns.ts` is the single place that
defines each column (type, width, editable/sortable/filterable, formatter). The
header, cells, sorting and filtering all read from it, so adding a column is a
one-line change.

## Project layout

```
src/
  components/
    ui/            shadcn primitives (button, input, select, badge)
    table/         DataTable + Toolbar, TableHeader, FilterRow, rows, cells, pagination
  store/           Zustand store
  hooks/           processed-rows selector, unsaved-changes guard
  lib/             filter/sort, csv, cn helper
  data/            column config, sample-data generator
  types/           shared types
```

## Limitations

- Fixed row height means long values are truncated rather than wrapped.
- No backend. Saving updates in-memory state; a hard refresh regenerates the
  sample data. Hooking Save up to an API would be the next step.
- The leave-page warning uses the browser's native dialog, so the message text
  can't be customized.
- Filtering is substring/operator based, not fuzzy.

## Sample data

The 10,000 rows are generated client-side from a seeded RNG (so reloads are
stable). Change the count in `src/store/useTableStore.ts`.
