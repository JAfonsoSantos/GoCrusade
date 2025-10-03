import { Check, ChevronsUpDown } from "lucide-react";
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

const mockProperties = [
  { id: "1", name: "continente.pt" },
  { id: "2", name: "wells.pt" },
  { id: "3", name: "zu.pt" },
];

export function PropertySwitcher() {
  const [selectedProperty, setSelectedProperty] = useState(mockProperties[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="text-muted-foreground">{selectedProperty.name}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Property</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockProperties.map((property) => (
          <DropdownMenuItem
            key={property.id}
            onSelect={() => setSelectedProperty(property)}
            className="gap-2"
          >
            <Check
              className={cn(
                "h-4 w-4",
                selectedProperty.id === property.id ? "opacity-100" : "opacity-0"
              )}
            />
            {property.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
