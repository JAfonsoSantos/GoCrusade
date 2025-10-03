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

  // Calculate based on pricing model
  switch (flight.pricing_model) {
    case 'CPM': {
      delivered = totalImps;
      if (flight.goal_type === 'IMPRESSIONS' && flight.goal_amount) {
        expected = flight.goal_amount;
      } else if (flight.start_at && flight.end_at) {
        const totalDays = Math.ceil(
          (new Date(flight.end_at).getTime() - new Date(flight.start_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysPassed = Math.ceil(
          (Date.now() - new Date(flight.start_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        expected = ((flight.goal_amount || 0) / totalDays) * Math.min(daysPassed, totalDays);
      }
      break;
    }
    case 'CPC': {
      delivered = totalClicks;
      if (flight.goal_type === 'CLICKS' && flight.goal_amount) {
        expected = flight.goal_amount;
      }
      break;
    }
    case 'CPA': {
      delivered = totalConvs;
      if (flight.goal_type === 'CONVERSIONS' && flight.goal_amount) {
        expected = flight.goal_amount;
      }
      break;
    }
    case 'FLAT': {
      delivered = totalSpend;
      expected = flight.rate;
      break;
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
