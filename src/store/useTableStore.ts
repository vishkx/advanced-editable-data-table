import { create } from "zustand";
import type {
  ColumnKey,
  EmployeeRow,
  SortDirection,
  SortRule,
} from "@/types/table";
import { generateEmployees } from "@/data/generateEmployees";

export type ViewMode = "virtual" | "pagination";

interface TableState {
  rows: EmployeeRow[];
  rowIndex: Record<number, number>; // id -> index in rows, for O(1) lookups

  drafts: Record<number, EmployeeRow>; // id -> working copy while editing
  undo: Record<number, EmployeeRow[]>; // id -> stack of previous saved values

  sorting: SortRule[]; // array order is the sort priority
  columnFilters: Record<string, string>;
  globalFilter: string;

  view: ViewMode;
  page: number; // zero-based
  pageSize: number;

  startEdit: (id: number) => void;
  updateDraft: (id: number, key: ColumnKey, value: string | number) => void;
  saveRow: (id: number) => void;
  saveAll: () => void;
  cancelEdit: (id: number) => void;
  cancelAll: () => void;
  undoRow: (id: number) => void;

  toggleSort: (key: ColumnKey) => void;
  clearSort: () => void;
  setColumnFilter: (key: ColumnKey, value: string) => void;
  setGlobalFilter: (value: string) => void;
  clearFilters: () => void;

  setView: (view: ViewMode) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

function buildIndex(rows: EmployeeRow[]): Record<number, number> {
  const idx: Record<number, number> = {};
  for (let i = 0; i < rows.length; i++) idx[rows[i].id] = i;
  return idx;
}

function nextDirection(
  dir: SortDirection | undefined
): SortDirection | undefined {
  return dir === undefined ? "asc" : dir === "asc" ? "desc" : undefined;
}

const initialRows = generateEmployees(10_000);

export const useTableStore = create<TableState>((set, get) => ({
  rows: initialRows,
  rowIndex: buildIndex(initialRows),

  drafts: {},
  undo: {},

  sorting: [],
  columnFilters: {},
  globalFilter: "",

  view: "virtual",
  page: 0,
  pageSize: 50,

  startEdit: (id) =>
    set((s) => {
      if (s.drafts[id]) return s; // already editing
      const row = s.rows[s.rowIndex[id]];
      return { drafts: { ...s.drafts, [id]: { ...row } } };
    }),

  updateDraft: (id, key, value) =>
    set((s) => {
      const draft = s.drafts[id];
      if (!draft) return s;
      return { drafts: { ...s.drafts, [id]: { ...draft, [key]: value } } };
    }),

  saveRow: (id) =>
    set((s) => {
      const draft = s.drafts[id];
      if (!draft) return s;
      const index = s.rowIndex[id];
      const previous = s.rows[index];

      const rows = s.rows.slice();
      rows[index] = draft;

      const drafts = { ...s.drafts };
      delete drafts[id];

      // Only push an undo entry if something actually changed.
      const changed = (Object.keys(draft) as ColumnKey[]).some(
        (k) => draft[k] !== previous[k]
      );
      const undo = changed
        ? { ...s.undo, [id]: [...(s.undo[id] ?? []), previous] }
        : s.undo;

      return { rows, drafts, undo };
    }),

  saveAll: () => {
    const ids = Object.keys(get().drafts).map(Number);
    ids.forEach((id) => get().saveRow(id));
  },

  cancelEdit: (id) =>
    set((s) => {
      if (!s.drafts[id]) return s;
      const drafts = { ...s.drafts };
      delete drafts[id];
      return { drafts };
    }),

  cancelAll: () => set({ drafts: {} }),

  undoRow: (id) =>
    set((s) => {
      const stack = s.undo[id];
      if (!stack || stack.length === 0) return s;

      const nextStack = stack.slice();
      const previous = nextStack.pop()!;
      const index = s.rowIndex[id];

      const rows = s.rows.slice();
      rows[index] = previous;

      const undo = { ...s.undo };
      if (nextStack.length) undo[id] = nextStack;
      else delete undo[id];

      // Undo also closes the editor for that row if it was open.
      const drafts = { ...s.drafts };
      delete drafts[id];

      return { rows, undo, drafts };
    }),

  toggleSort: (key) =>
    set((s) => {
      const existing = s.sorting.find((r) => r.key === key);
      const dir = nextDirection(existing?.direction);
      const without = s.sorting.filter((r) => r.key !== key);
      if (!dir) return { sorting: without };
      // Most recently clicked column sorts first.
      return { sorting: [{ key, direction: dir }, ...without] };
    }),

  clearSort: () => set({ sorting: [] }),

  setColumnFilter: (key, value) =>
    set((s) => ({
      columnFilters: { ...s.columnFilters, [key]: value },
      page: 0,
    })),

  setGlobalFilter: (value) => set({ globalFilter: value, page: 0 }),

  clearFilters: () => set({ columnFilters: {}, globalFilter: "", page: 0 }),

  setView: (view) => set({ view }),
  setPage: (page) => set({ page }),
  setPageSize: (size) => set({ pageSize: size, page: 0 }),
}));
