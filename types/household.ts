export interface Household {
  id: string;
  org_id: string;
  owner_user_id: string;
  name: string;
  timezone: string | null;
  location_region: string | null;
  metadata: Record<string, unknown> | null;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string | null;
  display_name: string;
  role_hint: string | null;
  date_of_birth: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
}
