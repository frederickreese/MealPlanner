import { getCurrentUser } from './auth';
import { postgrest } from './supabaseRest';
import { GoalFocus, MealPlan, MealPlanWithSlots, MealSlot } from '../types/mealPlan';

export async function listMealPlans(householdId: string): Promise<MealPlan[]> {
  const { data, error } = await postgrest<MealPlan[]>({
    table: 'food_core_meal_plan',
    filters: [{ column: 'household_id', op: 'eq', value: householdId }],
    order: { column: 'start_date', ascending: false }
  });
  if (error) throw error;
  return data ?? [];
}

export async function createMealPlan(params: {
  householdId: string;
  name: string;
  startDate: string;
  endDate: string;
  goalFocus?: GoalFocus;
}): Promise<MealPlan> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await postgrest<MealPlan>({
    table: 'food_core_meal_plan',
    method: 'POST',
    body: {
      household_id: params.householdId,
      created_by_user_id: user.id,
      name: params.name,
      start_date: params.startDate,
      end_date: params.endDate,
      goal_focus: params.goalFocus ?? null
    },
    single: true
  });
  if (error || !data) throw new Error(error?.message || 'Unable to create plan');
  return data;
}

export async function getMealPlanWithSlots(mealPlanId: string): Promise<MealPlanWithSlots> {
  const { data: plan, error: planError } = await postgrest<MealPlan>({
    table: 'food_core_meal_plan',
    filters: [{ column: 'id', op: 'eq', value: mealPlanId }],
    single: true
  });
  if (planError || !plan) throw new Error(planError?.message || 'Plan not found');

  const { data: slots, error: slotError } = await postgrest<MealSlot[]>({
    table: 'food_core_meal_slot',
    filters: [{ column: 'meal_plan_id', op: 'eq', value: mealPlanId }]
  });
  if (slotError) throw slotError;

  return { ...plan, slots: slots ?? [] };
}

export async function upsertMealSlots(
  mealPlanId: string,
  slots: Omit<MealSlot, 'meal_plan_id'>[]
): Promise<MealSlot[]> {
  const payload = slots.map((slot) => ({ ...slot, meal_plan_id: mealPlanId }));
  const { data, error } = await postgrest<MealSlot[]>({
    table: 'food_core_meal_slot',
    method: 'POST',
    body: payload,
    upsert: true
  });
  if (error || !data) throw new Error(error?.message || 'Unable to upsert slots');
  return data;
}

export async function updateMealPlan(
  mealPlanId: string,
  updates: Partial<Pick<MealPlan, 'name' | 'start_date' | 'end_date' | 'goal_focus'>>
): Promise<MealPlan> {
  const { data, error } = await postgrest<MealPlan>({
    table: 'food_core_meal_plan',
    method: 'PATCH',
    filters: [{ column: 'id', op: 'eq', value: mealPlanId }],
    body: updates,
    single: true
  });
  if (error || !data) throw new Error(error?.message || 'Unable to update plan');
  return data;
}

export async function deleteMealPlan(mealPlanId: string): Promise<void> {
  const { error } = await postgrest({
    table: 'food_core_meal_plan',
    method: 'DELETE',
    filters: [{ column: 'id', op: 'eq', value: mealPlanId }]
  });
  if (error) throw error;
}
