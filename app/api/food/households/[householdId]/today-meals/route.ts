import { NextResponse } from 'next/server';
import { postgrest } from '../../../../../../lib/supabaseRest';

export async function GET(_request: Request, { params }: { params: { householdId: string } }) {
  const today = new Date().toISOString().split('T')[0];

  const { data: plans, error: planError } = await postgrest<{ id: string }[]>({
    table: 'food_core_meal_plan',
    select: 'id',
    filters: [
      { column: 'household_id', op: 'eq', value: params.householdId },
      { column: 'start_date', op: 'lte', value: today },
      { column: 'end_date', op: 'gte', value: today }
    ]
  });
  if (planError) return NextResponse.json({ error: planError.message }, { status: 500 });

  const planIds = plans?.map((p) => p.id) ?? [];
  if (planIds.length === 0) return NextResponse.json([]);

  const { data, error } = await postgrest({
    table: 'food_core_meal_slot',
    filters: [
      { column: 'date', op: 'eq', value: today },
      { column: 'meal_plan_id', op: 'in', value: planIds }
    ]
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
