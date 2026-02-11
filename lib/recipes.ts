import { postgrest } from './supabaseRest';
import { Recipe } from '../types/recipe';

export async function searchRecipes(options: {
  householdId?: string;
  query?: string;
  publicOnly?: boolean;
}): Promise<Recipe[]> {
  const filters = [] as { column: string; op: 'eq' | 'ilike'; value: string | boolean }[];

  if (options.query) {
    filters.push({ column: 'title', op: 'ilike', value: `%${options.query}%` });
  }

  if (options.publicOnly) {
    filters.push({ column: 'is_public', op: 'eq', value: true });
  } else if (options.householdId) {
    // Show both household recipes and public recipes to match picker behavior.
    const { data, error } = await postgrest<Recipe[]>({
      table: 'food_core_recipe',
      filters,
      or: `household_id.eq.${options.householdId},is_public.eq.true`,
      limit: 20
    });

    if (error) throw error;
    return data ?? [];
  }

  const { data, error } = await postgrest<Recipe[]>({
    table: 'food_core_recipe',
    filters,
    limit: 20
  });
  if (error) throw error;
  return data ?? [];
}
