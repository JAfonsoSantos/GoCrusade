import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail } from "lucide-react";

const mockContacts = [
  { id: "1", name: "João Silva", email: "joao@sonae.pt", advertiser: "Sonae MC" },
  { id: "2", name: "Maria Santos", email: "maria@pg.com", advertiser: "P&G" },
  { id: "3", name: "Pedro Costa", email: "pedro@mattel.com", advertiser: "Mattel" },
];

export default function Contacts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage contact list</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="font-semibold">{contact.name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {contact.email}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{contact.advertiser}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
