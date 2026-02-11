import { describe, it, expect, vi } from 'vitest';
import { listMealPlans } from '../lib/mealPlans';
import * as supabaseRest from '../lib/supabaseRest';

const mockPlans = [
  { id: '1', household_id: 'h1', name: 'Plan A', start_date: '2024-01-01', end_date: '2024-01-07', created_by_user_id: 'u', goal_focus: null, metadata: null }
];

describe('mealPlans service', () => {
  it('lists meal plans for household', async () => {
    const postgrestSpy = vi.spyOn(supabaseRest, 'postgrest').mockResolvedValue({ data: mockPlans, error: undefined });

    const plans = await listMealPlans('h1');
    expect(plans[0].name).toBe('Plan A');
    expect(postgrestSpy).toHaveBeenCalledWith({
      table: 'food_core_meal_plan',
      filters: [{ column: 'household_id', op: 'eq', value: 'h1' }],
      order: { column: 'start_date', ascending: false }
    });
  });
});
