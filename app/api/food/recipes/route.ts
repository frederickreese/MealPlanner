import { NextResponse } from 'next/server';
import { searchRecipes } from '../../../../lib/recipes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const householdId = searchParams.get('householdId') || undefined;
  const query = searchParams.get('query') || undefined;
  const publicOnly = searchParams.get('public') === 'true';
  try {
    const recipes = await searchRecipes({ householdId, query, publicOnly });
    return NextResponse.json(recipes);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
