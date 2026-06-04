import type { ColumnDef, EmployeeRow } from "@/types/table";

// Quote fields containing commas, quotes or newlines (RFC 4180).
function escapeField(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsv(
  rows: EmployeeRow[],
  columns: readonly ColumnDef[]
): string {
  const header = columns.map((c) => escapeField(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeField(row[c.key])).join(","))
    .join("\r\n");
  return `${header}\r\n${body}`;
}

export function downloadCsv(
  rows: EmployeeRow[],
  columns: readonly ColumnDef[],
  filename = "table-export.csv"
): void {
  const csv = rowsToCsv(rows, columns);
  // BOM so Excel opens it as UTF-8.
  const blob = new Blob(["﻿" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
