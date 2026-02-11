import { NextResponse } from 'next/server';
import { upsertMealSlots } from '../../../../../../../lib/mealPlans';

export async function POST(request: Request, { params }: { params: { mealPlanId: string } }) {
  const body = await request.json();
  try {
    const slots = await upsertMealSlots(params.mealPlanId, body.slots || []);
    return NextResponse.json(slots);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
