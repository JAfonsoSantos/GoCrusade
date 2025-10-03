import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mockBusinesses = [
  { id: "1", name: "Kevel Demo" },
  { id: "2", name: "Sonae MC" },
  { id: "3", name: "Continente" },
];

export function BusinessSwitcher() {
  const [selectedBusiness, setSelectedBusiness] = useState(mockBusinesses[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <span className="font-medium">{selectedBusiness.name}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Business</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockBusinesses.map((business) => (
          <DropdownMenuItem
            key={business.id}
            onSelect={() => setSelectedBusiness(business)}
            className="gap-2"
          >
            <Check
              className={cn(
                "h-4 w-4",
                selectedBusiness.id === business.id ? "opacity-100" : "opacity-0"
              )}
            />
            {business.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <Plus className="h-4 w-4" />
          Add Business
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
