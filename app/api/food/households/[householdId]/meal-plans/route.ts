import { NextResponse } from 'next/server';
import { createMealPlan, listMealPlans } from '../../../../../../lib/mealPlans';

export async function GET(
  _request: Request,
  { params }: { params: { householdId: string } }
) {
  try {
    const plans = await listMealPlans(params.householdId);
    return NextResponse.json(plans);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { householdId: string } }
) {
  const body = await request.json();
  const { name, startDate, endDate, goalFocus } = body as {
    name?: string;
    startDate?: string;
    endDate?: string;
    goalFocus?: 'budget' | 'health' | 'speed' | 'comfort' | null;
  };

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
  }

  if (startDate > endDate) {
    return NextResponse.json({ error: 'Start date must be before or equal to end date' }, { status: 400 });
  }

  try {
    const plan = await createMealPlan({
      householdId: params.householdId,
      name: name.trim(),
      startDate,
      endDate,
      goalFocus: goalFocus ?? null
    });
    return NextResponse.json(plan, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
