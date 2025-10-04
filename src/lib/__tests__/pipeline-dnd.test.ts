import { describe, it, expect } from 'vitest';

/**
 * Test: Pipeline Kanban DnD behavior
 * 
 * When dropping a card onto another card, it should move to that card's column.
 * When dropping a card onto a column, it should move to that column.
 */

type OpportunityStage = 
  | "Prospecting"
  | "Qualification"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

interface Opportunity {
  id: string;
  stage: OpportunityStage;
  name: string;
}

interface DndOverData {
  type: 'container' | 'opportunity';
  containerId?: string;
}

/**
 * Simulates the drag-and-drop logic from Pipeline.tsx
 */
function moveOpportunity(
  opp: Opportunity,
  overData: DndOverData | undefined,
  mockStages: OpportunityStage[]
): OpportunityStage {
  let destinationStage: string | undefined;

  if (overData?.type === 'container') {
    // Dropped over a container (column)
    destinationStage = overData.containerId;
  } else if (overData?.type === 'opportunity') {
    // Dropped over another card - use that card's container (column)
    destinationStage = overData.containerId;
  }

  // Fallback to source stage if no valid destination
  if (!destinationStage || !mockStages.includes(destinationStage as OpportunityStage)) {
    destinationStage = opp.stage;
  }

  return destinationStage as OpportunityStage;
}

describe('Pipeline Kanban DnD', () => {
  const mockStages: OpportunityStage[] = [
    "Prospecting",
    "Qualification",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ];

  it('should move card to target column when dropped on column', () => {
    const opp: Opportunity = {
      id: 'opp-1',
      stage: 'Prospecting',
      name: 'Test Opportunity',
    };

    const overData: DndOverData = {
      type: 'container',
      containerId: 'Proposal',
    };

    const result = moveOpportunity(opp, overData, mockStages);
    expect(result).toBe('Proposal');
  });

  it('should move card to the column of the card it was dropped on', () => {
    const opp: Opportunity = {
      id: 'opp-1',
      stage: 'Prospecting',
      name: 'Test Opportunity',
    };

    // Simulate dropping on a card in "Negotiation" column
    const overData: DndOverData = {
      type: 'opportunity',
      containerId: 'Negotiation',
    };

    const result = moveOpportunity(opp, overData, mockStages);
    expect(result).toBe('Negotiation');
  });

  it('should keep card in source column if dropped on invalid target', () => {
    const opp: Opportunity = {
      id: 'opp-1',
      stage: 'Prospecting',
      name: 'Test Opportunity',
    };

    const overData: DndOverData = {
      type: 'container',
      containerId: 'InvalidStage',
    };

    const result = moveOpportunity(opp, overData, mockStages);
    expect(result).toBe('Prospecting'); // Fallback to source
  });

  it('should keep card in source column if overData is undefined', () => {
    const opp: Opportunity = {
      id: 'opp-1',
      stage: 'Prospecting',
      name: 'Test Opportunity',
    };

    const result = moveOpportunity(opp, undefined, mockStages);
    expect(result).toBe('Prospecting');
  });
});
