import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoStore } from "@/demo/DemoProvider";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useToast } from "@/hooks/use-toast";

const mockStages = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export default function Pipeline() {
  const { opportunities, advertisers, updateOpportunity } = useDemoStore();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const { toast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStage = destination.droppableId;
    updateOpportunity(draggableId, { stage: newStage });

    toast({
      title: "Deal Moved",
      description: `Moved to ${newStage}`,
    });
  };

  const getStageTotal = (stage: string) => {
    return opportunities
      .filter((o) => o.stage === stage)
      .reduce((sum, o) => sum + (o.amount || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">Manage your sales opportunities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "list")}>
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-6 mb-2">
            {mockStages.map((stage) => (
              <Card key={stage}>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{stage} Total</p>
                  <p className="text-lg font-bold">€{getStageTotal(stage).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mockStages.map((stage) => (
                <div key={stage} className="space-y-3">
                  <div className="font-semibold text-sm flex items-center justify-between">
                    <span>{stage}</span>
                    <Badge variant="secondary">
                      {opportunities.filter((o) => o.stage === stage).length}
                    </Badge>
                  </div>
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-2 min-h-[200px] ${
                          snapshot.isDraggingOver ? "bg-muted/50 rounded-lg p-2" : ""
                        }`}
                      >
                        {opportunities
                          .filter((opp) => opp.stage === stage)
                          .map((opp, index) => {
                            const advertiser = advertisers.find((a) => a.id === opp.advertiser_id);
                            return (
                              <Draggable key={opp.id} draggableId={opp.id} index={index}>
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`cursor-move transition-shadow ${
                                      snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
                                    }`}
                                  >
                                    <CardHeader className="p-4">
                                      <CardTitle className="text-sm">{opp.name}</CardTitle>
                                      <CardDescription className="text-xs">
                                        {advertiser?.name || "Unknown"}
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 space-y-2">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-primary">
                                          €{opp.amount?.toLocaleString() || "—"}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                          {opp.owner}
                                        </Badge>
                                      </div>
                                      <div className="text-xs text-muted-foreground">{opp.close_date}</div>
                                      <div className="flex gap-1">
                                        <Button size="sm" variant="outline" className="flex-1">
                                          Link Campaign
                                        </Button>
                                        {opp.sf_id && (
                                          <Button size="sm" variant="ghost">
                                            <ExternalLink className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {opportunities.map((opp) => {
                  const advertiser = advertisers.find((a) => a.id === opp.advertiser_id);
                  return (
                    <div
                      key={opp.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <div className="font-semibold">{opp.name}</div>
                        <div className="text-sm text-muted-foreground">{advertiser?.name || "Unknown"}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge>{opp.stage}</Badge>
                        <div className="text-right">
                          <div className="font-semibold">€{opp.amount?.toLocaleString() || "—"}</div>
                          <div className="text-xs text-muted-foreground">{opp.close_date}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" asChild className="h-auto py-4">
          <Link to="/pipeline/advertisers" className="flex flex-col items-start gap-2">
            <span className="font-semibold">Advertisers</span>
            <span className="text-xs text-muted-foreground">Manage advertiser accounts</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-4">
          <Link to="/pipeline/brands" className="flex flex-col items-start gap-2">
            <span className="font-semibold">Brands</span>
            <span className="text-xs text-muted-foreground">View brand catalog</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-4">
          <Link to="/pipeline/contacts" className="flex flex-col items-start gap-2">
            <span className="font-semibold">Contacts</span>
            <span className="text-xs text-muted-foreground">Manage contact list</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
