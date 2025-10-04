import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useDemoStore } from "@/demo/DemoProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { openAdvertiserTab } from "@/lib/openInTab";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Advertiser } from "@/lib/types";
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

export default function Advertisers() {
  const navigate = useNavigate();
  const { advertisers, opportunities, brands, addAdvertiser, updateAdvertiser, business } = useDemoStore();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAdvertiser, setEditingAdvertiser] = useState<Advertiser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [advertiserToDelete, setAdvertiserToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    parent_name: "",
  });

  const filteredAdvertisers = advertisers.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.parent_name && a.parent_name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleNew = () => {
    setEditingAdvertiser(null);
    setFormData({ name: "", parent_name: "" });
    setDrawerOpen(true);
  };

  const handleEdit = (advertiser: Advertiser) => {
    setEditingAdvertiser(advertiser);
    setFormData({
      name: advertiser.name,
      parent_name: advertiser.parent_name || "",
    });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Advertiser name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingAdvertiser) {
      updateAdvertiser(editingAdvertiser.id, formData);
      toast({
        title: "Advertiser Updated",
        description: `${formData.name} has been updated`,
      });
    } else {
      const newAdvertiser: Advertiser = {
        id: `adv-${Date.now()}`,
        business_id: business.id,
        name: formData.name,
        parent_name: formData.parent_name || undefined,
      };
      addAdvertiser(newAdvertiser);
      toast({
        title: "Advertiser Created",
        description: `${formData.name} has been added`,
      });
    }

    setDrawerOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (advertiserToDelete) {
      // In a real app, check for dependencies before deleting
      toast({
        title: "Advertiser Deleted",
        description: "Advertiser has been removed",
      });
      setDeleteDialogOpen(false);
      setAdvertiserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advertisers</h1>
          <p className="text-muted-foreground">Manage advertiser accounts</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Advertiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Advertisers ({advertisers.length})</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search advertisers..."
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
                <TableHead>Name</TableHead>
                <TableHead>Parent Account</TableHead>
                <TableHead>Brands</TableHead>
                <TableHead>Opportunities</TableHead>
                <TableHead>SF ID</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdvertisers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No advertisers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdvertisers.map((advertiser) => {
                  const oppCount = opportunities.filter((o) => o.advertiser_id === advertiser.id).length;
                  const brandCount = brands.filter((b) => b.advertiser_id === advertiser.id).length;

                  return (
                    <TableRow 
                      key={advertiser.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => {
                        openAdvertiserTab(advertiser.id, advertiser.name);
                        navigate(`/pipeline/advertisers/${advertiser.id}`);
                      }}
                    >
                      <TableCell className="font-medium">{advertiser.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {advertiser.parent_name || "—"}
                      </TableCell>
                      <TableCell>{brandCount}</TableCell>
                      <TableCell>{oppCount}</TableCell>
                      <TableCell>
                        {advertiser.sf_id && (
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(advertiser)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setAdvertiserToDelete(advertiser.id);
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
            <SheetTitle>{editingAdvertiser ? "Edit Advertiser" : "New Advertiser"}</SheetTitle>
            <SheetDescription>
              {editingAdvertiser ? "Update advertiser details" : "Create a new advertiser account"}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Advertiser Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Unilever"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent Account (Optional)</Label>
              <Input
                id="parent"
                value={formData.parent_name}
                onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                placeholder="e.g., Unilever Global"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setDrawerOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {editingAdvertiser ? "Save Changes" : "Create Advertiser"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Advertiser?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this advertiser. This action cannot be undone.
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
