import { getAuthUser } from './supabaseRest';

export async function getCurrentUser() {
  return getAuthUser();
}

export async function requireUser() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}
