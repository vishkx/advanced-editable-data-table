import { Badge } from "@/components/ui/badge";
import type { EmployeeStatus } from "@/types/table";
import type { ComponentProps } from "react";

type BadgeVariant = ComponentProps<typeof Badge>["variant"];

const VARIANT: Record<EmployeeStatus, BadgeVariant> = {
  Active: "success",
  Inactive: "destructive",
  Pending: "warning",
  "On Leave": "neutral",
};

export function StatusPill({ status }: { status: EmployeeStatus }) {
  return (
    <Badge variant={VARIANT[status]}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </Badge>
  );
}
