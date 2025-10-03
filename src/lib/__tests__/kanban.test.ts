import { describe, it, expect } from 'vitest';
import { Opportunity, OpportunityStage } from '@/lib/types';

interface MoveCardParams {
  id: string;
  from: OpportunityStage;
  to: OpportunityStage;
  opportunities: Opportunity[];
}

/**
 * Pure function that moves a card from one stage to another
 * Returns a new array with the updated opportunity
 */
function moveCard({ id, from, to, opportunities }: MoveCardParams): Opportunity[] {
  return opportunities.map(opp => 
    opp.id === id ? { ...opp, stage: to } : opp
  );
}

describe('Kanban moveCard reducer', () => {
  const mockOpportunities: Opportunity[] = [
    {
      id: '1',
      business_id: 'biz-1',
      advertiser_id: 'adv-1',
      name: 'Deal A',
      stage: 'Prospecting',
      amount: 10000,
      close_date: '2025-12-31',
    },
    {
      id: '2',
      business_id: 'biz-1',
      advertiser_id: 'adv-2',
      name: 'Deal B',
      stage: 'Qualification',
      amount: 20000,
      close_date: '2025-11-30',
    },
    {
      id: '3',
      business_id: 'biz-1',
      advertiser_id: 'adv-1',
      name: 'Deal C',
      stage: 'Prospecting',
      amount: 15000,
      close_date: '2025-10-15',
    },
  ];

  it('should move a card from one stage to another', () => {
    const result = moveCard({
      id: '1',
      from: 'Prospecting',
      to: 'Qualification',
      opportunities: mockOpportunities,
    });

    expect(result).toHaveLength(3);
    expect(result.find(o => o.id === '1')?.stage).toBe('Qualification');
    expect(result.find(o => o.id === '2')?.stage).toBe('Qualification');
    expect(result.find(o => o.id === '3')?.stage).toBe('Prospecting');
  });

  it('should not mutate the original array', () => {
    const original = [...mockOpportunities];
    const result = moveCard({
      id: '1',
      from: 'Prospecting',
      to: 'Proposal',
      opportunities: mockOpportunities,
    });

    expect(mockOpportunities).toEqual(original);
    expect(result).not.toBe(mockOpportunities);
  });

  it('should preserve all other opportunities unchanged', () => {
    const result = moveCard({
      id: '2',
      from: 'Qualification',
      to: 'Closed Won',
      opportunities: mockOpportunities,
    });

    const unchanged = result.filter(o => o.id !== '2');
    const originalUnchanged = mockOpportunities.filter(o => o.id !== '2');
    
    expect(unchanged).toEqual(originalUnchanged);
  });

  it('should handle moving to the same stage (no-op)', () => {
    const result = moveCard({
      id: '1',
      from: 'Prospecting',
      to: 'Prospecting',
      opportunities: mockOpportunities,
    });

    expect(result.find(o => o.id === '1')?.stage).toBe('Prospecting');
    expect(result).toHaveLength(3);
  });

  it('should return all items when id not found', () => {
    const result = moveCard({
      id: 'non-existent',
      from: 'Prospecting',
      to: 'Qualification',
      opportunities: mockOpportunities,
    });

    expect(result).toEqual(mockOpportunities);
  });

  it('should move multiple cards to the same destination stage', () => {
    let result = moveCard({
      id: '1',
      from: 'Prospecting',
      to: 'Negotiation',
      opportunities: mockOpportunities,
    });

    result = moveCard({
      id: '3',
      from: 'Prospecting',
      to: 'Negotiation',
      opportunities: result,
    });

    const negotiationDeals = result.filter(o => o.stage === 'Negotiation');
    expect(negotiationDeals).toHaveLength(2);
    expect(negotiationDeals.map(o => o.id).sort()).toEqual(['1', '3']);
  });
});
