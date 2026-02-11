export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type GoalFocus = 'budget' | 'health' | 'speed' | 'comfort' | null;

export interface MealPlan {
  id: string;
  household_id: string;
  created_by_user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  goal_focus: GoalFocus;
  metadata: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface MealSlot {
  id?: string;
  meal_plan_id: string;
  date: string;
  meal_type: MealType;
  recipe_id?: string | null;
  external_note?: string | null;
  household_member_ids?: string[] | null;
  locked?: boolean;
  metadata?: Record<string, unknown> | null;
}

export interface MealPlanWithSlots extends MealPlan {
  slots: MealSlot[];
}
