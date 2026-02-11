import { NextResponse } from 'next/server';
import { deleteMealPlan, getMealPlanWithSlots, updateMealPlan } from '../../../../../lib/mealPlans';

export async function GET(
  _request: Request,
  { params }: { params: { mealPlanId: string } }
) {
  try {
    const plan = await getMealPlanWithSlots(params.mealPlanId);
    return NextResponse.json(plan);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { mealPlanId: string } }) {
  const body = await request.json();
  try {
    const plan = await updateMealPlan(params.mealPlanId, body);
    return NextResponse.json(plan);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { mealPlanId: string } }) {
  try {
    await deleteMealPlan(params.mealPlanId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
