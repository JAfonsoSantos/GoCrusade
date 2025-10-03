import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShortcutsModal({ open, onOpenChange }: ShortcutsModalProps) {
  const shortcuts = [
    { key: "⌘K / Ctrl+K", description: "Open command palette" },
    { key: "?", description: "Show keyboard shortcuts" },
    { key: "G then P", description: "Go to Pipeline" },
    { key: "G then C", description: "Go to Campaigns" },
    { key: "G then I", description: "Go to Integrations" },
    { key: "G then H", description: "Go to Home" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate Crusade faster
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Shortcut</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortcuts.map((shortcut, index) => (
              <TableRow key={index}>
                <TableCell>
                  <kbd className="px-2 py-1.5 text-xs font-semibold bg-muted border rounded">
                    {shortcut.key}
                  </kbd>
                </TableCell>
                <TableCell>{shortcut.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
