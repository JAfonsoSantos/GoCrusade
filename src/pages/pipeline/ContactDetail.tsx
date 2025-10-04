import { useParams, Link } from "react-router-dom";
import { useDemoStore } from "@/demo/DemoProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, User, Briefcase, Building2, Target } from "lucide-react";

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const { contacts, advertisers, opportunities } = useDemoStore();
  
  const contact = contacts.find(c => c.id === id);
  const advertiser = contact?.advertiser_id ? advertisers.find(a => a.id === contact.advertiser_id) : null;
  const relatedOpps = contact?.advertiser_id ? opportunities.filter(o => o.advertiser_id === contact.advertiser_id) : [];

  if (!contact) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/pipeline/contacts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contacts
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Contact not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/pipeline/contacts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            {contact.name}
          </h1>
          {contact.title && (
            <p className="text-muted-foreground mt-1">{contact.title}</p>
          )}
        </div>
        {contact.sf_id && (
          <Badge variant="outline">Synced with Salesforce</Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <a href={`mailto:${contact.email}`} className="text-sm underline text-primary">
              {contact.email}
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Title</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{contact.title || "—"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertiser</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {advertiser ? (
              <Link to={`/pipeline/advertisers/${advertiser.id}`} className="text-sm underline text-primary">
                {advertiser.name}
              </Link>
            ) : (
              <div className="text-sm text-muted-foreground">—</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Related Opportunities ({relatedOpps.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {relatedOpps.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No opportunities found</p>
          ) : (
            <div className="space-y-3">
              {relatedOpps.map(opp => (
                <Card key={opp.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{opp.name}</CardTitle>
                      <Badge>{opp.stage}</Badge>
                    </div>
                    {opp.amount && (
                      <p className="text-sm text-muted-foreground">${opp.amount.toLocaleString()}</p>
                    )}
                    {opp.close_date && (
                      <p className="text-xs text-muted-foreground">
                        Close Date: {new Date(opp.close_date).toLocaleDateString()}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
