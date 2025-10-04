import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plus, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoStore } from "@/demo/DemoProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DndContext, 
  DragEndEvent, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  useDroppable,
  DragStartEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/hooks/use-toast";
import { LinkCampaignModal } from "@/components/LinkCampaignModal";
import { NewOpportunityModal } from "@/components/NewOpportunityModal";
import { Opportunity } from "@/lib/types";

const mockStages = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

interface OpportunityCardProps {
  opp: Opportunity;
  advertiser: { name: string } | undefined;
  onLinkCampaign: (oppId: string) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
}

function OpportunityCard({ opp, advertiser, onLinkCampaign, isDragging, isOverlay }: OpportunityCardProps) {
  return (
    <Card
      className={`transition-shadow ${
        isDragging ? "opacity-50" : ""
      } ${isOverlay ? "cursor-grabbing shadow-2xl rotate-3" : "hover:shadow-md"}`}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm">{opp.name}</CardTitle>
        <CardDescription className="text-xs">{advertiser?.name || "Unknown"}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-primary">€{opp.amount?.toLocaleString() || "—"}</span>
          <Badge variant="outline" className="text-xs">
            {opp.owner}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">{opp.close_date}</div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onLinkCampaign(opp.id);
            }}
          >
            <LinkIcon className="mr-1 h-3 w-3" />
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
  );
}

interface SortableOpportunityCardProps {
  opp: Opportunity;
  advertiser: { name: string } | undefined;
  onLinkCampaign: (oppId: string) => void;
  stage: string;
}

function SortableOpportunityCard({ opp, advertiser, onLinkCampaign, stage }: SortableOpportunityCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opp.id,
    data: {
      type: 'opportunity',
      opportunity: opp,
      containerId: stage,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <OpportunityCard
        opp={opp}
        advertiser={advertiser}
        onLinkCampaign={onLinkCampaign}
        isDragging={isDragging}
      />
    </div>
  );
}

interface DroppableStageProps {
  stage: string;
  children: React.ReactNode;
}

function DroppableStage({ stage, children }: DroppableStageProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: {
      type: 'container',
      containerId: stage,
    },
  });

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <div 
      ref={setNodeRef} 
      className={`space-y-2 min-h-[200px] rounded-lg p-2 border-2 border-dashed transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-muted"
      }`}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
          Drop an opportunity here
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default function Pipeline() {
  const { opportunities, advertisers, updateOpportunity } = useDemoStore();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [newOppModalOpen, setNewOppModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const oppId = active.id as string;
    const opp = opportunities.find((o) => o.id === oppId);
    
    if (!opp) return;

    // Determine destination stage
    let destinationStage: string | undefined;
    
    if (over.data.current?.type === 'container') {
      // Dropped over a container (column)
      destinationStage = over.data.current.containerId as string;
    } else if (over.data.current?.type === 'opportunity') {
      // Dropped over another card - use that card's container (column)
      destinationStage = over.data.current.containerId as string;
    }

    // Fallback to source stage if no valid destination
    if (!destinationStage || !mockStages.includes(destinationStage)) {
      destinationStage = opp.stage;
    }

    // Only update if stage actually changed
    if (opp.stage !== destinationStage) {
      updateOpportunity(oppId, { stage: destinationStage as any });

      toast({
        description: `Moved to ${destinationStage}`,
      });
    }
  };

  const handleLinkCampaign = (oppId: string) => {
    setSelectedOpportunityId(oppId);
    setLinkModalOpen(true);
  };

  const getStageTotal = (stage: string) => {
    return opportunities
      .filter((o) => o.stage === stage)
      .reduce((sum, o) => sum + (o.amount || 0), 0);
  };

  return (
    <ErrorBoundary fallbackMessage="Unable to load pipeline. Please try reloading the page.">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">Manage your sales opportunities</p>
        </div>
        <Button onClick={() => setNewOppModalOpen(true)}>
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
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-6 mb-2">
                {mockStages.map((stage) => (
                  <Skeleton key={stage} className="h-20" />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {mockStages.map((stage) => (
                  <div key={stage} className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
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

              <DndContext
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 select-none">
              {mockStages.map((stage) => {
                const stageOpportunities = opportunities.filter((o) => o.stage === stage);
                
                return (
                  <div key={stage} className="space-y-3">
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>{stage}</span>
                      <Badge variant="secondary">{stageOpportunities.length}</Badge>
                    </div>
                    <DroppableStage stage={stage}>
                      {stageOpportunities.map((opp) => {
                        const advertiser = advertisers.find((a) => a.id === opp.advertiser_id);
                        return (
                          <SortableOpportunityCard
                            key={opp.id}
                            opp={opp}
                            advertiser={advertiser}
                            onLinkCampaign={handleLinkCampaign}
                            stage={stage}
                          />
                        );
                      })}
                    </DroppableStage>
                  </div>
                );
              })}
            </div>
            <DragOverlay>
              {activeId ? (() => {
                const opp = opportunities.find((o) => o.id === activeId);
                const advertiser = opp ? advertisers.find((a) => a.id === opp.advertiser_id) : undefined;
                return opp ? (
                  <OpportunityCard
                    opp={opp}
                    advertiser={advertiser}
                    onLinkCampaign={handleLinkCampaign}
                    isOverlay
                  />
                ) : null;
              })() : null}
            </DragOverlay>
          </DndContext>
            </>
          )}
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

      <LinkCampaignModal
        opportunityId={selectedOpportunityId}
        open={linkModalOpen}
        onOpenChange={setLinkModalOpen}
      />

      <NewOpportunityModal
        open={newOppModalOpen}
        onOpenChange={setNewOppModalOpen}
      />
    </div>
    </ErrorBoundary>
  );
}
