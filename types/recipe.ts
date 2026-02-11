export interface Recipe {
  id: string;
  household_id: string | null;
  creator_user_id: string;
  title: string;
  subtitle: string | null;
  cuisine_id: string | null;
  primary_image_url: string | null;
  prep_time_min: number | null;
  cook_time_min: number | null;
  servings: number | null;
  difficulty: string | null;
  is_public: boolean;
  source_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}
