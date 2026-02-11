import { NextResponse } from 'next/server';
import { createHouseholdWithOrg, getHouseholds } from '../../../../lib/households';

export async function GET() {
  try {
    const households = await getHouseholds();
    return NextResponse.json(households);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  try {
    const household = await createHouseholdWithOrg(name);
    return NextResponse.json(household, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
