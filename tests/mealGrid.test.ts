import { describe, it, expect } from 'vitest';
import { buildMealGrid } from '../lib/mealGrid';
import { MealSlot } from '../types/mealPlan';

describe('buildMealGrid', () => {
  it('maps slots into grid days', () => {
    const slots: MealSlot[] = [
      { meal_plan_id: '1', date: '2024-01-01', meal_type: 'breakfast', recipe_id: 'r1' },
      { meal_plan_id: '1', date: '2024-01-02', meal_type: 'dinner', external_note: 'Pizza' }
    ];
    const grid = buildMealGrid(slots, '2024-01-01', '2024-01-03');
    expect(grid).toHaveLength(3);
    expect(grid[0].slots.breakfast?.recipe_id).toBe('r1');
    expect(grid[1].slots.dinner?.external_note).toBe('Pizza');
    expect(grid[2].slots.snack).toBeUndefined();
  });
});
