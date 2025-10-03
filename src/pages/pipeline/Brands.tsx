import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useDemoStore } from "@/demo/DemoProvider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Brand } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Brands() {
  const { brands, advertisers, addBrand, updateBrand, business } = useDemoStore();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    advertiser_id: "",
  });

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNew = () => {
    setEditingBrand(null);
    setFormData({ name: "", advertiser_id: "" });
    setDrawerOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      advertiser_id: brand.advertiser_id,
    });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Brand name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.advertiser_id) {
      toast({
        title: "Validation Error",
        description: "Please select an advertiser",
        variant: "destructive",
      });
      return;
    }

    if (editingBrand) {
      updateBrand(editingBrand.id, formData);
      toast({
        title: "Brand Updated",
        description: `${formData.name} has been updated`,
      });
    } else {
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        business_id: business.id,
        name: formData.name,
        advertiser_id: formData.advertiser_id,
      };
      addBrand(newBrand);
      toast({
        title: "Brand Created",
        description: `${formData.name} has been added`,
      });
    }

    setDrawerOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (brandToDelete) {
      toast({
        title: "Brand Deleted",
        description: "Brand has been removed",
      });
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">Manage brand catalog</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Brand
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Brands ({brands.length})</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Advertiser (Parent)</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No brands found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => {
                  const advertiser = advertisers.find((a) => a.id === brand.advertiser_id);

                  return (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {advertiser?.name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(brand)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setBrandToDelete(brand.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingBrand ? "Edit Brand" : "New Brand"}</SheetTitle>
            <SheetDescription>
              {editingBrand ? "Update brand details" : "Create a new brand under an advertiser"}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Dove"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advertiser">Advertiser (Parent) *</Label>
              <Select
                value={formData.advertiser_id}
                onValueChange={(v) => setFormData({ ...formData, advertiser_id: v })}
              >
                <SelectTrigger id="advertiser">
                  <SelectValue placeholder="Select advertiser" />
                </SelectTrigger>
                <SelectContent>
                  {advertisers.map((adv) => (
                    <SelectItem key={adv.id} value={adv.id}>
                      {adv.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setDrawerOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {editingBrand ? "Save Changes" : "Create Brand"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this brand. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
