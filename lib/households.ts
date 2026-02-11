import { getCurrentUser } from './auth';
import { postgrest } from './supabaseRest';
import { Household } from '../types/household';

export async function getHouseholds(): Promise<Household[]> {
  const { data, error } = await postgrest<Household[]>({
    table: 'food_core_household',
    order: { column: 'created_at', ascending: false }
  });
  if (error) throw error;
  return data ?? [];
}

export async function createHouseholdWithOrg(name: string): Promise<Household> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data: org, error: orgError } = await postgrest<{ id: string }>({
    table: 'identity_core_org',
    method: 'POST',
    body: { owner_user_id: user.id, name, type: 'household', timezone: 'UTC' },
    single: true
  });
  if (orgError || !org) throw new Error(orgError?.message || 'Unable to create org');

  const { error: membershipError } = await postgrest({
    table: 'identity_core_org_membership',
    method: 'POST',
    body: { org_id: org.id, user_id: user.id, role: 'owner' }
  });
  if (membershipError) throw membershipError;

  const { data: household, error: hhError } = await postgrest<Household>({
    table: 'food_core_household',
    method: 'POST',
    body: { org_id: org.id, owner_user_id: user.id, name, timezone: 'UTC' },
    single: true
  });
  if (hhError || !household) throw new Error(hhError?.message || 'Unable to create household');

  return household;
}
