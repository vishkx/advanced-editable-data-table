export interface EmployeeRow {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
  joinedAt: string; // ISO date string (YYYY-MM-DD)
}

export type EmployeeStatus = "Active" | "Inactive" | "Pending" | "On Leave";

export type ColumnKey = keyof EmployeeRow;

export type ColumnType = "text" | "number" | "select" | "date";

export type SortDirection = "asc" | "desc";

// One rule in a multi-column sort; priority is the index in the array.
export interface SortRule {
  key: ColumnKey;
  direction: SortDirection;
}

export interface ColumnDef {
  key: ColumnKey;
  header: string;
  type: ColumnType;
  width: number; // fixed px width, used by the grid layout
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "right" | "center";
  options?: readonly string[]; // for select columns
  format?: (value: EmployeeRow[ColumnKey]) => string; // read-mode display
}
