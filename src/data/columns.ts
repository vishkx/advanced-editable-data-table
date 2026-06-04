import type { ColumnDef } from "@/types/table";
import { DEPARTMENT_OPTIONS, STATUSES } from "./generateEmployees";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Column config. Header, cells, sorting and filtering all read from this.
export const COLUMNS: readonly ColumnDef[] = [
  {
    key: "id",
    header: "ID",
    type: "number",
    width: 80,
    editable: false,
    sortable: true,
    filterable: true,
    align: "right",
    format: (v) => `#${v}`,
  },
  {
    key: "name",
    header: "Name",
    type: "text",
    width: 180,
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    key: "email",
    header: "Email",
    type: "text",
    width: 240,
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    key: "department",
    header: "Department",
    type: "select",
    width: 170,
    editable: true,
    sortable: true,
    filterable: true,
    options: DEPARTMENT_OPTIONS,
  },
  {
    key: "salary",
    header: "Salary",
    type: "number",
    width: 140,
    editable: true,
    sortable: true,
    filterable: true,
    align: "right",
    format: (v) => currency.format(Number(v)),
    filterPlaceholder: ">120000",
  },
  {
    key: "status",
    header: "Status",
    type: "select",
    width: 150,
    editable: true,
    sortable: true,
    filterable: true,
    options: STATUSES,
  },
  {
    key: "joinedAt",
    header: "Joined",
    type: "date",
    width: 140,
    editable: false,
    sortable: true,
    filterable: true,
  },
];

export const ACTIONS_WIDTH = 150;

export const TOTAL_WIDTH =
  COLUMNS.reduce((sum, c) => sum + c.width, 0) + ACTIONS_WIDTH;

// Shared grid-template-columns for the header and every row, so columns line up.
export const GRID_TEMPLATE =
  COLUMNS.map((c) => `${c.width}px`).join(" ") + ` ${ACTIONS_WIDTH}px`;
