import { Flight, DeliveryFlightDaily } from './types';

export type PacingHealth = 'green' | 'amber' | 'red';

export interface PacingResult {
  health: PacingHealth;
  percentage: number;
  delivered: number;
  expected: number;
}

export function calculatePacing(
  flight: Flight,
  deliveryData: DeliveryFlightDaily[]
): PacingResult {
  const flightDelivery = deliveryData.filter((d) => d.flight_id === flight.id);

  if (flightDelivery.length === 0) {
    return { health: 'amber', percentage: 0, delivered: 0, expected: 0 };
  }

  const totalImps = flightDelivery.reduce((sum, d) => sum + d.imps, 0);
  const totalClicks = flightDelivery.reduce((sum, d) => sum + d.clicks, 0);
  const totalSpend = flightDelivery.reduce((sum, d) => sum + d.spend, 0);
  const totalConvs = flightDelivery.reduce((sum, d) => sum + d.convs, 0);

  let delivered = 0;
  let expected = 0;

  // Calculate based on goal_type and pricing_model
  // Use delivered vs goal (not total imps)
  switch (flight.goal_type) {
    case 'IMPRESSIONS': {
      delivered = totalImps;
      expected = flight.goal_amount || 0;
      break;
    }
    case 'CLICKS': {
      delivered = totalClicks;
      expected = flight.goal_amount || 0;
      break;
    }
    case 'CONVERSIONS': {
      delivered = totalConvs;
      expected = flight.goal_amount || 0;
      break;
    }
    case 'SPEND': {
      delivered = totalSpend;
      expected = flight.goal_amount || 0;
      break;
    }
    default: {
      // Fallback to pricing model
      if (flight.pricing_model === 'CPM') {
        delivered = totalImps;
        expected = flight.goal_amount || 0;
      } else if (flight.pricing_model === 'CPC') {
        delivered = totalClicks;
        expected = flight.goal_amount || 0;
      } else if (flight.pricing_model === 'CPA') {
        delivered = totalConvs;
        expected = flight.goal_amount || 0;
      } else if (flight.pricing_model === 'FLAT') {
        delivered = totalSpend;
        expected = flight.rate || 0;
      }
    }
  }

  const percentage = expected > 0 ? (delivered / expected) * 100 : 0;

  let health: PacingHealth;
  if (percentage >= 95) health = 'green';
  else if (percentage >= 80) health = 'amber';
  else health = 'red';

  return { health, percentage, delivered, expected };
}

export function getPacingColor(health: PacingHealth): string {
  switch (health) {
    case 'green':
      return 'hsl(var(--success))';
    case 'amber':
      return 'hsl(var(--warning))';
    case 'red':
      return 'hsl(var(--destructive))';
  }
}
