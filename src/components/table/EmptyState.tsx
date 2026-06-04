import { SearchX } from "lucide-react";
import { useTableStore } from "@/store/useTableStore";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  const clearFilters = useTableStore((s) => s.clearFilters);
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="rounded-full bg-muted p-3 text-muted-foreground">
        <SearchX className="size-6" />
      </div>
      <div>
        <p className="font-medium">No rows match your filters</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or clearing the active filters.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={clearFilters}>
        Clear filters
      </Button>
    </div>
  );
}
